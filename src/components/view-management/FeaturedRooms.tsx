"use client";

import React from "react";
import RoomCard from "./RoomCard";
import { Grid } from "@/components/ui/grid";
import { toast } from "sonner";

/**
 * FeaturedRooms
 * - Render a responsive grid of RoomCard items (mock data).
 * - Exposes simple handlers for Open and Moderation (demo toasts).
 *
 * Layout matches screenshot: cards in a 3-column grid on large screens, spacing and rounded containers.
 */

type Room = {
  id: string;
  title: string;
  course?: string;
  date?: string;
  ccu: number;
  capacity?: number | null;
  messages: number;
  violations: number;
  visibility?: "Công khai" | "Riêng tư";
  status?: "running" | "idle" | "ended";
};

const MOCK: Room[] = [
  {
    id: "r1",
    title: "Toán - Tổ hợp & Xác suất: Ôn tập chuyên sâu",
    course: "Luyện thi Đại học Toán • Chuyên đề Tổ hợp",
    date: "Hôm nay",
    ccu: 462,
    capacity: 10,
    messages: 3396,
    violations: 0,
    visibility: "Công khai",
    status: "running",
  },
  {
    id: "r2",
    title: "Toán - Hàm số & Ứng dụng: Bài tập sát đề",
    course: "Luyện thi Đại học Toán • Hàm số chuyên sâu",
    date: "Hôm nay",
    ccu: 433,
    capacity: 74,
    messages: 3858,
    violations: 3,
    visibility: "Công khai",
    status: "running",
  },
  {
    id: "r3",
    title: "Vật Lý - Điện xoay chiều: Bài tập và mẹo làm nhanh",
    course: "Luyện thi Đại học Vật Lý • Điện xoay chiều",
    date: "Hôm nay",
    ccu: 381,
    capacity: 104,
    messages: 3374,
    violations: 1,
    visibility: "Riêng tư",
    status: "running",
  },
  {
    id: "r4",
    title: "Vật Lý - Dao động & Sóng: Tổng hợp đề thi",
    course: "Luyện thi Đại học Vật Lý • Dao động & Sóng",
    date: "Hôm nay",
    ccu: 366,
    capacity: 97,
    messages: 3239,
    violations: 2,
    visibility: "Riêng tư",
    status: "running",
  },
  {
    id: "r5",
    title: "Hóa Học - Este & Polime: Bài tập nâng cao",
    course: "Luyện thi Đại học Hóa • Hữu cơ nâng cao",
    date: "Hôm nay",
    ccu: 338,
    capacity: 5,
    messages: 2992,
    violations: 4,
    visibility: "Công khai",
    status: "running",
  },
  {
    id: "r6",
    title: "Hóa Học - Phản ứng chọn lọc & tổng hợp hữu cơ",
    course: "Luyện thi Đại học Hóa • Tổng hợp hữu cơ",
    date: "Hôm nay",
    ccu: 290,
    capacity: 111,
    messages: 3351,
    violations: 2,
    visibility: "Công khai",
    status: "running",
  },
];

const FeaturedRooms: React.FC = () => {
  const handleOpen = (id: string) => {
    toast.info(`Mở phòng ${id} (demo).`);
  };

  const handleModeration = (id: string) => {
    toast.info(`Moderation cho ${id} (demo).`);
  };

  return (
    <section>
      <div className="rounded-lg border bg-white dark:bg-gray-800 p-4">
        <h3 className="text-lg font-semibold">Phòng nổi bật hôm nay</h3>
        <p className="text-sm text-muted-foreground mt-1">Phiên ôn luyện chuyên đề Toán - Lý - Hóa</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK.map((r) => (
            <div key={r.id} className="min-h-[220px]">
              <RoomCard
                id={r.id}
                title={r.title}
                course={r.course}
                date={r.date}
                ccu={r.ccu}
                capacity={r.capacity ?? null}
                messages={r.messages}
                violations={r.violations}
                visibility={r.visibility}
                status={r.status}
                onOpen={handleOpen}
                onModeration={handleModeration}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedRooms;