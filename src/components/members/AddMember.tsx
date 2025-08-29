import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AddMember: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thêm thành viên</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Trang thêm thành viên (placeholder). Mình sẽ triển khai form thêm, xác thực và lưu sau khi bạn gửi yêu cầu chi tiết.
        </p>
        <div className="flex justify-end">
          <Button variant="outline">HỦY</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white ml-2">LƯU</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddMember;