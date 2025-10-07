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
  TooltipProps,
} from "recharts";
import type { ValueType, NameType } from "recharts/src/component/DefaultTooltipContent";

const data = [
  { month: "Tháng 1", with: 98, without: 88 },
  { month: "Tháng 2", with: 96, without: 76 },
  { month: "Tháng 3", with: 94, without: 64 },
  { month: "Tháng 4", with: 92, without: 58 },
  { month: "Tháng 5", with: 90, without: 52 },
  { month: "Tháng 6", with: 88, without: 46 },
];

const CustomDiamond = (props: any) => {
  const { cx, cy, stroke, payload, value } = props;
  if (cx == null || cy == null) return null;
  return (
    <g>
      <rect
        x={cx - 6}
        y={cy - 6}
        width={12}
        height={12}
        transform={`rotate(45 ${cx} ${cy})`}
        stroke={stroke}
        fill="#fff"
        strokeWidth={1.5}
      />
    </g>
  );
};

const CustomCircle = (props: any) => {
  const { cx, cy, stroke } = props;
  if (cx == null || cy == null) return null;
  return (
    <circle cx={cx} cy={cy} r={5} stroke={stroke} strokeWidth={1.5} fill="#fff" />
  );
};

const tooltipFormatter = (value: ValueType, name: NameType) => {
  return [`${value}%`, String(name)];
};

const RetentionChart: React.FC = () => {
  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 8, right: 40, left: 40, bottom: 8 }}>
          <CartesianGrid stroke="#edf2f7" strokeDasharray="4 4" />
          <XAxis dataKey="month" tick={{ fontSize: 13 }} />
          <YAxis tick={{ fontSize: 13 }} domain={[0, 100]} />
          <Tooltip formatter={tooltipFormatter} />
          <Legend verticalAlign="bottom" height={36} />
          <Line
            type="monotone"
            dataKey="with"
            name="Có Xem chung"
            stroke="#10b981"
            strokeWidth={3}
            dot={<CustomCircle stroke="#10b981" />}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="without"
            name="Không Xem chung"
            stroke="#ef4444"
            strokeWidth={2}
            strokeDasharray="6 6"
            dot={<CustomDiamond stroke="#ef4444" />}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RetentionChart;