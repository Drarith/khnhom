import { render, screen } from "@testing-library/react";
import GoogleLogin from "@/components/googleLogin/googleLogin";
import { describe, it, expect, vi } from "vitest";

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
}));

describe("GoogleLogin", () => {
  it("renders a link with translated label and correct href", async () => {
    const ui = await GoogleLogin();
    render(ui);

    

    const link = screen.getByRole("link", { name: /googlelabel/i });
    // Basic presence assertion without jest-dom matcher due to type recognition issue
    expect(link != null).toBe(true);
    expect(link.getAttribute("href") || "").toContain("/auth/google");
  });
});
