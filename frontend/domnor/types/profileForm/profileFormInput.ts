export interface profileFormInput {
  username: string;
  displayName: string;
  bio?: string;
  profilePictureUrl?: string;
  paymentQrCodeUrl?: string;
  socials?: Record<string, string>[];
  link?: Record<string, string>;
  theme: string;
  selectedTemplate?: string;
}
