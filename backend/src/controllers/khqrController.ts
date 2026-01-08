import type { Request, Response } from "express";
import QRCode from "qrcode";
// @ts-expect-error For some reason when I install types the package breaks
import { BakongKHQR, khqrData, IndividualInfo } from "bakong-khqr";
import { connectRedis } from "../config/redisClient.js";
import { uploadBase64ToCloudinary } from "../https/uploadToCloudinary.js";
import type { IUser } from "../model/types-for-models/userModel.types.js";
import Profile from "../model/profileModel.js";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
import { env } from "../config/myEnv.js";

const redisClient = await connectRedis();

/*
const proxyConfig = {
  protocol: "https" as const,
  host: env.PROXY_HOST || "",
  port: env.PROXY_PORT || 0,
  auth: {
    username: env.PROXY_USERNAME || "",
    password: env.PROXY_PASSWORD || "",
  },
};
*/

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

      await Profile.findOneAndUpdate(
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
  } else {
    // Handle merchant account type
    return res.status(501).json({
      success: false,
      message: "Merchant account type is not yet implemented",
    });
  }
}

export const createKHQRForDonation = async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: "Amount is required" });

    const individualInfo = new IndividualInfo(
      "dararith_sarin@aclb",
      "DararithSarin",
      "Phnom Penh",
      { amount: parseFloat(amount), currency: khqrData.currency.usd }
    );
    const KHQR = new BakongKHQR();
    const result = KHQR.generateIndividual(individualInfo);

    const md5 = result.data?.md5 || (result as any).md5;
    const qrString = result.data?.qr || (result as any).qr;

    if (!md5) throw new Error("MD5 generation failed");

    // Save donation context to Redis (TTL: 4 minutes)
    const donationContext = {
      profileId: req.profile.id,
      amount: parseFloat(amount),
      createdAt: Date.now(),
    };
    await redisClient.setEx(
      `donation_context:${md5}`,
      240,
      JSON.stringify(donationContext)
    );

    const qrCodeDataURL = await QRCode.toDataURL(qrString);
    console.log("Generated KHQR for donation:", { md5, qrString });
    return res.status(200).json({
      qrData: qrCodeDataURL,
      md5: md5,
    });
  } catch (error) {
    return res.status(500).json({ error: String(error) });
  }
};

// Check payment status endpoint (for polling)
export const checkPaymentStatus = async (req: Request, res: Response) => {
  console.log("checkPaymentStatus called with params:", req.params);
  const { md5 } = req.params;
  if (!md5) {
    return res.status(400).json({ message: "MD5 is required" });
  }

  try {
    // Check if already completed (cached in Redis)
    console.log("Checking cached result for MD5:", md5);
    const cachedResult = await redisClient.get(`khqr_job:${md5}`);
    if (cachedResult) {
      const result = JSON.parse(cachedResult);
      return res.status(200).json(result);
    }

    // Get donation context from Redis
    const contextStr = await redisClient.get(`donation_context:${md5}`);
    if (!contextStr) {
      return res.status(404).json({ status: "NOT_FOUND" });
    }

    const context = JSON.parse(contextStr);
    const elapsed = Date.now() - context.createdAt;

    // Check if expired (3 minutes)
    if (elapsed > 3 * 60 * 1000) {
      await redisClient.del(`donation_context:${md5}`);
      await redisClient.setEx(
        `khqr_job:${md5}`,
        600,
        JSON.stringify({ status: "EXPIRED" })
      );
      return res.status(200).json({ status: "EXPIRED" });
    }

    const username = encodeURIComponent(env.PROXY_USERNAME || "");
    const password = encodeURIComponent(env.PROXY_PASSWORD || "");
    const proxyUrl = `http://${username}:${password}@${env.PROXY_HOST}:${env.PROXY_PORT}`;
    const httpsAgent = new HttpsProxyAgent(proxyUrl);

    // Check Bakong API
    const { data } = await axios.post(
      "https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5",
      { md5 },
      {
        httpsAgent,
        proxy: false,
        headers: {
          Authorization: `Bearer ${env.BAKONG_TOKEN}`,
        },
      }
    );

    if (data?.responseCode === 0) {
      // Payment confirmed!
      const profile = await Profile.findById(context.profileId);
      if (profile) {
        profile.donationAmount =
          Math.round(((profile.donationAmount || 0) + context.amount) * 100) /
          100;
        profile.isVerified = profile.donationAmount >= 10;
        await profile.save();
      }

      const result = { status: "PAID", data: data.data };
      await redisClient.del(`donation_context:${md5}`); // ADD THIS - cleanup
      await redisClient.setEx(`khqr_job:${md5}`, 600, JSON.stringify(result));
      return res.status(200).json(result);
    }

    // Still pending
    return res.status(200).json({ status: "PENDING" });
  } catch (error) {
    console.error("Error checking payment status:", error);
    return res.status(500).json({ status: "ERROR", error: String(error) });
  }
};
