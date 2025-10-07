"use client";

import React from "react";
import TrendRealtimeStats from "./TrendRealtimeStats";

/**
 * TrendMetrics
 * - Section 1: Real-time stats (implemented in TrendRealtimeStats)
 * - Future sections can be added below
 */

const TrendMetrics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Section 1: Real-time stats */}
      <TrendRealtimeStats />

      {/* Placeholder for additional sections (charts, trends) */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded border p-4">
          <div className="text-sm text-muted-foreground">Charts & trends will be placed here.</div>
          <div className="mt-3 h-40 rounded border bg-white dark:bg-gray-800 flex items-center justify-center text-muted-foreground">
            Placeholder for charts
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendMetrics;