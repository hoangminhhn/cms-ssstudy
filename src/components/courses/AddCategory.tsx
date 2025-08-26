import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AddCategory: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thêm danh mục</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">Form thêm danh mục sẽ xuất hiện ở đây.</p>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">Tạo danh mục</Button>
      </CardContent>
    </Card>
  );
};

export default AddCategory;