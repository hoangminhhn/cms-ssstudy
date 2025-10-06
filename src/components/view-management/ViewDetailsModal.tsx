"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export interface MemberLog {
  id: string;
  name: string;
  role: "member" | "moderator";
  joinedAt: string;
  leftAt?: string;
  durationMinutes?: number;
}

export interface TimelineEvent {
  id: string;
  type: "created" | "started" | "ended" | "renamed" | "owner_changed" | "system";
  time: string;
  notes?: string;
}

export interface RoomDetail {
  id: string;
  name: string;
  course?: string;
  owner?: string;
  status: "upcoming" | "live" | "ended";
  isPublic: boolean;
  participants: number;
  capacity: number;
  labels?: string[];
  timeline: TimelineEvent[];
  members: MemberLog[];
  logs: { id: string; message: string; time: string }[];
  features: {
    chat: boolean;
    reaction: boolean;
    attachments: boolean;
    recording: boolean;
    screenShare: boolean;
  };
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: RoomDetail | null;
  onUpdateRoom?: (r: Partial<RoomDetail>) => void;
  onBanUser?: (userId: string, reason?: string, until?: string) => void;
  onExportLogs?: (roomId: string) => void;
  onForceEnd?: (roomId: string) => void;
}

const ViewDetailsModal: React.FC<Props> = ({ open, onOpenChange, room, onUpdateRoom, onBanUser, onExportLogs, onForceEnd }) => {
  const [capacity, setCapacity] = React.useState<number>(room?.capacity ?? 50);
  const [isPublic, setIsPublic] = React.useState<boolean>(room?.isPublic ?? true);
  const [labels, setLabels] = React.useState<string>((room?.labels || []).join(", "));

  React.useEffect(() => {
    if (room) {
      setCapacity(room.capacity);
      setIsPublic(room.isPublic);
      setLabels((room.labels || []).join(", "));
    }
  }, [room]);

  if (!room) return null;

  const handleSave = () => {
    onUpdateRoom?.({ capacity, isPublic, labels: labels.split(",").map(s => s.trim()).filter(Boolean) });
    toast.success("Cập nhật cấu hình phòng (mô phỏng).");
  };

  const handleForceEnd = () => {
    onForceEnd?.(room.id);
    toast.success("Đã kết thúc phòng (mô phỏng).");
  };

  const handleExport = () => {
    onExportLogs?.(room.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{room.name} — Chi tiết</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="mb-3">
              <Label className="text-sm">ID</Label>
              <div className="mt-1 text-sm">{room.id}</div>
            </div>

            <div className="mb-3">
              <Label className="text-sm">Khoá/Bài học</Label>
              <div className="mt-1 text-sm">{room.course ?? "-"}</div>
            </div>

            <div className="mb-3">
              <Label className="text-sm">Chủ phòng</Label>
              <div className="mt-1 text-sm">{room.owner ?? "-"}</div>
            </div>

            <div className="mb-3">
              <Label className="text-sm">Trạng thái</Label>
              <div className="mt-1 text-sm">{room.status}</div>
            </div>

            <div className="mb-3">
              <Label className="text-sm">Số người</Label>
              <div className="mt-1 text-sm">{room.participants} / {room.capacity}</div>
            </div>

            <div className="mb-3">
              <Label className="text-sm">Nhãn</Label>
              <div className="mt-1 text-sm">{(room.labels || []).join(", ") || "-"}</div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleForceEnd}>
                Kết thúc cưỡng bức
              </Button>
              <Button variant="outline" onClick={handleExport}>
                Xuất logs
              </Button>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div>
              <Label className="text-sm">Timeline</Label>
              <div className="mt-2 space-y-2 border rounded p-3 bg-gray-50 dark:bg-gray-900">
                {room.timeline.map(ev => (
                  <div key={ev.id} className="flex items-start gap-3">
                    <div className="text-xs text-muted-foreground w-28">{ev.time}</div>
                    <div>
                      <div className="text-sm font-medium">{ev.type}</div>
                      {ev.notes && <div className="text-sm text-muted-foreground">{ev.notes}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Thành viên</Label>
                <div className="mt-2 border rounded p-3 max-h-48 overflow-y-auto bg-white dark:bg-gray-800">
                  {room.members.map(m => (
                    <div key={m.id} className="flex items-center justify-between gap-2 py-2 border-b">
                      <div>
                        <div className="font-medium">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.role} • joined {m.joinedAt}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => { toast.info(`Mute/Warning to ${m.name} (demo)`); }}>
                          !
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => { onBanUser?.(m.id, "Violation (demo)", undefined); toast.success("Đã ban (mô phỏng)."); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm">System logs</Label>
                <div className="mt-2 border rounded p-3 max-h-48 overflow-y-auto bg-white dark:bg-gray-800">
                  {room.logs.slice().reverse().map(l => (
                    <div key={l.id} className="text-sm text-muted-foreground py-1 border-b">
                      <div className="text-xs">{l.time}</div>
                      <div>{l.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t pt-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                  <Label className="text-sm">Sức chứa tối đa</Label>
                  <Input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value || 0))} />
                </div>

                <div>
                  <Label className="text-sm">Công khai</Label>
                  <div className="mt-2">
                    <Switch checked={isPublic} onCheckedChange={(v) => setIsPublic(!!v)} />
                  </div>
                </div>

                <div>
                  <Label className="text-sm">Nhãn (comma)</Label>
                  <Input value={labels} onChange={(e) => setLabels(e.target.value)} />
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={() => { setCapacity(room.capacity); setIsPublic(room.isPublic); setLabels((room.labels || []).join(", ")); toast.info("Đã hoàn tác (demo)"); }}>
                  Hoàn tác
                </Button>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>
                  Lưu cấu hình
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDetailsModal;