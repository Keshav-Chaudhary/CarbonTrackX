import { useState } from "react";
import { useCarbonStore } from "@/lib/store/carbon-store";
import { useToast } from "@/components/ui";

export function useSettingsActions() {
  const activities = useCarbonStore((s) => s.activities);
  const goal = useCarbonStore((s) => s.goal);
  const setGoal = useCarbonStore((s) => s.setGoal);
  const clearAll = useCarbonStore((s) => s.clearAll);
  
  const { toast } = useToast();
  const [showClearDialog, setShowClearDialog] = useState(false);

  function handleExport() {
    const blob = new Blob([JSON.stringify({ activities, goal }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carbontrackx-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast("Data exported successfully.", "success");
  }

  function handleClearAll() {
    clearAll();
    setShowClearDialog(false);
    toast("All data cleared. Your slate is clean.", "success");
  }

  return {
    activities,
    goal,
    setGoal,
    showClearDialog,
    setShowClearDialog,
    handleExport,
    handleClearAll,
    toast,
  };
}
