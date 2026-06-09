"use client";

import { Database, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import type { Activity } from "@/lib/emissions/types";
import { Section, Row, StatPill } from "../SettingsClient";

interface SettingsStorageSectionProps {
  activities: Activity[];
  hydrated: boolean;
  handleExport: () => void;
  onClearClick: () => void;
  storageKey: string;
}

export function SettingsStorageSection({
  activities,
  hydrated,
  handleExport,
  onClearClick,
  storageKey,
}: SettingsStorageSectionProps) {
  const totalQuantity = activities.reduce((s, a) => s + (a.quantity ?? 0), 0);
  const storageSize =
    hydrated && typeof window !== "undefined"
      ? (JSON.stringify(localStorage.getItem(storageKey) ?? "").length / 1024).toFixed(1)
      : "0.0";

  return (
    <Section
      icon={Database}
      title="Data Management"
      description="Your data lives entirely in your browser's local storage — nothing is sent to any server."
    >
      {/* Stats strip */}
      <div className="mb-6 grid grid-cols-3 gap-3">
        <StatPill label="Activities" value={String(activities.length)} />
        <StatPill label="Total CO2e" value={`${totalQuantity.toFixed(1)} kg`} />
        <StatPill label="Storage" value={`${storageSize} KB`} />
      </div>

      <Row label="Export Data" hint="Download a full JSON backup of all activities and your goal.">
        <Button variant="ghost" size="sm" onClick={handleExport} className="gap-2">
          <Download className="size-3.5" />
          Export JSON
        </Button>
      </Row>

      <Row
        label="Clear All Data"
        hint="Permanently delete every logged activity and reset your goal. This cannot be undone."
      >
        <Button
          size="sm"
          onClick={onClearClick}
          className="gap-2 border-[var(--critical)] bg-transparent text-[var(--critical)] hover:bg-[var(--critical)] hover:text-[#ffffff] transition-colors"
          variant="ghost"
        >
          <Trash2 className="size-3.5" />
          Clear All Data
        </Button>
      </Row>
    </Section>
  );
}
