import { render } from "@testing-library/react";
import { GoogleIcon } from "@/config/googleIcon";
import { describe, it, expect } from "vitest";

describe("GoogleIcon", () => {
  it("renders an svg", () => {
    const { container } = render(<GoogleIcon />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
  });
});
