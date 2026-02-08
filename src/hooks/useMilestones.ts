"use client";

import { useEffect, useRef } from "react";
import { useToast } from "@/contexts/ToastContext";
import { useStats } from "./useStats";

const MILESTONES = [100, 500, 1000];

export function useMilestones() {
  const { rawStats } = useStats();
  const { addToast } = useToast();
  const celebratedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!rawStats) return;

    const count = rawStats.totalSubmissions;
    for (const milestone of MILESTONES) {
      if (count >= milestone && !celebratedRef.current.has(milestone)) {
        celebratedRef.current.add(milestone);
        addToast(`🎉 ${milestone} salaries submitted! Keep it going!`, "success");
      }
    }
  }, [rawStats, addToast]);
}
