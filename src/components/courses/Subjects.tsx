import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Subjects: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Môn học</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Đây là trang quản lý Môn học — danh sách môn, mô tả và ánh xạ cho khóa học.
        </p>
      </CardContent>
    </Card>
  );
};

export default Subjects;