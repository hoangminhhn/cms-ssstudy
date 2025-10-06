"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Phòng đang live" value="12" desc="Số phòng đang phát hiện tại" />
        <StatCard title="Yêu cầu hỗ trợ" value="3" desc="Yêu cầu chờ xử lý" />
        <StatCard title="Báo cáo hôm nay" value="8" desc="Số báo cáo mới" />
        <StatCard title="Người dùng online" value="1,240" desc="Đang xem chung" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Hành động nhanh</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Button onClick={() => alert("Tạo cảnh báo (demo)")}>Tạo cảnh báo</Button>
            <Button variant="outline" onClick={() => alert("Làm mới dữ liệu (demo)")}>
              Làm mới
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Các cảnh báo gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li className="text-muted-foreground">[14:12] Phòng 23 mất kết nối</li>
              <li className="text-muted-foreground">[13:20] Báo cáo spam: Phòng 8</li>
              <li className="text-muted-foreground">[11:05] Dung lượng đạt ngưỡng</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ghi chú</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Bạn có thể thêm widget khác ở đây tuỳ theo nhu cầu (biểu đồ, lịch, v.v.).</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardTab;