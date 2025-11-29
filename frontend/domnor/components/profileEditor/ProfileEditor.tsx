"use client";
import { useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { Camera, Link as LinkIcon, Palette, Eye, User } from "lucide-react";
import type { ProfileData } from "@/types/profileData/profileData";
import ProfileFormInput from "../profileInput/profileInput";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProfileFormEditorInputValues,
  linkFormEditorInputValues,
} from "@/types/profileForm/profileFormInput";
import {
  profileFormEditorInputSchema,
  linkFormEditorInputSchema,
} from "@/validationSchema/inputValidationSchema";
import { normalizeValue } from "@/helpers/normalizeVal";
import SocialMediaForm from "../createProfile/socialMediaForm";
import { useMutation } from "@tanstack/react-query";
import { putJSON, postJSON } from "@/https/https";
import { toast } from "react-toastify";

import ProfilePicture from "./ProfilePicture";
import getAxiosErrorMessage from "@/helpers/getAxiosErrorMessage";
import { AxiosError } from "axios";
import Button from "../ui/Button";

import { LinkRequest, LinkResponse } from "@/types/profileForm/linkInput";

export default function ProfileEditor({
  initialData,
}: {
  initialData?: ProfileData;
}) {
  const [activeTab, setActiveTab] = useState<
    "profile" | "socials" | "links" | "appearance"
  >("profile");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register: profileRegister,
    control: profileControl,
    setValue: profileSetValue,
    handleSubmit: profileHandleSubmit,
    formState: { errors: profileErrors, isValid: profileIsValid },
  } = useForm<ProfileFormEditorInputValues>({
    resolver: zodResolver(
      profileFormEditorInputSchema
    ) as Resolver<ProfileFormEditorInputValues>,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      displayName: initialData?.displayName,
      bio: initialData?.bio,
      socials: initialData?.socials || {},
    },
  });

  const {
    register: linkRegister,
    control: linkControl,
    handleSubmit: linkHandleSubmit,
    formState: { errors: linkErrors, isValid: LinkIsValid },
  } = useForm<linkFormEditorInputValues>({
    resolver: zodResolver(
      linkFormEditorInputSchema
    ) as Resolver<linkFormEditorInputValues>,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      link: { title: "", url: "" },
    },
  });

  console.log("Initial Data:", initialData);
  const displayName = normalizeValue(
    useWatch({
      control: profileControl,
      name: "displayName",
      defaultValue: initialData?.displayName || "",
    })
  );

  const bio = normalizeValue(
    useWatch({
      control: profileControl,
      name: "bio",
      defaultValue: initialData?.bio || "",
    })
  );

  const link = useWatch({
    control: linkControl,
    name: "link",
    defaultValue: { title: "", url: "" },
  });

  const socials = useWatch({
    control: profileControl,
    name: "socials",
    defaultValue: {},
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "socials", label: "Socials", icon: LinkIcon },
    { id: "links", label: "Links", icon: LinkIcon },
    { id: "appearance", label: "Appearance", icon: Palette },
  ] as const;

  const profileMutation = useMutation({
    mutationFn: (values: ProfileFormEditorInputValues) =>
      putJSON("/update-profile", values),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = getAxiosErrorMessage(error);
      toast.error("Error updating profile" + errorMessage);
    },
  });

  const linkMutation = useMutation({
    mutationFn: (values: linkFormEditorInputValues) =>
      postJSON<LinkResponse, LinkRequest>("/create-link", values),
    onSuccess: () => {
      toast.success("Link added successfully!");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = getAxiosErrorMessage(error);
      toast.error("Error adding link: " + errorMessage);
    },
  });

  const onSubmit = (values: ProfileFormEditorInputValues) => {
    setIsSubmitting(true);
    console.log("Submitting values:", values);
    setTimeout(() => {
      profileMutation.mutate(values, {
        onSettled: () => {
          setIsSubmitting(false);
        },
      });
    }, 1000);
  };

  const onAddLinkCLick = (values: linkFormEditorInputValues) => {
    console.log(values);
    linkMutation.mutate(values);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="bg-foreground rounded-lg shadow-sm p-6 mb-6 border border-primary/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">
                Welcome back, {initialData?.username}
              </h1>
              <p className="text-sm text-primary/60 mt-1">
                Customize your profile and manage your links
              </p>
            </div>
            <Button type="button" className="flex items-center gap-2">
              <Eye size={18} />
              Preview
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-foreground rounded-lg shadow-sm p-2 border border-primary/10">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      type="button"
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-primary/10 text-primary"
                          : "text-primary/70 hover:bg-primary/5"
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}

          <div className="lg:col-span-9">
            <form onSubmit={profileHandleSubmit(onSubmit)} noValidate>
              <div className="bg-foreground rounded-lg shadow-sm border border-primary/10">
                {/* Profile Tab */}
                {activeTab === "profile" && (
                  <div className="p-6 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-primary">
                        Profile Information
                      </h2>
                    </div>

                    {/* Profile Picture */}
                    {initialData?.displayName && (
                      <ProfilePicture
                        displayName={initialData?.displayName}
                        Camera={Camera}
                      />
                    )}
                    <div className="border-t border-primary/10 pt-6 space-y-6">
                      {/* Display Name */}
                      <ProfileFormInput
                        register={profileRegister}
                        fieldId="displayName"
                        fieldInput="displayName"
                        initialValue={initialData?.displayName}
                        fieldStateError={profileErrors.displayName}
                        fieldWatchValue={displayName}
                        label="Display Name"
                        maxLength={30}
                        hasInput={!!displayName}
                      />

                      {/* Bio */}
                      <ProfileFormInput
                        register={profileRegister}
                        fieldId="bio"
                        fieldInput="bio"
                        initialValue={initialData?.bio}
                        fieldStateError={profileErrors.bio}
                        fieldWatchValue={bio}
                        label="Bio"
                        maxLength={1000}
                        textArea={true}
                        hasInput={!!bio}
                      />

                      {/* Payment QR Code */}
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-primary/70 mb-2">
                          Payment QR Code
                        </label>
                        <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:border-primary/30 transition-colors cursor-pointer">
                          {initialData?.paymentQrCodeUrl ? (
                            <div className="space-y-3">
                              <div className="w-32 h-32 mx-auto bg-primary/5 rounded-lg"></div>
                              <button
                                type="button"
                                className="text-sm text-primary hover:text-primary/80"
                              >
                                Change QR Code
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="text-primary/40">
                                <Camera size={32} className="mx-auto" />
                              </div>
                              <p className="text-sm text-primary/60">
                                Upload payment QR code
                              </p>
                              <input
                                type="file"
                                className="text-sm text-primary hover:text-primary/80"
                              ></input>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Socials Tab */}
                {activeTab === "socials" && (
                  <div className="p-6 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-2 text-primary">
                        Social Links
                      </h2>
                      <p className="text-sm text-primary/60">
                        Connect your social media accounts
                      </p>
                    </div>

                    <SocialMediaForm
                      socials={socials}
                      setValue={profileSetValue}
                    />
                  </div>
                )}

                {/* Links Tab */}
                {activeTab === "links" && (
                  <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold mb-2 text-primary">
                          Custom Links
                        </h2>
                        <p className="text-sm text-primary/60">
                          Add custom links to your profile
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-4">
                      <ProfileFormInput
                        register={linkRegister}
                        fieldId="linkTitle"
                        fieldInput="link.title"
                        fieldStateError={linkErrors.link?.title}
                        fieldWatchValue={link?.title || ""}
                        label="Link Title"
                        maxLength={50}
                        hasInput={!!link?.title}
                      />
                      <ProfileFormInput
                        register={linkRegister}
                        fieldId="linkUrl"
                        fieldInput="link.url"
                        fieldStateError={linkErrors.link?.url}
                        fieldWatchValue={link?.url || ""}
                        label="Link URL"
                        maxLength={200}
                        hasInput={!!link?.url}
                      />
                      <Button
                        onClick={linkHandleSubmit(onAddLinkCLick)}
                        disabled={!LinkIsValid}
                        type="button"
                      >
                        Add Link
                      </Button>
                    </div>

                    {initialData?.links.length === 0 ? (
                      <div className="border-2 border-dashed border-primary/20 rounded-lg p-12 text-center">
                        <LinkIcon
                          size={48}
                          className="mx-auto text-primary/40 mb-4"
                        />
                        <h3 className="text-lg font-medium text-primary mb-2">
                          No links yet
                        </h3>
                        <p className="text-sm text-primary/60 mb-4">
                          Start adding custom links to share with your audience
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        placeholder for links list
                      </div>
                    )}
                  </div>
                )}

                {/* Appearance Tab */}
                {activeTab === "appearance" && (
                  <div className="p-6 space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-2 text-primary">
                        Appearance
                      </h2>
                      <p className="text-sm text-primary/60">
                        Customize how your profile looks
                      </p>
                    </div>

                    {/* Template Selection */}
                    <div>
                      <label className="block text-sm font-medium text-primary/70 mb-3">
                        Profile Template
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                          "default",
                          "minimal",
                          "gradient",
                          "dark",
                          "modern",
                          "classic",
                        ].map((template) => (
                          <button
                            type="button"
                            key={template}
                            className={`p-4 border-2 rounded-lg text-center transition-all ${
                              initialData?.selectedTemplate === template
                                ? "border-primary bg-primary/5"
                                : "border-primary/20 hover:border-primary/30"
                            }`}
                          >
                            <div className="w-full h-24 bg-linear-to-br from-primary/10 to-primary/20 rounded mb-2"></div>
                            <span className="text-sm font-medium capitalize text-primary">
                              {template}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Theme Color */}
                    <div>
                      <label className="block text-sm font-medium text-primary/70 mb-3">
                        Theme Color
                      </label>
                      <div className="flex gap-3">
                        {[
                          "#3B82F6",
                          "#8B5CF6",
                          "#EC4899",
                          "#10B981",
                          "#F59E0B",
                          "#EF4444",
                        ].map((color) => (
                          <button
                            type="button"
                            key={color}
                            className="w-12 h-12 rounded-full border-2 border-primary/20 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        <button
                          type="button"
                          className="w-12 h-12 rounded-full border-2 border-primary/20 hover:scale-110 transition-transform bg-linear-to-br from-purple-400 to-pink-600"
                        />
                      </div>
                    </div>

                    {/* Profile Status */}
                    <div className="border-t border-primary/10 pt-6">
                      <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg">
                        <div>
                          <h3 className="font-medium text-primary">
                            Profile Status
                          </h3>
                          <p className="text-sm text-primary/60">
                            {initialData?.isActive
                              ? "Your profile is live"
                              : "Your profile is hidden"}
                          </p>
                        </div>
                        <button
                          type="button"
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            initialData?.isActive
                              ? "bg-primary"
                              : "bg-primary/30"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-foreground transition-transform ${
                              initialData?.isActive
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                {activeTab === "links" ? (
                  ""
                ) : (
                  <div className="px-6 py-4 border-t border-primary/10 bg-primary/5">
                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="secondary">
                        Cancel
                      </Button>
                      <Button
                        disabled={!profileIsValid}
                        type="submit"
                        isLoading={isSubmitting}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
