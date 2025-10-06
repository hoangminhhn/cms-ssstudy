"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StatCard: React.FC<{ title: string; value: string; desc?: string }> = ({ title, value, desc }) => (
  <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
    <div className="text-xs text-muted-foreground">{title}</div>
    <div className="text-2xl font-bold mt-2">{value}</div>
    {desc && <div className="text-xs text-muted-foreground mt-1">{desc}</div>}
  </div>
);

const DashboardTab: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Top stat cards remain as placeholders for your data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Phòng đang live" value="—" desc="" />
        <StatCard title="Yêu cầu hỗ trợ" value="—" desc="" />
        <StatCard title="Báo cáo hôm nay" value="—" desc="" />
        <StatCard title="Người dùng online" value="—" desc="" />
      </div>

      {/* Removed demo widgets; placeholder section for future data */}
      <div className="border rounded-md p-6 bg-white dark:bg-gray-800 text-center text-muted-foreground">
        Nội dung chi tiết dashboard đang trống — gửi dữ liệu mới và tôi sẽ hiển thị chúng ở đây.
      </div>
    </div>
  );
};

export default DashboardTab;