import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function DeveloperSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 overflow-hidden border-t border-[var(--border)]">
      <ScrollReveal animation="custom-fade-in" className="mb-16 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-black tracking-tight text-fg sm:text-5xl">
          Crafted by Keshav Chaudhary
        </h2>
        <p className="mt-6 text-xl text-fg-muted leading-relaxed">
          A passion project designed and built to bring high-fidelity telemetry tracking and local privacy to the forefront of climate tech.
        </p>
      </ScrollReveal>

      <ScrollReveal 
        delayMs={100} 
        className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]"
      >
        {/* Decorative background blur */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent-subtle)] blur-[80px] transition-all group-hover:scale-120 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          
          {/* Left Side: Avatar with glowing effect */}
          <div className="relative shrink-0">
            <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--positive)] opacity-40 blur group-hover:opacity-60 transition duration-300" />
            <img 
              src="/developer_avatar.png" 
              alt="Keshav Chaudhary" 
              className="relative size-24 md:size-32 rounded-full border border-[var(--border)] bg-surface-3 shadow-inner object-cover"
            />
          </div>

          {/* Right Side: Bio and links */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-fg">Keshav Chaudhary</h3>
                <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-wider mt-1">
                  CS Student @ IIIT Delhi
                </p>
              </div>
              
              <div className="flex justify-center md:justify-start gap-3">
                <a 
                  href="https://github.com/Keshav-Chaudhary" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="rounded-full bg-surface border border-[var(--border)] p-2 text-fg-subtle hover:text-fg hover:border-[var(--accent-line)] transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Code2 className="size-5" />
                </a>
              </div>
            </div>

            <p className="mt-4 text-fg-muted leading-relaxed max-w-2xl">
              Keshav combines mathematical rigor with modern full-stack development to architect local-first, performant interfaces. His work on CarbonTrackX aims to eliminate tracking friction and demonstrate that climate awareness tools can be both private and visually stunning.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Link 
                href="/developer" 
                className="group/btn inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-bold text-[var(--accent-fg)] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--accent-strong)] hover:shadow-[0_0_12px_var(--accent-line)]"
              >
                View Developer Profile
                <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>

        </div>
      </ScrollReveal>
    </section>
  );
}
