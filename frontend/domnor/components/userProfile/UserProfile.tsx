import { ProfileData } from "@/types/profileData";
import { ReactNode } from "react";

export default function UserProfile({ data }: { data: ProfileData }) {
  return <h1>this is userProfile {data.displayName}</h1>;
}
