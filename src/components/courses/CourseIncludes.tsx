"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash, Plus } from "lucide-react";

const CourseIncludes: React.FC = () => {
  const [items, setItems] = useState<string[]>([""]);

  const updateItem = (index: number, value: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const addItem = () => setItems((prev) => [...prev, ""]);

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {items.map((value, idx) => (
        <div key={idx} className="flex items-center gap-2">
          {/* Label removed as requested */}

          <div className="flex-1 flex items-center gap-2 min-w-0">
            <Input
              value={value}
              onChange={(e) => updateItem(idx, e.target.value)}
              placeholder="Nhập nội dung..."
              className="min-w-0"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => removeItem(idx)}
              aria-label={`Xóa mục ${idx + 1}`}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}

      <div>
        <Button onClick={addItem} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Thêm nội dung
        </Button>
      </div>
    </div>
  );
};

export default CourseIncludes;