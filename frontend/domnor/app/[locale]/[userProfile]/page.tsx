import UserProfile from "@/components/userProfile/UserProfile";
import { ProfileData } from "@/types/profileData";
import { Metadata } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function generateMetadata({ params }: { params: { locale: string; userProfile: string } }): Promise<Metadata> {
  const {locale, userProfile } = await params;
  const username = userProfile.toString().toLowerCase();
  const res = await fetch(`${API_URL}/${username}`, { next: { revalidate: 60 } });
  if (!res.ok) return { title: "Profile", description: "Profile not found" };
  const profile: ProfileData = await res.json();
  const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/${username}`;
  const image = profile.profilePictureUrl || `${process.env.NEXT_PUBLIC_FRONTEND_URL}/default-profile.png`;

  return {
    title: profile.displayName || profile.username,
    description: profile.bio || "Profile",
    openGraph: {
      url,
      title: profile.displayName,
      description: profile.bio,
      images: [image],
    },
  };
}

export default async function UserProfilePage({ params }: { params: { locale: string; userProfile: string } }) {
  const { locale, userProfile } = await params;
  const username = userProfile.toString().toLowerCase();
  console.log("Fetching profile for username:", username);
  const res = await fetch(`${API_URL}/${username}`, { next: { revalidate: 60 } });
  if (!res.ok) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>Error loading profile</p>
        </div>
      </div>
    );
  }

  const data: ProfileData = await res.json();

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  if (!data.isActive) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>This profile is deactivated.</p>
        </div>
      </div>
    );
  }

  return <UserProfile data={data} />;
}
