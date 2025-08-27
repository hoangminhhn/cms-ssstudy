import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Categories: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh mục</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Trang quản lý Danh mục khóa học — tạo, sửa, xóa danh mục.
        </p>
      </CardContent>
    </Card>
  );
};

export default Categories;