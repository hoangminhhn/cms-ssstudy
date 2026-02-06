"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Highlight = {
  id: string;
  text: string;
};

const Highlights: React.FC = () => {
  const [items, setItems] = React.useState<Highlight[]>([]);
  const [value, setValue] = React.useState<string>("");

  const add = () => {
    const t = value.trim();
    if (!t) {
      toast.error("Vui lòng nhập nội dung.");
      return;
    }
    setItems((s) => [...s, { id: `h-${Date.now()}`, text: t }]);
    setValue("");
    toast.success("Đã thêm mục nổi bật.");
  };

  const remove = (id: string) => {
    setItems((s) => s.filter((i) => i.id !== id));
    toast.success("Đã xóa mục.");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Thêm điểm nổi bật (ví dụ: Có đáp án chi tiết)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={add}>Thêm</Button>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <div className="text-sm text-muted-foreground p-3 border rounded">Chưa có điểm nổi bật.</div>
        ) : (
          items.map((it) => (
            <div key={it.id} className="flex items-center justify-between gap-3 border rounded p-2 bg-white dark:bg-gray-800">
              <div className="text-sm truncate">{it.text}</div>
              <Button variant="ghost" className="text-red-600" onClick={() => remove(it.id)}>Xóa</Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Highlights;