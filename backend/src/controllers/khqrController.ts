import type { Request, Response } from "express";
import QRCode from "qrcode";
// @ts-expect-error For some reason when I install types the package breaks
import { BakongKHQR, khqrData, IndividualInfo } from "bakong-khqr";
import { uploadBase64ToCloudinary } from "../https/uploadToCloudinary.js";
import type { IUser } from "../model/types-for-models/userModel.types.js";
import Profile from "../model/profileModel.js";

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
      console.log("QR String:", individual.data.qr);

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

      await Profile.findOneAndUpdate(
        { user: (req.user as IUser).id },
        { $set: { paymentQrCodeUrl: secure_url } },
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
