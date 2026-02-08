"use client";

import { useEffect, useState } from "react";

type StatsData = {
  totalSubmissions: number;
  uniqueLocations: number;
  lastUpdated: string | Date;
};

function timeAgo(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function useStats() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [animatedSubmissions, setAnimatedSubmissions] = useState(0);
  const [animatedLocations, setAnimatedLocations] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [timeAgoText, setTimeAgoText] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (!res.ok) throw new Error(`Stats API error: ${res.status}`);
        const data = await res.json();
        setStats(data);
        setIsLoading(false);

        // Animate submission counter
        const target = data.totalSubmissions;
        const duration = 1000; // 1 second
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const current = Math.floor(progress * target);
          setAnimatedSubmissions(current);

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };
        requestAnimationFrame(animate);

        // Animate locations counter
        const targetLoc = data.uniqueLocations;
        const startTimeLoc = Date.now();

        const animateLoc = () => {
          const elapsed = Date.now() - startTimeLoc;
          const progress = Math.min(elapsed / duration, 1);
          const current = Math.floor(progress * targetLoc);
          setAnimatedLocations(current);

          if (progress < 1) {
            requestAnimationFrame(animateLoc);
          }
        };
        requestAnimationFrame(animateLoc);

        // Update time ago text
        setTimeAgoText(timeAgo(data.lastUpdated));
      } catch (err) {
        console.error("Error fetching stats:", err);
        setIsLoading(false);
      }
    };

    fetchStats();

    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update time ago text every minute
  useEffect(() => {
    if (!stats) return;
    const interval = setInterval(() => {
      setTimeAgoText(timeAgo(stats.lastUpdated));
    }, 60000);
    return () => clearInterval(interval);
  }, [stats]);

  return {
    totalSubmissions: animatedSubmissions,
    uniqueLocations: animatedLocations,
    lastUpdated: timeAgoText,
    isLoading,
    rawStats: stats,
  };
}
