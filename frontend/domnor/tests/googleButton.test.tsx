import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import GoogleLoginButton from "@/components/googleLogin/googleButton";
import { describe, it, expect } from "vitest";

describe("GoogleLoginButton", () => {
  it("renders with provided label", () => {
    render(
      <GoogleLoginButton href="/auth/google" label="Continue with Google" />
    );
    expect(
      screen.getByRole("link", { name: /continue with google/i })
    ).toBeInTheDocument();
  });

  it("applies custom label and href", () => {
    render(<GoogleLoginButton href="/custom" label="Login via Google" />);
    const link = screen.getByRole("link", { name: /login via google/i });
    expect(link).toHaveAttribute("href", "/custom");
  });

  it("sets aria-disabled when loading", () => {
    render(
      <GoogleLoginButton
        href="/auth/google"
        label="Continue with Google"
        isLoading
      />
    );
    const link = screen.getByRole("link", { name: /continue with google/i });
    expect(link).toHaveAttribute("aria-disabled", "true");
  });
});
