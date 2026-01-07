import { MetadataRoute } from "next";
import { getJSON } from "@/https/https";

interface PublicProfile {
  username: string;
  updatedAt: string;
}

interface ProfilesResponse {
  status: string;
  data: PublicProfile[];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_FRONTEND_URL || "";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/en/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kh/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/kh/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/en/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/kh/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/en/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/kh/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  // Fetch all public profiles
  try {
    const response = await getJSON<ProfilesResponse>("/profiles/public");

    if (response.status === "success" && response.data) {
      // Add English locale versions
      const profilePages: MetadataRoute.Sitemap = response.data.map(
        (profile) => ({
          url: `${baseUrl}/en/${profile.username}`,
          lastModified: new Date(profile.updatedAt),
          changeFrequency: "weekly",
          priority: 0.9,
        })
      );

      // Add Khmer locale versions
      const profilePagesKh: MetadataRoute.Sitemap = response.data.map(
        (profile) => ({
          url: `${baseUrl}/kh/${profile.username}`,
          lastModified: new Date(profile.updatedAt),
          changeFrequency: "weekly",
          priority: 0.9,
        })
      );

      return [...staticPages, ...profilePages, ...profilePagesKh];
    }

    return staticPages;
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return static pages only if profile fetch fails
    return staticPages;
  }
}
