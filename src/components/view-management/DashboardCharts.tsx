"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/**
 * DashboardCharts
 * - Left: 15-day multi-line trend chart (CCU, Phòng, Tin nhắn) with dual Y axes
 * - Right: Pie chart showing violation distribution
 * This component is self-contained and can be updated independently.
 */

const lineData = [
  { date: "25/09", ccu: 120, phong: 5, tin: 600 },
  { date: "26/09", ccu: 150, phong: 10, tin: 700 },
  { date: "27/09", ccu: 30, phong: 3, tin: 200 },
  { date: "28/09", ccu: 180, phong: 8, tin: 1050 },
  { date: "29/09", ccu: 75, phong: 6, tin: 650 },
  { date: "30/09", ccu: 90, phong: 4, tin: 1020 },
  { date: "01/10", ccu: 60, phong: 2, tin: 500 },
  { date: "02/10", ccu: 140, phong: 12, tin: 1200 },
  { date: "03/10", ccu: 155, phong: 5, tin: 1800 },
  { date: "04/10", ccu: 130, phong: 7, tin: 1500 },
  { date: "05/10", ccu: 200, phong: 10, tin: 1700 },
  { date: "06/10", ccu: 20, phong: 1, tin: 120 },
  { date: "07/10", ccu: 100, phong: 6, tin: 900 },
  { date: "08/10", ccu: 110, phong: 8, tin: 980 },
  { date: "09/10", ccu: 95, phong: 4, tin: 880 },
];

const pieData = [
  { name: "Loại A", value: 76, color: "#0ea5e9" }, // blue
  { name: "Loại B", value: 12, color: "#10b981" }, // green
  { name: "Loại C", value: 8, color: "#f59e0b" },  // amber
  { name: "Loại D", value: 4, color: "#ef4444" },  // red
];

const ChartLegend = () => (
  <div className="flex items-center gap-4 mt-3 text-sm">
    <div className="flex items-center gap-2">
      <span className="inline-block w-3 h-3 rounded-full bg-green-500" />
      <span className="text-xs text-muted-foreground">CCU</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="inline-block w-3 h-3 rounded-full bg-cyan-500" />
      <span className="text-xs text-muted-foreground">Phòng</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="inline-block w-3 h-3 rounded-full bg-violet-500" />
      <span className="text-xs text-muted-foreground">Tin nhắn</span>
    </div>
  </div>
);

const DashboardCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left: Trend card spanning 2 columns on large screens */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold">Xu hướng hoạt động (15 ngày)</h3>
        <p className="text-sm text-muted-foreground mt-1">Phòng tạo mới, CCU, tin nhắn</p>

        <div className="mt-4" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 10, right: 40, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e6e9" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" orientation="left" tick={{ fontSize: 12 }} domain={[0, 220]} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} domain={[0, 2000]} />
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="ccu"
                name="CCU"
                stroke="#10B981"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="phong"
                name="Phòng"
                stroke="#06B6D4"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="tin"
                name="Tin nhắn"
                stroke="#8B5CF6"
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <ChartLegend />
      </div>

      {/* Right: Pie chart card */}
      <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm">
        <h3 className="text-lg font-semibold">Tỉ lệ vi phạm</h3>
        <p className="text-sm text-muted-foreground mt-1">Phân bố loại vi phạm (mock)</p>

        <div className="mt-6 flex items-center justify-center" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={4}
                labelLine={false}
                label={({ percent }) => `${Math.round((percent || 0) * 100)}%`}
              >
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-2 flex flex-col gap-2">
          {pieData.map((d) => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: d.color }} />
                <span className="text-sm text-gray-700 dark:text-gray-200">{d.name}</span>
              </div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{d.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;