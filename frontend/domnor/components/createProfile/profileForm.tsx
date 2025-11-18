"use client";

import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProfileFormInputSchema } from "@/validationSchema/inputValidationSchema";

import { useTranslations } from "next-intl";

import ProfileFormInput from "../profileInput/profileInput";
import SocialMediaForm from "./socialMediaForm";

import { useMutation } from "@tanstack/react-query";
import { postJSON } from "@/https/https";

import { ProfileFormInputValues } from "@/types/profileForm/profileFormInput";
import { Bounce, toast } from "react-toastify";

import { useState } from "react";
import { AxiosError } from "axios";
import getAxiosErrorMessage from "@/helpers/getAxiosErrorMessage";
import { useRouter } from "next/navigation";

export default function ProfileForm() {
  const router = useRouter();

  const t = useTranslations("profileSetupPage");

  const profileFormInputSchema = createProfileFormInputSchema(t);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<ProfileFormInputValues>({
    resolver: zodResolver(
      profileFormInputSchema
    ) as Resolver<ProfileFormInputValues>,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      username: "",
      displayName: "",
      bio: "",
      socials: {},
      link: "",
    },
  });

  const normalizeValue = (value?: string | null) => value ?? "";
  const username = normalizeValue(
    useWatch({ control, name: "username", defaultValue: "" })
  );
  const displayName = normalizeValue(
    useWatch({ control, name: "displayName", defaultValue: "" })
  );
  const bio = normalizeValue(
    useWatch({ control, name: "bio", defaultValue: "" })
  );

  const link = normalizeValue(
    useWatch({ control, name: "link", defaultValue: "" })
  );

  const socials = useWatch({ control, name: "socials", defaultValue: {} });

  const hasValue = (value: string) => value.trim().length > 0;

  const mutation = useMutation({
    mutationFn: (values: ProfileFormInputValues) =>
      postJSON("/create-profile", values),
    onSuccess: (data) => {
      console.log("Profile created successfully", data);
      setIsSubmitting(false);
      router.push("/dashboard");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = getAxiosErrorMessage(error);
      if (errorMessage?.includes("Profile already existed")) {
        toast.error(errorMessage + " redirecting...", {
          position: "top-right",
          autoClose: 3000,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Bounce,
        });
        setTimeout(() => {
          setIsSubmitting(false);
          router.push("/dashboard");
        }, 3000);
      } else {
        toast.error(errorMessage + " Please try again later.", {
          position: "top-right",
          autoClose: 10000,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
          transition: Bounce,
        });
        setIsSubmitting(false);
      }
    },
  });

  const onSubmit = (values: ProfileFormInputValues) => {
    setIsSubmitting(true);
    mutation.mutate(values);
  };

  return (
    <section className="min-h-screen w-full bg-foreground px-4 py-8">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-primary/10 bg-foreground px-6 py-8 shadow-2xl md:px-10 md:py-12">
        <header className="space-y-2 border-b border-primary/10 pb-6">
          <h1 className="text-primary text-2xl">DOMNOR</h1>
          <p className="text-sm uppercase tracking-[0.2em] text-primary/70">
            {t("common.page")}
          </p>
          <h2 className="text-2xl font-semibold text-primary md:text-3xl">
            {t("common.title")}
          </h2>
          <p className="text-sm text-primary/70">{t("common.about")}</p>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-10"
          noValidate
        >
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary/80">
                  {t("common.basic")}
                </p>
                <p className="text-xs text-primary/70">
                  {t("common.basicInfo")}
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <ProfileFormInput
                register={register}
                fieldId="username"
                fieldInput="username"
                fieldStateError={errors.username}
                fieldWatchValue={username}
                label={t("profileInputLabel.username")}
                maxLength={30}
                hasInput={hasValue(username)}
              />
              <ProfileFormInput
                register={register}
                fieldId="displayName"
                fieldInput="displayName"
                fieldStateError={errors.displayName}
                fieldWatchValue={displayName}
                label={t("profileInputLabel.displayName")}
                maxLength={30}
                hasInput={hasValue(displayName)}
              />
            </div>

            <ProfileFormInput
              register={register}
              fieldId="bio"
              fieldInput="bio"
              fieldStateError={errors.bio}
              fieldWatchValue={bio}
              label={t("profileInputLabel.bio")}
              maxLength={1000}
              textArea
              hasInput={hasValue(bio)}
            />
          </section>

          <section className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-primary/80">
                {t("common.socialAndLink")}
              </p>
              <p className="text-xs text-primary/70">
                {t("common.socialAndLinkInfo")}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <ProfileFormInput
                register={register}
                fieldId="link"
                fieldInput="link"
                fieldStateError={errors.link}
                fieldWatchValue={link}
                label={t("profileInputLabel.link")}
                maxLength={200}
                hasInput={hasValue(link)}
              />
            </div>

            <SocialMediaForm socials={socials} setValue={setValue} />
          </section>

          <footer className="flex flex-col gap-4 border-t border-primary/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-primary/70">{t("common.preSave")}</p>
            <button
              type="submit"
              disabled={isSubmitting ? true : !isValid}
              className="w-full rounded-full bg-primary px-8 py-3 text-center text-sm font-semibold uppercase tracking-wide text-foreground transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isSubmitting ? "Submitting" : t("common.saveProfile")}
            </button>
          </footer>
        </form>
      </div>
    </section>
  );
}
