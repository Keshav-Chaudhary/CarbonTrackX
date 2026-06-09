"use client";

import { useState } from "react";
import {
  Palette,
  Database,
  Target,
  Trash2,
  RotateCcw,
  Download,
  ShieldCheck,
  Info,
  Moon,
  Sun,
  SlidersHorizontal,
} from "lucide-react";
import { useCarbonStore, STORAGE_KEY } from "@/lib/store/carbon-store";
import { BENCHMARKS } from "@/lib/insights/analyze";
import { useTheme } from "@/components/theme/ThemeProvider";
import { PageHeader } from "@/components/app/PageHeader";
import { Button, Dialog, formatKg } from "@/components/ui";
import { useToast } from "@/components/ui";
import { cn } from "@/lib/cn";

/* ─── Section wrapper ───────────────────────────────────── */
function Section({
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
function Row({
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
function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-[var(--border-strong)] bg-surface-3 px-4 py-3 text-center">
      <span className="text-lg font-black tabular-nums text-fg">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-fg-muted">{label}</span>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────── */
export function SettingsClient() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const activities = useCarbonStore((s) => s.activities);
  const goal = useCarbonStore((s) => s.goal);
  const setGoal = useCarbonStore((s) => s.setGoal);
  const clearAll = useCarbonStore((s) => s.clearAll);

  const [goalInput, setGoalInput] = useState(
    String(goal?.dailyTargetKg ?? BENCHMARKS.sustainableDailyTarget),
  );
  const [showClearDialog, setShowClearDialog] = useState(false);


  function handleSaveGoal() {
    const val = parseFloat(goalInput);
    if (!Number.isFinite(val) || val <= 0) {
      toast("Please enter a valid daily target greater than 0.", "error");
      return;
    }
    setGoal(val);
    toast(`Daily target set to ${formatKg(val)} kg CO2e / day.`, "success");
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify({ activities, goal }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carbontrackx-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Data exported successfully.", "success");
  }

  function handleClearAll() {
    clearAll();
    setShowClearDialog(false);
    toast("All data cleared. Your slate is clean.", "success");
  }

  return (
    <div className="stagger flex flex-col gap-4 pb-12">
      <PageHeader
        eyebrow="Settings"
        title="Preferences & Data"
        description="Customise your experience, manage your daily target, and control your stored footprint data."
        actions={
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-surface-3 px-3 py-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-fg-muted">
              {theme === "dark" ? "Dark" : "Light"} Mode
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative flex h-6 w-11 cursor-pointer rounded-full border border-[var(--border-strong)] bg-surface transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              style={{
                backgroundColor:
                  theme === "dark" ? "var(--accent)" : "var(--surface-3)",
              }}
            >
              <span
                className={cn(
                  "absolute top-0.5 size-5 rounded-full bg-[#ffffff] shadow-sm transition-transform duration-300",
                  theme === "dark" ? "translate-x-5" : "translate-x-0.5",
                )}
              />
            </button>
          </div>
        }
      />

      {/* ── Appearance ── */}
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

      {/* ── Daily Goal ── */}
      <Section
        icon={Target}
        title="Daily Emission Target"
        description="Set your personal daily CO2e budget. The engine uses this to compute your goal progress."
      >
        <Row
          label="Global Sustainable Average"
          hint="The IPCC recommends staying under this threshold."
        >
          <span className="rounded-lg border border-[var(--border-strong)] bg-surface-3 px-3 py-1.5 font-mono text-sm font-bold text-fg">
            {formatKg(BENCHMARKS.sustainableDailyTarget)} kg / day
          </span>
        </Row>

        <Row
          label="Your Daily Target"
          hint="Adjust to match your personal reduction ambition."
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                id="daily-target-input"
                type="number"
                min="0.1"
                step="0.1"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="w-28 rounded-xl border border-[var(--border-strong)] bg-surface px-3 py-2 text-right font-mono text-sm text-fg placeholder:text-fg-subtle focus:outline-none focus:ring-2 focus:ring-[var(--accent-subtle)] focus:border-[var(--accent)] transition"
                aria-label="Daily target in kg CO2e"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-fg-subtle">
                kg
              </span>
            </div>
            <Button size="sm" onClick={handleSaveGoal} className="gap-2">
              <SlidersHorizontal className="size-3.5" />
              Save
            </Button>
          </div>
        </Row>

        {goal && (
          <Row label="Current Target" hint="Your active daily footprint goal.">
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-[var(--accent-muted)] bg-[var(--accent-subtle)] px-3 py-1.5 font-mono text-sm font-bold text-[var(--accent)]">
                {formatKg(goal.dailyTargetKg)} kg / day
              </span>
              <button
                type="button"
                onClick={() => { setGoal(null); toast("Goal removed.", "success"); }}
                className="rounded-lg border border-[var(--border)] p-2 text-fg-muted hover:border-[var(--critical)] hover:text-[var(--critical)] transition-colors"
                aria-label="Remove goal"
              >
                <RotateCcw className="size-3.5" />
              </button>
            </div>
          </Row>
        )}
      </Section>

      {/* ── Data Management ── */}
      <Section
        icon={Database}
        title="Data Management"
        description="Your data lives entirely in your browser's local storage — nothing is sent to any server."
      >
        {/* Stats strip */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <StatPill label="Activities" value={String(activities.length)} />
          <StatPill
            label="Total CO2e"
            value={`${activities.reduce((s, a) => s + (a.quantity ?? 0), 0).toFixed(1)} kg`}
          />
          <StatPill
            label="Storage"
            value={`${(JSON.stringify(localStorage?.getItem?.(STORAGE_KEY) ?? "").length / 1024).toFixed(1)} KB`}
          />
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
            onClick={() => setShowClearDialog(true)}
            className="gap-2 border-[var(--critical)] bg-transparent text-[var(--critical)] hover:bg-[var(--critical)] hover:text-[#ffffff] transition-colors"
            variant="ghost"
          >
            <Trash2 className="size-3.5" />
            Clear All Data
          </Button>
        </Row>
      </Section>

      {/* ── Privacy ── */}
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

      {/* ── About ── */}
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
