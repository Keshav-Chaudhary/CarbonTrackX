"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquareArrowOutUpRight } from "lucide-react";
import { APP_NAV, INFO_NAV } from "./nav-config";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Activity as LogoIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/** Returns true when `href` matches the current path (exact for /app root). */
function isActive(pathname: string, href: string): boolean {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Persistent desktop sidebar: brand, primary navigation grouped by architecture, 
 * with premium active states and secondary info links.
 */
export function Sidebar() {
  const pathname = usePathname();

  // Group the items based on their technical classification
  const groupedNav = APP_NAV.reduce((acc, item) => {
    const groupName = item.group || "MENU";
    if (!acc[groupName]) {
      acc[groupName] = [];
    }
    acc[groupName].push(item);
    return acc;
  }, {} as Record<string, typeof APP_NAV>);

  return (
    <>
      {/* Spacer to hold layout space without causing shift on hover */}
      <div className="hidden h-screen shrink-0 transition-[width] duration-300 md:block w-20" />

      {/* Actual visual sidebar */}
      <aside
        className="group fixed top-0 left-0 hidden h-screen border-r border-[var(--border)] bg-surface-2 transition-all duration-300 md:block z-40 overflow-hidden w-20 hover:w-64 hover:shadow-2xl"
      >
        <div className="relative flex h-full flex-col w-64">
          {/* Subtle ambient noise/glow behind the sidebar */}
          <div className="absolute top-0 -left-20 -z-10 h-64 w-64 rounded-full bg-[var(--accent-subtle)] blur-[100px] pointer-events-none opacity-40" />

          <div className="flex h-[72px] shrink-0 items-center justify-between px-6 border-b border-[var(--border-faint)]">
            <div className="flex w-auto items-center">
              <Link
                href="/app"
                className="inline-flex items-center gap-2 font-semibold"
                aria-label="CarbonTrackX — home"
              >
                <span
                  aria-hidden="true"
                  className="flex size-7 shrink-0 items-center justify-center rounded-[var(--r-sm)] border border-[var(--accent-line)] bg-[var(--accent-subtle)]"
                >
                  <LogoIcon className="size-4 text-[var(--accent)]" />
                </span>
                <span className="text-fg tracking-tight transition-opacity duration-300 opacity-0 group-hover:opacity-100">CTx</span>
              </Link>
            </div>
            <div className="flex items-center gap-1 transition-opacity duration-300 absolute right-4 opacity-0 group-hover:opacity-100">
              <ThemeToggle />
            </div>
          </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar">
        <div className="flex flex-col gap-10">
          {Object.entries(groupedNav).map(([groupName, items]) => (
            <div key={groupName}>
              <h3 className="mb-4 px-3 text-[10px] font-bold uppercase tracking-widest text-fg-subtle drop-shadow-sm transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                {groupName}
              </h3>
              <ul className="flex flex-col gap-1.5">
                {items.map((item) => {
                  const active = isActive(pathname, item.href);
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                          active
                            ? "bg-gradient-to-r from-[var(--accent-subtle)] to-transparent font-bold text-fg"
                            : "font-medium text-fg-muted hover:bg-surface-3 hover:text-fg",
                        )}
                      >
                        <Icon
                          aria-hidden="true"
                          className={cn(
                            "size-4 shrink-0 transition-transform group-hover:scale-110",
                            active ? "text-[var(--accent)]" : "text-fg-subtle group-hover:text-fg",
                          )}
                        />
                        <span className="transition-opacity duration-300 whitespace-nowrap opacity-0 group-hover:opacity-100">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-[var(--border-faint)] bg-surface-2 mt-auto">
        <ul className="flex flex-col gap-1.5">
          {INFO_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-fg-muted transition-all hover:bg-surface-3 hover:text-fg"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-surface-3 border border-[var(--border)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] transition-colors shadow-sm">
                    <Icon aria-hidden="true" className="size-3.5 transition-transform group-hover:scale-110" />
                  </span>
                  <span className="transition-opacity duration-300 whitespace-nowrap opacity-0 group-hover:opacity-100">{item.label}</span>
                  <SquareArrowOutUpRight aria-hidden="true" className="ml-auto size-3.5 text-fg-subtle transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)] opacity-0 group-hover:opacity-100" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  </aside>
  </>
  );
}
