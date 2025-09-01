"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCategoryForm: React.FC = () => {
  const [name, setName] = React.useState<string>("");
  const [visible, setVisible] = React.useState<boolean>(true);
  const navigate = useNavigate();

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Vui lòng nhập tên danh mục.");
      return;
    }

    // In a real app you'd POST to an API here. We'll simulate success.
    console.log("Saving category:", { name: trimmed, visible });
    toast.success("Đã lưu danh mục.");
    // Redirect back to categories list
    navigate("/news?tab=categories");
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Thêm mới</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="category-name" className="text-xs font-medium text-muted-foreground uppercase">Tên danh mục</Label>
              <Input
                id="category-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên danh mục"
                className="mt-2"
              />
            </div>

            <div className="flex items-center gap-3">
              <Label className="min-w-[96px]">Hiển thị</Label>
              <Switch checked={visible} onCheckedChange={(v) => setVisible(!!v)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating footer actions (aligned bottom-right like the screenshot) */}
      <div className="fixed right-6 bottom-6 z-50">
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/news?tab=categories")}>Hủy</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>Lưu</Button>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryForm;