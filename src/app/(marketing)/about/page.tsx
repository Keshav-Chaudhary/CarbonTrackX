import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Lock, Code2, Accessibility, Gauge } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "What CarbonTrackX is, the principles behind it, and how your data is handled.",
};

const PRINCIPLES = [
  {
    icon: Code2,
    title: "Deterministic Core",
    body: "All emissions math and recommendations are strictly unit-tested functions. The AI layer narrates the data; it never fabricates or estimates the core figures.",
  },
  {
    icon: Lock,
    title: "Privacy by Design",
    body: "Your activity log is stored locally in your browser. There is no account required and no analytics tracking. Data leaves your device only when you actively chat with the AI assistant.",
  },
  {
    icon: Accessibility,
    title: "Accessible to Everyone",
    body: "Semantic HTML, full keyboard support, screen-reader-friendly data tables, AA contrast, and respect for reduced-motion preferences.",
  },
  {
    icon: Gauge,
    title: "Honest About Limits",
    body: "These are educational estimates derived from public scientific factors, not a certified audit. We show our math and our sources so you can judge the data for yourself.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-[radial-gradient(ellipse_at_top_right,_var(--accent-subtle),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_var(--accent-subtle),_transparent_50%)]">
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[var(--accent)] opacity-5 blur-[100px]" />
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 text-center custom-fade-in">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent)] drop-shadow-sm mb-6">
            About CarbonTrackX
          </p>
          <h1 className="mt-6 text-balance text-5xl font-extrabold tracking-tight text-fg lg:text-7xl">
            Clarity without <span className="text-[var(--accent)]">compromise.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-pretty text-lg text-fg-muted lg:text-xl leading-relaxed">
            CarbonTrackX helps individuals understand, track, and significantly reduce their carbon footprint using a local-first, deterministic engine. Designed for everyday people, not scientists.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          {PRINCIPLES.map(({ icon: Icon, title, body }, index) => (
            <ScrollReveal
              delayMs={index * 100}
              key={title}
              className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[40px] transition-all group-hover:scale-150" />
              <span className="relative flex size-12 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-fg mb-6 group-hover:text-[var(--accent)] transition-colors">
                <Icon className="size-6" />
              </span>
              <h2 className="relative text-2xl font-bold text-fg">{title}</h2>
              <p className="relative mt-3 text-fg-muted leading-relaxed">
                {body}
              </p>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delayMs={400} className="mt-24 relative overflow-hidden rounded-3xl border border-[var(--border)] bg-surface-2 p-12 text-center shadow-lg transition-all hover:border-[var(--accent-line)]">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent-subtle)] to-transparent opacity-20" />
          <h2 className="relative text-4xl font-extrabold tracking-tight text-fg">
            Ready to measure your footprint?
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-lg text-fg-muted">
            No accounts. No onboarding. It takes just one logged activity to get your first insight.
          </p>
          <div className="relative mt-10 flex justify-center">
            <Link
              href="/app"
              className="group inline-flex h-16 items-center justify-center gap-3 overflow-hidden rounded-full bg-[var(--accent)] px-10 text-lg font-bold text-[var(--accent-fg)] shadow-[0_0_20px_var(--accent-line)] transition-all hover:scale-105 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_30px_var(--accent-line)]"
            >
              Launch Dashboard
              <ArrowRight aria-hidden="true" className="size-6 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
