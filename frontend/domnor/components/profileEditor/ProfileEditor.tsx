"use client";
import { useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { Link as LinkIcon, Palette, Eye, User } from "lucide-react";
import type { ProfileData } from "@/types/profileData/profileData";
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
import { useMutation } from "@tanstack/react-query";
import { putJSON, postJSON } from "@/https/https";
import { toast } from "react-toastify";
import getAxiosErrorMessage from "@/helpers/getAxiosErrorMessage";
import { AxiosError } from "axios";
import Button from "../ui/Button";
import ProfileTab from "./ProfileTab";
import SocialsTab from "./SocialsTab";
import LinksTab from "./LinksTab";
import AppearanceTab from "./AppearanceTab";

export default function ProfileEditor({
  initialData,
}: {
  initialData?: ProfileData;
}) {
  const [activeTab, setActiveTab] = useState<
    "profile" | "socials" | "links" | "appearance"
  >("profile");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingLink, setIsAddingLink] = useState(false);

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
    reset: linkReset,
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
      postJSON("/create-link", values),
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
    setIsAddingLink(true);
    setTimeout(() => {
      console.log("Adding link:", values);
      linkMutation.mutate(values, {
        onSettled: () => {
          setIsAddingLink(false);
          linkReset();
        },
      });
    }, 2000);
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
                {activeTab === "profile" && (
                  <ProfileTab
                    register={profileRegister}
                    errors={profileErrors}
                    displayName={displayName}
                    bio={bio}
                    initialData={initialData}
                  />
                )}

                {activeTab === "socials" && (
                  <SocialsTab socials={socials} setValue={profileSetValue} />
                )}

                {activeTab === "links" && (
                  <LinksTab
                    register={linkRegister}
                    errors={linkErrors}
                    handleSubmit={linkHandleSubmit}
                    onAddLink={onAddLinkCLick}
                    linkTitle={link?.title || ""}
                    linkUrl={link?.url || ""}
                    isValid={LinkIsValid}
                    isAdding={isAddingLink}
                    initialData={initialData}
                  />
                )}

                {activeTab === "appearance" && (
                  <AppearanceTab initialData={initialData} />
                )}

                {/* Save Button */}
                {activeTab !== "links" && (
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
