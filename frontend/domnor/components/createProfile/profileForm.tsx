"use client";

import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormInputSchema } from "@/validationSchema/ProfileInputSchema";
import { z } from "zod";

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
      <div>
        <label htmlFor="username">Username</label>
        <input id="username" {...register("username")} />
      </div>
    </form>
  );
}
