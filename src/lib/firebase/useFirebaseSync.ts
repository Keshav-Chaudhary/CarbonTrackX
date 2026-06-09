"use client";

import { useEffect, useRef } from "react";
import { useCarbonStore } from "@/lib/store/carbon-store";
import { db } from "./config";
import { doc, setDoc } from "firebase/firestore";
import { makeId } from "@/lib/store/helpers";

function getUserId() {
  if (typeof window === "undefined") return "anon";
  let id = localStorage.getItem("carbon-anon-id");
  if (!id) {
    id = makeId();
    localStorage.setItem("carbon-anon-id", id);
  }
  return id;
}

export function useFirebaseSync() {
  const userId = getUserId();
  const state = useCarbonStore();
  const lastSynced = useRef<string | null>(null);

  useEffect(() => {
    // Only sync if state actually changed
    const stringified = JSON.stringify({ activities: state.activities, goal: state.goal });
    if (lastSynced.current === stringified) return;

    const syncToFirebase = async () => {
      if (!db) return; // Exit early if Firebase is not configured

      try {
        await setDoc(doc(db, "users", userId), {
          activities: state.activities,
          goal: state.goal,
          lastUpdated: new Date().toISOString()
        }, { merge: true });
        lastSynced.current = stringified;
      } catch (err) {
        console.warn("Failed to sync to Firebase. Will retry later.", err);
      }
    };

    // Debounce the sync
    const timeout = setTimeout(syncToFirebase, 2000);
    return () => clearTimeout(timeout);
  }, [state.activities, state.goal, userId]);
}
