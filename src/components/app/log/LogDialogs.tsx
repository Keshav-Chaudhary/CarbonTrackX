"use client";

import { Button, Dialog } from "@/components/ui";
import { PRESETS } from "./log-constants";

interface LogDialogsProps {
  confirmClear: boolean;
  setConfirmClear: (open: boolean) => void;
  clearAll: () => void;
  toast: (msg: string, type?: "success" | "error" | "info") => void;

  pendingPreset: typeof PRESETS[number] | null;
  setPendingPreset: (preset: typeof PRESETS[number] | null) => void;
  handleQuickLog: (preset: typeof PRESETS[number]) => void;

  confirmBulkDelete: boolean;
  setConfirmBulkDelete: (open: boolean) => void;
  selectedCount: number;
  handleBulkDelete: () => void;

  showImportDialog: boolean;
  setShowImportDialog: (open: boolean) => void;
  importFile: File | null;
  setImportFile: (file: File | null) => void;
  handleImport: (file: File, mode: "merge" | "overwrite") => void;
}

export function LogDialogs({
  confirmClear,
  setConfirmClear,
  clearAll,
  toast,
  pendingPreset,
  setPendingPreset,
  handleQuickLog,
  confirmBulkDelete,
  setConfirmBulkDelete,
  selectedCount,
  handleBulkDelete,
  showImportDialog,
  setShowImportDialog,
  importFile,
  setImportFile,
  handleImport,
}: LogDialogsProps) {
  return (
    <>
      {/* dialog for clear all */}
      <Dialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Delete all activity logs?"
        description="This will permanently delete all your recorded activities and reset your daily goal. This action cannot be undone."
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={() => setConfirmClear(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              clearAll();
              setConfirmClear(false);
              toast("All activity logs have been deleted.", "info");
            }}
          >
            Delete All
          </Button>
        </div>
      </Dialog>

      {/* dialog for preset confirmation */}
      <Dialog
        open={!!pendingPreset}
        onClose={() => setPendingPreset(null)}
        title={`Add ${pendingPreset?.label}?`}
        description={`This will log an activity of ${pendingPreset?.desc} to your history today, which will increase your total carbon footprint. Do you want to proceed?`}
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={() => setPendingPreset(null)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (pendingPreset) {
                handleQuickLog(pendingPreset);
                setPendingPreset(null);
              }
            }}
          >
            Add Activity
          </Button>
        </div>
      </Dialog>

      {/* dialog for bulk delete */}
      <Dialog
        open={confirmBulkDelete}
        onClose={() => setConfirmBulkDelete(false)}
        title="Delete selected logs?"
        description={`This will permanently delete the ${selectedCount} selected activities from your history. This action cannot be undone.`}
      >
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="ghost" onClick={() => setConfirmBulkDelete(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleBulkDelete();
              setConfirmBulkDelete(false);
            }}
          >
            Delete Selected
          </Button>
        </div>
      </Dialog>

      {/* dialog for import selection */}
      <Dialog
        open={showImportDialog}
        onClose={() => {
          setShowImportDialog(false);
          setImportFile(null);
        }}
        title="Import Telemetry Data"
        description={importFile ? `Importing from "${importFile.name}"` : ""}
      >
        <p className="text-sm text-fg-muted">
          Choose how you want to load these records into your local database:
        </p>
        <div className="flex flex-col gap-2 mt-4">
          <Button
            variant="ghost"
            className="justify-start text-left py-3 px-4 border border-[var(--border-strong)] bg-surface-3 hover:bg-[var(--accent-subtle)] hover:border-[var(--accent-line)]"
            onClick={() => {
              if (importFile) {
                handleImport(importFile, "merge");
                setShowImportDialog(false);
                setImportFile(null);
              }
            }}
          >
            <div className="flex flex-col">
              <span className="font-semibold text-fg">Merge with Current Data</span>
              <span className="text-xs text-fg-subtle">Keep all existing logged telemetry and append new entries.</span>
            </div>
          </Button>
          <Button
            variant="ghost"
            className="justify-start text-left py-3 px-4 border border-[var(--border-strong)] bg-surface-3 hover:bg-[var(--critical-subtle)] hover:border-[var(--critical)]"
            onClick={() => {
              if (importFile) {
                handleImport(importFile, "overwrite");
                setShowImportDialog(false);
                setImportFile(null);
              }
            }}
          >
            <div className="flex flex-col">
              <span className="font-semibold text-fg">Overwrite Existing Data</span>
              <span className="text-xs text-fg-subtle">Wipe the local database and replace it completely with the file data.</span>
            </div>
          </Button>
        </div>
        <div className="flex justify-end gap-3 mt-4 border-t border-[var(--border-faint)] pt-3">
          <Button
            variant="ghost"
            onClick={() => {
              setShowImportDialog(false);
              setImportFile(null);
            }}
          >
            Cancel
          </Button>
        </div>
      </Dialog>
    </>
  );
}
