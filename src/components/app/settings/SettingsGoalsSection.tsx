"use client";

import { useState } from "react";
import { Target, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Button, formatKg } from "@/components/ui";
import { BENCHMARKS } from "@/lib/insights/analyze";
import type { Goal } from "@/lib/store/carbon-store";
import { Section, Row } from "../SettingsClient";

interface SettingsGoalsSectionProps {
  goal: Goal | null;
  setGoal: (dailyTargetKg: number | null) => void;
  toast: (msg: string, type?: "success" | "error" | "info") => void;
}

export function SettingsGoalsSection({
  goal,
  setGoal,
  toast,
}: SettingsGoalsSectionProps) {
  const [goalInput, setGoalInput] = useState(
    String(goal?.dailyTargetKg ?? BENCHMARKS.sustainableDailyTarget)
  );

  const handleSaveGoal = () => {
    const val = parseFloat(goalInput);
    if (!Number.isFinite(val) || val <= 0) {
      toast("Please enter a valid daily target greater than 0.", "error");
      return;
    }
    setGoal(val);
    toast(`Daily target set to ${formatKg(val)} kg CO2e / day.`, "success");
  };

  return (
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
              onClick={() => {
                setGoal(null);
                toast("Goal removed.", "success");
              }}
              className="rounded-lg border border-[var(--border)] p-2 text-fg-muted hover:border-[var(--critical)] hover:text-[var(--critical)] transition-colors"
              aria-label="Remove goal"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>
        </Row>
      )}
    </Section>
  );
}
