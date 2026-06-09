"use client";

import { TrendingDown, Route, Target, Salad } from "lucide-react";

const SUGGESTIONS = [
  { icon: TrendingDown, text: "Analyze my primary emission drivers." },
  { icon: Route, text: "Suggest high-impact footprint reductions." },
  { icon: Target, text: "Evaluate my long-term sustainability trajectory." },
  { icon: Salad, text: "Calculate the impact of a dietary shift." },
];

interface SuggestionChipsProps {
  submit: (text: string) => void;
  enabled: boolean | null;
  streaming: boolean;
}

export function SuggestionChips({
  submit,
  enabled,
  streaming,
}: SuggestionChipsProps) {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-2">
      {SUGGESTIONS.map(({ icon: Icon, text }) => (
        <button
          key={text}
          type="button"
          onClick={() => submit(text)}
          disabled={enabled === null || streaming}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-surface border border-[var(--border)] rounded-full text-fg-muted hover:text-fg hover:border-[var(--accent-strong)] hover:bg-[var(--accent-subtle)] transition-all disabled:opacity-50 shadow-sm cursor-pointer"
        >
          <Icon aria-hidden="true" className="size-3.5 text-[var(--accent)]" />
          {text}
        </button>
      ))}
    </div>
  );
}
