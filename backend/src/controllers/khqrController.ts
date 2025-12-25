import type { Request, Response } from "express";
import QRCode from "qrcode";
// @ts-expect-error For some reason when I install types the package breaks
import { BakongKHQR, khqrData, IndividualInfo } from "bakong-khqr";
import { uploadBase64ToCloudinary } from "../https/uploadToCloudinary.js";
import type { IUser } from "../model/types-for-models/userModel.types.js";
import Profile from "../model/profileModel.js";
import axios from "axios";
import type { IProfile } from "../model/types-for-models/profileModel.types.js";

const clients = new Map<string, Response>();
let amountToSave: number;
let profileToSave: IProfile;

export async function createKHQR(req: Request, res: Response) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.profile) {
    return res.status(404).json({
      success: false,
      message: "Profile not found. Please create a profile first.",
    });
  }
  const { accountType } = req.body;
  if (!accountType) {
    return res.status(400).json({ message: "Account type is required" });
  }
  if (accountType !== "individual" && accountType !== "merchant") {
    return res.status(400).json({ message: "Invalid account type" });
  }
  if (accountType === "individual") {
    const { bakongAccountID, merchantName, merchantCity } = req.body;

    // Validate mandatory fields
    if (!bakongAccountID || !merchantName) {
      return res
        .status(400)
        .json({ message: "Missing mandatory fields for individual account" });
    }

    const mandatoryFields = ["accountType", "bakongAccountID", "merchantName"];

    // Build optional data dynamically
    const optionalData: Record<string, any> = {};

    Object.entries(req.body).forEach(([key, value]) => {
      // Skip mandatory fields and empty values
      if (mandatoryFields.includes(key) || !value || value === "") {
        return;
      }

      // Handle special cases
      if (key === "currency") {
        optionalData.currency =
          value === "KHR" ? khqrData.currency.khr : khqrData.currency.usd;
      } else if (key === "amount") {
        optionalData.amount = parseFloat(value as string);
      } else if (key === "merchantCity" || key === "merchanCity") {
        return;
      } else {
        optionalData[key] = value;
      }
    });

    const individualInfo = merchantCity
      ? new IndividualInfo(
          bakongAccountID,
          merchantName,
          merchantCity,
          optionalData
        )
      : new IndividualInfo(bakongAccountID, merchantName, optionalData);

    try {
      const KHQR = new BakongKHQR();
      const individual = await KHQR.generateIndividual(individualInfo);

      // Generate QR code as Data URL (base64 image)
      const qrCodeDataURL = await QRCode.toDataURL(individual.data.qr, {
        errorCorrectionLevel: "M",
        type: "image/png",
        width: 512,
        margin: 2,
      });

      const cloudinaryResponse = await uploadBase64ToCloudinary(
        qrCodeDataURL,
        `khqr_${(req.user as IUser).id}`
      );
      const { secure_url } = cloudinaryResponse;

      if (!secure_url) {
        return res.status(500).json({
          success: false,
          message:
            "Failed to upload QR code to our servers. Please try again later.",
        });
      }

      const { data } = BakongKHQR.decode(individual.data.qr);
      const decodedQR = data;

      const updatedProfile = await Profile.findOneAndUpdate(
        { user: (req.user as IUser).id },
        {
          $set: {
            paymentQrCodeUrl: secure_url,
            paymentInfo: {
              bakongAccountID: bakongAccountID,
              merchantName: decodedQR.merchantName,
              merchantCity: decodedQR.merchantCity
                ? decodedQR.merchantCity
                : "",
              currency: decodedQR.transactionCurrency === "116" ? "KHR" : "USD",
              amount: decodedQR.transactionAmount
                ? parseFloat(decodedQR.transactionAmount)
                : 0,
              purpose: decodedQR.purpose ? decodedQR.purpose : "",
            },
          },
        },
        { new: true }
      );

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error("Error generating KHQR:", error);
      return res.status(500).json({
        success: false,
        message: "Error generating QR code",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

async function pollBakong(md5: string) {
  const start = Date.now();
  const timeout = 5 * 60 * 1000; // 5 mins

  const check = async () => {
    // 1. Check if we timed out
    if (Date.now() - start > timeout) {
      notifyClient(md5, { status: "EXPIRED" });
      return;
    }

    if (!clients.has(md5)) {
      console.log(`[SSE] Stopping poll for ${md5} - User refreshed/left.`);
      return;
    }

    try {
      // 2. Ask Bakong
      const { data } = await axios.post(
        "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5",
        { md5 },
        { headers: { Authorization: `Bearer ${process.env.BAKONG_TOKEN}` } }
      );

      // 3. If paid, notify and stop
      if (data && data.responseCode === 0) {
        notifyClient(md5, { status: "PAID", data: data.data });
        return;
      }

      // 4. If not paid, keep checking only if the client is still listening
      // Optimization: If the user closed the tab (client gone), stop polling Bakong to save resources.
      if (clients.has(md5)) {
        setTimeout(check, 5000); // Check every 3s
      } else {
        console.log(`[SSE] Client ${md5} disconnected. Stopping poll.`);
      }
    } catch (error) {
      console.error(`[SSE] Error polling ${md5}`, error);
      setTimeout(check, 5000); // Retry slower on error
    }
  };

  check();
}

// Helper to send data to the specific user
function notifyClient(md5: string, payload: any) {
  const client = clients.get(md5);

  if (client) {
    // SSE formatting is strict: "data: <json>\n\n"
    client.write(`data: ${JSON.stringify(payload)}\n\n`);

    // If it's a final state (PAID or EXPIRED), close the connection
    if (payload.status === "PAID" || payload.status === "EXPIRED") {
      client.end();
      clients.delete(md5);
      updateAmount(payload.status);
    }
  }
}

async function updateAmount(status: string) {
  if (!status || status !== "PAID") return;
  const currentDonationAmount = (profileToSave as IProfile).donationAmount;
  const newDonationAmount = currentDonationAmount
    ? currentDonationAmount + amountToSave
    : amountToSave;
  profileToSave.donationAmount = newDonationAmount;

  if (!profileToSave.isSupporter && newDonationAmount >= 5) {
    profileToSave.isSupporter = true;
  }

  if (!profileToSave.isGoldSupporter && newDonationAmount >= 20) {
    profileToSave.isGoldSupporter = true;
  }

  await profileToSave.save();
  amountToSave = 0;
}

// --- C. EXPRESS CONTROLLERS ---

// 1. The Setup Endpoint (Generates QR)
export const createKHQRForDonation = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: "Amount is required" });

    // Generate QR Logic (Same as yours)
    const individualInfo = new IndividualInfo(
      "dararith_sarin@aclb",
      "DararithSarin",
      "Phnom Penh",
      { amount: parseFloat(amount), currency: khqrData.currency.usd }
    );
    const KHQR = new BakongKHQR();
    const result = KHQR.generateIndividual(individualInfo);

    // Safety check for library version differences
    const md5 = result.data?.md5 || (result as any).md5;
    const qrString = result.data?.qr || (result as any).qr;

    if (!md5) throw new Error("MD5 generation failed");

    const qrCodeDataURL = await QRCode.toDataURL(qrString);
    amountToSave = parseFloat(amount);
    profileToSave = req.profile;

    return res.status(200).json({
      qrData: qrCodeDataURL,
      md5: md5,
      // Give frontend the URL to listen to
      subscribeUrl: `/api/payment/events/${md5}`,
    });
  } catch (error) {
    return res.status(500).json({ error: String(error) });
  }
};

// 2. The SSE Endpoint (Frontend listens here)
export const paymentEventsHandler = (req: Request, res: Response) => {
  const { md5 } = req.params;
  if (!md5) {
    return res.status(400).json({ message: "MD5 is required" });
  }

  // Mandatory headers for SSE
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  // Send initial heartbeat so frontend knows it's working
  res.write(`data: ${JSON.stringify({ status: "CONNECTED" })}\n\n`);

  // Register this client
  clients.set(md5, res);
  pollBakong(md5);

  // Clean up if user closes tab
  req.on("close", () => {
    console.log(`[SSE] Connection closed for ${md5}`);
    clients.delete(md5);
  });
};
