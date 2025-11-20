import { z } from "zod";
import { createProfileFormInputSchema } from "@/validationSchema/inputValidationSchema";

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