"use client";
import { useState } from "react";
import { Camera, Link as LinkIcon, Palette, Eye, User } from "lucide-react";
import type { ProfileData } from "@/types/profileData/profileData";
import { SOCIAL_PLATFORMS } from "@/config/socials";

interface ProfileEditorProps {
  initialData?: ProfileData["data"];
}

export default function ProfileEditor({ initialData }: ProfileEditorProps) {
  const [activeTab, setActiveTab] = useState<
    "profile" | "socials" | "links" | "appearance"
  >("profile");

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

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "socials", label: "Socials", icon: LinkIcon },
    { id: "links", label: "Links", icon: LinkIcon },
    { id: "appearance", label: "Appearance", icon: Palette },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
              <p className="text-sm text-gray-500 mt-1">
                Customize your profile and manage your links
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Eye size={18} />
              Preview
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-50"
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
            <div className="bg-white rounded-lg shadow-sm">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Profile Information
                    </h2>
                  </div>

                  {/* Profile Picture */}
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white text-3xl font-bold">
                        {mockData.displayName?.[0]?.toUpperCase() || "U"}
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-100 hover:bg-gray-50 transition-colors">
                        <Camera size={16} className="text-gray-700" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-2">
                        Profile Picture
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Upload a profile picture that represents you
                      </p>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        Upload Photo
                      </button>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    {/* Username */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                          @
                        </span>
                        <input
                          type="text"
                          defaultValue={mockData.username}
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                          placeholder="username"
                        />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">
                        Your unique profile URL: domnor.com/@{mockData.username}
                      </p>
                    </div>

                    {/* Display Name */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        defaultValue={mockData.displayName}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        placeholder="Your name"
                      />
                    </div>

                    {/* Bio */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        defaultValue={mockData.bio}
                        rows={4}
                        maxLength={160}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                        placeholder="Tell people about yourself..."
                      />
                      <p className="mt-2 text-xs text-gray-500 text-right">
                        {mockData.bio?.length || 0}/160
                      </p>
                    </div>

                    {/* Payment QR Code */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment QR Code
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                        {mockData.paymentQrCodeUrl ? (
                          <div className="space-y-3">
                            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg"></div>
                            <button className="text-sm text-blue-600 hover:text-blue-700">
                              Change QR Code
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="text-gray-400">
                              <Camera size={32} className="mx-auto" />
                            </div>
                            <p className="text-sm text-gray-500">
                              Upload payment QR code
                            </p>
                            <button className="text-sm text-blue-600 hover:text-blue-700">
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
                    <h2 className="text-xl font-semibold mb-2">Social Links</h2>
                    <p className="text-sm text-gray-500">
                      Connect your social media accounts
                    </p>
                  </div>

                  <div className="space-y-4">
                    {SOCIAL_PLATFORMS.map((platform) => {
                      const socialValue =
                        mockData.socials[
                          platform.key as keyof typeof mockData.socials
                        ] || "";

                      return (
                        <div
                          key={platform.key}
                          className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                        >
                          <div className="flex-shrink-0">{platform.svg}</div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {platform.label}
                            </label>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-400 whitespace-nowrap">
                                {platform.prefix}
                              </span>
                              <input
                                type="text"
                                defaultValue={socialValue}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
                                placeholder={`your${platform.key}`}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Links Tab */}
              {activeTab === "links" && (
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        Custom Links
                      </h2>
                      <p className="text-sm text-gray-500">
                        Add custom links to your profile
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      + Add Link
                    </button>
                  </div>

                  {mockData.links.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                      <LinkIcon
                        size={48}
                        className="mx-auto text-gray-400 mb-4"
                      />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No links yet
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Start adding custom links to share with your audience
                      </p>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        Add Your First Link
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mockData.links.map((link, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                        >
                          <div className="flex-1">
                            <input
                              type="text"
                              defaultValue="Link Title"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                              placeholder="Link title"
                            />
                            <input
                              type="url"
                              defaultValue={link}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                              placeholder="https://"
                            />
                          </div>
                          <button className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === "appearance" && (
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Appearance</h2>
                    <p className="text-sm text-gray-500">
                      Customize how your profile looks
                    </p>
                  </div>

                  {/* Template Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
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
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="w-full h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-2"></div>
                          <span className="text-sm font-medium capitalize">
                            {template}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Theme Color */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
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
                          className="w-12 h-12 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      <button className="w-12 h-12 rounded-full border-2 border-gray-300 hover:scale-110 transition-transform bg-gradient-to-br from-purple-400 to-pink-600" />
                    </div>
                  </div>

                  {/* Profile Status */}
                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Profile Status
                        </h3>
                        <p className="text-sm text-gray-500">
                          {mockData.isActive
                            ? "Your profile is live"
                            : "Your profile is hidden"}
                        </p>
                      </div>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          mockData.isActive ? "bg-blue-600" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
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
              <div className="px-6 py-4 border-t bg-gray-50">
                <div className="flex justify-end gap-3">
                  <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium">
                    Cancel
                  </button>
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
