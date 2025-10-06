import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import DateRangePicker from "@/components/DateRangePicker";
import { Search, Eye, Ban, ShieldAlert, Settings, XCircle, Play, Pause, FileDown, Users, MessageSquare, Clock, Tag, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

type RoomStatus = "upcoming" | "live" | "ended";
type RoomPrivacy = "public" | "private";

interface Room {
  id: string;
  name: string;
  course?: string; // linked course
  lesson?: string; // linked lesson
  owner: string;
  status: RoomStatus;
  privacy: RoomPrivacy;
  participants: number;
  violated?: boolean;
  createdAt?: string;
  startedAt?: string;
  endedAt?: string;
  features: {
    chat: boolean;
    reactions: boolean;
    attachments: boolean;
    recording: boolean;
    screenShare: boolean;
  };
  tags?: string[];
}

interface Participant {
  id: string;
  name: string;
  role: "member" | "moderator";
  joinedAt: string;
  leftAt?: string;
  totalMinutes?: number;
  muted?: boolean;
  banned?: boolean;
  messages?: number;
  files?: number;
  reactions?: number;
}

interface FlaggedMessage {
  id: string;
  roomId: string;
  user: string;
  content: string;
  reason: string; // AI/regex/keyword
  createdAt: string;
  status?: "queued" | "approved" | "hidden" | "deleted" | "warned";
}

const mockRooms: Room[] = [
  {
    id: "RM-1001",
    name: "Ôn đề 2025 – Hình học",
    course: "Toán 12",
    lesson: "Bài 10",
    owner: "GV. Đạt",
    status: "live",
    privacy: "public",
    participants: 42,
    violated: false,
    createdAt: "2025-08-29 09:00",
    startedAt: "2025-08-29 09:30",
    features: { chat: true, reactions: true, attachments: true, recording: true, screenShare: true },
    tags: ["Hình học", "Đề 2025"],
  },
  {
    id: "RM-1002",
    name: "Tổng ôn – Đại số",
    course: "Toán 11",
    lesson: "Bài 5",
    owner: "GV. Lan",
    status: "upcoming",
    privacy: "private",
    participants: 0,
    violated: false,
    createdAt: "2025-08-28 20:15",
    features: { chat: true, reactions: true, attachments: false, recording: false, screenShare: false },
    tags: ["Đại số"],
  },
  {
    id: "RM-1003",
    name: "Phân tích đề HSA – Khoa học",
    course: "HSA",
    lesson: "Mock Test #3",
    owner: "GV. Nam",
    status: "ended",
    privacy: "public",
    participants: 128,
    violated: true,
    createdAt: "2025-08-27 18:00",
    startedAt: "2025-08-27 18:30",
    endedAt: "2025-08-27 19:30",
    features: { chat: true, reactions: true, attachments: true, recording: true, screenShare: true },
    tags: ["HSA", "Khoa học"],
  },
];

const mockParticipants: Participant[] = [
  { id: "U-1", name: "Minh", role: "moderator", joinedAt: "2025-08-29 09:30", totalMinutes: 60, messages: 12, files: 1, reactions: 8 },
  { id: "U-2", name: "An", role: "member", joinedAt: "2025-08-29 09:35", leftAt: "2025-08-29 10:15", totalMinutes: 40, messages: 5, reactions: 3 },
  { id: "U-3", name: "Linh", role: "member", joinedAt: "2025-08-29 09:40", totalMinutes: 55, messages: 9, files: 2, reactions: 7 },
];

const mockQueue: FlaggedMessage[] = [
  { id: "F-901", roomId: "RM-1003", user: "An", content: "link spam http://...", reason: "keyword", createdAt: "2025-08-27 18:45", status: "queued" },
  { id: "F-902", roomId: "RM-1003", user: "Linh", content: "ngôn ngữ độc hại ...", reason: "AI", createdAt: "2025-08-27 18:46", status: "queued" },
];

const courses = ["Tất cả", "Toán 12", "Toán 11", "HSA"];
const owners = ["Tất cả", "GV. Đạt", "GV. Lan", "GV. Nam"];
const statuses: RoomStatus[] = ["upcoming", "live", "ended"];
const privacies: RoomPrivacy[] = ["public", "private"];

const ViewManagement: React.FC = () => {
  // Filters
  const [query, setQuery] = React.useState("");
  const [dateRange, setDateRange] = React.useState<{ from?: Date; to?: Date } | undefined>(undefined);
  const [courseFilter, setCourseFilter] = React.useState<string>("Tất cả");
  const [ownerFilter, setOwnerFilter] = React.useState<string>("Tất cả");
  const [statusFilter, setStatusFilter] = React.useState<string>("Tất cả");
  const [privacyFilter, setPrivacyFilter] = React.useState<string>("Tất cả");
  const [violatedOnly, setViolatedOnly] = React.useState<boolean>(false);
  const [minParticipants, setMinParticipants] = React.useState<number | "">("");
  const [maxParticipants, setMaxParticipants] = React.useState<number | "">("");

  // Rooms state
  const [rooms, setRooms] = React.useState<Room[]>(mockRooms);
  const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);
  const [roomDetailOpen, setRoomDetailOpen] = React.useState<boolean>(false);

  // Moderation Center
  const [queue, setQueue] = React.useState<FlaggedMessage[]>(mockQueue);
  const [queueQuery, setQueueQuery] = React.useState<string>("");

  // Stats (computed)
  const stats = React.useMemo(() => {
    const total = rooms.length;
    const live = rooms.filter((r) => r.status === "live").length;
    const upcoming = rooms.filter((r) => r.status === "upcoming").length;
    const ended = rooms.filter((r) => r.status === "ended").length;
    const totalParticipants = rooms.reduce((acc, r) => acc + r.participants, 0);
    const violated = rooms.filter((r) => r.violated).length;
    return { total, live, upcoming, ended, totalParticipants, violated };
  }, [rooms]);

  // Filtering
  const filteredRooms = React.useMemo(() => {
    return rooms.filter((r) => {
      const q = query.trim().toLowerCase();
      if (q) {
        const inText =
          r.id.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          (r.course || "").toLowerCase().includes(q) ||
          (r.lesson || "").toLowerCase().includes(q) ||
          r.owner.toLowerCase().includes(q);
        if (!inText) return false;
      }
      if (courseFilter !== "Tất cả" && r.course !== courseFilter) return false;
      if (ownerFilter !== "Tất cả" && r.owner !== ownerFilter) return false;
      if (statusFilter !== "Tất cả" && r.status !== statusFilter) return false;
      if (privacyFilter !== "Tất cả" && r.privacy !== privacyFilter) return false;
      if (violatedOnly && !r.violated) return false;

      if (dateRange?.from) {
        const t = new Date(r.createdAt || r.startedAt || r.endedAt || Date.now());
        if (t < dateRange.from) return false;
      }
      if (dateRange?.to) {
        const t = new Date(r.createdAt || r.startedAt || r.endedAt || Date.now());
        const toEnd = new Date(dateRange.to);
        toEnd.setHours(23, 59, 59, 999);
        if (t > toEnd) return false;
      }

      if (minParticipants !== "" && r.participants < Number(minParticipants)) return false;
      if (maxParticipants !== "" && r.participants > Number(maxParticipants)) return false;

      return true;
    });
  }, [rooms, query, courseFilter, ownerFilter, statusFilter, privacyFilter, violatedOnly, dateRange, minParticipants, maxParticipants]);

  // Actions - Room controls
  const openDetail = (room: Room) => {
    setSelectedRoom(room);
    setRoomDetailOpen(true);
  };

  const toggleOpenClose = (roomId: string) => {
    setRooms((prev) =>
      prev.map((r) =>
        r.id === roomId ? { ...r, privacy: r.privacy === "public" ? "private" : "public" } : r
      )
    );
    toast.success("Đã cập nhật chế độ công khai/phòng.");
  };

  const forceEnd = (roomId: string) => {
    setRooms((prev) => prev.map((r) => (r.id === roomId ? { ...r, status: "ended", endedAt: new Date().toLocaleString() } : r)));
    toast.success("Đã kết thúc cưỡng bức phòng.");
  };

  const updateFeatures = (roomId: string, features: Partial<Room["features"]>) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === roomId ? { ...r, features: { ...r.features, ...features } } : r))
    );
    toast.success("Đã cập nhật tính năng phòng.");
  };

  const assignModerator = (roomId: string, userName: string) => {
    toast.success(`Đã chỉ định moderator: ${userName} cho phòng ${roomId} (demo).`);
  };

  // Moderation actions
  const approveMessage = (id: string) => {
    setQueue((prev) => prev.map((m) => (m.id === id ? { ...m, status: "approved" } : m)));
    toast.success("Đã duyệt tin nhắn.");
  };
  const hideMessage = (id: string) => {
    setQueue((prev) => prev.map((m) => (m.id === id ? { ...m, status: "hidden" } : m)));
    toast.success("Đã ẩn tin nhắn.");
  };
  const deleteMessage = (id: string) => {
    setQueue((prev) => prev.map((m) => (m.id === id ? { ...m, status: "deleted" } : m)));
    toast.success("Đã xoá tin nhắn.");
  };
  const warnUser = (id: string) => {
    setQueue((prev) => prev.map((m) => (m.id === id ? { ...m, status: "warned" } : m)));
    toast.success("Đã cảnh cáo người dùng.");
  };

  // Export CSV
  const downloadCSV = (filename: string, rows: string[]) => {
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportRooms = () => {
    const header = "id,name,course,lesson,owner,status,privacy,participants,violated,createdAt,startedAt,endedAt";
    const lines = filteredRooms.map((r) =>
      [
        r.id,
        `"${r.name.replace(/"/g, '""')}"`,
        r.course || "",
        r.lesson || "",
        r.owner,
        r.status,
        r.privacy,
        r.participants,
        r.violated ? "1" : "0",
        r.createdAt || "",
        r.startedAt || "",
        r.endedAt || "",
      ].join(",")
    );
    downloadCSV("rooms.csv", [header, ...lines]);
    toast.success("Đã xuất danh sách phòng (CSV).");
  };

  const exportMessages = () => {
    const header = "id,roomId,user,reason,createdAt,status,content";
    const filtered = queue.filter((m) => {
      const q = queueQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        m.roomId.toLowerCase().includes(q) ||
        m.user.toLowerCase().includes(q) ||
        m.content.toLowerCase().includes(q) ||
        m.reason.toLowerCase().includes(q)
      );
    });
    const lines = filtered.map((m) =>
      [
        m.id,
        m.roomId,
        m.user,
        m.reason,
        m.createdAt,
        m.status || "",
        `"${m.content.replace(/"/g, '""')}"`,
      ].join(",")
    );
    downloadCSV("flagged_messages.csv", [header, ...lines]);
    toast.success("Đã xuất tin nhắn bị cờ đỏ (CSV).");
  };

  // Schedule (upcoming)
  const upcomingRooms = React.useMemo(() => rooms.filter((r) => r.status === "upcoming"), [rooms]);

  return (
    <Layout headerTitle="Quản lý xem chung">
      <div className="flex flex-col gap-6 w-full overflow-x-hidden">
        {/* Quick stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Tổng số phòng</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.total}</div><p className="text-xs text-muted-foreground">Tất cả trạng thái</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Đang diễn ra</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.live}</div><p className="text-xs text-muted-foreground">Live rooms</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Sắp diễn ra</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.upcoming}</div><p className="text-xs text-muted-foreground">Upcoming</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Đã kết thúc</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.ended}</div><p className="text-xs text-muted-foreground">Ended</p></CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Người tham gia</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.totalParticipants}</div><p className="text-xs text-muted-foreground">Tổng cộng</p></CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader><CardTitle>Bộ lọc</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_220px_220px_180px_180px_160px_160px] gap-3 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10" placeholder="Tìm theo ID, tên phòng, khoá học, bài học, chủ phòng..." value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <Select value={courseFilter} onValueChange={setCourseFilter}>
                <SelectTrigger><SelectValue placeholder="Khoá học" /></SelectTrigger>
                <SelectContent>{courses.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                <SelectTrigger><SelectValue placeholder="Giáo viên/Chủ phòng" /></SelectTrigger>
                <SelectContent>{owners.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tất cả">Tất cả</SelectItem>
                  {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={privacyFilter} onValueChange={setPrivacyFilter}>
                <SelectTrigger><SelectValue placeholder="Công khai/Riêng tư" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tất cả">Tất cả</SelectItem>
                  {privacies.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                <Switch checked={violatedOnly} onCheckedChange={(v) => setViolatedOnly(!!v)} />
                <span className="text-sm">Chỉ hiển thị có vi phạm</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" min={0} value={minParticipants === "" ? "" : String(minParticipants)} onChange={(e) => setMinParticipants(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Min người" />
                <Input type="number" min={0} value={maxParticipants === "" ? "" : String(maxParticipants)} onChange={(e) => setMaxParticipants(e.target.value === "" ? "" : Number(e.target.value))} placeholder="Max người" />
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <DateRangePicker date={dateRange} setDate={setDateRange} />
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => toast.success("Đã áp dụng bộ lọc (demo).")}>Lọc kết quả</Button>
              <Button variant="outline" onClick={exportRooms} className="flex items-center gap-2"><FileDown className="h-4 w-4" /> Xuất phòng (CSV)</Button>
            </div>
          </CardContent>
        </Card>

        {/* Rooms table */}
        <Card>
          <CardHeader><CardTitle>Danh sách phòng</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tên phòng</TableHead>
                  <TableHead>Bài học / Khoá</TableHead>
                  <TableHead>Chủ phòng</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Công khai</TableHead>
                  <TableHead>Tham gia</TableHead>
                  <TableHead>Vi phạm</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.length === 0 ? (
                  <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">Không có phòng phù hợp.</TableCell></TableRow>
                ) : (
                  filteredRooms.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.id}</TableCell>
                      <TableCell>{r.name}</TableCell>
                      <TableCell>{r.lesson ? `${r.lesson}` : "-"}{r.course ? ` / ${r.course}` : ""}</TableCell>
                      <TableCell>{r.owner}</TableCell>
                      <TableCell>{r.status === "upcoming" ? "Sắp diễn ra" : r.status === "live" ? "Đang diễn ra" : "Đã kết thúc"}</TableCell>
                      <TableCell>{r.privacy === "public" ? "Công khai" : "Riêng tư"}</TableCell>
                      <TableCell>{r.participants}</TableCell>
                      <TableCell>{r.violated ? "Có" : "Không"}</TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button variant="ghost" size="icon" title="Xem chi tiết" onClick={() => openDetail(r)}><Eye className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" title="Đóng/Mở phòng" onClick={() => toggleOpenClose(r.id)}>{r.privacy === "public" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}</Button>
                          {r.status !== "ended" && (
                            <Button variant="ghost" size="icon" title="Kết thúc cưỡng bức" onClick={() => forceEnd(r.id)} className="text-red-600">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" title="Chỉ định moderator" onClick={() => assignModerator(r.id, "Minh")}><Users className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" title="Cấu hình" onClick={() => updateFeatures(r.id, { recording: !(r.features?.recording ?? false) })}><Settings className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Room detail dialog */}
        <Dialog open={roomDetailOpen} onOpenChange={setRoomDetailOpen}>
          <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết phòng {selectedRoom?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Timeline */}
              <Card>
                <CardHeader><CardTitle>Timeline</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> Tạo: {selectedRoom?.createdAt || "-"}</div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> Bắt đầu: {selectedRoom?.startedAt || "-"}</div>
                    <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> Kết thúc: {selectedRoom?.endedAt || "-"}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card>
                <CardHeader><CardTitle>Tính năng phòng</CardTitle></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedRoom && (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Chat</span>
                          <Switch checked={selectedRoom.features.chat} onCheckedChange={(v) => updateFeatures(selectedRoom.id, { chat: !!v })} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Reactions</span>
                          <Switch checked={selectedRoom.features.reactions} onCheckedChange={(v) => updateFeatures(selectedRoom.id, { reactions: !!v })} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Đính kèm</span>
                          <Switch checked={selectedRoom.features.attachments} onCheckedChange={(v) => updateFeatures(selectedRoom.id, { attachments: !!v })} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Ghi hình/Log</span>
                          <Switch checked={selectedRoom.features.recording} onCheckedChange={(v) => updateFeatures(selectedRoom.id, { recording: !!v })} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">Chia sẻ màn hình</span>
                          <Switch checked={selectedRoom.features.screenShare} onCheckedChange={(v) => updateFeatures(selectedRoom.id, { screenShare: !!v })} />
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          <span className="text-sm">{(selectedRoom.tags || []).join(", ") || "—"}</span>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Participants */}
              <Card>
                <CardHeader><CardTitle>Thành viên</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="text-sm text-orange-600 border-b">
                          <th className="p-3 text-left">Tên</th>
                          <th className="p-3 text-left">Vai trò</th>
                          <th className="p-3 text-left">Join</th>
                          <th className="p-3 text-left">Leave</th>
                          <th className="p-3 text-left">Thời lượng</th>
                          <th className="p-3 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockParticipants.map((p) => (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="p-3">{p.name}</td>
                            <td className="p-3">{p.role === "moderator" ? "Moderator" : "Member"}</td>
                            <td className="p-3">{p.joinedAt}</td>
                            <td className="p-3">{p.leftAt || "-"}</td>
                            <td className="p-3">{p.totalMinutes ?? "-"}</td>
                            <td className="p-3 text-right">
                              <div className="inline-flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => toast.success(`Đã chuyển vai trò cho ${p.name} (demo).`)}>Chuyển vai trò</Button>
                                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => toast.success(`Đã cảnh cáo ${p.name} (demo).`)}>Cảnh cáo</Button>
                                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => toast.success(`Đã ban ${p.name} (demo).`)}><Ban className="h-4 w-4" /> Ban</Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRoomDetailOpen(false)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Moderation Center */}
        <Card>
          <CardHeader><CardTitle>Trung tâm Moderation</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-3">
              <Input placeholder="Tìm theo phòng, người dùng, từ khoá, lý do..." value={queueQuery} onChange={(e) => setQueueQuery(e.target.value)} />
              <Button variant="outline" onClick={exportMessages} className="flex items-center gap-2"><FileDown className="h-4 w-4" /> Xuất tin nhắn (CSV)</Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-sm text-orange-600 border-b">
                    <th className="p-3 text-left">Phòng</th>
                    <th className="p-3 text-left">Người dùng</th>
                    <th className="p-3 text-left">Lý do</th>
                    <th className="p-3 text-left">Thời gian</th>
                    <th className="p-3 text-left">Nội dung</th>
                    <th className="p-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {queue
                    .filter((m) => {
                      const q = queueQuery.trim().toLowerCase();
                      if (!q) return true;
                      return (
                        m.roomId.toLowerCase().includes(q) ||
                        m.user.toLowerCase().includes(q) ||
                        m.content.toLowerCase().includes(q) ||
                        m.reason.toLowerCase().includes(q)
                      );
                    })
                    .map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50">
                        <td className="p-3">{m.roomId}</td>
                        <td className="p-3">{m.user}</td>
                        <td className="p-3">{m.reason}</td>
                        <td className="p-3">{m.createdAt}</td>
                        <td className="p-3">{m.content}</td>
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => approveMessage(m.id)}>Duyệt</Button>
                            <Button variant="ghost" size="sm" onClick={() => hideMessage(m.id)}>Ẩn</Button>
                            <Button variant="ghost" size="sm" className="text-red-600" onClick={() => deleteMessage(m.id)}>Xoá</Button>
                            <Button variant="outline" size="sm" onClick={() => warnUser(m.id)}><AlertTriangle className="h-4 w-4" /> Cảnh cáo</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader><CardTitle>Lịch phòng sắp diễn ra</CardTitle></CardHeader>
          <CardContent>
            {upcomingRooms.length === 0 ? (
              <div className="text-sm text-muted-foreground">Không có phòng sắp diễn ra.</div>
            ) : (
              <div className="space-y-2">
                {upcomingRooms.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 border rounded-md bg-white dark:bg-gray-800">
                    <div>
                      <div className="font-medium">{r.name}</div>
                      <div className="text-sm text-muted-foreground">{r.course ? `Khoá: ${r.course}` : ""}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{r.owner}</span>
                      <Button variant="outline" size="sm" onClick={() => toast.success("Đã nhắc việc (demo).")}>Nhắc việc</Button>
                      <Button className="bg-orange-500 hover:bg-orange-600 text-white" size="sm" onClick={() => toast.success("Đăng lịch (demo).")}>Đăng lịch</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <MadeWithDyad />
    </Layout>
  );
};

export default ViewManagement;