"use client";

import React from "react";
import { Heart, Shield, ArrowUpRight } from "lucide-react";

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: React.ReactNode; subtitle?: string; bg?: string }> = ({ icon, title, value, subtitle, bg }) => {
  return (
    <div className={`rounded-lg p-4 shadow-sm ${bg ?? "bg-white"} border`}>
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-white p-2 border flex items-center justify-center">{icon}</div>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground uppercase">{title}</div>
          <div className="mt-3 text-2xl font-semibold">{value}</div>
          {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
        </div>
      </div>
    </div>
  );
};

const RetentionStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      <StatCard
        icon={<Heart className="h-5 w-5 text-green-600" />}
        title="Retention trung bình"
        value={<div><span className="text-3xl text-green-700">88%</span></div>}
        subtitle="Sau 6 tháng"
        bg="bg-green-50/60"
      />

      <StatCard
        icon={<Shield className="h-5 w-5 text-sky-600" />}
        title="Giảm Churn Rate"
        value={<div className="text-3xl text-sky-700">-28%</div>}
        subtitle="So với không xem chung"
        bg="bg-sky-50/60"
      />

      <StatCard
        icon={<ArrowUpRight className="h-5 w-5 text-violet-600" />}
        title="Tăng LTV"
        value={<div className="text-3xl text-violet-700">+45%</div>}
        subtitle="Lifetime Value cao hơn"
        bg="bg-violet-50/60"
      />
    </div>
  );
};

export default RetentionStats;