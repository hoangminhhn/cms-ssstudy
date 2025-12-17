"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const genPassword = (len = 7) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

const PracticeConfig: React.FC = () => {
  const [enabled, setEnabled] = React.useState<boolean>(true);
  const [start, setStart] = React.useState<string>("");
  const [end, setEnd] = React.useState<string>("");
  const [resultOnSubmit, setResultOnSubmit] = React.useState<string>("Ngay sau khi nộp");
  const [resultAfterClose, setResultAfterClose] = React.useState<string>("Sau khi đóng đề");
  const [requirePassword, setRequirePassword] = React.useState<boolean>(true);
  const [password, setPassword] = React.useState<string>(() => genPassword());

  const handleGenerate = () => {
    const p = genPassword();
    setPassword(p);
    toast.success("Đã tạo mật khẩu mới.");
  };

  return (
    <div className="mt-4 border rounded-lg bg-white dark:bg-gray-800 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">Cấu hình luyện đề thực chiến</div>
        <div className="flex items-center gap-2">
          <Switch checked={enabled} onCheckedChange={(v) => setEnabled(!!v)} />
        </div>
      </div>

      {enabled ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: start / end */}
          <div className="space-y-3">
            <Label className="text-sm">Mở đề</Label>
            <Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
            <Label className="text-sm mt-2">Đóng đề</Label>
            <Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>

          {/* Middle: result policy */}
          <div className="space-y-3">
            <Label className="text-sm">Chính sách kết quả/đáp án</Label>
            <div>
              <Select value={resultOnSubmit} onValueChange={setResultOnSubmit}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ngay sau khi nộp">Kết quả: Ngay sau khi nộp</SelectItem>
                  <SelectItem value="Giấu đáp án">Kết quả: Giấu đáp án</SelectItem>
                  <SelectItem value="Sau khi đóng đề">Kết quả: Sau khi đóng đề</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={resultAfterClose} onValueChange={setResultAfterClose}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sau khi đóng đề">Khi đóng đề: Hiển thị kết quả</SelectItem>
                  <SelectItem value="Không hiển thị">Khi đóng đề: Không hiển thị</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right: password requirement */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm">Yêu cầu mật khẩu</Label>
              <Switch checked={requirePassword} onCheckedChange={(v) => setRequirePassword(!!v)} />
            </div>

            <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
              <Label className="text-xs">Mật khẩu</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input value={password} onChange={(e) => setPassword(e.target.value)} />
                <Button className="bg-white border" onClick={handleGenerate}>Tạo</Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Mật khẩu sẽ được sử dụng khi mở đề cho thí sinh (bảo vệ ngoài web).</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-muted-foreground">Tắt cấu hình luyện đề thực chiến.</div>
      )}
    </div>
  );
};

export default PracticeConfig;