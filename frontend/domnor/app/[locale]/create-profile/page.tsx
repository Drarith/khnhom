import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import ProfileForm from "@/components/createProfile/profileForm";

export default async function CreateProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    redirect("/");
  }
  return (
    <div>
      <ProfileForm />;
    </div>
  );
}
