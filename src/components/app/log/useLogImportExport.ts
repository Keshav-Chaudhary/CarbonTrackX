"use client";

import { useState, useCallback } from "react";
import type { Activity } from "@/lib/emissions/types";
import type { Goal } from "@/lib/store/carbon-store";
import { todayISO } from "@/lib/store/helpers";
import { useToast } from "@/components/ui";

interface UseLogImportExportProps {
  activities: Activity[];
  goal: Goal | null;
  addActivity: (input: { factorId: string; quantity: number; date: string; note?: string }) => {
    ok: boolean;
    error?: string;
  };
  clearAll: () => void;
  setGoal: (dailyTargetKg: number | null) => void;
}

export function useLogImportExport({
  activities,
  goal,
  addActivity,
  clearAll,
  setGoal,
}: UseLogImportExportProps) {
  const { toast } = useToast();
  const [importFile, setImportFile] = useState<File | null>(null);
  const [showImportDialog, setShowImportDialog] = useState(false);

  const handleExport = useCallback(() => {
    try {
      const data = {
        activities,
        goal,
        exportedAt: new Date().toISOString(),
        version: 1,
      };
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `carbontrackx_telemetry_export_${todayISO()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast("Telemetry ledger exported successfully.");
    } catch {
      toast("Failed to export telemetry data.", "error");
    }
  }, [activities, goal, toast]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImportFile(file);
      setShowImportDialog(true);
    }
    e.target.value = "";
  }, []);

  const handleImport = useCallback(
    (file: File, mode: "merge" | "overwrite") => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (!data || (!Array.isArray(data.activities) && !Array.isArray(data))) {
            toast("Invalid JSON format: Expected activities array.", "error");
            return;
          }

          const importedActivities = Array.isArray(data) ? data : data.activities;
          const importedGoal = data.goal;

          if (mode === "overwrite") {
            clearAll();
          }

          let successCount = 0;
          let failCount = 0;

          type ImportedActivity = {
            factorId?: string;
            quantity?: number;
            date?: string;
            note?: string;
          };

          importedActivities.forEach((act: ImportedActivity) => {
            if (
              typeof act.factorId === "string" &&
              typeof act.quantity === "number" &&
              typeof act.date === "string"
            ) {
              const res = addActivity({
                factorId: act.factorId,
                quantity: act.quantity,
                date: act.date,
                note: typeof act.note === "string" ? act.note : undefined,
              });
              if (res.ok) successCount++;
              else failCount++;
            } else {
              failCount++;
            }
          });

          if (importedGoal && typeof importedGoal.dailyTargetKg === "number") {
            setGoal(importedGoal.dailyTargetKg);
          }

          toast(
            `Import complete. Success: ${successCount}. Failures/Skipped: ${failCount}.`,
            failCount > 0 ? "error" : "info"
          );
        } catch {
          toast("Failed to parse JSON file.", "error");
        }
      };
      reader.readAsText(file);
    },
    [addActivity, clearAll, setGoal, toast]
  );

  return {
    importFile,
    setImportFile,
    showImportDialog,
    setShowImportDialog,
    handleExport,
    handleFileChange,
    handleImport,
  };
}
