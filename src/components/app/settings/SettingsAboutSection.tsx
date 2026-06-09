"use client";

import { Info } from "lucide-react";
import { Section, Row } from "../SettingsClient";

export function SettingsAboutSection() {
  return (
    <Section
      icon={Info}
      title="About CarbonTrackX"
      description="Application version and technical information."
    >
      <Row label="Version" hint="Current application release.">
        <span className="rounded-lg border border-[var(--border-strong)] bg-surface-3 px-3 py-1.5 font-mono text-xs font-bold text-fg-muted">
          v1.0.0
        </span>
      </Row>
      <Row label="Emission Factors" hint="Science-based CO2e coefficients sourced from IPCC and IEA datasets.">
        <span className="rounded-lg border border-[var(--border-strong)] bg-surface-3 px-3 py-1.5 font-mono text-xs font-bold text-fg-muted">
          IPCC AR6
        </span>
      </Row>
      <Row label="Framework" hint="Built with Next.js, Tailwind CSS, and Zustand.">
        <div className="flex items-center gap-2">
          {["Next.js", "Tailwind", "Zustand"].map((t) => (
            <span
              key={t}
              className="rounded-full border border-[var(--border)] bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-fg-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </Row>
    </Section>
  );
}
