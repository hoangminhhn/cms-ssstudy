"use client";

import React from "react";

interface StepRates {
  step12: number; // 0-1
  step23: number;
  step34: number;
}

const StatCard: React.FC<{ title: string; percent: number; subtitle: string }> = ({ title, percent, subtitle }) => {
  return (
    <div className="bg-white dark:bg-gray-900 border rounded-lg p-4 text-center shadow-sm">
      <div className="text-xs text-muted-foreground uppercase mb-2">{title}</div>
      <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{Math.round(percent)}%</div>
      <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>
    </div>
  );
};

interface FunnelStatsProps {
  rates: StepRates;
  labels?: { s12?: string; s23?: string; s34?: string };
}

const FunnelStats: React.FC<FunnelStatsProps> = ({ rates, labels }) => {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard title="Bước 1 → 2" percent={rates.step12 * 100} subtitle={labels?.s12 ?? "tham gia xem chung"} />
      <StatCard title="Bước 2 → 3" percent={rates.step23 * 100} subtitle={labels?.s23 ?? "xem hết video"} />
      <StatCard title="Bước 3 → 4" percent={rates.step34 * 100} subtitle={labels?.s34 ?? "mua khóa học"} />
    </div>
  );
};

export default FunnelStats;