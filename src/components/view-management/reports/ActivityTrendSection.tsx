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
  Cell,
} from "recharts";

const SAMPLE = [
  { date: "1/10", rooms: 12, participants: 52, messages: 130 },
  { date: "2/10", rooms: 18, participants: 75, messages: 50 },
  { date: "3/10", rooms: 15, participants: 80, messages: 60 },
  { date: "4/10", rooms: 10, participants: 65, messages: 170 },
  { date: "5/10", rooms: 9, participants: 25, messages: 150 },
  { date: "6/10", rooms: 14, participants: 45, messages: 190 },
  { date: "7/10", rooms: 13, participants: 75, messages: 120 },
];

const StatCard: React.FC<{ title: string; value: React.ReactNode; subtitle?: string; bg?: string }> = ({ title, value, subtitle, bg }) => {
  return (
    <div className={`rounded-lg p-4 ${bg ?? "bg-white"} shadow-sm border`}>
      <div className="text-xs text-muted-foreground">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      {subtitle && <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>}
    </div>
  );
};

const ActivityTrendSection: React.FC = () => {
  return (
    <section className="bg-white dark:bg-gray-800 rounded-lg border p-4 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold">Xu hướng hoạt động</h3>
          <div className="text-xs text-muted-foreground">Phân tích theo thời gian</div>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-red-50 text-red-600 text-sm">
            <span className="text-xs">-29.4%</span>
          </div>

          <select className="h-8 rounded-md border px-2 bg-white dark:bg-gray-800 text-sm">
            <option>7 ngày</option>
            <option>30 ngày</option>
            <option>90 ngày</option>
          </select>
        </div>
      </div>

      <div style={{ height: 300 }} className="mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={SAMPLE} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e6e7eb" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} formatter={(value: any) => value} />
            <Line type="monotone" dataKey="rooms" name="Số phòng" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="participants" name="Người tham gia" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="messages" name="Tin nhắn" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <StatCard title="Trung bình/ngày" value={<div className="text-3xl text-sky-600">14</div>} subtitle="Phòng" bg="bg-sky-50" />
        </div>
        <div className="flex-1">
          <StatCard title="Trung bình/ngày" value={<div className="text-3xl text-violet-600">62</div>} subtitle="Người" bg="bg-violet-50" />
        </div>
        <div className="flex-1">
          <StatCard title="Trung bình/ngày" value={<div className="text-3xl text-emerald-600">126</div>} subtitle="Tin nhắn" bg="bg-emerald-50" />
        </div>
      </div>
    </section>
  );
};

export default ActivityTrendSection;