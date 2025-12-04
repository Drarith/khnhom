"use client";
import { useState, useEffect } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { Link as LinkIcon, Palette, Eye, User, QrCode } from "lucide-react";
import type { ProfileData } from "@/types/profileData";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProfileFormEditorInputValues,
  linkFormEditorInputValues,
  khqrFormEditorInputValues,
} from "@/types/profileFormInput";
import {
  profileFormEditorInputSchema,
  linkFormEditorInputSchema,
  khqrFormEditorInputSchema,
} from "@/validationSchema/inputValidationSchema";
import { normalizeValue } from "@/helpers/normalizeVal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putJSON, postJSON, deleteLink } from "@/https/https";
import { toast } from "react-toastify";
import getAxiosErrorMessage from "@/helpers/getAxiosErrorMessage";
import { AxiosError } from "axios";

import Button from "../ui/Button";
import ProfileTab from "./components/ProfileTab";
import SocialsTab from "./components/SocialsTab";
import LinksTab from "./components/LinksTab";
import AppearanceTab from "./components/AppearanceTab";
import PaymentTab from "./components/PaymentTab";

export default function ProfileEditor({
  initialData,
}: {
  initialData?: ProfileData;
}) {
  const [activeTab, setActiveTab] = useState<
    "profile" | "socials" | "links" | "appearance" | "payment"
  >("profile");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const [generatedQR, setGeneratedQR] = useState<string>("");
  const [qrError, setQrError] = useState<string>("");

  const queryClient = useQueryClient();

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

  const {
    register: khqrRegister,
    control: khqrControl,
    reset: khqrReset,
    handleSubmit: khqrHandleSubmit,
    formState: { errors: khqrErrors, isValid: khqrIsValid },
  } = useForm<khqrFormEditorInputValues>({
    resolver: zodResolver(
      khqrFormEditorInputSchema
    ) as Resolver<khqrFormEditorInputValues>,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      accountType: undefined,
      bakongAccountID: "",
      merchantName: "",
      currency: "KHR",
      amount: "",
      merchantCity: "Phnom Penh",
      billNumber: "",
      mobileNumber: "",
      storeLabel: "",
      terminalLabel: "",
      purposeOfTransaction: "",
      upiAccountInformation: "",
      merchantAlternateLanguagePreference: "",
      merchantNameAlternateLanguage: "",
      merchantCityAlternateLanguage: "",
      accountInformation: "",
      acquiringBank: "",
      merchantID: "",
    },
  });

  // console.log("Initial Data:", initialData);
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

  // KHQR form watches
  const accountType = useWatch({
    control: khqrControl,
    name: "accountType",
    defaultValue: "individual",
  });
  const bakongAccountID = useWatch({
    control: khqrControl,
    name: "bakongAccountID",
    defaultValue: "",
  });
  const merchantName = useWatch({
    control: khqrControl,
    name: "merchantName",
    defaultValue: "",
  });
  const currency = useWatch({
    control: khqrControl,
    name: "currency",
    defaultValue: "KHR",
  });
  const amount = useWatch({
    control: khqrControl,
    name: "amount",
    defaultValue: "",
  });
  const merchantID = useWatch({
    control: khqrControl,
    name: "merchantID",
    defaultValue: "",
  });
  const acquiringBank = useWatch({
    control: khqrControl,
    name: "acquiringBank",
    defaultValue: "",
  });
  const accountInformation = useWatch({
    control: khqrControl,
    name: "accountInformation",
    defaultValue: "",
  });
  const merchantCity = useWatch({
    control: khqrControl,
    name: "merchantCity",
    defaultValue: "",
  });
  const billNumber = useWatch({
    control: khqrControl,
    name: "billNumber",
    defaultValue: "",
  });
  const mobileNumber = useWatch({
    control: khqrControl,
    name: "mobileNumber",
    defaultValue: "",
  });
  const storeLabel = useWatch({
    control: khqrControl,
    name: "storeLabel",
    defaultValue: "",
  });
  const terminalLabel = useWatch({
    control: khqrControl,
    name: "terminalLabel",
    defaultValue: "",
  });
  const purposeOfTransaction = useWatch({
    control: khqrControl,
    name: "purposeOfTransaction",
    defaultValue: "",
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "socials", label: "Socials", icon: LinkIcon },
    { id: "links", label: "Links", icon: LinkIcon },
    { id: "payment", label: "Payment", icon: QrCode },
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

  const linkAddMutation = useMutation({
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

  const linkDeleteMutation = useMutation({
    mutationFn: (id: string) => {
      return deleteLink(`/profile/links/${id}`);
    },
    onSuccess: () => {
      toast.success("Link deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = getAxiosErrorMessage(error);
      toast.error("Error deleting link: " + errorMessage);
    },
  });

  const onDelete = (id: string) => {
    linkDeleteMutation.mutate(id);
  };

  const paymentMutation = useMutation({
    mutationFn: (PaymentRequest: Partial<khqrFormEditorInputValues>) => {
      return postJSON("/khqr", PaymentRequest);
    },
    onSuccess: () => {
      toast.success("Your Payment QR has been created successfully!");
      // queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = getAxiosErrorMessage(error);
      toast.error("Error creating QR payment: " + errorMessage);
    },
  });

  const onSubmit = (values: ProfileFormEditorInputValues) => {
    setIsSubmitting(true);
    console.log("Submitting values:", values);
    try {
      setTimeout(() => {
        profileMutation.mutate(values, {
          onSettled: () => {
            setIsSubmitting(false);
          },
        });
      }, 1000);
    } catch (err) {
      const errorMsg = getAxiosErrorMessage(err);
      toast.error(errorMsg);
      console.error("Error submitting profile:", err);
      setIsSubmitting(false);
    }
  };

  const onAddLinkCLick = (values: linkFormEditorInputValues) => {
    setIsAddingLink(true);
    try {
      setTimeout(() => {
        console.log("Adding link:", values);
        linkAddMutation.mutate(values, {
          onSettled: () => {
            setIsAddingLink(false);
            linkReset();
          },
        });
      }, 2000);
    } catch (err) {
      const errorMsg = getAxiosErrorMessage(err);
      toast.error(errorMsg);
      console.error("Error adding link:", err);
      setIsAddingLink(false);
    }
  };

  const onGenerateQR = (values: khqrFormEditorInputValues) => {
    setIsGeneratingQR(true);
    setQrError("");

    try {
      // filter out unnecessary optional data with empty string
      const filteredData = Object.entries(values).filter(
        ([_, val]) => val !== ""
      );
      const requestData = Object.fromEntries(filteredData);

      paymentMutation.mutate(requestData, {
        onSettled: () => {
          setIsGeneratingQR(false);
        },
        onSuccess: (data: any) => {
          if (data?.qrCode) {
            setGeneratedQR(data.qrCode);
          }
        },
      });
    } catch (err) {
      const errorMsg = getAxiosErrorMessage(err);
      setQrError(errorMsg);
      toast.error(errorMsg);
      console.error("Error generating KHQR:", err);
      setIsGeneratingQR(false);
    }
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
                    onDelete={onDelete}
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

                {activeTab === "payment" && (
                  <PaymentTab
                    register={khqrRegister}
                    errors={khqrErrors}
                    handleSubmit={khqrHandleSubmit}
                    onGenerateQR={onGenerateQR}
                    accountType={accountType}
                    bakongAccountID={bakongAccountID}
                    merchantName={merchantName}
                    merchantID={merchantID}
                    acquiringBank={acquiringBank}
                    accountInformation={accountInformation}
                    currency={currency}
                    amount={amount}
                    merchantCity={merchantCity}
                    billNumber={billNumber}
                    mobileNumber={mobileNumber}
                    storeLabel={storeLabel}
                    terminalLabel={terminalLabel}
                    purposeOfTransaction={purposeOfTransaction}
                    isValid={khqrIsValid}
                    isGenerating={isGeneratingQR}
                    generatedQR={generatedQR}
                    error={qrError}
                    initialData={initialData}
                  />
                )}

                {/* Save Button */}
                {activeTab !== "links" && activeTab !== "payment" && (
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
