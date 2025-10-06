"use client";

import React from "react";
import Layout from "@/components/Layout";
import ViewFilters, { RoomStatus } from "@/components/view-management/ViewFilters";
import ViewList, { Room } from "@/components/view-management/ViewList";
import ViewDetailsModal from "@/components/view-management/ViewDetailsModal";
import ModerationQueue from "@/components/view-management/ModerationQueue";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { toast } from "sonner";

const mockCourses = ["Toán 10", "Toán 11", "Vật lý 12"];
const mockTeachers = ["GV A", "GV B", "GV C"];

function genRoom(i: number): Room {
  const statuses: RoomStatus[] = ["upcoming", "live", "ended", "all"];
  const s = statuses[i % 3] as RoomStatus;
  return {
    id: `R${1000 + i}`,
    name: `Phòng Xem Chung ${i}`,
    course: mockCourses[i % mockCourses.length],
    owner: mockTeachers[i % mockTeachers.length],
    status: s,
    isPublic: i % 2 === 0,
    participants: Math.floor(Math.random() * 120),
    flagged: i % 7 === 0,
    startAt: new Date().toISOString(),
    createdAt: new Date().toLocaleString(),
  };
}

const initialRooms: Room[] = Array.from({ length: 27 }).map((_, i) => genRoom(i));

const ViewManagement: React.FC = () => {
  const [filters, setFilters] = React.useState({});
  const [rooms, setRooms] = React.useState<Room[]>(initialRooms);
  const [page, setPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [selectedRoom, setSelectedRoom] = React.useState<number | null>(null);
  const [modalOpen, setModalOpen] = React.useState(false);

  const [flagged, setFlagged] = React.useState([
    { id: "f1", roomId: "R1000", author: "HS001", content: "Spam link http://...", time: new Date().toLocaleString(), reason: "link" },
    { id: "f2", roomId: "R1003", author: "HS099", content: "Offensive message", time: new Date().toLocaleString(), reason: "abuse" },
  ]);

  const openDetails = (r: Room) => {
    // build mock detail object to pass to modal by id (we store index)
    const idx = rooms.findIndex(x => x.id === r.id);
    if (idx === -1) return;
    setSelectedRoom(idx);
    setModalOpen(true);
  };

  const onToggleOpen = (id: string) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, status: r.status === "live" ? "ended" : "live" } : r));
    toast.success("Đã chuyển trạng thái phòng (mô phỏng).");
  };

  const onForceEnd = (id: string) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, status: "ended" } : r));
    toast.success("Đã force end (mô phỏng).");
  };

  const onUpdateRoom = (partial: Partial<any>) => {
    if (selectedRoom === null) return;
    const id = rooms[selectedRoom].id;
    setRooms(prev => prev.map(r => r.id === id ? { ...r, ...partial } : r));
  };

  const onBanUser = (userId: string, reason?: string, until?: string) => {
    toast.success(`Ban ${userId} (demo): ${reason ?? ""} until ${until ?? "indef"}`);
  };

  const onExportLogs = (roomId: string) => {
    toast.success(`Export logs for ${roomId} (demo)`);
  };

  const onResolveFlag = (id: string, action: "approve" | "hide" | "delete") => {
    setFlagged(prev => prev.filter(f => f.id !== id));
    toast.success(`Flag ${id} ${action} (demo).`);
  };

  // mock detail object for modal
  const detail = React.useMemo(() => {
    if (selectedRoom === null) return undefined;
    const r = rooms[selectedRoom];
    return {
      id: r.id,
      name: r.name,
      course: r.course,
      owner: r.owner,
      status: r.status,
      isPublic: r.isPublic,
      participants: r.participants,
      capacity: Math.max(r.participants, 100),
      labels: ["Ôn đề", "Hình học"],
      timeline: [
        { id: "t1", type: "created", time: r.createdAt, notes: "Tạo phòng" },
        { id: "t2", type: "started", time: new Date().toLocaleString(), notes: "Bắt đầu (demo)" },
      ],
      members: [
        { id: "m1", name: "HS001", role: "member", joinedAt: new Date().toLocaleString(), durationMinutes: 12 },
        { id: "m2", name: "HS002", role: "moderator", joinedAt: new Date().toLocaleString(), durationMinutes: 32 },
      ],
      logs: [
        { id: "l1", message: "User HS001 joined", time: new Date().toLocaleString() },
        { id: "l2", message: "Moderator muted user", time: new Date().toLocaleString() },
      ],
      features: { chat: true, reaction: true, attachments: true, recording: false, screenShare: true },
    };
  }, [selectedRoom, rooms]);

  return (
    <Layout headerTitle="Quản lý xem chung">
      <div className="space-y-4">
        <ViewFilters filters={filters} setFilters={setFilters as any} onApply={() => toast.info("Apply filters (demo)")} courses={mockCourses} teachers={mockTeachers} />

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
          <div>
            <ViewList
              rooms={rooms}
              onView={openDetails}
              onToggleOpen={onToggleOpen}
              onForceEnd={onForceEnd}
              page={page}
              setPage={setPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
            />
          </div>

          <div className="space-y-4">
            <ModerationQueue items={flagged} onResolve={onResolveFlag} />
            <div className="border rounded p-4 bg-white dark:bg-gray-800">
              <h3 className="font-semibold mb-2">Quick stats (demo)</h3>
              <div className="text-sm text-muted-foreground">Phòng hiện có: {rooms.length}</div>
              <div className="text-sm text-muted-foreground">Phòng flagged: {flagged.length}</div>
            </div>
          </div>
        </div>

        <ViewDetailsModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          room={detail as any}
          onUpdateRoom={onUpdateRoom}
          onBanUser={onBanUser}
          onExportLogs={onExportLogs}
          onForceEnd={onForceEnd}
        />
      </div>

      <MadeWithDyad />
    </Layout>
  );
};

export default ViewManagement;