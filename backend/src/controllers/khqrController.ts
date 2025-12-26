import type { Request, Response } from "express";
import QRCode from "qrcode";
// @ts-expect-error For some reason when I install types the package breaks
import { BakongKHQR, khqrData, IndividualInfo } from "bakong-khqr";
import { uploadBase64ToCloudinary } from "../https/uploadToCloudinary.js";
import type { IUser } from "../model/types-for-models/userModel.types.js";
import Profile from "../model/profileModel.js";
import axios from "axios";

interface PollingJob {
  res: Response;
  profileId: string;
  amount: number;
  attempts: number;
}

const activeJobs = new Map<string, PollingJob>();

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

async function pollBakong(md5: string, startTime = Date.now()) {
  const job = activeJobs.get(md5);
  if (!job) return;

  // Timeout: Stop polling after 5 minutes
  // if (Date.now() - startTime > 5 * 60 * 1000) {
  //   notifyAndCleanup(md5, { status: "EXPIRED" });
  //   return;
  // }

  if (Date.now() - startTime > 30 * 1000) {
    notifyAndCleanup(md5, { status: "EXPIRED" });
    return;
  }

  

  try {
    const { data } = await axios.post(
      "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5",
      { md5 },
      { headers: { Authorization: `Bearer ${process.env.BAKONG_TOKEN}` } }
    );

    if (data?.responseCode === 0) {
      await finalizeTransaction(md5, job, data.data);
      return;
    }

    // Successive attempt tracking
    job.attempts++;

    // Exponential Backoff: Starts at 3s, slows down as time passes
    const nextDelay = Math.min(
      3000 + Math.floor(job.attempts / 5) * 2000,
      15000
    );
    setTimeout(() => pollBakong(md5, startTime), nextDelay);
  } catch (error) {
    // Error backoff: Wait 10s if the Bakong API is down or errors out
    setTimeout(() => pollBakong(md5, startTime), 10000);
  }
}

async function finalizeTransaction(
  md5: string,
  job: PollingJob,
  paymentData: any
) {
  try {
    const profile = await Profile.findById(job.profileId);
    if (profile) {
      profile.donationAmount =
        Math.round(((profile.donationAmount || 0) + job.amount) * 100) / 100;
      profile.isSupporter = profile.donationAmount >= 5;
      profile.isGoldSupporter = profile.donationAmount >= 20;
      await profile.save();
    }
    notifyAndCleanup(md5, { status: "PAID", data: paymentData });
  } catch (err) {
    console.error("Database update failed:", err);
    // You might want to retry the DB update here
  }
}

function notifyAndCleanup(md5: string, payload: any) {
  const job = activeJobs.get(md5);
  if (job) {
    job.res.write(`data: ${JSON.stringify(payload)}\n\n`);
    job.res.end();
    activeJobs.delete(md5);
    console.log(`[SSE] Job ${md5} completed and cleaned up.`);
  }
}

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

    // Register this client
    activeJobs.set(md5, {
      res: null as unknown as Response,
      profileId: req.profile.id,
      amount: parseFloat(amount),
      attempts: 0,
    });

    const qrCodeDataURL = await QRCode.toDataURL(qrString);
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
  console.log(
    `[SSE] Connection established for ${md5}, length: ${activeJobs.size}`
  );
  // Send initial heartbeat so frontend knows it's working
  res.write(`data: ${JSON.stringify({ status: "CONNECTED" })}\n\n`);
  const activeJob = activeJobs.get(md5);
  if (activeJob) {
    activeJob.res = res;
  }
  pollBakong(md5);

  // Clean up if user closes tab
  req.on("close", () => {
    console.log(`[SSE] Connection closed for ${md5}`);
    activeJobs.delete(md5);
  });
};
