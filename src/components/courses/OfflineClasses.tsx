import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OfflineClasses: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lớp Offline</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Đây là trang quản lý Lớp Offline. Hiển thị danh sách lớp trực tiếp, phòng học và lịch biểu.
        </p>
      </CardContent>
    </Card>
  );
};

export default OfflineClasses;