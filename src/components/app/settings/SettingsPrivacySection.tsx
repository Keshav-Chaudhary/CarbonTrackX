"use client";

import { ShieldCheck } from "lucide-react";
import { Section, Row } from "../SettingsClient";

export function SettingsPrivacySection() {
  return (
    <Section
      icon={ShieldCheck}
      title="Privacy"
      description="How CarbonTrackX handles your information."
    >
      <Row label="Data Storage" hint="All footprint data is stored locally in your browser only.">
        <span className="flex items-center gap-1.5 rounded-full border border-[var(--success-muted,var(--border-strong))] bg-[var(--success-subtle,var(--accent-subtle))] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[var(--success,var(--accent))]">
          <span className="size-1.5 rounded-full bg-[var(--success,var(--accent))]" />
          Local Only
        </span>
      </Row>
      <Row label="AI Inference" hint="Conversations with the Intelligence Center are sent to your configured AI model only.">
        <span className="flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-surface-3 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-fg-muted">
          <span className="size-1.5 rounded-full bg-[var(--accent)]" />
          LLM Only
        </span>
      </Row>
      <Row label="Analytics" hint="No third-party analytics or tracking scripts are loaded.">
        <span className="flex items-center gap-1.5 rounded-full border border-[var(--border-strong)] bg-surface-3 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-fg-muted">
          <span className="size-1.5 rounded-full bg-[var(--fg-muted)]" />
          None
        </span>
      </Row>
    </Section>
  );
}
