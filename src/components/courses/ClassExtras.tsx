"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ClassExtras: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Sách đề xuất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Danh sách sách đề xuất sẽ hiển thị ở đây.</div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Thêm sách</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sách tặng kèm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Danh sách sách tặng kèm.</div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Thêm sách</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Khóa học tặng kèm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Danh sách khóa học tặng kèm.</div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Thêm khóa học</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Khóa học đề xuất</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Danh sách khóa học đề xuất.</div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Thêm khóa học</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClassExtras;