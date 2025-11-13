"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormInputSchema } from "@/validationSchema/ProfileInputSchema";
import { z } from "zod";

import ProfileFormInput from "../profieInput/profileInput";

type FormInputValues = z.infer<typeof profileFormInputSchema>;

export default function ProfileForm() {
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
    <form action="">
      {/* <div>
        <label htmlFor="username">Username</label>
        <input id="username" {...register("username")} />
        <div style={{ fontSize: 12, color: errors.username ? "red" : "#666" }}>
          {errors.username ? (
            // error message from Zod will be in errors.username.message
            <span role="alert">{errors.username.message}</span>
          ) : (
            <span>{username.length}/30</span>
          )}
        </div>
      </div> */}
      <ProfileFormInput
        register={register}
        fieldId="username"
        fieldInput="username"
        fieldStateError={errors.username}
        fieldWatchValue={username}
        label="Username"
        maxLength={30}
      />
    </form>
  );
}
