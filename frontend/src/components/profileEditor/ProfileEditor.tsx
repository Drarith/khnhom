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
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { ProfileData } from "@/types/profileData";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProfileFormEditorInputValues,
  linkFormEditorInputValues,
  khqrFormEditorInputValues,
} from "@/types/profileFormInput";
import {
  editProfileFormInputSchema,
  linkFormEditorInputSchema,
  khqrFormEditorInputSchema,
} from "@/validationSchema/inputValidationSchema";
import { normalizeValue } from "@/helpers/normalizeVal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  putJSON,
  postJSON,
  deleteLink,
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
import GenerateQrTab from "./components/GenerateQr";
import AdminTab from "./components/AdminTab";
import DonationTab from "./components/DonationTab";
import { SocialShare } from "../shareSocial/ShareSocial";

import UserProfile from "../userProfile/UserProfile";
import { useTabAnimation } from "@/gsap/tab";
import { useTranslations } from "next-intl";

export enum Tab {
  PROFILE = "profile",
  SOCIALS = "socials",
  LINKS = "links",
  APPEARANCE = "appearance",
  PAYMENT = "payment",
  DONATION = "donation",
  ADMIN = "admin",
}

export default function ProfileEditor({
  initialData,
}: {
  initialData?: ProfileData;
}) {
  if (!initialData) {
    const error = new Error("Initial data is required for ProfileEditor");
    toast.error("Failed to load profile data. Please try again.");
    throw error;
  }
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PROFILE);
  const [showShareModal, setShowShareModal] = useState(false);

  const [qrError, setQrError] = useState<string>("");
  const [notPreviewing, setNotPreviewing] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const t = useTranslations("profileEditor");
  const p = useTranslations("profileSetupPage");

  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const response = await getJSON<{ role: string }>("/user/role");
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
      // we defined a function so we need to actaully call it
      editProfileFormInputSchema(p)
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
    setValue: khqrSetValue,
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
      accountType: "individual",
      bakongAccountID: "",
      merchantName: "",
      currency: "KHR",
      amount: "",
      merchantCity: "Phnom Penh",
      accountInformation: "",
      acquiringBank: "",
      // @ts-expect-error - This works as intended, ts being weird
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
  // const billNumber = useWatch({
  //   control: khqrControl,
  //   name: "billNumber",
  //   defaultValue: "",
  // });
  // const mobileNumber = useWatch({
  //   control: khqrControl,
  //   name: "mobileNumber",
  //   defaultValue: "",
  // });
  // const storeLabel = useWatch({
  //   control: khqrControl,
  //   name: "storeLabel",
  //   defaultValue: "",
  // });
  // const terminalLabel = useWatch({
  //   control: khqrControl,
  //   name: "terminalLabel",
  //   defaultValue: "",
  // });
  // const purposeOfTransaction = useWatch({
  //   control: khqrControl,
  //   name: "purposeOfTransaction",
  //   defaultValue: "",
  // });

  const tabs = [
    { id: Tab.PROFILE, label: t("tabs.profile"), icon: User },
    { id: Tab.SOCIALS, label: t("tabs.socials"), icon: LinkIcon },
    { id: Tab.LINKS, label: t("tabs.links"), icon: LinkIcon },
    { id: Tab.PAYMENT, label: t("tabs.payment"), icon: QrCode },
    { id: Tab.DONATION, label: t("tabs.support"), icon: Heart },
    { id: Tab.APPEARANCE, label: t("tabs.appearance"), icon: Palette },
    ...(isAdmin
      ? [{ id: Tab.ADMIN, label: t("tabs.admin"), icon: Shield }]
      : []),
  ];

  const { mutate: profileMutation, isPending: isProfilePending } = useMutation({
    mutationFn: (values: ProfileFormEditorInputValues) =>
      putJSON("/update-profile", values),
    onSuccess: () => {
      toast.success(t("toasts.profileUpdated"));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = getAxiosErrorMessage(error);
      toast.error(t("toasts.profileUpdateError") + errorMessage);
    },
  });

  const { mutate: linkAddMutation, isPending: isAddingLink } = useMutation({
    mutationFn: (values: linkFormEditorInputValues) =>
      postJSON("/create-link", values),
    onSuccess: () => {
      toast.success(t("toasts.linkAdded"));
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = getAxiosErrorMessage(error);
      toast.error(t("toasts.linkAddError") + errorMessage);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      linkReset();
    },
  });

  const { mutate: linkDeleteMutation } = useMutation({
    mutationFn: (id: string) => {
      return deleteLink(`/profile/links/${id}`);
    },
    onSuccess: () => {
      toast.success(t("toasts.linkDeleted"));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = getAxiosErrorMessage(error);
      toast.error(t("toasts.linkDeleteError") + errorMessage);
    },
  });

  const { mutate: paymentMutation, isPending: isGeneratingQR } = useMutation({
    mutationFn: (PaymentRequest: Partial<khqrFormEditorInputValues>) => {
      return postJSON("/khqr", PaymentRequest);
    },
    onSuccess: () => {
      toast.success(t("toasts.qrCreated"));
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const errorMessage = getAxiosErrorMessage(error);
      toast.error(t("toasts.qrCreateError"));
      setQrError(errorMessage);
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
        toast.error(errorMessage || t("toasts.deactivateError"));
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
        toast.error(errorMessage || t("toasts.reactivateError"));
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

  const handleDeactivateAccount = (username: string) => {
    deactivateAccountMutation(username);
  };

  const handleReactivateAccount = (username: string) => {
    reactivateAccountMutation(username);
  };

  const handlePreviewToggle = () => {
    const menu = document.querySelector(".menu-container");
    setNotPreviewing(!notPreviewing);
    if (notPreviewing) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      menu?.classList.add("hidden");
    } else {
      menu?.classList.remove("hidden");
    }
  };

  const { containerRef, highlighterRef } = useTabAnimation(activeTab, [
    notPreviewing,
    isAdmin,
  ]);

  // Tab Chevron
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const checkScroll = () => {
    if (containerRef.current) {
      // scrollLeft: is how far we have scrolled from the left
      // clientWidth: how much the user see
      // scrollWidth: How wide the content is including the hidden part
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [activeTab, notPreviewing, isAdmin, checkScroll]);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const scrollAmount = 150;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen">
      {notPreviewing ? (
        <div className="max-w-5xl mx-auto p-4 md:p-6 text-primary">
          {/* Header */}
          <div className="bg-foreground rounded-lg shadow-sm p-6 mb-6 border border-primary/10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">
                  {t("welcomeBack", { username: initialData?.username || "" })}
                </h1>
                <p className="text-sm text-primary/60 mt-1">
                  {t("customizeProfile")}
                </p>
              </div>
              <Button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Share2 size={18} />
                {/* {t("buttons.share", { defaultValue: "Share" })} */}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
              <div className="bg-foreground rounded-lg shadow-sm p-2 border border-primary/10 relative group">
                {/* Left Arrow */}
                {canScrollLeft && (
                  <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center bg-linear-to-r from-foreground via-foreground/90 to-transparent px-1 md:hidden rounded-l-lg">
                    <button
                      type="button"
                      onClick={() => scroll("left")}
                      className="p-1 hover:bg-primary/10 rounded-full transition-colors cursor-pointer"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  </div>
                )}

                {/* Right Arrow */}
                {canScrollRight && (
                  <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center bg-linear-to-l from-foreground via-foreground/90 to-transparent px-1 md:hidden rounded-r-lg">
                    <button
                      type="button"
                      onClick={() => scroll("right")}
                      className="p-1 hover:bg-primary/10 rounded-full transition-colors cursor-pointer"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}

                <nav id="nav-tab">
                  <div
                    ref={containerRef}
                    className="tabs-container overflow-hidden relative space-y-1 md:grid md:grid-cols-1 lg:grid-cols-1 md:gap-2 flex overflow-x-auto no-scrollbar px-2 md:px-0"
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
                          className={`w-full flex flex-1 items-center gap-3 px-4 py-3 rounded-lg transition-colors relative z-10 whitespace-nowrap cursor-pointer ${
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
              </div>
              <div className="bg-foreground p-2 mt-6 rounded-lg flex items-center justify-center">
                <Button
                  type="button"
                  className="flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all duration-300 px-6 py-3 rounded-full cursor-pointer"
                  onClick={handlePreviewToggle}
                >
                  <Eye size={20} />
                  <span className="font-semibold">
                    {t("buttons.previewDrag")}
                  </span>
                </Button>
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
                      selectedTemplate={selectedTemplate || "default"}
                      backgroundImage={backgroundImage || ""}
                      setValue={profileSetValue }
                    />
                  )}
                  {/* Generate QR Code tab, will name later maybe ._. */}
                  {activeTab === "payment" && (
                    <GenerateQrTab
                      register={khqrRegister}
                      setValue={khqrSetValue}
                      errors={khqrErrors}
                      // @ts-expect-error - This one i'm pretty sure related to the error from switching between individual and merchant
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
                      isValid={khqrIsValid}
                      isGenerating={isGeneratingQR}
                      error={qrError}
                      initialData={initialData}
                    />
                  )}

                  {activeTab === "donation" && (
                    <DonationTab
                      currentDonationAmount={initialData?.donationAmount || 0}
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
                    activeTab !== "admin" &&
                    activeTab !== "donation" && (
                      <div className="px-6 py-4 border-t border-primary/10 bg-primary/5">
                        <div className="flex justify-end gap-3">
                          <Button
                            data-button="cool"
                            type="button"
                            variant="secondary"
                            className="cursor-pointer"
                          >
                            {t("buttons.cancel")}
                          </Button>
                          <Button
                            disabled={!profileIsValid}
                            type="submit"
                            isLoading={isProfilePending}
                            className="cursor-pointer"
                          >
                            {t("buttons.saveChanges")}
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
        <div className="absolute inset-0">
          <UserProfile data={initialData!} />
          <div className="fixed bottom-8 right-8 z-50">
            <Button
              type="button"
              className="flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all duration-300 px-6 py-3 rounded-full cursor-pointer"
              onClick={handlePreviewToggle}
            >
              <Palette size={20} />
              <span className="font-semibold">{t("buttons.backToEditor")}</span>
            </Button>
          </div>
        </div>
      )}

      {showShareModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 cursor-pointer">
          <SocialShare
            url={`${window.location.origin}/${initialData?.username}`}
            onClose={() => setShowShareModal(false)}
          />
        </div>
      )}
    </div>
  );
}
