import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CourseReviews: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Đánh giá khóa học</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Trang quản lý đánh giá khóa học — xem, duyệt hoặc xóa đánh giá.
        </p>
      </CardContent>
    </Card>
  );
};

export default CourseReviews;