"use client";
import { useQuery } from "@tanstack/react-query";

import { getJSON } from "@/https/https";

import type { ProfileData } from "@/types/profileData";
import ProfileEditor from "@/components/profileEditor/ProfileEditor";
import ErrorBoundary from "@/errorBoundary";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const { isPending, data } = useQuery<{ data: ProfileData }>({
    queryKey: ["profile"],
    queryFn: () => getJSON("/me"),
  });

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ProfileEditor initialData={data?.data} />
    </ErrorBoundary>
  );
}
