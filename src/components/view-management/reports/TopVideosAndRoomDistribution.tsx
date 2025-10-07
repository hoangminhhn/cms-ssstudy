"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";

type TopItem = {
  rank: number;
  title: string;
  subtitle?: string;
  rooms: number;
};

const SAMPLE_TOP: TopItem[] = [
  { rank: 1, title: "Toán 12 - Luyện thi THPT - Bài 1: Giới hạn của hàm số", subtitle: "Xu hướng tăng", rooms: 1 },
  { rank: 2, title: "Toán 12 - Luyện thi THPT - Bài 15: Khối đa diện", subtitle: "Xu hướng tăng", rooms: 1 },
  { rank: 3, title: "Ngữ Văn 12 - Đề thi thử THPT 2025", subtitle: "Xu hướng tăng", rooms: 1 },
  { rank: 4, title: "Tiếng Anh 12 - Bài 8: Reading Comprehension", subtitle: "Xu hướng tăng", rooms: 1 },
  { rank: 5, title: "Vật Lý 12 - Bài 3: Dao động điều hòa", subtitle: "Xu hướng tăng", rooms: 1 },
];

const PIE_DATA = [
  { name: "Đang xem", value: 2, color: "#10B981" },
  { name: "Sắp diễn ra", value: 1, color: "#3B82F6" },
  { name: "Đã kết thúc", value: 2, color: "#6B7280" },
];

const percent = (v: number, total: number) => Math.round((v / total) * 100);

const TopVideosAndRoomDistribution: React.FC = () => {
  const total = PIE_DATA.reduce((s, d) => s + d.value, 0) || 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left: Top 5 list */}
      <div className="bg-white dark:bg-gray-800 border rounded-lg shadow-sm p-4">
        <h4 className="text-sm font-semibold mb-3">Top 5 bài học được xem chung</h4>

        <div className="space-y-3">
          {SAMPLE_TOP.map((it) => (
            <div key={it.rank} className="flex items-center justify-between gap-3 bg-sky-50 dark:bg-gray-900 rounded-md p-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  aria-hidden
                  className="flex items-center justify-center h-10 w-10 rounded-lg text-white font-semibold"
                  style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}
                >
                  <span className="text-sm">{it.rank}</span>
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-medium text-ellipsis overflow-hidden whitespace-nowrap">{it.title}</div>
                  {it.subtitle && <div className="text-xs text-muted-foreground mt-1">{it.subtitle}</div>}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-sm font-semibold">{it.rooms}</div>
                <div className="text-xs text-muted-foreground">phòng</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Pie chart */}
      <div className="bg-white dark:bg-gray-800 border rounded-lg shadow-sm p-4">
        <h4 className="text-sm font-semibold mb-3">Phân bố phòng theo trạng thái</h4>

        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="w-full lg:w-1/2 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={6}
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value} (${percent(value, total)}%)`}
                >
                  {PIE_DATA.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1 w-full">
            <ul className="space-y-2">
              {PIE_DATA.map((p) => (
                <li key={p.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ background: p.color }} />
                    <span className="text-sm">{p.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{p.value} ({percent(p.value, total)}%)</div>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">Xem chi tiết</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopVideosAndRoomDistribution;