import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AddClass: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thêm lớp</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">Form tạo lớp mới sẽ xuất hiện tại đây.</p>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">Tạo lớp mới</Button>
      </CardContent>
    </Card>
  );
};

export default AddClass;