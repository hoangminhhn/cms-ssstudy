"use client";

import React from "react";

interface Stats {
  retentionAvg: number;
  churnDeltaPercent: number;
  ltvDeltaPercent: number;
}

const StatCard: React.FC<{ title: string; value: React.ReactNode; subtitle?: React.ReactNode; bg?: string }> = ({ title, value, subtitle, bg }) => {
  return (
    <div className={`rounded-lg p-4 shadow-sm ${bg ?? "bg-white dark:bg-gray-800"} border`}>
      <div className="text-xs text-muted-foreground mb-2">{title}</div>
      <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</div>
      {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
    </div>
  );
};

const RetentionStatsCards: React.FC<{ stats?: Stats }> = ({ stats = { retentionAvg: 88, churnDeltaPercent: -28, ltvDeltaPercent: 45 } }) => {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        title="Retention trung bình"
        value={<div className="text-3xl text-green-700">{stats.retentionAvg}%</div>}
        subtitle={<div className="text-xs text-muted-foreground">Sau 6 tháng</div>}
        bg="bg-green-50"
      />

      <StatCard
        title="Giảm Churn Rate"
        value={<div className="text-3xl text-blue-700">{stats.churnDeltaPercent}%</div>}
        subtitle={<div className="text-xs text-muted-foreground">So với không xem chung</div>}
        bg="bg-blue-50"
      />

      <StatCard
        title="Tăng LTV"
        value={<div className="text-3xl text-violet-700">+{stats.ltvDeltaPercent}%</div>}
        subtitle={<div className="text-xs text-muted-foreground">Lifetime Value cao hơn</div>}
        bg="bg-violet-50"
      />
    </div>
  );
};

export default RetentionStatsCards;