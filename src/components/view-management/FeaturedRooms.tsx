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
  { id: "r18", title: "Phòng 18 – Cloze test – collocations", course: "Vật lý 12 2025 • Hình học không gian – góc & khoảng cách", date: "Hôm nay", ccu: 462, capacity: 10, messages: 3396, violations: 0, visibility: "Công khai", status: "running" },
  { id: "r21", title: "Phòng 21 – Hình học không gian – góc & khoảng cách", course: "Vật lý 12 2025 • Hình học không gian – góc & khoảng cách", date: "Hôm nay", ccu: 433, capacity: 74, messages: 3858, violations: 3, visibility: "Công khai", status: "running" },
  { id: "r6", title: "Phòng 6 – Cloze test – collocations", course: "Vật lý 12 2025 • Hình học không gian – góc & khoảng cách", date: "Hôm nay", ccu: 381, capacity: 104, messages: 3374, violations: 1, visibility: "Riêng tư", status: "running" },
  { id: "r7", title: "Phòng 7 – Hình học không gian – góc & khoảng cách", course: "Hoá học 12 2025 • Este – xà phòng hoá", date: "Hôm nay", ccu: 366, capacity: 97, messages: 3239, violations: 2, visibility: "Riêng tư", status: "running" },
  { id: "r24", title: "Phòng 24 – Hình học không gian – góc & khoảng cách", course: "Tiếng Anh 2025 • Hình học không gian – góc & khoảng cách", date: "Hôm nay", ccu: 338, capacity: 5, messages: 2992, violations: 4, visibility: "Công khai", status: "running" },
  { id: "r10", title: "Phòng 10 – Cloze test – collocations", course: "Hoá học 12 2025 • Dao động điều hoà – tổng hợp", date: "Hôm nay", ccu: 290, capacity: 111, messages: 3351, violations: 2, visibility: "Công khai", status: "running" },
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
        <p className="text-sm text-muted-foreground mt-1">CCU & tương tác cao</p>

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