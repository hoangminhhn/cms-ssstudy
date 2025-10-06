"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar } from "lucide-react";

interface AuditFilters {
  email?: string;
  room?: string;
  from?: string;
  to?: string;
  status?: string;
}

interface AuditSearchFormProps {
  onSearch: (filters: AuditFilters) => void;
}

const ROOM_OPTIONS = ["Tất cả phòng", "Phòng A", "Phòng B", "Phòng C"];

const MESSAGE_STATUS = ["Tất cả tin nhắn", "Đã xử lý", "Chưa xử lý", "Đã đánh dấu"];

const AuditSearchForm: React.FC<AuditSearchFormProps> = ({ onSearch }) => {
  const [email, setEmail] = React.useState<string>("");
  const [room, setRoom] = React.useState<string>(ROOM_OPTIONS[0]);
  const [from, setFrom] = React.useState<string>("");
  const [to, setTo] = React.useState<string>("");
  const [status, setStatus] = React.useState<string>(MESSAGE_STATUS[0]);
  const [warning, setWarning] = React.useState<string | null>(null);

  const handleSearch = () => {
    // Require either email or room not default
    if (!email.trim() && (!room || room === ROOM_OPTIONS[0])) {
      setWarning("⚠️ Vui lòng chọn người dùng hoặc phòng để tìm kiếm");
      toast.error("Vui lòng chọn người dùng hoặc phòng để tìm kiếm");
      return;
    }
    setWarning(null);
    onSearch({
      email: email.trim() || undefined,
      room: room === ROOM_OPTIONS[0] ? undefined : room,
      from: from || undefined,
      to: to || undefined,
      status: status === MESSAGE_STATUS[0] ? undefined : status,
    });
    toast.success("Đã áp dụng bộ lọc (demo).");
  };

  const handleClear = () => {
    setEmail("");
    setRoom(ROOM_OPTIONS[0]);
    setFrom("");
    setTo("");
    setStatus(MESSAGE_STATUS[0]);
    setWarning(null);
    onSearch({});
  };

  return (
    <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Tìm kiếm & Audit tin nhắn</h3>
      <p className="text-sm text-muted-foreground mb-4">Xem lịch sử chat theo người dùng hoặc phòng cụ thể</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm">Email người dùng</Label>
          <Input placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" />
        </div>

        <div>
          <Label className="text-sm">Phòng</Label>
          <Select value={room} onValueChange={(v) => setRoom(v)}>
            <SelectTrigger className="w-full h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROOM_OPTIONS.map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm">Từ ngày</Label>
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-2" />
        </div>

        <div>
          <Label className="text-sm">Đến ngày</Label>
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-2" />
        </div>

        <div className="md:col-span-2">
          <Label className="text-sm">Trạng thái tin nhắn</Label>
          <Select value={status} onValueChange={(v) => setStatus(v)}>
            <SelectTrigger className="w-full h-10 mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MESSAGE_STATUS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button className="flex-1 bg-sky-400 hover:bg-sky-500 text-white" onClick={handleSearch}>
          🔍 Tìm kiếm
        </Button>
        <Button variant="outline" onClick={handleClear}>Hủy</Button>
      </div>

      {warning && (
        <div className="mt-3 p-3 rounded bg-yellow-50 text-yellow-800 text-sm">
          {warning}
        </div>
      )}

      <div className="mt-4 p-3 rounded border bg-blue-50">
        <div className="flex items-center gap-2 font-medium mb-2">💡 Hướng dẫn sử dụng</div>
        <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
          <li><strong>Audit người dùng:</strong> Nhập email để xem toàn bộ tin nhắn của người đó</li>
          <li><strong>Xem chat phòng:</strong> Chọn phòng để xem lịch sử chat trong phòng đó</li>
          <li><strong>Khoảng thời gian:</strong> Thêm từ/đến ngày để thu hẹp kết quả</li>
          <li><strong>Trạng thái:</strong> Lọc theo tin nhắn đã vi phạm hoặc đã xử lý</li>
        </ul>
      </div>
    </div>
  );
};

export default AuditSearchForm;