export interface SafeBrowsingResponse {
  matches?: Array<{
    threatType: string;
    platformType: string;
    threat: { url: string };
  }>;
}
