"use client";

import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormInputSchema } from "@/validationSchema/ProfileInputSchema";
import { z } from "zod";

import { useTranslations } from "next-intl";

import ProfileFormInput from "../profieInput/profileInput";

type FormInputValues = z.infer<typeof profileFormInputSchema>;

export default function ProfileForm() {
  const t = useTranslations("profileSetupPage");
  const {
    register,
    control,
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

  const hasValue = (value: string) => value.trim().length > 0;

  const onSubmit = (values: FormInputValues) => {
    // TODO: wire this up to the real create/update profile mutation
    console.table(values);
  };

  return (
    <section className="min-h-screen w-full bg-foreground px-4 py-8">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-primary/10 bg-foreground px-6 py-8 shadow-2xl md:px-10 md:py-12">
        <header className="space-y-2 border-b border-primary/10 pb-6">
          <p className="text-sm uppercase tracking-[0.2em] text-primary/70">
            {t("common.page")}
          </p>
          <h1 className="text-2xl font-semibold text-primary md:text-3xl">
            {t("common.title")}
          </h1>
          <p className="text-sm text-primary/70">
            {t("common.about")}
          </p>
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
              {/* <span className="text-xs text-primary/60">
                {isValid ? "All good" : "Keep editing"}
              </span> */}
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
          </section>

          <footer className="flex flex-col gap-4 border-t border-primary/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-primary/70">
              {t("common.preSave")}
            </p>
            <button
              type="submit"
              disabled={!isValid}
              className="w-full rounded-full bg-primary px-8 py-3 text-center text-sm font-semibold uppercase tracking-wide text-foreground transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {t("common.saveProfile")}
            </button>
          </footer>
        </form>
      </div>
    </section>
  );
}
