"use client";
import { useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { Camera, Link as LinkIcon, Palette, Eye, User } from "lucide-react";
import type { ProfileData } from "@/types/profileData/profileData";
import { SOCIAL_PLATFORMS } from "@/config/socials";
import ProfileFormInput from "../profileInput/profileInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileFormInputValues } from "@/types/profileForm/profileFormInput";
import { profileFormInputSchema } from "@/validationSchema/inputValidationSchema";
import { normalizeValue } from "@/helpers/normalizeVal";
import SocialMediaForm from "../createProfile/socialMediaForm";

interface ProfileEditorProps {
  initialData?: ProfileData["data"];
}

export default function ProfileEditor({ initialData }: ProfileEditorProps) {
  const [activeTab, setActiveTab] = useState<
    "profile" | "socials" | "links" | "appearance"
  >("profile");

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormInputValues>({
    resolver: zodResolver(
      profileFormInputSchema
    ) as Resolver<ProfileFormInputValues>,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      username: initialData?.username || "",
      displayName: initialData?.displayName || "",
      bio: initialData?.bio || "",
      socials: initialData?.socials,
      link: initialData?.links,
    },
  });

  // Mock data for non-functional component
  const mockData = initialData || {
    _id: "",
    user: "",
    username: "username",
    displayName: "Display Name",
    bio: "",
    profilePictureUrl: "",
    paymentQrCodeUrl: "",
    links: [],
    theme: "",
    selectedTemplate: "default",
    views: 0,
    isActive: true,
    createdAt: "",
    updatedAt: "",
    __v: 0,
    socials: {
      facebook: "",
      instagram: "",
      telegram: "",
      youtube: "",
      linkedin: "",
      x: "",
      tiktok: "",
      github: "",
    },
  };

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

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "socials", label: "Socials", icon: LinkIcon },
    { id: "links", label: "Links", icon: LinkIcon },
    { id: "appearance", label: "Appearance", icon: Palette },
  ] as const;

  const onSubmit = (values: ProfileFormInputValues) => {
    console.log("Form submitted with values:", values);
  }

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
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Eye size={18} />
              Preview
            </button>
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
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="lg:col-span-9">
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
                    <div className="flex items-start gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-linear-to-br from-purple-400 to-pink-600 flex items-center justify-center text-foreground text-3xl font-bold">
                          {mockData.displayName?.[0]?.toUpperCase() || "U"}
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-foreground rounded-full shadow-lg border-2 border-primary/10 hover:bg-primary/5 transition-colors">
                          <Camera size={16} className="text-primary" />
                        </button>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-primary mb-2">
                          Profile Picture
                        </h3>
                        <p className="text-sm text-primary/60 mb-3">
                          Upload a profile picture that represents you
                        </p>
                        <button className="px-4 py-2 border border-primary/20 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
                          Upload Photo
                        </button>
                      </div>
                    </div>
                    <div className="border-t border-primary/10 pt-6 space-y-6">
                      {/* Display Name */}
                      <ProfileFormInput
                        register={register}
                        fieldId="displayName"
                        fieldInput="displayName"
                        fieldStateError={errors.displayName}
                        fieldWatchValue={displayName}
                        label="Display Name"
                        maxLength={30}
                        hasInput={!!displayName}
                      />

                      {/* Bio */}
                      <ProfileFormInput
                        register={register}
                        fieldId="bio"
                        fieldInput="bio"
                        fieldStateError={errors.bio}
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
                          {mockData.paymentQrCodeUrl ? (
                            <div className="space-y-3">
                              <div className="w-32 h-32 mx-auto bg-primary/5 rounded-lg"></div>
                              <button className="text-sm text-primary hover:text-primary/80">
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
                              <button className="text-sm text-primary hover:text-primary/80">
                                Browse files
                              </button>
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

                    <SocialMediaForm socials={socials} setValue={setValue} />
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
                      <button className="px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                        + Add Link
                      </button>
                    </div>

                    {mockData.links.length === 0 ? (
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
                        <button className="px-4 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                          Add Your First Link
                        </button>
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
                            key={template}
                            className={`p-4 border-2 rounded-lg text-center transition-all ${
                              mockData.selectedTemplate === template
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
                            key={color}
                            className="w-12 h-12 rounded-full border-2 border-primary/20 hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                        <button className="w-12 h-12 rounded-full border-2 border-primary/20 hover:scale-110 transition-transform bg-linear-to-br from-purple-400 to-pink-600" />
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
                            {mockData.isActive
                              ? "Your profile is live"
                              : "Your profile is hidden"}
                          </p>
                        </div>
                        <button
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            mockData.isActive ? "bg-primary" : "bg-primary/30"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-foreground transition-transform ${
                              mockData.isActive
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
                <div className="px-6 py-4 border-t border-primary/10 bg-primary/5">
                  <div className="flex justify-end gap-3">
                    <button className="px-6 py-2 border border-primary/20 rounded-lg text-primary hover:bg-primary/5 transition-colors font-medium">
                      Cancel
                    </button>
                    <button type="submit" className="px-6 py-2 bg-primary text-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
