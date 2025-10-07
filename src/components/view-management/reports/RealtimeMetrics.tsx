"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * RealtimeMetrics
 * Minimal, self-contained component that renders a few metric cards.
 * Intentionally contains placeholders (--). Replace with real data fetching later.
 */

const MetricCard: React.FC<{ title: string; value?: string }> = ({ title, value }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-semibold">{value ?? "--"}</div>
    </CardContent>
  </Card>
);

const RealtimeMetrics: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard title="Active Users (CCU)" value="--" />
        <MetricCard title="Phòng đang mở" value="--" />
        <MetricCard title="Tin nhắn / phút" value="--" />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Live stream / Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Khu vực hiển thị dữ liệu real-time (placeholder).</div>
            <div className="mt-3 h-36 rounded border bg-white dark:bg-gray-800 flex items-center justify-center text-muted-foreground">
              Real-time widgets will render here.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealtimeMetrics;