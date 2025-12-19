import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Nav from "@/components/nav/Nav";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useParams: () => ({ locale: "en" }),
  usePathname: () => "/en",
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock gsap
vi.mock("@/gsap/tab", () => ({
  useTabAnimation: () => ({
    containerRef: { current: null },
    highlighterRef: { current: null },
  }),
}));

const messages = {
  nav: {
    home: "Home",
    about: "About",
    contact: "Contact",
    menu: "Menu",
    close: "Close",
    logout: "LOGOUT",
    github: "Github",
    viewShowreel: "View Showreel",
  },
};

const queryClient = new QueryClient();

const renderWithIntl = (component: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <NextIntlClientProvider locale="en" messages={messages}>
        {component}
      </NextIntlClientProvider>
    </QueryClientProvider>
  );
};

describe("Nav", () => {

  it("opens menu when clicking Menu", async () => {
    const user = userEvent.setup();
    renderWithIntl(<Nav />);

    const menuButton = screen.getByText("Menu");
    await user.click(menuButton);

    expect(screen.getByText("Close")).toBeInTheDocument();
    expect(screen.getByText("HOME")).toBeInTheDocument();
    expect(screen.getByText("ABOUT")).toBeInTheDocument();
    expect(screen.getByText("CONTACT")).toBeInTheDocument();
  });

  it("shows logout button when not on controlled path", async () => {
    const user = userEvent.setup();
    renderWithIntl(<Nav />);

    const menuButton = screen.getByText("Menu");
    await user.click(menuButton);

    expect(screen.queryByText("LOGOUT")).not.toBeInTheDocument();
  });
});
