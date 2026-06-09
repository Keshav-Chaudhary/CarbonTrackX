"use client";

import { Trash2 } from "lucide-react";
import { STORAGE_KEY } from "@/lib/store/carbon-store";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useHydrated } from "@/components/useHydrated";
import { Button, Dialog } from "@/components/ui";

// Extracted hooks and headers
import { useSettingsActions } from "./settings/useSettingsActions";
import { SettingsHeader } from "./settings/SettingsHeader";

// Extracted sections
import { SettingsAppearanceSection } from "./settings/SettingsAppearanceSection";
import { SettingsGoalsSection } from "./settings/SettingsGoalsSection";
import { SettingsPrivacySection } from "./settings/SettingsPrivacySection";
import { SettingsStorageSection } from "./settings/SettingsStorageSection";
import { SettingsAboutSection } from "./settings/SettingsAboutSection";

/* ─── Section wrapper ───────────────────────────────────── */
export function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-6 md:p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--accent-subtle)] blur-[40px] opacity-0 transition-all group-hover:opacity-60 pointer-events-none" />
      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-surface-3 shadow-sm">
            <Icon className="size-5 text-[var(--accent)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-fg">{title}</h2>
            <p className="text-sm text-fg-muted">{description}</p>
          </div>
        </div>
        <div className="border-t border-[var(--border-faint)] pt-5">{children}</div>
      </div>
    </div>
  );
}

/* ─── Row inside a section ──────────────────────────────── */
export function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border-faint)] last:border-0 last:pb-0 first:pt-0">
      <div>
        <p className="text-sm font-semibold text-fg">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-fg-muted">{hint}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}

/* ─── Stat pill ─────────────────────────────────────────── */
export function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-[var(--border-strong)] bg-surface-3 px-4 py-3 text-center">
      <span className="text-lg font-black tabular-nums text-fg">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-fg-muted">{label}</span>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────── */
export function SettingsClient() {
  const hydrated = useHydrated();
  const { theme, toggleTheme } = useTheme();
  const {
    activities,
    goal,
    setGoal,
    showClearDialog,
    setShowClearDialog,
    handleExport,
    handleClearAll,
    toast,
  } = useSettingsActions();

  return (
    <div className="stagger flex flex-col gap-4 pb-12">
      <SettingsHeader theme={theme} toggleTheme={toggleTheme} />

      <SettingsAppearanceSection theme={theme} toggleTheme={toggleTheme} />

      <SettingsGoalsSection goal={goal} setGoal={setGoal} toast={toast} />

      <SettingsStorageSection
        activities={activities}
        hydrated={hydrated}
        handleExport={handleExport}
        onClearClick={() => setShowClearDialog(true)}
        storageKey={STORAGE_KEY}
      />

      <SettingsPrivacySection />

      <SettingsAboutSection />

      {/* Clear All Dialog */}
      <Dialog
        open={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        title="Clear All Data?"
        description={`This will permanently delete all ${activities.length} logged activities and remove your goal. This action cannot be undone.`}
      >
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowClearDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleClearAll}
            className="bg-[var(--critical)] text-[#ffffff] hover:opacity-90 border-transparent shadow-sm"
          >
            <Trash2 className="size-4 mr-2" />
            Clear Everything
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
