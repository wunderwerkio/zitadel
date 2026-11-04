// wunderwerk: werkstatt.css styles the login only through `data-ww` hooks and
// a few DOM shapes. This pins them, so an upstream release that moves or drops
// one fails the sync build instead of silently losing the look.
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Alert, AlertType } from "../components/alert";
import { BackButton } from "../components/back-button";
import { Button, ButtonColors, ButtonVariants } from "../components/button";
import { Card } from "../components/card";
import { DynamicTheme } from "../components/dynamic-theme";
import { BaseButton } from "../components/idps/base-button";
import { TextInput } from "../components/input";
import ThemeSwitch from "../components/theme-switch";
import { WerkstattBackdrop } from "./backdrop";

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "dark", setTheme: vi.fn(), resolvedTheme: "dark" }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ back: vi.fn(), push: vi.fn() }),
}));

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("werkstatt hooks", () => {
  it("marks the card", () => {
    const { container } = render(<Card>x</Card>);
    expect(container.querySelector('[data-ww="card"]')).toBeTruthy();
  });

  it("marks buttons with variant and colour", () => {
    const { container } = render(
      <Button variant={ButtonVariants.Primary} color={ButtonColors.Warn}>
        x
      </Button>,
    );
    const button = container.querySelector('[data-ww="button"]');
    expect(button?.getAttribute("data-variant")).toBe("Primary");
    expect(button?.getAttribute("data-color")).toBe("Warn");
  });

  it("marks the back button", () => {
    const { container } = render(<BackButton />);
    expect(container.querySelector('button[data-ww="button"][data-ww-back]')).toBeTruthy();
  });

  it("marks fields: label span first, input, message row as a div", () => {
    const { container } = render(<TextInput label="Name" error="required" />);
    const field = container.querySelector('label[data-ww="field"]');
    expect(field?.getAttribute("data-invalid")).toBe("true");
    expect(field?.firstElementChild?.tagName).toBe("SPAN");
    expect(field?.querySelector(":scope > input")).toBeTruthy();
    expect(field?.querySelector(":scope > div")).toBeTruthy();
  });

  it("marks alerts with their type", () => {
    const { container } = render(<Alert type={AlertType.ALERT}>x</Alert>);
    expect(container.querySelector('[data-ww="alert"][data-type="alert"]')).toBeTruthy();
  });

  it("marks identity provider buttons", () => {
    const { container } = render(<BaseButton>GitHub</BaseButton>);
    expect(container.querySelector('button[data-ww="idp"]')).toBeTruthy();
  });

  it("marks the frame, stack, logo, title and form of a page", () => {
    // jsdom has no matchMedia; the layout hook asks it for the breakpoint.
    vi.stubGlobal("matchMedia", () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));

    const { container } = render(
      <DynamicTheme>
        <h1>Title</h1>
        <form>Form</form>
      </DynamicTheme>,
    );
    for (const hook of ["frame", "stack", "logo", "title", "form"]) {
      expect(container.querySelector(`[data-ww="${hook}"]`), hook).toBeTruthy();
    }
    expect(container.querySelector('[data-ww="stack"] > [data-ww="logo"]')).toBeTruthy();
  });

  it("exposes the chosen theme on the switch", () => {
    const { container } = render(<ThemeSwitch />);
    expect(container.querySelector('button[aria-pressed="true"]')).toBeTruthy();
  });

  it("draws the backdrop", () => {
    const { container } = render(<WerkstattBackdrop />);
    expect(container.querySelectorAll('[data-ww="drawing"]')).toHaveLength(3);
  });
});
