"use client";

import { useFirebaseSync } from "@/lib/firebase/useFirebaseSync";

export function SyncController() {
  useFirebaseSync();
  return null;
}
