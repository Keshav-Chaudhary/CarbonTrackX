"use client";

import { Moon, Sun, Palette } from "lucide-react";
import { cn } from "@/lib/cn";
import { Section, Row } from "../SettingsClient";

interface SettingsAppearanceSectionProps {
  theme: string;
  toggleTheme: () => void;
}

export function SettingsAppearanceSection({
  theme,
  toggleTheme,
}: SettingsAppearanceSectionProps) {
  return (
    <Section
      icon={Palette}
      title="Appearance"
      description="Control how CarbonTrackX looks and feels."
    >
      <Row
        label="Colour Theme"
        hint="Switch between dark and light mode for comfortable viewing."
      >
        <button
          type="button"
          aria-pressed={theme === "dark"}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all",
            theme === "dark"
              ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]"
              : "border-[var(--border)] bg-surface text-fg-muted hover:border-[var(--border-strong)]",
          )}
          onClick={() => theme !== "dark" && toggleTheme()}
        >
          <Moon className="size-3.5" />
          Dark
        </button>
        <button
          type="button"
          aria-pressed={theme === "light"}
          className={cn(
            "flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all",
            theme === "light"
              ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]"
              : "border-[var(--border)] bg-surface text-fg-muted hover:border-[var(--border-strong)]",
          )}
          onClick={() => theme !== "light" && toggleTheme()}
        >
          <Sun className="size-3.5" />
          Light
        </button>
      </Row>
    </Section>
  );
}
