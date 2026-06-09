"use client";

import { Sparkles } from "lucide-react";
import { PRESETS } from "../log/log-constants";

interface QuickPresetsProps {
  onSelectPreset: (preset: typeof PRESETS[number]) => void;
}

export function QuickPresets({ onSelectPreset }: QuickPresetsProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[40px] opacity-0 transition-all group-hover:scale-150 group-hover:opacity-100" />
      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-3 border-b border-[var(--border-faint)] pb-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border-strong)] transition-colors group-hover:border-[var(--accent)]">
            <Sparkles className="size-5 text-[var(--accent)] group-hover:scale-110 transition-transform" />
          </span>
          <div>
            <h2 className="text-xl font-bold text-fg">Quick Log Presets</h2>
            <p className="text-sm text-fg-muted">One-click templates to instantly log routine actions.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="flex flex-col items-start text-left p-4 rounded-xl border border-[var(--border-strong)] bg-surface-3 hover:border-[var(--accent-line)] hover:bg-[var(--accent-subtle)] transition-all cursor-pointer group/btn"
            >
              <preset.icon className="size-5 mb-2 text-[var(--accent)] group-hover/btn:scale-110 transition-transform" />
              <span className="block text-sm font-semibold text-fg">{preset.label}</span>
              <span className="block text-xs text-fg-subtle">{preset.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
