import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import ProfileForm from "@/components/createProfile/profileForm";
import ErrorBoundary from "@/errorBoundary";

export default async function CreateProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    redirect("/");
  }
  return (
    <ErrorBoundary>
      <ProfileForm />
    </ErrorBoundary>
  );
}
