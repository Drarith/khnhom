export type KHQRCurrency = "KHR" | "USD";

export type KHQRAccountType = "individual" | "merchant";


interface KHQRBaseData {
  bakongAccountID: string; 
  currency?: KHQRCurrency; 
  amount?: number; 
  merchantName: string; 
  merchantCity?: string; 
  billNumber?: string; 
  mobileNumber?: string; 
  storeLabel?: string; 
  terminalLabel?: string; 
  purposeOfTransaction?: string; 
  upiAccountInformation?: string; 
  merchantAlternateLanguagePreference?: string;
  merchantNameAlternateLanguage?: string; 
  merchantCityAlternateLanguage?: string; 
}

// Individual KHQR Data
export interface KHQRIndividualData extends KHQRBaseData {
  accountType: "individual";
  accountInformation?: string; 
  acquiringBank?: string; 
}

// Merchant KHQR Data
export interface KHQRMerchantData extends KHQRBaseData {
  accountType: "merchant";
  merchantID: string; 
  acquiringBank: string; 
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
  qrCode?: string; 
  error?: string;
}
