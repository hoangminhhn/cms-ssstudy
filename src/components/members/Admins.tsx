import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Admins: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản trị viên</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Trang quản lý Quản trị viên (placeholder). Gửi mô tả chức năng bạn muốn cho trang này để mình triển khai tiếp.
        </p>
      </CardContent>
    </Card>
  );
};

export default Admins;