import { cache } from "react";
import { Metadata } from "next";
import UserProfile from "@/components/userProfile/UserProfile";
import ProfileNotFound from "@/components/erro/ProfileNotFound";
import { ProfileData } from "@/types/profileData";

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// 1. Memoized fetch function
const getProfile = cache(async (username: string) => {
  const res = await fetch(`${API_URL}/${username.toLowerCase()}`, {
    // next: { revalidate: 60, tags: [`user-${username.toLowerCase()}`] },
    cache: "no-cache",
  });
  if (!res.ok) return null;
  return res.json() as Promise<ProfileData>;
});

export async function generateMetadata({
  params,
}: {
  params: { userProfile: string };
}): Promise<Metadata> {
  const { userProfile } = await params;
  const profile = await getProfile(userProfile);

  if (!profile) return { title: "Profile Not Found" };

  return {
    title: profile.displayName || profile.username,
    description: profile.bio || "Profile",
    openGraph: {
      images: [profile.profilePictureUrl || "/default-profile.png"],
    },
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: { userProfile: string };
}) {
  const { userProfile } = await params;
  const data = await getProfile(userProfile);

  if (!data) {
    return <ProfileNotFound username={userProfile} />;
  }

  if (!data.isActive) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>This profile is deactivated.</p>
      </div>
    );
  }

  return <UserProfile data={data} />;
}
