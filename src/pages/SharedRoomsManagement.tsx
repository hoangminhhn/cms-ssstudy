"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/DateRangePicker";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trash2, User, Clock, Eye, X, Download } from "lucide-react";

// Types
type RoomStatus = "upcoming" | "live" | "ended";
type Privacy = "public" | "private";

interface Member {
  id: string;
  name: string;
  role: "owner" | "moderator" | "member";
  joinedAt: string;
  leftAt?: string | null;
  totalMs: number; // total ms in room
}

interface Room {
  id: string;
  name: string;
  lesson: string;
  owner: string;
  status: RoomStatus;
  privacy: Privacy;
  participants: number;
  maxParticipants: number;
  flagged: boolean;
  createdAt: string;
  startAt?: string | null;
  endAt?: string | null;
  labels?: string[];
  timeline?: { time: string; event: string }[];
  members?: Member[];
  logs?: { time: string; message: string }[];
}

// Mock data generator
const now = () => new Date().toISOString();
const sampleRooms: Room[] = [
  {
    id: "R-1001",
    name: "Ôn hình học - Buổi 1",
    lesson: "Hình học - Khóa Toán 12",
    owner: "Thầy A",
    status: "upcoming",
    privacy: "public",
    participants: 3,
    maxParticipants: 100,
    flagged: false,
    createdAt: now(),
    startAt: null,
    endAt: null,
    labels: ["Ôn đề 2025", "Hình học"],
    timeline: [{ time: now(), event: "created" }],
    members: [
      { id: "u1", name: "Nguyễn A", role: "owner", joinedAt: now(), totalMs: 0 },
      { id: "u2", name: "Học sinh B", role: "member", joinedAt: now(), totalMs: 0 },
    ],
    logs: [{ time: now(), message: "Room created" }],
  },
  {
    id: "R-1002",
    name: "Đề thử HSA - Live",
    lesson: "Ngân hàng đề - HSA",
    owner: "Cô B",
    status: "live",
    privacy: "private",
    participants: 42,
    maxParticipants: 50,
    flagged: true,
    createdAt: now(),
    startAt: now(),
    endAt: null,
    labels: ["HSA", "Thi thử"],
    timeline: [{ time: now(), event: "created" }, { time: now(), event: "started" }],
    members: [
      { id: "u10", name: "Alice", role: "owner", joinedAt: now(), totalMs: 1000 * 60 * 20 },
      { id: "u11", name: "Bob", role: "moderator", joinedAt: now(), totalMs: 1000 * 60 * 10 },
    ],
    logs: [{ time: now(), message: "Started streaming" }],
  },
  {
    id: "R-1003",
    name: "Ôn luyện - Kết thúc",
    lesson: "Khóa tổng ôn",
    owner: "Thầy C",
    status: "ended",
    privacy: "public",
    participants: 0,
    maxParticipants: 200,
    flagged: false,
    createdAt: now(),
    startAt: now(),
    endAt: now(),
    labels: ["Tổng ôn"],
    timeline: [{ time: now(), event: "created" }, { time: now(), event: "started" }, { time: now(), event: "ended" }],
    members: [
      { id: "u20", name: "Học sinh X", role: "member", joinedAt: now(), leftAt: now(), totalMs: 1000 * 60 * 60 },
    ],
    logs: [{ time: now(), message: "Ended by host" }],
  },
];

const format = (iso?: string) => (iso ? new Date(iso).toLocaleString() : "-");

// Subcomponents: Detail modal, Ban modal, Moderation modal
function RoomDetailModal({
  room,
  open,
  onClose,
  onUpdateRoom,
  onForceEnd,
}: {
  room: Room | null;
  open: boolean;
  onClose: () => void;
  onUpdateRoom: (r: Room) => void;
  onForceEnd: (id: string) => void;
}) {
  const [local, setLocal] = React.useState<Room | null>(room);

  React.useEffect(() => setLocal(room), [room]);

  if (!local) return null;

  const toggleOpen = () => {
    const updated = { ...local };
    if (updated.status === "live") updated.status = "ended";
    else if (updated.status === "ended") updated.status = "upcoming";
    else updated.status = "live";
    setLocal(updated);
    onUpdateRoom(updated);
    toast.success("Đã cập nhật trạng thái phòng (mô phỏng).");
  };

  const handleChangeOwner = (newOwner: string) => {
    const updated = { ...local, owner: newOwner };
    setLocal(updated);
    onUpdateRoom(updated);
    toast.success(`Đã chuyển chủ phòng cho ${newOwner} (mô phỏng).`);
  };

  const handleAdjustCapacity = (v: number) => {
    const updated = { ...local, maxParticipants: v };
    setLocal(updated);
    onUpdateRoom(updated);
    toast.success("Đã thay đổi sức chứa (mô phỏng).");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-4xl w-full">
        <DialogHeader>
          <DialogTitle>Chi tiết phòng: {local.name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-2">
          <div className="md:col-span-2 space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {(local.timeline || []).map((t, i) => (
                    <li key={i} className="text-sm">
                      <strong>{format(t.time)}</strong> — {t.event}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Members ({local.members?.length ?? 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-muted-foreground border-b">
                      <th>Người</th>
                      <th>Vai trò</th>
                      <th>Join</th>
                      <th>Leave</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(local.members || []).map((m) => (
                      <tr key={m.id} className="border-b">
                        <td>{m.name}</td>
                        <td className="capitalize">{m.role}</td>
                        <td>{format(m.joinedAt)}</td>
                        <td>{m.leftAt ? format(m.leftAt) : "-"}</td>
                        <td>{Math.round(m.totalMs / 60000)} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1">
                  {(local.logs || []).map((l, i) => (
                    <li key={i}>
                      <strong>{format(l.time)}</strong> — {l.message}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-col gap-2">
                  <Button onClick={toggleOpen}>{local.status === "live" ? "Đóng phòng" : "Mở phòng"}</Button>
                  <Button variant="destructive" onClick={() => { onForceEnd(local.id); onClose(); }}>Kết thúc cưỡng bức</Button>

                  <div>
                    <Label className="text-sm">Chuyển chủ phòng</Label>
                    <InputInlineChange onConfirm={(v) => handleChangeOwner(v)} placeholder={local.owner} />
                  </div>

                  <div>
                    <Label className="text-sm">Sức chứa tối đa</Label>
                    <input
                      type="number"
                      defaultValue={local.maxParticipants}
                      onBlur={(e) => handleAdjustCapacity(Number(e.target.value || local.maxParticipants))}
                      className="w-full border rounded px-2 py-1"
                      min={1}
                    />
                  </div>

                  <div>
                    <Label className="text-sm">Public / Private</Label>
                    <div className="pt-2">
                      <Switch checked={local.privacy === "public"} onCheckedChange={(v) => {
                        const updated = { ...local, privacy: v ? "public" : "private" };
                        setLocal(updated);
                        onUpdateRoom(updated);
                        toast.success("Đã cập nhật quyền truy cập (mô phỏng).");
                      }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Labels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(local.labels || []).map((lab, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">{lab}</span>
                  ))}
                </div>
                <div className="mt-2">
                  <Label className="sr-only">Add label</Label>
                  <Input onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const v = (e.target as HTMLInputElement).value.trim();
                      if (!v) return;
                      const updated = { ...local, labels: [...(local.labels || []), v] };
                      setLocal(updated); onUpdateRoom(updated); (e.target as HTMLInputElement).value = "";
                    }
                  }} placeholder="Enter to add label" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export / Webhook</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={() => exportRoomCSV(local)}>Xuất CSV phòng</Button>
                <Button onClick={() => toast.info("Webhook (read-only) enabled (mô phỏng).")}>Enable Webhook (demo)</Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// small inline input + confirm button
function InputInlineChange({ onConfirm, placeholder }: { onConfirm: (v: string) => void; placeholder?: string }) {
  const [val, setVal] = React.useState("");
  return (
    <div className="flex gap-2">
      <input className="flex-1 border rounded px-2 py-1" value={val} onChange={(e) => setVal(e.target.value)} placeholder={placeholder} />
      <Button onClick={() => { if (val.trim()) { onConfirm(val.trim()); setVal(""); } }}>Chuyển</Button>
    </div>
  );
}

function exportRoomCSV(room: Room) {
  const headers = ["id", "name", "lesson", "owner", "status", "privacy", "participants", "maxParticipants", "labels"];
  const row = [
    room.id,
    `"${room.name}"`,
    `"${room.lesson}"`,
    room.owner,
    room.status,
    room.privacy,
    String(room.participants),
    String(room.maxParticipants),
    `"${(room.labels || []).join(";")}"`
  ];
  const csv = [headers.join(","), row.join(",")].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${room.id}_room.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  toast.success("CSV exported (demo).");
}

// Moderation modal
function ModerationQueueModal({ open, onClose, queue, onAction }: {
  open: boolean; onClose: () => void; queue: { id: string; roomId: string; user: string; text: string; flaggedAt: string }[]; onAction: (id: string, action: "hide" | "delete" | "warn") => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Moderation Queue ({queue.length})</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 p-2">
          {queue.length === 0 ? <div className="text-sm text-muted-foreground">Không có tin nhắn bị cờ.</div> : queue.map(q => (
            <div key={q.id} className="border rounded p-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm"><strong>{q.user}</strong> in <span className="font-medium">{q.roomId}</span> — <span className="text-xs text-muted-foreground">{new Date(q.flaggedAt).toLocaleString()}</span></div>
                  <div className="mt-2">{q.text}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button onClick={() => onAction(q.id, "hide")} className="bg-yellow-500 text-white">Ẩn</Button>
                  <Button onClick={() => onAction(q.id, "delete")} className="bg-red-600 text-white">Xóa</Button>
                  <Button onClick={() => onAction(q.id, "warn")} variant="outline">Cảnh cáo</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function SharedRoomsManagement() {
  const [rooms, setRooms] = React.useState<Room[]>(sampleRooms);
  const [filters, setFilters] = React.useState({
    dateRange: undefined as { from?: Date; to?: Date } | undefined,
    lesson: "",
    owner: "",
    status: "" as "" | RoomStatus,
    minParticipants: "" as string | number,
    flaggedOnly: false,
  });

  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);

  const [moderationOpen, setModerationOpen] = React.useState(false);
  const [modQueue, setModQueue] = React.useState<{ id: string; roomId: string; user: string; text: string; flaggedAt: string }[]>([
    { id: "m1", roomId: "R-1002", user: "User123", text: "This looks like spam http://bad.link", flaggedAt: new Date().toISOString() }
  ]);

  const onOpenDetail = (r: Room) => {
    setSelectedRoom(r);
    setDetailOpen(true);
  };

  const onUpdateRoom = (updated: Room) => {
    setRooms(prev => prev.map(r => (r.id === updated.id ? updated : r)));
  };

  const onForceEnd = (id: string) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, status: "ended", endAt: new Date().toISOString(), logs: [...(r.logs||[]), { time: new Date().toISOString(), message: "Force ended by admin" }] } : r));
    toast.success("Phòng đã bị kết thúc cưỡng bức (mô phỏng).");
  };

  const applyFilters = (r: Room) => {
    // text query
    if (query && !(r.name.toLowerCase().includes(query.toLowerCase()) || r.id.toLowerCase().includes(query.toLowerCase()))) return false;
    const f = filters;
    if (f.lesson && !r.lesson.toLowerCase().includes(String(f.lesson).toLowerCase())) return false;
    if (f.owner && !r.owner.toLowerCase().includes(String(f.owner).toLowerCase())) return false;
    if (f.status && r.status !== f.status) return false;
    if (f.flaggedOnly && !r.flagged) return false;
    if (f.minParticipants) {
      const min = Number(f.minParticipants || 0);
      if (isFinite(min) && r.participants < min) return false;
    }
    if (f.dateRange?.from) {
      const from = f.dateRange.from;
      const created = new Date(r.createdAt);
      if (created < from) return false;
    }
    if (f.dateRange?.to) {
      const to = new Date(f.dateRange.to!);
      to.setHours(23,59,59,999);
      const created = new Date(r.createdAt);
      if (created > to) return false;
    }
    return true;
  };

  const filtered = rooms.filter(applyFilters);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);

  const handleBan = (roomId: string, memberId: string, reason?: string, until?: string) => {
    // simulate: remove member
    setRooms(prev => prev.map(r => r.id === roomId ? { ...r, members: (r.members||[]).filter(m => m.id !== memberId), logs: [...(r.logs||[]), { time: new Date().toISOString(), message: `Banned ${memberId} (${reason || "no reason"}) until ${until || "n/a"}` }] } : r));
    toast.success("Đã ban thành viên (mô phỏng).");
  };

  const handleModAction = (id: string, action: "hide" | "delete" | "warn") => {
    setModQueue(prev => prev.filter(q => q.id !== id));
    toast.success(`Action '${action}' applied to moderation item ${id} (mô phỏng).`);
  };

  const handleExportAllRooms = () => {
    // create CSV of all filtered rooms
    const headers = ["id", "name", "lesson", "owner", "status", "privacy", "participants", "maxParticipants", "flagged"];
    const rows = filtered.map(r => [
      r.id,
      `"${r.name.replace(/"/g,'""')}"`,
      `"${r.lesson.replace(/"/g,'""')}"`,
      r.owner,
      r.status,
      r.privacy,
      String(r.participants),
      String(r.maxParticipants),
      r.flagged ? "1" : "0",
    ].join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shared_rooms_export_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("Exported CSV (mô phỏng).");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý xem chung</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Top Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="p-3 border rounded">
              <div className="text-sm text-muted-foreground">Tổng phòng</div>
              <div className="text-2xl font-semibold">{rooms.length}</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-sm text-muted-foreground">Phòng đang live</div>
              <div className="text-2xl font-semibold">{rooms.filter(r => r.status === "live").length}</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-sm text-muted-foreground">Tổng người tham gia (ước)</div>
              <div className="text-2xl font-semibold">{rooms.reduce((s, r) => s + r.participants, 0)}</div>
            </div>
            <div className="p-3 border rounded">
              <div className="text-sm text-muted-foreground">Phòng flagged</div>
              <div className="text-2xl font-semibold">{rooms.filter(r => r.flagged).length}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end mb-4">
            <div className="md:col-span-2">
              <Label>Tìm kiếm</Label>
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ID hoặc tên phòng..." />
            </div>

            <div>
              <Label>Khoá học / Bài học</Label>
              <Input value={filters.lesson} onChange={(e) => setFilters(s => ({ ...s, lesson: e.target.value }))} placeholder="Tên khoá/bài" />
            </div>

            <div>
              <Label>Chủ phòng / Giáo viên</Label>
              <Input value={filters.owner} onChange={(e) => setFilters(s => ({ ...s, owner: e.target.value }))} placeholder="Tên chủ phòng" />
            </div>

            <div>
              <Label>Trạng thái</Label>
              <Select value={filters.status || ""} onValueChange={(v) => setFilters(s => ({ ...s, status: (v || "") as any }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tất cả</SelectItem>
                  <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                  <SelectItem value="live">Đang diễn ra</SelectItem>
                  <SelectItem value="ended">Đã kết thúc</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Thời gian</Label>
              <DateRangePicker date={filters.dateRange as any} setDate={(d) => setFilters(s => ({ ...s, dateRange: d }))} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end mb-4">
            <div>
              <Label>Số người >=</Label>
              <Input value={String(filters.minParticipants)} onChange={(e) => setFilters(s => ({ ...s, minParticipants: e.target.value }))} type="number" />
            </div>

            <div>
              <Label>Flagged only</Label>
              <div className="pt-2">
                <Switch checked={filters.flaggedOnly} onCheckedChange={(v) => setFilters(s => ({ ...s, flaggedOnly: !!v }))} />
              </div>
            </div>

            <div className="md:col-span-3 flex items-center gap-2">
              <Button onClick={() => { setPage(1); toast.success("Filters applied (mô phỏng)"); }}>Áp dụng</Button>
              <Button variant="outline" onClick={() => { setFilters({ dateRange: undefined, lesson: "", owner: "", status: "", minParticipants: "", flaggedOnly: false }); setQuery(""); toast.info("Đã reset filters"); }}>Reset</Button>
              <Button className="ml-auto" onClick={() => { setModerationOpen(true); }}>Moderation Queue</Button>
              <Button onClick={handleExportAllRooms}><Download className="mr-2 h-4 w-4" />Export CSV</Button>
            </div>
          </div>

          {/* Rooms table */}
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-orange-600 border-b">
                  <th className="p-3 w-[120px]">ID</th>
                  <th className="p-3">Tên phòng</th>
                  <th className="p-3">Bài học / Khoá</th>
                  <th className="p-3">Chủ phòng</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3">Public</th>
                  <th className="p-3">Participants</th>
                  <th className="p-3">Flagged</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-muted-foreground">Không có phòng phù hợp.</td>
                  </tr>
                ) : pageItems.map(room => (
                  <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-medium">{room.id}</td>
                    <td className="p-3">
                      <button className="text-left text-blue-600 underline" onClick={() => onOpenDetail(room)}>{room.name}</button>
                      <div className="text-xs text-muted-foreground">{room.labels?.join(" • ")}</div>
                    </td>
                    <td className="p-3">{room.lesson}</td>
                    <td className="p-3">{room.owner}</td>
                    <td className="p-3 capitalize">{room.status}</td>
                    <td className="p-3">{room.privacy === "public" ? "Yes" : "No"}</td>
                    <td className="p-3">{room.participants}/{room.maxParticipants}</td>
                    <td className="p-3">{room.flagged ? "⚑" : "-"}</td>
                    <td className="p-3 text-right flex gap-2 justify-end">
                      <Button size="sm" onClick={() => {
                        // toggle open/close
                        const updated = { ...room, status: room.status === "live" ? "ended" : "live", startAt: room.status === "upcoming" ? new Date().toISOString() : room.startAt };
                        onUpdateRoom(room.id, updated);
                        toast.success("Toggled room (mô phỏng).");
                      }}>
                        {room.status === "live" ? "Close" : "Open"}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => { onForceEnd(room.id); }}>Force end</Button>
                      <Button size="sm" onClick={() => onOpenDetail(room)}>Manage</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">Hiển thị {start+1}-{Math.min(start+pageSize, filtered.length)} / {filtered.length}</div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}>‹</button>
              <div className="px-3 py-1 bg-white border rounded">{page}</div>
              <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}>›</button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail modal */}
      <RoomDetailModal room={selectedRoom} open={detailOpen} onClose={() => setDetailOpen(false)} onUpdateRoom={(r)=> setRooms(prev => prev.map(rr => rr.id===r.id ? r : rr))} onForceEnd={onForceEnd} />

      {/* Moderation Modal */}
      <ModerationQueueModal open={moderationOpen} onClose={() => setModerationOpen(false)} queue={modQueue} onAction={handleModAction} />
    </div>
  );
}