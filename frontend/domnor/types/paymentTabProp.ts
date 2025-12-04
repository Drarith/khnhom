import type {
  UseFormRegister,
  FieldErrors,
  UseFormHandleSubmit,
} from "react-hook-form";
import type { khqrFormEditorInputValues } from "./profileFormInput";
import type { ProfileData } from "@/types/profileData";

export interface PaymentTabProps {
  register: UseFormRegister<khqrFormEditorInputValues>;
  errors: FieldErrors<khqrFormEditorInputValues>;
  handleSubmit: UseFormHandleSubmit<khqrFormEditorInputValues>;
  onGenerateQR: (values: khqrFormEditorInputValues) => void;
  accountType: "individual" | "merchant";
  bakongAccountID: string;
  merchantName: string;
  merchantID: string;
  acquiringBank?: string;
  accountInformation?: string;
  currency?: string;
  amount?: string;
  merchantCity?: string;
  billNumber?: string;
  mobileNumber?: string;
  storeLabel?: string;
  terminalLabel?: string;
  purposeOfTransaction?: string;
  isValid?: boolean;
  isGenerating?: boolean;
  generatedQR?: string;
  error: string;
  initialData?: ProfileData;
}
