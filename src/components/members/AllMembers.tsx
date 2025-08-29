import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AllMembers: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thành viên</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Đây là trang danh sách Thành viên (placeholder). Gửi cho mình mô tả chi tiết chức năng bạn muốn ở trang này và mình sẽ triển khai đầy đủ với dữ liệu demo, bộ lọc, bảng, và các thao tác tương ứng.
        </p>
      </CardContent>
    </Card>
  );
};

export default AllMembers;