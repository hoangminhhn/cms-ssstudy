"use client";

import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface ConfigPanelProps {
  displayMode: string;
  setDisplayMode: (v: string) => void;
  allowFiles: boolean;
  setAllowFiles: (v: boolean) => void;
  onCreate: () => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ displayMode, setDisplayMode, allowFiles, setAllowFiles, onCreate }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border rounded-lg p-4 space-y-4">
      <h4 className="text-sm font-medium">Cấu hình</h4>

      <div>
        <Label>Hiển thị</Label>
        <div className="mt-2">
          <Select value={displayMode} onValueChange={setDisplayMode}>
            <SelectTrigger className="w-full h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Miễn phí</SelectItem>
              <SelectItem value="paid">Trả phí</SelectItem>
              <SelectItem value="members">Chỉ thành viên</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch checked={allowFiles} onCheckedChange={(v) => setAllowFiles(!!v)} />
        <Label className="mb-0">Cho phép tải file</Label>
      </div>

      <div className="pt-2">
        <Button className="w-full bg-gradient-to-r from-violet-500 to-pink-500 text-white" onClick={() => { onCreate(); toast.success("Tạo tài liệu (demo)."); }}>
          Tạo tài liệu
        </Button>
      </div>
    </div>
  );
};

export default ConfigPanel;