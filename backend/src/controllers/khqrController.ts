// import { Request, Response } from "express";

// interface KHQRBaseData {
//   bakongAccountID: string;
//   currency?: "KHR" | "USD";
//   amount?: number;
//   merchantName: string;
//   merchantCity?: string;
//   billNumber?: string;
//   mobileNumber?: string;
//   storeLabel?: string;
//   terminalLabel?: string;
//   purposeOfTransaction?: string;
//   upiAccountInformation?: string;
//   merchantAlternateLanguagePreference?: string;
//   merchantNameAlternateLanguage?: string;
//   merchantCityAlternateLanguage?: string;
// }

// interface KHQRIndividualData extends KHQRBaseData {
//   accountType: "individual";
//   accountInformation?: string;
//   acquiringBank?: string;
// }

// interface KHQRMerchantData extends KHQRBaseData {
//   accountType: "merchant";
//   merchantID: string;
//   acquiringBank: string;
// }

// type KHQRData = KHQRIndividualData | KHQRMerchantData;

// interface GenerateKHQRRequest {
//   accountType: "individual" | "merchant";
//   data: KHQRData;
// }

// /**
//  * Generate KHQR Code
//  * POST /api/khqr/generate
//  *
//  * This is a placeholder controller. In production, you would:
//  * 1. Install the bakong-khqr npm package: npm install bakong-khqr
//  * 2. Import and use the actual KHQR generation library
//  * 3. Generate the QR code image
//  * 4. Return the base64 encoded image or save to storage
//  */
// export const generateKHQR = async (req: Request, res: Response) => {
//   try {
//     const { accountType, data } = req.body as GenerateKHQRRequest;

//     // Validate required fields based on account type
//     if (!data.bakongAccountID || !data.merchantName) {
//       return res.status(400).json({
//         success: false,
//         error: "Bakong Account ID and Merchant Name are required",
//       });
//     }

//     if (accountType === "merchant") {
//       const merchantData = data as KHQRMerchantData;
//       if (!merchantData.merchantID || !merchantData.acquiringBank) {
//         return res.status(400).json({
//           success: false,
//           error:
//             "Merchant ID and Acquiring Bank are required for merchant accounts",
//         });
//       }
//     }

//     // TODO: Implement actual KHQR generation using bakong-khqr library
//     // Example usage (install bakong-khqr first):
//     /*
//     import { KHQR } from "bakong-khqr";
    
//     let khqr;
//     if (accountType === "individual") {
//       khqr = KHQR.individual({
//         bakongAccountID: data.bakongAccountID,
//         merchantName: data.merchantName,
//         accountInformation: data.accountInformation,
//         acquiringBank: data.acquiringBank,
//         currency: data.currency || "KHR",
//         amount: data.amount,
//         merchantCity: data.merchantCity || "Phnom Penh",
//         billNumber: data.billNumber,
//         mobileNumber: data.mobileNumber,
//         storeLabel: data.storeLabel,
//         terminalLabel: data.terminalLabel,
//         purposeOfTransaction: data.purposeOfTransaction,
//       });
//     } else {
//       const merchantData = data as KHQRMerchantData;
//       khqr = KHQR.merchant({
//         bakongAccountID: merchantData.bakongAccountID,
//         merchantID: merchantData.merchantID,
//         acquiringBank: merchantData.acquiringBank,
//         merchantName: merchantData.merchantName,
//         currency: merchantData.currency || "KHR",
//         amount: merchantData.amount,
//         merchantCity: merchantData.merchantCity || "Phnom Penh",
//         billNumber: merchantData.billNumber,
//         mobileNumber: merchantData.mobileNumber,
//         storeLabel: merchantData.storeLabel,
//         terminalLabel: merchantData.terminalLabel,
//         purposeOfTransaction: merchantData.purposeOfTransaction,
//       });
//     }
    
//     // Generate QR code as base64 image
//     const qrCodeBase64 = await khqr.generateQR();
//     */

//     // Placeholder response - return a mock base64 QR code
//     const mockQRCode =
//       "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

//     console.log("KHQR Generation Request:", {
//       accountType,
//       bakongAccountID: data.bakongAccountID,
//       merchantName: data.merchantName,
//       ...(accountType === "merchant" && {
//         merchantID: (data as KHQRMerchantData).merchantID,
//         acquiringBank: data.acquiringBank,
//       }),
//     });

//     return res.status(200).json({
//       success: true,
//       qrCode: mockQRCode,
//       message:
//         "This is a placeholder response. Implement actual KHQR generation using bakong-khqr library.",
//     });
//   } catch (error: any) {
//     console.error("Error generating KHQR:", error);
//     return res.status(500).json({
//       success: false,
//       error: error.message || "Internal server error while generating KHQR",
//     });
//   }
// };
