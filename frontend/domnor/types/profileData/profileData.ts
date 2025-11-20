export interface ProfileData {
  data: {
    _id: string;
    user: string;
    username: string;
    displayName: string;
    bio: string;
    profilePictureUrl: string;
    paymentQrCodeUrl: string;
    links: string[];
    theme: string;
    selectedTemplate: string;
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
  };
}