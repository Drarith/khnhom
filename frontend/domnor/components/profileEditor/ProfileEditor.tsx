"use client";
import { useState, useEffect } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import {
  Link as LinkIcon,
  Palette,
  Eye,
  User,
  QrCode,
  Shield,
} from "lucide-react";
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
import {
  putJSON,
  postJSON,
  deleteLink,
  logout,
  getJSON,
  patchJSON,
} from "@/https/https";
import { toast } from "react-toastify";
import getAxiosErrorMessage from "@/helpers/getAxiosErrorMessage";
import { AxiosError } from "axios";

import Button from "../ui/Button";
import ProfileTab from "./components/ProfileTab";
import SocialsTab from "./components/SocialsTab";
import LinksTab from "./components/LinksTab";
import AppearanceTab from "./components/AppearanceTab";
import PaymentTab from "./components/PaymentTab";
import AdminTab from "./components/AdminTab";

import UserProfile from "../userProfile/UserProfile";
import { useTabAnimation } from "@/gsap/tab";
import { setTimeout } from "timers";
import { set } from "zod";

export enum Tab {
  PROFILE = "profile",
  SOCIALS = "socials",
  LINKS = "links",
  APPEARANCE = "appearance",
  PAYMENT = "payment",
  ADMIN = "admin",
}

export default function ProfileEditor({
  initialData,
}: {
  initialData?: ProfileData;
}) {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PROFILE);

  const [qrError, setQrError] = useState<string>("");
  const [notPreviewing, setNotPreviewing] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await getJSON<{ role: string }>("user/role");
        setIsAdmin(response.role === "admin");
      } catch (error) {
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, []);

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
      theme: initialData?.theme || "",
      selectedTemplate: initialData?.selectedTemplate || "default",
      backgroundImage: initialData?.backgroundImage || "",
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

  const theme = useWatch({
    control: profileControl,
    name: "theme",
    defaultValue: "classic dark",
  });

  const selectedTemplate = useWatch({
    control: profileControl,
    name: "selectedTemplate",
    defaultValue: "default",
  });

  const backgroundImage = useWatch({
    control: profileControl,
    name: "backgroundImage",
    defaultValue: "",
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
    { id: Tab.PROFILE, label: "Profile", icon: User },
    { id: Tab.SOCIALS, label: "Socials", icon: LinkIcon },
    { id: Tab.LINKS, label: "Links", icon: LinkIcon },
    { id: Tab.PAYMENT, label: "Payment", icon: QrCode },
    { id: Tab.APPEARANCE, label: "Appearance", icon: Palette },
    ...(isAdmin ? [{ id: Tab.ADMIN, label: "Admin", icon: Shield }] : []),
  ];

  const { mutate: profileMutation, isPending: isProfilePending } = useMutation({
    mutationFn: (values: ProfileFormEditorInputValues) =>
      putJSON("/update-profile", values),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = getAxiosErrorMessage(error);
      toast.error("Error updating profile" + errorMessage);
    },
  });

  const { mutate: linkAddMutation, isPending: isAddingLink } = useMutation({
    mutationFn: (values: linkFormEditorInputValues) =>
      postJSON("/create-link", values),
    onSuccess: () => {
      toast.success("Link added successfully!");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = getAxiosErrorMessage(error);
      toast.error("Error adding link: " + errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      linkReset();
    },
  });

  const { mutate: linkDeleteMutation, isPending: isDeletingLink } = useMutation(
    {
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
    }
  );

  const { mutate: paymentMutation, isPending: isGeneratingQR } = useMutation({
    mutationFn: (PaymentRequest: Partial<khqrFormEditorInputValues>) => {
      return postJSON("/khqr", PaymentRequest);
    },
    onSuccess: () => {
      toast.success("Your Payment QR has been created successfully!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = getAxiosErrorMessage(error);
      toast.error("Error creating QR payment");
      setQrError(errorMessage);
    },
  });

  const { mutate: logoutMutation } = useMutation({
    mutationFn: () => {
      return logout();
    },
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  const { mutate: deactivateAccountMutation, isPending: isDeactivating } =
    useMutation({
      mutationFn: (username: string) =>
        patchJSON<unknown, { success: boolean; message: string }>(
          `admin/deactivate/${username}`
        ),
      onSuccess: (response) => {
        toast.success(response.message);
      },
      onError: (error: AxiosError<{ message?: string }>) => {
        const errorMessage = getAxiosErrorMessage(error);
        toast.error(errorMessage || "Failed to deactivate account");
      },
    });

  const { mutate: reactivateAccountMutation, isPending: isReactivating } =
    useMutation({
      mutationFn: (username: string) =>
        patchJSON<unknown, { success: boolean; message: string }>(
          `admin/reactivate/${username}`
        ),
      onSuccess: (response) => {
        toast.success(response.message);
      },
      onError: (error: AxiosError<{ message?: string }>) => {
        const errorMessage = getAxiosErrorMessage(error);
        toast.error(errorMessage || "Failed to reactivate account");
      },
    });

  const onDelete = (id: string) => {
    linkDeleteMutation(id);
  };

  const onSubmit = (values: ProfileFormEditorInputValues) => {
    // console.log("Submitting profile values:", values);
    profileMutation(values);
  };

  const onAddLinkCLick = (values: linkFormEditorInputValues) => {
    linkAddMutation(values);
  };

  const onGenerateQR = (values: khqrFormEditorInputValues) => {
    const filteredData = Object.entries(values).filter(
      ([_, val]) => val !== ""
    );
    const requestData = Object.fromEntries(filteredData);
    paymentMutation(requestData);
  };

  const onLogout = () => {
    logoutMutation();
  };

  const handleDeactivateAccount = (username: string) => {
    deactivateAccountMutation(username);
  };

  const handleReactivateAccount = (username: string) => {
    reactivateAccountMutation(username);
  };

  const handlePreviewToggle = () => {
    setNotPreviewing(!notPreviewing);
  };

  const { containerRef, highlighterRef } = useTabAnimation(activeTab, [
    notPreviewing,
    isAdmin,
  ]);

  return (
    <div className="min-h-screen bg-background">
      {notPreviewing ? (
        <div className="max-w-5xl mx-auto p-4 md:p-6 text-primary">
          {/* Header */}
          <div className="bg-foreground rounded-lg shadow-sm p-6 mb-6 border border-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome back, {initialData?.username}
                </h1>
                <p className="text-sm text-primary/60 mt-1">
                  Customize your profile and manage your links
                </p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                className="bg-primary text-foreground p-3 rounded"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
              <div className="bg-foreground rounded-lg shadow-sm p-2 border border-primary/10 relative">
                <nav id="nav-tab">
                  <div
                    ref={containerRef}
                    className="tabs-container relative space-y-1 md:grid md:grid-cols-1 lg:grid-cols-1 md:gap-2 flex overflow-x-auto no-scrollbar"
                  >
                    <div
                      ref={highlighterRef}
                      className="tab-highlighter absolute top-0 left-0 z-0 bg-primary rounded-4xl pointer-events-none"
                    />
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          type="button"
                          key={tab.id}
                          data-id={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative z-10 ${
                            activeTab === tab.id ? "text-foreground" : ""
                          }`}
                        >
                          <Icon size={20} />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </nav>
                {/* Fade indicator - only on mobile */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-foreground to-transparent pointer-events-none lg:hidden" />
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
                    <AppearanceTab
                      initialData={initialData}
                      theme={theme}
                      selectedTemplate={selectedTemplate}
                      backgroundImage={backgroundImage || ""}
                      setValue={profileSetValue}
                    />
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
                      error={qrError}
                      initialData={initialData}
                    />
                  )}

                  {activeTab === "admin" && isAdmin && (
                    <AdminTab
                      onDeactivate={handleDeactivateAccount}
                      onReactivate={handleReactivateAccount}
                      isProcessing={isDeactivating || isReactivating}
                    />
                  )}

                  {/* Save Button */}
                  {activeTab !== "links" &&
                    activeTab !== "payment" &&
                    activeTab !== "admin" && (
                      <div className="px-6 py-4 border-t border-primary/10 bg-primary/5">
                        <div className="flex justify-end gap-3">
                          <Button
                            data-button="cool"
                            type="button"
                            variant="secondary"
                          >
                            Cancel
                          </Button>
                          <Button
                            disabled={!profileIsValid}
                            type="submit"
                            isLoading={isProfilePending}
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
      ) : (
        <UserProfile data={initialData!} />
      )}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          type="button"
          className="flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 px-6 py-3 rounded-full"
          onClick={handlePreviewToggle}
        >
          {notPreviewing ? (
            <>
              <Eye size={20} />
              <span className="font-semibold">Preview Profile</span>
            </>
          ) : (
            <>
              <Palette size={20} />
              <span className="font-semibold">Back to Editor</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
