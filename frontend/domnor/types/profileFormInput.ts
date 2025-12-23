import { z } from "zod";
import {
  createProfileFormInputSchema,
  editProfileFormInputSchema,
  linkFormEditorInputSchema,
  khqrFormEditorInputSchema,
} from "@/validationSchema/inputValidationSchema";

export interface ProfileFormInputs {
  username: string;
  displayName: string;
  bio?: string;
  profilePictureUrl?: string;
  paymentQrCodeUrl?: string;
  socials?: Record<string, string>[];
  link?: Record<string, string>;
  theme?: string;
  selectedTemplate?: string;
}

export type ProfileFormInputValues = z.infer<
  ReturnType<typeof createProfileFormInputSchema>
>;

export type ProfileFormEditorInputValues = z.infer<
  typeof editProfileFormInputSchema
>;

export type linkFormEditorInputValues = z.infer<
  typeof linkFormEditorInputSchema
>;

export type khqrFormEditorInputValues = z.infer<
  typeof khqrFormEditorInputSchema
>;

// export type khqrIndividualFormValues = z.infer<typeof khqrIndividualFormSchema>;
// export type khqrMerchantFormValues = z.infer<typeof khqrMerchantFormSchema>;
// export type khqrFormEditorInputValues = khqrIndividualFormValues | khqrMerchantFormValues;