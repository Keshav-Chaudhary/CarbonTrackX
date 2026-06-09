import type { Metadata } from "next";
import { EMISSION_FACTORS, CATEGORY_META, CATEGORIES } from "@/lib/emissions/factors";
import { BENCHMARKS } from "@/lib/insights/analyze";
import { Calculator, Globe, Sparkles, Database } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Under The Hood",
  description:
    "Explore how CTx processes your data, our AI principles, and the transparent mathematics running your dashboard.",
};

export default function EnginePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-[radial-gradient(ellipse_at_top_right,_var(--accent-subtle),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_var(--accent-subtle),_transparent_50%)]">
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-5 blur-[100px]" />
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 text-center custom-fade-in">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent)] drop-shadow-sm mb-6">
            Under The Hood
          </p>
          <h1 className="mt-6 text-balance text-5xl font-extrabold tracking-tight text-fg lg:text-7xl">
            Transparent math.<br />
            <span className="text-[var(--accent)]">No black boxes.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg text-fg-muted lg:text-xl leading-relaxed">
            We believe you deserve to know exactly how your climate footprint is measured. Here is a full breakdown of the math, the models, and the AI powering CTx.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        
        {/* Reordered Grid: AI first, then Math, then Benchmarks */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* AI Assistant (Unique feature put at the top as requested) */}
          <ScrollReveal delayMs={100} className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] lg:col-span-3">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent-subtle)] blur-[80px] transition-all group-hover:scale-150" />
            <span className="relative flex size-12 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-fg mb-6 group-hover:text-[var(--accent)] transition-colors">
              <Sparkles className="size-6" />
            </span>
            <h2 className="relative text-2xl font-bold text-fg">The AI Co-Pilot</h2>
            <p className="relative mt-3 text-fg-muted leading-relaxed max-w-3xl">
              Most climate apps just show you charts. CTx gives you an active co-pilot. We pipe your hard data into a large language model, instructing it to act purely as a data analyst. It will never guess your footprint—it only explains the numbers that our deterministic engine has already verified. 
            </p>
          </ScrollReveal>

          {/* The Math */}
          <ScrollReveal delayMs={200} className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] lg:col-span-2">
            <span className="relative flex size-12 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-fg mb-6 group-hover:text-[var(--accent)] transition-colors">
              <Calculator className="size-6" />
            </span>
            <h2 className="text-2xl font-bold text-fg">Deterministic Math</h2>
            <p className="mt-3 text-fg-muted leading-relaxed">
              Every log you submit runs through a strict, unchanging formula. We take what you did and multiply it by scientific constants to get your footprint. It&apos;s perfectly auditable.
            </p>
            <div className="mt-6 rounded-xl border border-[var(--border-strong)] bg-surface-1 p-4 font-mono text-sm text-[var(--accent)] shadow-inner text-center font-bold">
              Total Impact = Activity Volume × Scientific Factor
            </div>
          </ScrollReveal>

          {/* Context / Baselines */}
          <ScrollReveal delayMs={300} className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
            <span className="relative flex size-12 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-fg mb-6 group-hover:text-[var(--accent)] transition-colors">
              <Globe className="size-6" />
            </span>
            <h2 className="text-2xl font-bold text-fg">Context & Baselines</h2>
            <p className="mt-3 text-fg-muted leading-relaxed">
              Numbers are useless without context. We measure your daily score against the global average ({BENCHMARKS.globalDailyAvg} kg/day) to show you exactly where you stand.
            </p>
          </ScrollReveal>

        </div>

        {/* Data Tables */}
        <ScrollReveal delayMs={400} className="mt-24">
          <div className="flex items-center gap-4 mb-8 border-b border-[var(--border)] pb-4">
            <Database className="size-8 text-[var(--accent)]" />
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-fg">Open Data Sources</h2>
              <p className="text-fg-muted mt-1">The exact scientific values we use to power your dashboard.</p>
            </div>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {CATEGORIES.map((category) => {
              const factors = EMISSION_FACTORS.filter((f) => f.category === category);
              return (
                <div key={category} className="rounded-3xl border border-[var(--border-faint)] bg-surface-2 overflow-hidden shadow-[var(--shadow-sm)]">
                  <div className="bg-surface-3 px-6 py-4 border-b border-[var(--border-faint)]">
                    <h3 className="text-lg font-bold text-fg tracking-wide uppercase">
                      {CATEGORY_META[category].label}
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-surface-2 border-b border-[var(--border-faint)]">
                        <tr className="text-left">
                          <th className="px-6 py-3 font-semibold text-fg-muted">Action</th>
                          <th className="px-6 py-3 font-semibold text-fg-muted">Weight</th>
                          <th className="px-6 py-3 font-semibold text-fg-muted hidden sm:table-cell">Citation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-faint)] bg-surface">
                        {factors.map((f) => (
                          <tr key={f.id} className="hover:bg-surface-2 transition-colors">
                            <th scope="row" className="px-6 py-4 text-left font-medium text-fg">
                              {f.label}
                            </th>
                            <td className="tnum px-6 py-4 whitespace-nowrap text-fg-muted font-bold">
                              {f.perUnitKg} <span className="text-xs font-normal">kg / {f.unit}</span>
                            </td>
                            <td className="px-6 py-4 text-fg-subtle text-xs hidden sm:table-cell">{f.source}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        <p className="mt-20 border-t border-[var(--border)] pt-8 text-center text-sm text-fg-subtle">
          Sources: United Kingdom DEFRA Conversion Data (2024), US EPA Standards, and the Poore & Nemecek Global Study (2018).
        </p>
      </section>
    </>
  );
}
