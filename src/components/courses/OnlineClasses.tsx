import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const OnlineClasses: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lớp Online</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Đây là trang quản lý Lớp Online. Bạn có thể thêm danh sách lớp, quản lý lịch học, trạng thái lớp tại đây.
        </p>
      </CardContent>
    </Card>
  );
};

export default OnlineClasses;