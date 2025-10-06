"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const StatCard: React.FC<{ title: string; value: React.ReactNode; subtitle?: string }> = ({ title, value, subtitle }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  );
};

const DashboardTab: React.FC = () => {
  // mock values
  const liveRooms = 9;
  const messagesPerDay = 850;
  const avgMinutes = 13;
  const warnings24h = 2;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Phòng đang LIVE" value={liveRooms} subtitle="Thời gian thực" />
        <StatCard title="Tin nhắn / ngày" value={messagesPerDay} subtitle="Hôm nay (mock)" />
        <StatCard title="Thời lượng TB/phòng" value={`${avgMinutes} phút`} subtitle="Theo 14 ngày" />
        <StatCard title="Cảnh báo 24h" value={warnings24h} subtitle="Spam/vi phạm" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Bảng tóm tắt nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Đây là dashboard tóm tắt cho chức năng "Xem chung". Dữ liệu là mock để tiện kết nối với API sau này.
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between text-sm">
                <div>Số phòng tạo hôm nay</div>
                <div className="font-medium">12</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>CCU toàn hệ thống (peak)</div>
                <div className="font-medium">320</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>Tỷ lệ giữ chân ≥ 10 phút</div>
                <div className="font-medium">62%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>RM-1001: Phòng LIVE – 42 người tham gia</li>
                <li>RM-1003: Phòng đã kết thúc – 128 người, 2 vi phạm</li>
                <li>RM-1002: Phòng sắp diễn ra – nhắc lịch gửi 09:00</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardTab;