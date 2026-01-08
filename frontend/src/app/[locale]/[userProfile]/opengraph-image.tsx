import { ImageResponse } from "next/og";
import { ProfileData } from "@/types/profileData";

export const runtime = "edge";

export const alt = "Profile";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const API_URL =
  process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;

const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;

export default async function Image({
  params,
}: {
  params: Promise<{ userProfile: string }>;
}) {
  const { userProfile } = await params;

  let profile: ProfileData | null = null;

  try {
    const res = await fetch(`${API_URL}/${userProfile.toLowerCase()}`, {
      cache: "no-store",
    });

    if (res.ok) {
      profile = (await res.json()) as ProfileData;
    }
  } catch (error) {
    console.error("Failed to fetch profile for OG image:", error);
  }

  if (!profile || !profile.isActive) {
    console.log(
      `OG Image: Profile not found or inactive for user: ${userProfile}`
    );
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 48,
            background: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#333",
          }}
        >
          Khnhom
        </div>
      ),
      { ...size }
    );
  }

  const { displayName, username, bio, profilePictureUrl } = profile;
  console.log(
    `OG Image: Generating for ${username}, Pic: ${profilePictureUrl}`
  );

  // Ensure we have a valid absolute URL for the image
  // Satori (OG image generation) requires absolute URLs for images
  let imageSrc = profilePictureUrl;

  if (!imageSrc) {
    // Fallback to default
    imageSrc = `${FRONTEND_URL}/default-profile.png`;
  } else if (!imageSrc.startsWith("http")) {
    const path = imageSrc.startsWith("/") ? imageSrc : `/${imageSrc}`;
    imageSrc = `${FRONTEND_URL}${path}`;
  } else {
    if (imageSrc.includes("cloudinary.com")) {
      if (imageSrc.endsWith(".webp")) {
        imageSrc = imageSrc.replace(".webp", ".png");
      }
    }
  }

  const background = "linear-gradient(to bottom right, #ffffff, #f3f4f6)";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: background,
          fontFamily: "sans-serif",
        }}
      >
        {/* Main content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px",
            maxWidth: "80%",
            textAlign: "center",
          }}
        >
        
          <div style={{ display: "flex" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={displayName}
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "6px solid white",
                boxShadow:
                  "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
              }}
            />
          </div>

        
          <div
            style={{
              marginTop: "30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontSize: "64px",
                fontWeight: "bold",
                color: "#111827",
                lineHeight: 1,
              }}
            >
              {displayName}
            </div>
            <div
              style={{ fontSize: "32px", color: "#6B7280", marginTop: "10px" }}
            >
              @{username}
            </div>
          </div>

          {/* Bio Preview */}
          {bio && (
            <div
              style={{
                fontSize: "26px",
                color: "#4B5563",
                marginTop: "24px",
                lineHeight: 1.5,
                maxHeight: "120px",
                overflow: "hidden",
                display: "flex",
              }}
            >
              {bio.length > 90 ? bio.slice(0, 90) + "..." : bio}
            </div>
          )}
        </div>

        {/* Logo / Branding Bottom */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div style={{ fontSize: "24px", fontWeight: 600, color: "#000" }}>
            Khnhom
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
