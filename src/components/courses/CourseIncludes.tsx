"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash } from "lucide-react";

const CourseIncludes: React.FC = () => {
  const [items, setItems] = React.useState<string[]>(["Sách mẫu A", "Sách mẫu B"]);
  const [newItem, setNewItem] = React.useState<string>("");

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems((s) => [...s, newItem.trim()]);
    setNewItem("");
  };

  const removeItem = (index: number) => {
    setItems((s) => s.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sách bao gồm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-md p-2"
            >
              <div className="flex items-center space-x-3">
                <Checkbox id={`include-${idx}`} />
                <span className="text-sm">{item}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeItem(idx)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Nhập tên sách để thêm..."
            />
            <Button onClick={addItem}>Thêm</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseIncludes;