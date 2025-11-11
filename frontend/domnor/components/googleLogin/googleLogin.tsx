import GoogleLoginButton from "./googleButton";
import { getTranslations } from "next-intl/server";

export default async function GoogleLogin() {
  const t = await getTranslations("homepage");
  return <GoogleLoginButton className="mt-10" label={t("googleLabel")}/>;
}
