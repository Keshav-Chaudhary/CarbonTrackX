"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SquareArrowOutUpRight } from "lucide-react";
import { APP_NAV, INFO_NAV } from "./nav-config";
import { Logo } from "./Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
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
    <div className="relative flex h-full flex-col border-r border-[var(--border)] bg-surface-2 overflow-hidden">
      {/* Subtle ambient noise/glow behind the sidebar */}
      <div className="absolute top-0 -left-20 -z-10 h-64 w-64 rounded-full bg-[var(--accent-subtle)] blur-[100px] pointer-events-none opacity-40" />

      <div className="flex h-[72px] shrink-0 items-center justify-between px-6 border-b border-[var(--border-faint)]">
        <Logo href="/app" />
        <ThemeToggle />
      </div>

      <nav aria-label="Primary" className="flex-1 overflow-y-auto px-4 py-8 custom-scrollbar">
        <div className="flex flex-col gap-10">
          {Object.entries(groupedNav).map(([groupName, items]) => (
            <div key={groupName}>
              <h3 className="mb-4 px-3 text-[10px] font-bold uppercase tracking-widest text-fg-subtle drop-shadow-sm">
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
                        {item.label}
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
                  <span className="flex size-7 items-center justify-center rounded-md bg-surface-3 border border-[var(--border)] group-hover:text-[var(--accent)] group-hover:border-[var(--accent)] transition-colors shadow-sm">
                    <Icon aria-hidden="true" className="size-3.5 transition-transform group-hover:scale-110" />
                  </span>
                  <span>{item.label}</span>
                  <SquareArrowOutUpRight aria-hidden="true" className="ml-auto size-3.5 text-fg-subtle opacity-50 transition-all group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
