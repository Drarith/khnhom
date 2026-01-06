import { ProfileData } from "@/types/profileData";

interface StructuredDataProps {
  data: ProfileData;
  locale: string;
}

export default function StructuredData({ data, locale }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

  // Collect all social media URLs
  const sameAs = Object.entries(data.socials || {})
    .filter(([_, url]) => url && url.trim() !== "")
    .map(([_, url]) => url);

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_FRONTEND_URL is not defined");
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: data.createdAt,
    dateModified: data.updatedAt,
    mainEntity: {
      "@type": "Person",
      name: data.displayName || data.username,
      alternateName: data.username,
      description: data.bio || undefined,
      image: data.profilePictureUrl || undefined,
      url: `${baseUrl}/${locale}/${data.username}`,
      ...(sameAs.length > 0 && { sameAs: sameAs }),
      ...(data.isVerified && {
        award: "Verified Profile",
        knowsAbout: "Verified Content Creator",
      }),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
