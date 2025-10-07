"use client";

import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";

export type FunnelDatum = {
  name: string;
  value: number;
  color?: string;
};

interface FunnelChartProps {
  data: FunnelDatum[];
  max?: number;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data, max }) => {
  const computedMax = max ?? Math.max(...data.map((d) => d.value)) * 1.05;

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 80, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="#e6e7eb" />
          <XAxis
            type="number"
            domain={[0, Math.ceil(computedMax)]}
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: "#cbd5e1" }}
            tickLine={false}
          />
          <YAxis
            dataKey="name"
            type="category"
            width={160}
            tick={{ fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v: any) => [v, "Số người"]}
            contentStyle={{ borderRadius: 8 }}
          />
          <Bar dataKey="value" barSize={18} radius={[10, 10, 10, 10]}>
            <LabelList
              dataKey="value"
              position="right"
              formatter={(val: number) => String(val)}
              style={{ fontSize: 12, fill: "#0f172a" }}
            />
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.color ?? ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"][idx % 4]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FunnelChart;