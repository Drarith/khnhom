import type { Request, Response } from "express";

import { BakongKHQR, khqrData, IndividualInfo } from "bakong-khqr";

export async function createKHQR(req: Request, res: Response) {
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
        // Skip merchantCity since it's handled separately in constructor
        return;
      } else {
        optionalData[key] = value;
      }
    });
    // const optionalData = {
    //     currency: currency === "KHR" ? khqrData.currency.khr : khqrData.currency.usd
    // }

    const individualInfo = merchantCity
      ? new IndividualInfo(bakongAccountID, merchantName, merchantCity, optionalData)
      : new IndividualInfo(bakongAccountID, merchantName, optionalData);

    

    const KHQR = new BakongKHQR();
    const individual = KHQR.generateIndividual(individualInfo);
    console.log(individual);
    const decodee = BakongKHQR.decode(individual.qr)
    console.log("Decode",decodee);
  }
}
