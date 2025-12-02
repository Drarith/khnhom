export type KHQRCurrency = "KHR" | "USD";

export type KHQRAccountType = "individual" | "merchant";

// Base interface with common fields
interface KHQRBaseData {
  bakongAccountID: string; // Mandatory, max 32 chars
  currency?: KHQRCurrency; // Default: KHR
  amount?: number; // max 13 digits
  merchantName: string; // Mandatory, max 25 chars
  merchantCity?: string; // max 15 chars, Default: Phnom Penh
  billNumber?: string; // max 25 chars
  mobileNumber?: string; // max 25 chars, example: 855967854321
  storeLabel?: string; // max 25 chars
  terminalLabel?: string; // max 25 chars
  purposeOfTransaction?: string; // max 25 chars
  upiAccountInformation?: string; // max 31 chars
  merchantAlternateLanguagePreference?: string; // max 2 chars
  merchantNameAlternateLanguage?: string; // max 25 chars
  merchantCityAlternateLanguage?: string; // max 15 chars
}

// Individual KHQR Data
export interface KHQRIndividualData extends KHQRBaseData {
  accountType: "individual";
  accountInformation?: string; // max 32 chars, Account number or phone number
  acquiringBank?: string; // max 32 chars
}

// Merchant KHQR Data
export interface KHQRMerchantData extends KHQRBaseData {
  accountType: "merchant";
  merchantID: string; // Mandatory, max 32 chars
  acquiringBank: string; // Mandatory, max 32 chars
}

// Union type for KHQR data
export type KHQRData = KHQRIndividualData | KHQRMerchantData;

// Request interface for backend API
export interface GenerateKHQRRequest {
  accountType: KHQRAccountType;
  data: KHQRData;
}

// Response interface from backend
export interface GenerateKHQRResponse {
  success: boolean;
  qrCode?: string; // Base64 encoded image or URL
  error?: string;
}
