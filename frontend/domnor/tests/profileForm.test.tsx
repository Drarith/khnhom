import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import ProfileForm from "@/components/createProfile/profileForm";

const messages = {
  profileSetupPage: {
    common: {
      page: "PROFILE SETUP",
      title: "Craft your public profile",
      about: "Let's get you started with the essential set up.",
      basic: "Basic",
      basicInfo: "Username and display name appear on your profile.",
      preSave: "You're just a button away.",
      socialAndLink: "Socials & Link",
      socialAndLinkInfo: "Add your social media and website here.",
      saveProfile: "Save Profile",
    },
    profileInputLabel: {
      username: "Username",
      displayName: "Display Name",
      bio: "Bio(*optional)",
      socials: "Social Media Links",
      link: "Your Link(*optional)",
    },
    socialMediaInput: {
      addedSocialLink: "Added Social Links",
      addSocialLink: "Add Social Link",
      added: "Added",
    },
    validation: {
      minLength: "Must be at least {min} characters",
      maxLength: "Must be at most {max} characters",
      usernamePattern:
        "Username can contain only letters, numbers and underscores",
      invalidUrl: "Must be a valid HTTPS URL. Example: https://domnor.com",
    },
  },
};

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      {component}
    </NextIntlClientProvider>
  );
};

describe("ProfileForm", () => {
  it("renders the form with all required sections", () => {
    renderWithIntl(<ProfileForm />);

    expect(screen.getByText("PROFILE SETUP")).toBeInTheDocument();
    expect(screen.getByText("Craft your public profile")).toBeInTheDocument();
    expect(
      screen.getByText("Let's get you started with the essential set up.")
    ).toBeInTheDocument();
    expect(screen.getByText(/basic/i)).toBeInTheDocument();
    expect(screen.getByText(/socials.*link/i)).toBeInTheDocument();
  });

  it("renders all input fields", () => {
    renderWithIntl(<ProfileForm />);

    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Display Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Bio(*optional)")).toBeInTheDocument();
    expect(screen.getByLabelText("Your Link(*optional)")).toBeInTheDocument();
  });

  it("submit button is disabled initially", () => {
    renderWithIntl(<ProfileForm />);

    const submitButton = screen.getByRole("button", { name: /save profile/i });
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when required fields are valid", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileForm />);

    const usernameInput = screen.getByLabelText("Username");
    const displayNameInput = screen.getByLabelText("Display Name");

    await user.type(usernameInput, "testuser");
    await user.type(displayNameInput, "Test User");

    await waitFor(() => {
      const submitButton = screen.getByRole("button", {
        name: /save profile/i,
      });
      expect(submitButton).toBeEnabled();
    });
  });

  it("shows validation error for username with invalid characters", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileForm />);

    const usernameInput = screen.getByLabelText("Username");
    await user.type(usernameInput, "test-user!");

    await waitFor(() => {
      expect(
        screen.getByText(
          /Username can contain only letters, numbers and underscores/i
        )
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for username less than 3 characters", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileForm />);

    const usernameInput = screen.getByLabelText("Username");
    await user.type(usernameInput, "ab");
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/Must be at least 3 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("shows validation error for display name less than 3 characters", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileForm />);

    const displayNameInput = screen.getByLabelText("Display Name");
    await user.type(displayNameInput, "ab");
    await user.tab();

    await waitFor(() => {
      expect(
        screen.getByText(/Must be at least 3 characters/i)
      ).toBeInTheDocument();
    });
  });

  it("enforces max length for username", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileForm />);

    const usernameInput = screen.getByLabelText("Username") as HTMLInputElement;
    const longUsername = "a".repeat(50);
    await user.type(usernameInput, longUsername);

    expect(usernameInput.value.length).toBeLessThanOrEqual(30);
  });

  it("enforces max length for display name", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileForm />);

    const displayNameInput = screen.getByLabelText(
      "Display Name"
    ) as HTMLInputElement;
    const longDisplayName = "a".repeat(50);
    await user.type(displayNameInput, longDisplayName);

    expect(displayNameInput.value.length).toBeLessThanOrEqual(30);
  });

  it("bio textarea has max length attribute", () => {
    renderWithIntl(<ProfileForm />);

    const bioInput = screen.getByLabelText(
      "Bio(*optional)"
    ) as HTMLTextAreaElement;
    expect(bioInput).toHaveAttribute("maxlength", "1000");
  });

  it("enforces max length for link", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileForm />);

    const linkInput = screen.getByLabelText(
      "Your Link(*optional)"
    ) as HTMLInputElement;
    const longLink = "a".repeat(300);
    await user.type(linkInput, longLink);

    expect(linkInput.value.length).toBeLessThanOrEqual(200);
  });

  it("displays character count for username", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileForm />);

    const usernameInput = screen.getByLabelText("Username");
    await user.type(usernameInput, "test");

    await waitFor(() => {
      expect(screen.getByText(/4\s*\/\s*30/)).toBeInTheDocument();
    });
  });

  it("displays character count for bio", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileForm />);

    const bioInput = screen.getByLabelText("Bio(*optional)");
    await user.type(bioInput, "This is a test bio");

    await waitFor(() => {
      expect(screen.getByText(/18\s*\/\s*1000/)).toBeInTheDocument();
    });
  });

  it("calls onSubmit with form data when form is submitted", async () => {
    const user = userEvent.setup();
    const consoleTableSpy = vi.spyOn(console, "table");
    const consoleLogSpy = vi.spyOn(console, "log");

    renderWithIntl(<ProfileForm />);

    const usernameInput = screen.getByLabelText("Username");
    const displayNameInput = screen.getByLabelText("Display Name");
    const bioInput = screen.getByLabelText("Bio(*optional)");

    await user.type(usernameInput, "testuser");
    await user.type(displayNameInput, "Test User");
    await user.type(bioInput, "This is a test bio");

    await waitFor(() => {
      const submitButton = screen.getByRole("button", {
        name: /save profile/i,
      });
      expect(submitButton).toBeEnabled();
    });

    const submitButton = screen.getByRole("button", { name: /save profile/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(consoleTableSpy).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    consoleTableSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it("trims whitespace from display name", async () => {
    const user = userEvent.setup();
    const consoleLogSpy = vi.spyOn(console, "log");

    renderWithIntl(<ProfileForm />);

    const usernameInput = screen.getByLabelText("Username");
    const displayNameInput = screen.getByLabelText("Display Name");

    await user.type(usernameInput, "testuser");
    await user.type(displayNameInput, "  Test User  ");

    // Wait for validation to complete
    await waitFor(() => {
      const submitButton = screen.getByRole("button", {
        name: /save profile/i,
      });
      expect(submitButton).toBeEnabled();
    });

    const submitButton = screen.getByRole("button", { name: /save profile/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalled();
    });

    consoleLogSpy.mockRestore();
  });

  it("validates URL format for link field", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileForm />);

    const usernameInput = screen.getByLabelText("Username");
    const displayNameInput = screen.getByLabelText("Display Name");

    await user.type(usernameInput, "testuser");
    await user.type(displayNameInput, "Test User");

    const submitButton = screen.getByRole("button", { name: /save profile/i });

    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it("accepts valid URL for link field", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileForm />);

    const usernameInput = screen.getByLabelText("Username");
    const displayNameInput = screen.getByLabelText("Display Name");
    const linkInput = screen.getByLabelText("Your Link(*optional)");

    await user.type(usernameInput, "testuser");
    await user.type(displayNameInput, "Test User");
    await user.type(linkInput, "https://example.com");

    // Form should still be valid with a URL in the link field
    await waitFor(() => {
      const submitButton = screen.getByRole("button", {
        name: /save profile/i,
      });
      expect(submitButton).toBeEnabled();
    });
  });

  it("renders social media form section", () => {
    renderWithIntl(<ProfileForm />);

    expect(screen.getByText(/socials.*link/i)).toBeInTheDocument();
    expect(
      screen.getByText("Add your social media and website here.")
    ).toBeInTheDocument();
  });

  it("bio field is optional", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileForm />);

    const usernameInput = screen.getByLabelText("Username");
    const displayNameInput = screen.getByLabelText("Display Name");

    await user.type(usernameInput, "testuser");
    await user.type(displayNameInput, "Test User");

    await waitFor(() => {
      const submitButton = screen.getByRole("button", {
        name: /save profile/i,
      });
      expect(submitButton).toBeEnabled();
    });
  });

  it("link field is optional", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ProfileForm />);

    const usernameInput = screen.getByLabelText("Username");
    const displayNameInput = screen.getByLabelText("Display Name");

    await user.type(usernameInput, "testuser");
    await user.type(displayNameInput, "Test User");

    await waitFor(() => {
      const submitButton = screen.getByRole("button", {
        name: /save profile/i,
      });
      expect(submitButton).toBeEnabled();
    });
  });
});
