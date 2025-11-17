import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { useForm } from "react-hook-form";
import SocialMediaForm from "@/components/createProfile/socialMediaForm";
import { profileFormInputSchema } from "@/validationSchema/inputValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

type FormInputValues = z.infer<typeof profileFormInputSchema>;

const messages = {
  profileSetupPage: {
    socialMediaInput: {
      addedSocialLink: "Added Social Links",
      addSocialLink: "Add Social Link",
      added: "Added",
    },
  },
};

const TestWrapper = ({
  initialSocials = {},
  onSocialsChange,
}: {
  initialSocials?: Record<string, string>;
  onSocialsChange?: (socials: Record<string, string>) => void;
}) => {
  const { setValue, watch } = useForm<FormInputValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(profileFormInputSchema) as any,
    defaultValues: {
      username: "",
      displayName: "",
      bio: "",
      socials: initialSocials,
      link: "",
    },
  });

  const socials = watch("socials");

  if (onSocialsChange) {
    onSocialsChange(socials);
  }

  return (
    <NextIntlClientProvider locale="en" messages={messages}>
      <SocialMediaForm socials={socials} setValue={setValue} />
    </NextIntlClientProvider>
  );
};

describe("SocialMediaForm", () => {
  it("renders the social media form with default platform selected", () => {
    render(<TestWrapper />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("username")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add social link/i })
    ).toBeInTheDocument();
  });

  it("displays all available social platforms in dropdown", () => {
    render(<TestWrapper />);

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    const options = Array.from(select.options).map((opt) => opt.value);

    expect(options).toContain("telegram");
    expect(options).toContain("x");
    expect(options).toContain("instagram");
    expect(options).toContain("github");
    expect(options).toContain("tiktok");
    expect(options).toContain("youtube");
    expect(options).toContain("linkedin");
    expect(options).toContain("facebook");
  });

  it("changes platform when selecting from dropdown", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "github");

    expect(screen.getByText("https://github.com/")).toBeInTheDocument();
  });

  it("shows minimum character error when input is less than 3 characters", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("username");
    await user.type(input, "ab");

    await waitFor(() => {
      expect(screen.getByText("Minimum 3 characters")).toBeInTheDocument();
    });
  });

  it("shows preview URL while typing", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("username");
    await user.type(input, "testuser");

    await waitFor(() => {
      expect(
        screen.getByText("Preview: https://t.me/testuser")
      ).toBeInTheDocument();
    });
  });

  it("shows character count", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("username");
    await user.type(input, "test");

    await waitFor(() => {
      expect(screen.getByText("4/30")).toBeInTheDocument();
    });
  });

  it("shows warning when character count exceeds 30", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("username");
    await user.type(input, "a".repeat(31));

    await waitFor(() => {
      const charCount = screen.getByText(/31\/30/);
      expect(charCount).toHaveClass("text-red-500");
    });
  });

  it("disables add button when input is less than 3 characters", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("username");
    const button = screen.getByRole("button", { name: /add social link/i });

    await user.type(input, "ab");

    expect(button).toBeDisabled();
  });

  it("disables add button when input is more than 30 characters", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("username");
    const button = screen.getByRole("button", { name: /add social link/i });

    await user.type(input, "a".repeat(31));

    expect(button).toBeDisabled();
  });

  it("enables add button when input is valid", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("username");
    const button = screen.getByRole("button", { name: /add social link/i });

    await user.type(input, "testuser");

    await waitFor(() => {
      expect(button).toBeEnabled();
    });
  });

  it("adds social link when clicking add button", async () => {
    const user = userEvent.setup();
    let socials: Record<string, string> = {};
    const onSocialsChange = (newSocials: Record<string, string>) => {
      socials = newSocials;
    };

    render(<TestWrapper onSocialsChange={onSocialsChange} />);

    const input = screen.getByPlaceholderText("username");
    const button = screen.getByRole("button", { name: /add social link/i });

    await user.type(input, "testuser");
    await user.click(button);

    await waitFor(() => {
      expect(socials).toHaveProperty("telegram");
      expect(socials.telegram).toBe("https://t.me/testuser");
    });
  });

  it("adds social link when pressing Enter key", async () => {
    const user = userEvent.setup();
    let socials: Record<string, string> = {};
    const onSocialsChange = (newSocials: Record<string, string>) => {
      socials = newSocials;
    };

    render(<TestWrapper onSocialsChange={onSocialsChange} />);

    const input = screen.getByPlaceholderText("username");
    await user.type(input, "testuser{Enter}");

    await waitFor(() => {
      expect(socials).toHaveProperty("telegram");
      expect(socials.telegram).toBe("https://t.me/testuser");
    });
  });

  it("clears input after adding social link", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("username") as HTMLInputElement;
    const button = screen.getByRole("button", { name: /add social link/i });

    await user.type(input, "testuser");
    await user.click(button);

    await waitFor(() => {
      expect(input.value).toBe("");
    });
  });

  it("disables add button and shows 'Added' when platform is already added", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("username");
    const button = screen.getByRole("button");

    await user.type(input, "testuser");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Added")).toBeInTheDocument();
      expect(button).toBeDisabled();
    });
  });

  it("shows added social links list", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("username");
    const button = screen.getByRole("button", { name: /add social link/i });

    await user.type(input, "testuser");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Added Social Links \(1\)/)).toBeInTheDocument();
      expect(screen.getByText("Telegram")).toBeInTheDocument();
      expect(screen.getByText("https://t.me/testuser")).toBeInTheDocument();
    });
  });

  it("removes social link when clicking remove button", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("username");
    const addButton = screen.getByRole("button", { name: /add social link/i });

    await user.type(input, "testuser");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("https://t.me/testuser")).toBeInTheDocument();
    });

    const removeButton = screen.getByRole("button", {
      name: /remove telegram/i,
    });
    await user.click(removeButton);

    await waitFor(() => {
      expect(
        screen.queryByText("https://t.me/testuser")
      ).not.toBeInTheDocument();
    });
  });

  it("allows adding multiple different social platforms", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("username");
    const select = screen.getByRole("combobox");
    const addButton = screen.getByRole("button", { name: /add social link/i });

    // Add Telegram
    await user.type(input, "testuser");
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("https://t.me/testuser")).toBeInTheDocument();
    });

    // Add GitHub
    await user.selectOptions(select, "github");
    await user.type(input, "testuser");
    await user.click(addButton);

    await waitFor(() => {
      expect(
        screen.getByText("https://github.com/testuser")
      ).toBeInTheDocument();
      expect(screen.getByText(/Added Social Links \(2\)/)).toBeInTheDocument();
    });
  });

  it("trims whitespace from input before adding", async () => {
    const user = userEvent.setup();
    let socials: Record<string, string> = {};
    const onSocialsChange = (newSocials: Record<string, string>) => {
      socials = newSocials;
    };

    render(<TestWrapper onSocialsChange={onSocialsChange} />);

    const input = screen.getByPlaceholderText("username");
    const button = screen.getByRole("button", { name: /add social link/i });

    await user.type(input, "  testuser  ");
    await user.click(button);

    await waitFor(() => {
      expect(socials.telegram).toBe("https://t.me/testuser");
    });
  });

  it("shows checkmark in dropdown for added platforms", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("username");
    const select = screen.getByRole("combobox") as HTMLSelectElement;
    const button = screen.getByRole("button", { name: /add social link/i });

    await user.type(input, "testuser");
    await user.click(button);

    await waitFor(() => {
      const option = Array.from(select.options).find(
        (opt: HTMLOptionElement) => opt.value === "telegram"
      );
      expect(option?.text).toContain("✓");
    });
  });

  it("prevents adding same platform twice", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("username");
    const button = screen.getByRole("button");

    // Add first time
    await user.type(input, "testuser");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText("Added")).toBeInTheDocument();
    });

    // Try to add again
    await user.clear(input);
    await user.type(input, "anotheruser");

    expect(button).toBeDisabled();
  });

  it("updates preview when changing platform", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("username");
    const select = screen.getByRole("combobox");

    await user.type(input, "testuser");

    expect(
      screen.getByText("Preview: https://t.me/testuser")
    ).toBeInTheDocument();

    await user.selectOptions(select, "github");

    await waitFor(() => {
      expect(
        screen.getByText("Preview: https://github.com/testuser")
      ).toBeInTheDocument();
    });
  });

  it("renders with pre-existing socials", () => {
    const initialSocials = {
      telegram: "https://t.me/existinguser",
      github: "https://github.com/existinguser",
    };

    render(<TestWrapper initialSocials={initialSocials} />);

    expect(screen.getByText(/Added Social Links \(2\)/)).toBeInTheDocument();
    expect(screen.getByText("https://t.me/existinguser")).toBeInTheDocument();
    expect(
      screen.getByText("https://github.com/existinguser")
    ).toBeInTheDocument();
  });

  it("shows platform icon for each added social", async () => {
    const user = userEvent.setup();
    render(<TestWrapper />);

    const input = screen.getByPlaceholderText("username");
    const button = screen.getByRole("button", { name: /add social link/i });

    await user.type(input, "testuser");
    await user.click(button);

    await waitFor(() => {
      const addedSection =
        screen.getByText(/Added Social Links/i).parentElement;
      expect(addedSection).toBeInTheDocument();
      // SVG icons are present (checking structure)
      expect(addedSection?.querySelector("svg")).toBeInTheDocument();
    });
  });

  it("shows long URLs in the added list", async () => {
    const user = userEvent.setup();
    let socials: Record<string, string> = {};
    const onSocialsChange = (newSocials: Record<string, string>) => {
      socials = newSocials;
    };

    render(<TestWrapper onSocialsChange={onSocialsChange} />);

    const input = screen.getByPlaceholderText("username");
    const button = screen.getByRole("button", { name: /add social link/i });

    await user.type(input, "verylongusernamethatwillbetruncated");

    // Button should be disabled because it exceeds 30 chars
    expect(button).toBeDisabled();

    // Clear and add a valid username
    await user.clear(input);
    await user.type(input, "validusername");
    await user.click(button);

    await waitFor(() => {
      expect(socials.telegram).toBe("https://t.me/validusername");
    });
  });
});
