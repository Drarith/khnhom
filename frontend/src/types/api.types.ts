export interface LinkResponse {
  links: string[];
}

export interface SignatureResponse {
  signature: string;
  timestamp: number;
  publicId: string;
}

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  bytes: number;
}

// Profile API Types
export interface PublicProfile {
  username: string;
  updatedAt: string;
}

export interface ProfilesResponse {
  status: string;
  data: PublicProfile[];
}
