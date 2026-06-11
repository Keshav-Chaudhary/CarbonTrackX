"use client";

import { Info } from "lucide-react";
import { Section, Row } from "../SettingsClient";

export function SettingsAboutSection() {
  return (
    <Section
      icon={Info}
      title="About CarbonTrackX"
      description="Application version and developer information."
    >
      <Row label="Version" hint="Current application release.">
        <span className="rounded-lg border border-[var(--border-strong)] bg-surface-3 px-3 py-1.5 font-mono text-xs font-bold text-fg-muted">
          v1.0.0
        </span>
      </Row>
      <Row label="Developer" hint="Lead engineer and architect.">
        <span className="text-sm font-semibold text-fg">
          Keshav Chaudhary
        </span>
      </Row>
      <Row label="GitHub" hint="Open source repository profile.">
        <a 
          href="https://github.com/Keshav-Chaudhary" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm font-medium text-[var(--accent)] hover:underline"
        >
          @Keshav-Chaudhary
        </a>
      </Row>
      <Row label="Project Initiative" hint="Developed for the following hackathon/challenge.">
        <span className="rounded-lg border border-[var(--border-strong)] bg-surface-3 px-3 py-1.5 font-mono text-xs font-bold text-fg-muted">
          Prompt Wars Challenge 3
        </span>
      </Row>
      <Row label="AI Assistants Used" hint="Tools utilized for development, alignment, and data gathering.">
        <div className="flex flex-wrap justify-end gap-2 max-w-xs">
          {["Antigravity", "Claude AI", "Web Scrapper v2026", "Hybrid Local RAG Model"].map((t) => (
            <span
              key={t}
              className="rounded-full border border-[var(--border)] bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-fg-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </Row>
      <Row label="Framework" hint="Built with Next.js, Tailwind CSS, and Zustand.">
        <div className="flex flex-wrap justify-end gap-2">
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
