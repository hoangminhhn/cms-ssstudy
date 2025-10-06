"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter as FilterIcon } from "lucide-react";

interface RoomsFiltersProps {
  query: string;
  setQuery: (v: string) => void;
  status: string;
  setStatus: (v: string) => void;
  course: string;
  setCourse: (v: string) => void;
  grade: string;
  setGrade: (v: string) => void;
  subject: string;
  setSubject: (v: string) => void;
  teacher: string;
  setTeacher: (v: string) => void;
  onApply: () => void;
}

const statusOptions = [
  { value: "all", label: "Tất cả" },
  { value: "running", label: "Đang diễn ra" },
  { value: "idle", label: "Tạm dừng" },
  { value: "ended", label: "Kết thúc" },
];

// Updated label here: use "Khóa học"
const exampleCourses = [
  { value: "all", label: "Khóa học" },
  { value: "toan12", label: "Toán 12 2025" },
  { value: "vatly12", label: "Vật lý 12 2025" },
  { value: "hoahoc12", label: "Hóa học 12 2025" },
];

const gradeOptions = [
  { value: "all", label: "Cấp học" },
  { value: "lop10", label: "Lớp 10" },
  { value: "lop11", label: "Lớp 11" },
  { value: "lop12", label: "Lớp 12" },
];

const subjectOptions = [
  { value: "all", label: "Môn" },
  { value: "toan", label: "Toán" },
  { value: "vatly", label: "Vật Lý" },
  { value: "hoahoc", label: "Hóa" },
];

const teacherOptions = [
  { value: "all", label: "Giáo viên" },
  { value: "gv-nguyen", label: "Nguyễn Tiến Đạt" },
  { value: "gv-tran", label: "Trần Bình" },
  { value: "gv-phuc", label: "Vũ Đình Phúc" },
];

const RoomsFilters: React.FC<RoomsFiltersProps> = ({
  query,
  setQuery,
  status,
  setStatus,
  course,
  setCourse,
  grade,
  setGrade,
  subject,
  setSubject,
  teacher,
  setTeacher,
  onApply,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-10"
            placeholder="Tìm theo tên/ID/bài học/chủ phòng..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Tìm kiếm phòng"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={grade} onValueChange={setGrade}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {gradeOptions.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={subject} onValueChange={setSubject}>
            <SelectTrigger className="w-[140px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {subjectOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={teacher} onValueChange={setTeacher}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {teacherOptions.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={course} onValueChange={setCourse}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {exampleCourses.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button className="h-9 bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2" onClick={onApply}>
            <FilterIcon className="h-4 w-4" /> Áp dụng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoomsFilters;