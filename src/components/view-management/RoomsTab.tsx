"use client";

import React from "react";
import RoomsFilters from "./RoomsFilters";
import RoomsTable from "./RoomsTable";
import { toast } from "sonner";
import type { RoomRowData } from "./RoomRow";

/**
 * Updated RoomsTab: uses RoomsFilters + RoomsTable.
 * - Filters control local state (search/status/course)
 * - RoomsTable receives filtered list and action handlers
 */

const initialRooms: RoomRowData[] = [
  {
    id: "RM1020",
    code: "RM1020",
    title: "Phòng 21 – Hình học không gian – góc & khoảng cách",
    datetime: "25/09/2025 00:50",
    course: "Vật lý 12 2025",
    courseSub: "Hình học không gian – góc & khoảng cách",
    owner: "Phạm Chi",
    status: "running",
    ccu: 556,
    participants: 74,
    messages: 4497,
  },
  {
    id: "RM1017",
    code: "RM1017",
    title: "Phòng 18 – Cloze test – collocations",
    datetime: "07/10/2025 00:50",
    course: "Vật lý 12 2025",
    courseSub: "Hình học không gian – góc & khoảng cách",
    owner: "Phạm Chi",
    status: "running",
    ccu: 514,
    participants: 10,
    messages: 4026,
  },
  {
    id: "RM1006",
    code: "RM1006",
    title: "Phòng 7 – Hình học không gian – góc & khoảng cách",
    datetime: "03/10/2025 00:50",
    course: "Hoá học 12 2025",
    courseSub: "Este – xà phòng hóa",
    owner: "Lê Duy",
    status: "running",
    ccu: 454,
    participants: 97,
    messages: 3889,
  },
  {
    id: "RM1005",
    code: "RM1005",
    title: "Phòng 6 – Cloze test – collocations",
    datetime: "29/09/2025 00:50",
    course: "Vật lý 12 2025",
    courseSub: "Hình học không gian – góc & khoảng cách",
    owner: "Trần Bình",
    status: "running",
    ccu: 427,
    participants: 104,
    messages: 4030,
  },
];

const RoomsTab: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<string>("all");
  const [course, setCourse] = React.useState<string>("all");
  const [rooms, setRooms] = React.useState<RoomRowData[]>(initialRooms);

  const applyFilters = () => {
    toast.info("Áp dụng bộ lọc (demo).");
    // In a real app you'd fetch filtered data; here we keep local filtering on render
  };

  const filteredRooms = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return rooms.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (course !== "all" && course) {
        // simple course filter by code
        if (!r.course?.toLowerCase().includes(course.replace(/\d+/g, "").trim())) {
          // naive match, keep for demo
          // allow "toan12"/"vatly12" from Filters options mapping in future
        }
      }
      if (!q) return true;
      return (
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.code && r.code.toLowerCase().includes(q)) ||
        (r.course && r.course.toLowerCase().includes(q)) ||
        (r.owner && r.owner.toLowerCase().includes(q))
      );
    });
  }, [rooms, query, status, course]);

  const handleOpen = (id: string) => {
    toast.info(`Mở phòng ${id} (demo).`);
  };

  const handleEdit = (id: string) => {
    toast.info(`Chỉnh sửa phòng ${id} (demo).`);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa phòng này?")) return;
    setRooms((prev) => prev.filter((r) => r.id !== id));
    toast.success("Đã xóa phòng (demo).");
  };

  return (
    <div className="space-y-4">
      <RoomsFilters query={query} setQuery={setQuery} status={status} setStatus={setStatus} course={course} setCourse={setCourse} onApply={applyFilters} />

      <RoomsTable rooms={filteredRooms} onOpen={handleOpen} onEdit={handleEdit} onDelete={handleDelete} itemsPerPage={10} />
    </div>
  );
};

export default RoomsTab;