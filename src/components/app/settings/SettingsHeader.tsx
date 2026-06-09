import { PageHeader } from "@/components/app/shared/PageHeader";
import { cn } from "@/lib/cn";

interface SettingsHeaderProps {
  theme: string;
  toggleTheme: () => void;
}

export function SettingsHeader({ theme, toggleTheme }: SettingsHeaderProps) {
  return (
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
  );
}
