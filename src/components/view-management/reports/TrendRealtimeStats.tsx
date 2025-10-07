"use client";

import React from "react";
import { Users, Zap, Clock, UserPlus, Wifi, Info } from "lucide-react";

type Stat = {
  id: string;
  label: string;
  value: number | string;
  hint?: string;
  icon: React.ElementType;
  borderColor: string;
  textColor?: string;
};

const STATS: Stat[] = [
  { id: "ccu", label: "CCU", value: 0, hint: "Người đang online", icon: Users, borderColor: "border-sky-100", textColor: "text-sky-600" },
  { id: "pcu", label: "PCU", value: 0, hint: "Peak 24h", icon: Zap, borderColor: "border-violet-100", textColor: "text-violet-600" },
  { id: "rooms-active", label: "Phòng active", value: 2, hint: "Đang hoạt động", icon: Wifi, borderColor: "border-emerald-100", textColor: "text-emerald-600" },
  { id: "avg-duration", label: "Thời lượng TB", value: 0, hint: "Phút/phiên", icon: Clock, borderColor: "border-amber-100", textColor: "text-amber-600" },
  { id: "join-1h", label: "Join/1h", value: 0, hint: "Người mới tham gia", icon: UserPlus, borderColor: "border-indigo-100", textColor: "text-indigo-600" },
  { id: "system", label: "Trạng thái hệ thống", value: "Bình thường", hint: "", icon: Info, borderColor: "border-gray-100", textColor: "text-emerald-600" },
];

const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => {
  const Icon = stat.icon;
  return (
    <div className={`rounded-lg border ${stat.borderColor} bg-white dark:bg-gray-800 p-4`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-gray-50 dark:bg-gray-900">
            <Icon className={`h-4 w-4 ${stat.textColor ?? "text-gray-600"}`} />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
            <div className={`text-2xl font-semibold ${stat.textColor ?? "text-gray-900"} mt-1`}>{stat.value}</div>
          </div>
        </div>
      </div>

      {stat.hint ? <div className="mt-3 text-xs text-muted-foreground">{stat.hint}</div> : null}
    </div>
  );
};

const TrendRealtimeStats: React.FC = () => {
  return (
    <section>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <span className="text-sky-500">↗</span> Thống kê Real-time
        </h3>
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          <span>Đang cập nhật</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Two rows of three cards: render STATS items */}
        {STATS.slice(0, 3).map((s) => (
          <StatCard key={s.id} stat={s} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {STATS.slice(3, 6).map((s) => (
          <StatCard key={s.id} stat={s} />
        ))}
      </div>

      {/* Insights box */}
      <div className="mt-4 rounded-md border border-sky-100 bg-sky-50/60 p-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="text-sky-600 font-semibold text-sm">Insights Real-time</div>
        </div>
        <div className="text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 text-amber-500">⚠️</div>
            <div>Thời lượng phiên thấp - cần cải thiện engagement</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendRealtimeStats;