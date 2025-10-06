"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Play, MessageSquare, Clock, Bell } from "lucide-react";
import DashboardCharts from "./DashboardCharts";

type StatProps = {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  meta?: string;
};

const StatCard: React.FC<StatProps> = ({ icon: Icon, label, value, meta }) => {
  return (
    <Card className="rounded-lg border border-gray-100 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gray-50 p-2">
              <Icon className="h-4 w-4 text-gray-600" />
            </div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        </div>

        <div className="mt-3">
          <div className="text-3xl font-semibold text-gray-900">{value}</div>
          {meta && <div className="mt-1 text-xs text-gray-500">{meta}</div>}
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardTab: React.FC = () => {
  return (
    <section className="space-y-6">
      {/* Section 1: 4 stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Play}
          label="Bài học đang live"
          value={9}
          meta="Thời gian thực"
        />

        <StatCard
          icon={MessageSquare}
          label="Tin nhắn / ngày"
          value={850}
          meta="Hôm nay"
        />

        <StatCard
          icon={Clock}
          label="Thời lượng TB/phòng"
          value="32 phút"
          meta="Theo 14 ngày"
        />

        <StatCard
          icon={Bell}
          label="Cảnh báo 24h"
          value={2}
          meta="vi phạm"
        />
      </div>

      {/* Section 2: Charts - moved to a dedicated component for easier maintenance */}
      <DashboardCharts />
    </section>
  );
};

export default DashboardTab;