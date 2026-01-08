import { cache } from "react";
import { Metadata } from "next";
import UserProfile from "@/components/userProfile/UserProfile";
import ProfileNotFound from "@/components/erro/ProfileNotFound";
import StructuredData from "@/components/StructuredData";
import { ProfileData } from "@/types/profileData";

const API_URL =
  process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

type ProfileFetchResult =
  | { status: "success"; data: ProfileData }
  | { status: "not_found" }
  | { status: "error"; message: string };

// 1. Memoized fetch function
const getProfile = cache(
  async (username: string): Promise<ProfileFetchResult> => {
    try {
      const res = await fetch(`${API_URL}/${username.toLowerCase()}`, {
        // next: { revalidate: 60, tags: [`user-${username.toLowerCase()}`] },
        cache: "no-cache",
      });

      if (res.status === 404) {
        return { status: "not_found" };
      }

      if (!res.ok) {
        return {
          status: "error",
          message: `Failed to fetch profile: ${res.status} ${res.statusText}`,
        };
      }

      const data = (await res.json()) as ProfileData;
      return { status: "success", data };
    } catch (err) {
      console.error(err);
      return {
        status: "error",
        message:
          "We're experiencing issues connecting to the server. Please try again later.",
      };
    }
  }
);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userProfile: string; locale: string }>;
}): Promise<Metadata> {
  const { userProfile, locale } = await params;
  const result = await getProfile(userProfile);
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "";

  if (result.status === "success") {
    const profile = result.data;
    const title =
      profile.displayName + " Telegram, Instagram & Facebook Links | Khnhom" ||
      profile.username;
    const description = profile.bio || `Check out ${title}'s profile`;

    const url = `${baseUrl}/${locale}/${userProfile}`;

    return {
      title,
      description,
      alternates: {
        canonical: url,
        languages: {
          en: `${baseUrl}/en/${userProfile}`,
          km: `${baseUrl}/kh/${userProfile}`,
        },
      },
      openGraph: {
        title,
        description,
        url,
        siteName: "Khnhom",
        locale: locale === "kh" ? "km_KH" : "en_US",
        type: "profile",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
    };
  }

  return {
    title:
      result.status === "not_found"
        ? "Profile Not Found"
        : "Error Loading Profile",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userProfile: string; locale: string }>;
}) {
  const { userProfile, locale } = await params;
  const result = await getProfile(userProfile);

  if (result.status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
        <h1 className="text-2xl font-bold mb-2">Unable to Load Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {result.message}
        </p>
      </div>
    );
  }

  if (result.status === "not_found") {
    return <ProfileNotFound username={userProfile} />;
  }

  // At this point, result.status is 'success'
  const { data } = result;

  if (!data.isActive) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>This profile is deactivated.</p>
      </div>
    );
  }

  return (
    <>
      <StructuredData data={data} locale={locale} />
      <UserProfile data={data} />
    </>
  );
}
