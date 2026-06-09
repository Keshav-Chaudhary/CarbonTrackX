import type { Metadata } from "next";
import { GoalsClient } from "@/components/app/GoalsClient";

export const metadata: Metadata = {
  title: "Goals",
};

export default function GoalsPage() {
  return <GoalsClient />;
}
