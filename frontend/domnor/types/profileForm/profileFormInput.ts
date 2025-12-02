import { z } from "zod";
import {
  createProfileFormInputSchema,
  profileFormEditorInputSchema,
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
  typeof profileFormEditorInputSchema
>;

export type linkFormEditorInputValues = z.infer<
  typeof linkFormEditorInputSchema
>;

export type khqrFormEditorInputValues = z.infer<
  typeof khqrFormEditorInputSchema
>;
