import type { Metadata } from "next";
import { InsightsClient } from "@/components/app/insights/InsightsClient";

export const metadata: Metadata = {
  title: "Insights",
};

export default function InsightsPage() {
  return <InsightsClient />;
}
