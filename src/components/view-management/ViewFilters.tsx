"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import DateRangePicker from "@/components/DateRangePicker";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export type RoomStatus = "upcoming" | "live" | "ended" | "all";

interface Filters {
  q?: string;
  date?: { from?: Date; to?: Date };
  course?: string;
  teacher?: string;
  status?: RoomStatus;
  minParticipants?: number | "";
  flaggedOnly?: boolean;
}

interface Props {
  filters: Filters;
  setFilters: (f: Filters) => void;
  onApply?: () => void;
  courses: string[];
  teachers: string[];
}

const ViewFilters: React.FC<Props> = ({ filters, setFilters, onApply, courses, teachers }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border rounded p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="col-span-1 md:col-span-1">
          <Label className="text-sm">Tìm kiếm</Label>
          <Input
            placeholder="ID, tên phòng, chủ phòng..."
            value={filters.q ?? ""}
            onChange={(e) => setFilters({ ...filters, q: e.target.value })}
          />
        </div>

        <div>
          <Label className="text-sm">Thời gian</Label>
          <DateRangePicker date={filters.date} setDate={(d) => setFilters({ ...filters, date: d })} />
        </div>

        <div>
          <Label className="text-sm">Khoá / Bài học</Label>
          <Select
            value={filters.course ?? "all"}
            onValueChange={(v) => setFilters({ ...filters, course: v === "all" ? undefined : v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="-- Tất cả --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">-- Tất cả --</SelectItem>
              {courses.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm">Giáo viên / Chủ phòng</Label>
          <Select
            value={filters.teacher ?? "all"}
            onValueChange={(v) => setFilters({ ...filters, teacher: v === "all" ? undefined : v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="-- Tất cả --" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">-- Tất cả --</SelectItem>
              {teachers.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm">Trạng thái</Label>
          <Select value={filters.status ?? "all"} onValueChange={(v) => setFilters({ ...filters, status: v as RoomStatus })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
              <SelectItem value="live">Đang diễn ra</SelectItem>
              <SelectItem value="ended">Đã kết thúc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm">Số người tối thiểu</Label>
          <Input
            type="number"
            min={0}
            placeholder="0"
            value={filters.minParticipants === "" || filters.minParticipants === undefined ? "" : String(filters.minParticipants)}
            onChange={(e) => setFilters({ ...filters, minParticipants: e.target.value === "" ? "" : Number(e.target.value) })}
          />
        </div>

        <div className="flex items-end gap-2">
          <div className="flex items-center gap-2">
            <Switch checked={!!filters.flaggedOnly} onCheckedChange={(v) => setFilters({ ...filters, flaggedOnly: !!v })} />
            <Label className="mb-0">Chỉ vi phạm</Label>
          </div>
          <div className="ml-auto">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => onApply?.()}>
              Áp dụng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFilters;