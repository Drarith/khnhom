"use client";
import { useQuery } from "@tanstack/react-query";

import { getJSON } from "@/https/https";

import { toast } from "react-toastify";

import type { ProfileData } from "@/types/profileData/profileData";
import ProfileEditor from "@/components/profileEditor/ProfileEditor";

export default function Dashboard() {
  const { isPending, error, data } = useQuery<ProfileData>({
    queryKey: ["placeHolder"],
    queryFn: () => getJSON("/me"),
  });

  if (error) {
    toast.error(error.message);
  }

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

  return <ProfileEditor initialData={data?.data} />;
}
