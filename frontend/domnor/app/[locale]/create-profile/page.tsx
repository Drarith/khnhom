import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// import { ToastContainer } from "react-toastify";

import ProfileForm from "@/components/createProfile/profileForm";

export default async function CreateProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    redirect("/");
  }
  return (
    <div>
      <ProfileForm />;
      {/* <ToastContainer/> */}
    </div>
  );
}
