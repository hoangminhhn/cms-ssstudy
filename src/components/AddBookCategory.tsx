import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const AddBookCategory: React.FC = () => {
  const [name, setName] = useState("");
  const [visible, setVisible] = useState<boolean>(true);

  const handleSave = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.error("Vui lòng nhập tên danh mục.");
      return;
    }

    // For now we simulate save with a toast.
    // In a real app you'd call an API and update global state.
    toast.success(`Đã thêm danh mục: ${trimmed}`);
    setName("");
    setVisible(true);
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Thêm mới</CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid gap-6">
            <div>
              <Label className="text-xs font-medium text-gray-600 uppercase">Tên danh mục</Label>
              <Input
                placeholder="Nhập tên danh mục"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label className="text-xs font-medium text-gray-600 uppercase">Hiển thị</Label>
              </div>
              <div>
                <Switch checked={visible} onCheckedChange={(v) => setVisible(!!v)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-6">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>
          Lưu
        </Button>
      </div>
    </div>
  );
};

export default AddBookCategory;