"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const CourseIncludes: React.FC = () => {
  const [items, setItems] = useState<string[]>([]);
  const [value, setValue] = useState("");

  const addItem = () => {
    const v = value.trim();
    if (!v) {
      toast.error("Vui lòng nhập tên mục.");
      return;
    }
    setItems((s) => [...s, v]);
    setValue("");
    toast.success("Đã thêm mục kèm theo.");
  };

  const removeItem = (index: number) => {
    setItems((s) => s.filter((_, i) => i !== index));
    toast.success("Đã xóa mục kèm theo.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-orange-600">Khóa học kèm theo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Label className="text-xs">Thêm mục kèm theo</Label>
              <Input
                placeholder="Ví dụ: Tài liệu PDF, Bài tập..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem();
                  }
                }}
              />
            </div>
            <div className="pt-6">
              <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={addItem}>
                Thêm
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="text-sm text-muted-foreground p-3 border rounded">Chưa có mục kèm theo.</div>
            ) : (
              items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between border rounded px-3 py-2 bg-white dark:bg-gray-800">
                  <div className="text-sm">{it}</div>
                  <div>
                    <Button variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => removeItem(idx)}>
                      Xóa
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseIncludes;