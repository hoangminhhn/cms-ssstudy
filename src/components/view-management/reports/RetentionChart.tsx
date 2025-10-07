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
  Dot,
} from "recharts";

const SAMPLE = [
  { month: "Tháng 1", with: 98, without: 90 },
  { month: "Tháng 2", with: 96, without: 76 },
  { month: "Tháng 3", with: 92, without: 64 },
  { month: "Tháng 4", with: 90, without: 58 },
  { month: "Tháng 5", with: 88, without: 52 },
  { month: "Tháng 6", with: 85, without: 45 },
];

const CustomDot = ({ cx, cy, stroke }: any) => {
  if (cx == null || cy == null) return null;
  return (
    <circle cx={cx} cy={cy} r={4} fill={stroke} stroke="transparent" />
  );
};

const RetentionChart: React.FC<{ data?: typeof SAMPLE }> = ({ data = SAMPLE }) => {
  return (
    <div className="bg-white dark:bg-gray-900 border rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-800 dark:text-gray-100">Retention & Giá trị học sinh</h3>
      <p className="text-xs text-muted-foreground mt-1">Giữ chân học sinh hiệu quả hơn</p>

      <div className="mt-4" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e6e7eb" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} domain={[0, 110]} />
            <Tooltip formatter={(v: any) => [`${v}%`, "Retention %"]} />
            <Legend verticalAlign="bottom" height={36} />
            <Line
              type="monotone"
              dataKey="with"
              name="Có Xem chung"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="without"
              name="Không Xem chung"
              stroke="#ef4444"
              strokeDasharray="4 4"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RetentionChart;