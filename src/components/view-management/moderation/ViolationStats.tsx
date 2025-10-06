"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export interface ViolationDatum {
  name: string;
  value: number;
  color: string;
  percent?: number;
}

interface ViolationStatsProps {
  data?: ViolationDatum[];
}

const DEFAULT_DATA: ViolationDatum[] = [
  { name: "Spam", value: 23, color: "#ef4444" },
  { name: "Quấy rối", value: 3, color: "#fb923c" },
  { name: "Nội dung không phù hợp", value: 5, color: "#f59e0b" },
  { name: "Ngôn từ thù ghét", value: 6, color: "#fbbf24" },
  { name: "Khác", value: 4, color: "#10b981" },
];

const ViolationStats: React.FC<ViolationStatsProps> = ({ data = DEFAULT_DATA }) => {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thống kê vi phạm</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="w-full lg:w-56 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={32} outerRadius={80} paddingAngle={4} labelLine={false}>
                  {data.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1">
            <div className="grid gap-2">
              {data.map((d) => {
                const pct = Math.round((d.value / total) * 100);
                return (
                  <div key={d.name} className="flex items-center justify-between gap-3 p-2 rounded border">
                    <div className="flex items-center gap-3">
                      <span className="inline-block w-3 h-3 rounded-full" style={{ background: d.color }} />
                      <div className="text-sm">{d.name} <span className="text-xs text-muted-foreground">({pct}%)</span></div>
                    </div>
                    <div className="text-sm font-medium">{d.value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViolationStats;