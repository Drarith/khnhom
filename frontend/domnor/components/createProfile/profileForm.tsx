"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormInputSchema } from "@/validationSchema/ProfileInputSchema";
import { z } from "zod";

import { useTranslations } from "next-intl";

import ProfileFormInput from "../profieInput/profileInput";

type FormInputValues = z.infer<typeof profileFormInputSchema>;

export default function ProfileForm() {
  const t = useTranslations("profileInputLabel");
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormInputValues>({
    resolver: zodResolver(profileFormInputSchema) as Resolver<FormInputValues>,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      username: "",
      displayName: "",
      bio: "",
      profilePictureUrl: "",
      paymentQrCodeUrl: "",
      socials: {},
      theme: "default",
    },
  });

  const username = watch("username");
  const displayName = watch("displayName");
  const bio = watch("bio");

  return (
    <div className="bg-foreground flex flex-col py-3 items-center rounded-2xl mx-7 my-7 min-h-screen">
      {" "}
      <form action="">
        <ProfileFormInput
          register={register}
          fieldId="username"
          fieldInput="username"
          fieldStateError={errors.username}
          fieldWatchValue={username}
          label={t("username")}
          maxLength={30}
        />
        <ProfileFormInput
          register={register}
          fieldId="displayName"
          fieldInput="displayName"
          fieldStateError={errors.displayName}
          fieldWatchValue={displayName}
          label={t("displayName")}
          maxLength={30}
        />
        <ProfileFormInput
          register={register}
          fieldId="bio"
          fieldInput="bio"
          fieldStateError={errors.bio}
          fieldWatchValue={bio}
          label={t("bio")}
          maxLength={1000}
          textArea={true}
        />
      </form>
    </div>
  );
}
