"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getJSON } from "@/https/https";
import { ProfileData } from "@/types/profileData";
import UserProfile from "@/components/userProfile/UserProfile";

export default function UserProfilePage() {
  const { locale, userProfile } = useParams();
  const { data, error, isLoading } = useQuery<{ data: ProfileData }>({
    queryKey: ["userProfile", userProfile],
    queryFn: () => getJSON(`/${userProfile}`),
  });

  console.log("data for profile",data)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>Error loading profile</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p>Profile not found</p>
        </div>
      </div>
    );
  }

  return <UserProfile data={data} />;
}
