import { render, screen } from "@testing-library/react";
import Home from "@/components/home/home";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import "@testing-library/jest-dom/vitest";

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
}));

vi.mock("../googleLogin/googleLogin", () => ({
  __esModule: true,
  default: async () =>
    React.createElement("a", { href: "/auth/google" }, "googleLabel"),
}));

describe("Home component", () => {
  it("renders title, slogan and Google login", async () => {
    const ui = await Home();
    render(ui);

    expect(
      await screen.findByRole("heading", { name: "title" })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "slogan" })
    ).toBeInTheDocument();
    const googleLink = await screen.findByRole("link", {
      name: "googleLabel",
    });
    expect(googleLink).toBeInTheDocument();
    expect(googleLink).toHaveAttribute("href", "/auth/google");
  });
});
