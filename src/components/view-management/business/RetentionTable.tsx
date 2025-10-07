"use client";

import React from "react";

export type RetentionRow = {
  label: string;
  withFreemium: number; // percent or absolute depending on label; we use percent here
  withoutFreemium: number;
};

const SAMPLE_ROWS: RetentionRow[] = [
  { label: "Retention trung bình (6 tháng)", withFreemium: 88, withoutFreemium: 60 },
  { label: "Tỷ lệ giữ chân 1 tháng", withFreemium: 95, withoutFreemium: 76 },
  { label: "Tỷ lệ giữ chân 3 tháng", withFreemium: 90, withoutFreemium: 68 },
  { label: "Tỷ lệ chuyển đổi (mua)", withFreemium: 15, withoutFreemium: 7 },
];

const formatPercent = (n: number) => `${Math.round(n)}%`;

const computeDelta = (a: number, b: number) => {
  // absolute percent-point delta and relative percent change
  const point = a - b;
  const relative = b === 0 ? 100 : Math.round(((a - b) / b) * 100);
  const sign = point >= 0 ? "+" : "";
  return `${sign}${point}pp (${sign}${relative}%)`;
};

const RetentionTable: React.FC<{ rows?: RetentionRow[] }> = ({ rows = SAMPLE_ROWS }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800 text-left text-xs text-muted-foreground">
            <th className="px-4 py-3">Chỉ số</th>
            <th className="px-4 py-3">Có Xem chung</th>
            <th className="px-4 py-3">Không Xem chung</th>
            <th className="px-4 py-3">Chênh lệch</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, idx) => (
            <tr
              key={r.label}
              className={idx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}
            >
              <td className="px-4 py-3 align-top w-1/2">
                <div className="font-medium text-gray-900 dark:text-gray-100">{r.label}</div>
              </td>

              <td className="px-4 py-3 align-top w-1/6">
                <div className="text-lg font-semibold text-green-700">{formatPercent(r.withFreemium)}</div>
              </td>

              <td className="px-4 py-3 align-top w-1/6">
                <div className="text-lg font-semibold text-rose-600">{formatPercent(r.withoutFreemium)}</div>
              </td>

              <td className="px-4 py-3 align-top w-1/6">
                <div className="text-sm text-gray-700 dark:text-gray-200">{computeDelta(r.withFreemium, r.withoutFreemium)}</div>
              </td>
            </tr>
          ))}

          {/* optional summary row */}
          <tr className="bg-white dark:bg-gray-900">
            <td className="px-4 py-3 font-medium">Tổng quan</td>
            <td className="px-4 py-3 text-green-700 font-semibold">{formatPercent(
              Math.round(rows.reduce((s, r) => s + r.withFreemium, 0) / rows.length)
            )}</td>
            <td className="px-4 py-3 text-rose-600 font-semibold">{formatPercent(
              Math.round(rows.reduce((s, r) => s + r.withoutFreemium, 0) / rows.length)
            )}</td>
            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">Xem chi tiết từng chỉ số ở trên</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default RetentionTable;