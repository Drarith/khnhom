export interface ProfileData {
  _id: string;
  user: string;
  username: string;
  displayName: string;
  bio: string;
  profilePictureUrl: string;
  paymentQrCodeUrl: string;
  paymentInfo: {
    bakongAccountID: string;
    merchantName: string;
    merchantCity?: string;
    currency?: string;
    amount?: number;
    purpose?: string;
  };
  links: { title: string; url: string, _id:string}[];
  theme: string;
  selectedTemplate: TemplateType;
  views: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  socials: {
    facebook: string;
    instagram: string;
    telegram: string;
    youtube: string;
    linkedin: string;
    x: string;
    tiktok: string;
    github: string;
  };
}

export type TemplateType = "default" | "brutalist";