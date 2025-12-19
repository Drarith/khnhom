import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NextIntlClientProvider } from "next-intl";
import ProfileEditor from "@/components/profileEditor/ProfileEditor";
import { ProfileData } from "@/types/profileData";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => "/dashboard",
}));

// Mock react-draggable
vi.mock("react-draggable", () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DraggableCore: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Mock gsap
vi.mock("@/gsap/tab", () => ({
  useTabAnimation: () => ({
    containerRef: { current: null },
    highlighterRef: { current: null },
  }),
}));

const messages = {
  profileEditor: {
    welcomeBack: "Welcome back, {username}",
    customizeProfile: "Customize your profile and manage your links",
    tabs: {
      profile: "Profile",
      socials: "Socials",
      links: "Links",
      payment: "Payment",
      appearance: "Appearance",
      admin: "Admin",
    },
    buttons: {
      cancel: "Cancel",
      saveChanges: "Save Changes",
      previewDrag: "Preview(Drag me)",
      backToEditor: "Back to Editor",
      addLink: "Add Link",
      addingLink: "Adding Link...",
      generateQR: "Generate QR Code",
      processing: "Processing...",
      deactivateAccount: "Deactivate Account",
      reactivateAccount: "Reactivate Account",
    },
    toasts: {
      profileUpdated: "Profile updated successfully!",
      profileUpdateError: "Error updating profile",
      linkAdded: "Link added successfully!",
      linkAddError: "Error adding link: ",
      linkDeleted: "Link deleted successfully!",
      linkDeleteError: "Error deleting link: ",
      qrCreated: "Your Payment QR has been created successfully!",
      qrCreateError: "Error creating QR payment",
      deactivateError: "Failed to deactivate account",
      reactivateError: "Failed to reactivate account",
    },
    profileTab: {
      title: "Profile Information",
      displayName: "Display Name",
      bio: "Bio",
    },
    socialsTab: {
      title: "Social Links",
      description: "Connect your social media accounts",
    },
    linksTab: {
      title: "Custom Links",
      description: "Add custom links to your profile",
      linkTitle: "Link Title",
      linkUrl: "Link URL",
      noLinks: "No links yet",
      startAdding: "Start adding custom links to share with your audience",
    },
    appearanceTab: {
      title: "Appearance",
      description: "Customize how your profile looks",
      template: "Template",
      themeColor: "Theme Color",
      backgroundImage: "Background Image",
      none: "None",
      profileStatus: "Profile Status",
      profileLive: "Your profile is live",
      profileHidden: "Your profile is hidden",
    },
    paymentTab: {
      title: "Bakong KHQR Payment",
      description: "Generate a Bakong KHQR code for receiving payments",
      accountType: "Account Type *",
      individual: "Individual",
      merchant: "Merchant",
      bakongAccountID: "Bakong Account ID *",
      merchantName: "Merchant Name *",
      merchantID: "Merchant ID *",
      acquiringBank: "Acquiring Bank *",
      acquiringBankOptional: "Acquiring Bank (Optional)",
      accountInformation: "Account Information (Optional)",
      amount: "Amount (Optional)",
      hideOptions: "Hide additional options",
      addOptions: "Add additional options",
      additionalOptions: "Additional Options",
      merchantCity: "Merchant City",
      billNumber: "Bill Number",
      mobileNumber: "Mobile Number",
      storeLabel: "Store Label",
      terminalLabel: "Terminal Label",
      purposeOfTransaction: "Purpose of Transaction",
      yourKhqr: "Your KHQR Code",
      account: "Account",
      currency: "Currency",
      noQr: "No QR code generated",
      fillDetails: 'Fill in the details above and click "Generate QR Code"',
    },
    adminTab: {
      title: "Admin Controls",
      description: "Manage user accounts. Use these controls carefully.",
      deactivateTitle: "Deactivate Account",
      deactivateDesc:
        "Enter the username of the account you want to deactivate. The user will no longer be able to access or modify their profile.",
      deactivateLabel: "Username to Deactivate",
      deactivatePlaceholder: "Enter username",
      reactivateTitle: "Reactivate Account",
      reactivateDesc:
        "Enter the username of the account you want to reactivate. The user will regain access to their profile.",
      reactivateLabel: "Username to Reactivate",
      reactivatePlaceholder: "Enter username",
      warning: "Warning:",
      warningText: "Make sure you have the correct username before proceeding.",
    },
  },
  socialMediaForm: {
    minChars: "Minimum 3 characters",
    preview: "Preview:",
    addedSocialLink: "Added Social Links",
    addSocialLink: "Add Social Link",
    added: "Added",
  },
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale="en" messages={messages}>
        {component}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
};

const mockProfileData: ProfileData = {
  _id: "123456789",
  user: "user123",
  username: "testuser",
  displayName: "Test User",
  bio: "Test Bio",
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
  links: [],
  theme: "classic dark",
  selectedTemplate: "default",
  backgroundImage: "",
  isActive: true,
  paymentQrCodeUrl: "",
  paymentInfo: {
    bakongAccountID: "",
    merchantName: "",
  },
  profilePictureUrl: "",
  views: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("ProfileEditor", () => {
  it("renders the profile editor with initial data", () => {
    renderWithIntl(<ProfileEditor initialData={mockProfileData} />);

    expect(screen.getByText("Welcome back, testuser")).toBeInTheDocument();
    expect(
      screen.getByText("Customize your profile and manage your links")
    ).toBeInTheDocument();
  });

  it("renders all tabs", () => {
    renderWithIntl(<ProfileEditor initialData={mockProfileData} />);

    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Socials")).toBeInTheDocument();
    expect(screen.getByText("Links")).toBeInTheDocument();
    expect(screen.getByText("Payment")).toBeInTheDocument();
    expect(screen.getByText("Appearance")).toBeInTheDocument();
  });

  it("switches to Socials tab", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileEditor initialData={mockProfileData} />);

    const socialsTab = screen.getByText("Socials");
    await user.click(socialsTab);

    expect(screen.getByText("Social Links")).toBeInTheDocument();
    expect(
      screen.getByText("Connect your social media accounts")
    ).toBeInTheDocument();
  });

  it("switches to Links tab", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileEditor initialData={mockProfileData} />);

    const linksTab = screen.getByText("Links");
    await user.click(linksTab);

    expect(screen.getByText("Custom Links")).toBeInTheDocument();
    expect(
      screen.getByText("Add custom links to your profile")
    ).toBeInTheDocument();
  });

  it("switches to Appearance tab", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileEditor initialData={mockProfileData} />);

    const appearanceTab = screen.getByText("Appearance");
    await user.click(appearanceTab);

    expect(
      screen.getByText("Customize how your profile looks")
    ).toBeInTheDocument();
  });

  it("switches to Payment tab", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileEditor initialData={mockProfileData} />);

    const paymentTab = screen.getByText("Payment");
    await user.click(paymentTab);

    expect(screen.getByText("Bakong KHQR Payment")).toBeInTheDocument();
    expect(
      screen.getByText("Generate a Bakong KHQR code for receiving payments")
    ).toBeInTheDocument();
  });

  it("toggles preview mode", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileEditor initialData={mockProfileData} />);

    const previewButton = screen.getByText("Preview(Drag me)");
    await user.click(previewButton);

    expect(screen.getByText("Back to Editor")).toBeInTheDocument();
  });
});
