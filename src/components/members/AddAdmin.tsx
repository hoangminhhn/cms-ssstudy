import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AddAdmin: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thêm quản trị viên</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Trang thêm quản trị viên (placeholder). Mình sẽ thêm form với quyền, vai trò và xác thực khi bạn mô tả chi tiết.
        </p>
        <div className="flex justify-end">
          <Button variant="outline">HỦY</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white ml-2">LƯU</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddAdmin;