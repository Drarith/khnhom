import GoogleLoginButton from "./googleButton";
import { getTranslations } from "next-intl/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default async function GoogleLogin() {
  const t = await getTranslations("homepage");
  return <GoogleLoginButton className="mt-10" label={t("googleLabel")} href={`${API_BASE}/auth/google`} />;
}
