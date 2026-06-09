import {
  LayoutDashboard,
  PlusCircle,
  Lightbulb,
  MessageSquare,
  Target,
  Settings,
  Zap,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
  group?: string;
}

/** Primary in-app navigation, shown in the sidebar and mobile nav. */
export const APP_NAV: NavItem[] = [
  {
    href: "/app",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Your carbon overview",
    group: "OVERVIEW",
  },
  {
    href: "/app/log",
    label: "Activity Log",
    icon: PlusCircle,
    description: "Record your daily footprint",
    group: "OVERVIEW",
  },
  {
    href: "/app/insights",
    label: "Actionable Advice",
    icon: Lightbulb,
    description: "Ways to reduce your impact",
    group: "INTELLIGENCE",
  },
  {
    href: "/app/goals",
    label: "Green Targets",
    icon: Target,
    description: "Set footprint goals",
    group: "INTELLIGENCE",
  },
  {
    href: "/app/assistant",
    label: "AI Co-Pilot",
    icon: MessageSquare,
    description: "Chat with your AI guide",
    group: "INTELLIGENCE",
  },
  {
    href: "/app/settings",
    label: "Settings",
    icon: Settings,
    description: "App preferences",
    group: "SYSTEM",
  },
];

/** Secondary links shown in headers/footers. */
export const INFO_NAV = [
  { href: "/theengine", label: "The Engine", icon: Zap },
  { href: "/about", label: "About", icon: BookOpen },
];
