"use client";

import React from "react";
import TrendRealtimeStats from "./TrendRealtimeStats";
import ActivityTrendSection from "./ActivityTrendSection";
import TopVideosAndRoomDistribution from "./TopVideosAndRoomDistribution";
import TrendInsights from "./TrendInsights";

/**
 * TrendMetrics
 * - Section 1: Real-time stats (TrendRealtimeStats)
 * - Section 2: Activity trend (ActivityTrendSection)
 * - Section 3: Top videos + room distribution (TopVideosAndRoomDistribution)
 * - Section 4: Insights (TrendInsights)
 *
 * Each section is a separate component to allow easy updates.
 */

const TrendMetrics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Section 1: Real-time stats */}
      <TrendRealtimeStats />

      {/* Section 2: Activity trend with chart and three stat cards */}
      <ActivityTrendSection />

      {/* Section 3: Top 5 + Room distribution */}
      <TopVideosAndRoomDistribution />

      {/* Section 4: Insights panel (pale cyan card) */}
      <TrendInsights />

      {/* Placeholder for additional sections */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded border p-4">
          <div className="text-sm text-muted-foreground">Additional trend widgets will be placed here.</div>
          <div className="mt-3 h-40 rounded border bg-white dark:bg-gray-800 flex items-center justify-center text-muted-foreground">
            Placeholder for more charts
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendMetrics;