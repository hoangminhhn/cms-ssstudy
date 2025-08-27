import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AddCourseReview: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thêm đánh giá</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">Form tạo đánh giá khóa học (thủ công) sẽ xuất hiện ở đây.</p>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">Tạo đánh giá</Button>
      </CardContent>
    </Card>
  );
};

export default AddCourseReview;