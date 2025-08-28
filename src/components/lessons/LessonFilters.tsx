import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";

interface LessonFiltersProps {
  query: string;
  setQuery: (q: string) => void;
  grade: string;
  setGrade: (g: string) => void;
  subject: string;
  setSubject: (s: string) => void;
  teacher: string;
  setTeacher: (t: string) => void;
  onFilter: () => void;
  onAddChapter: () => void;
  onAddLesson: () => void;
}

const LessonFilters: React.FC<LessonFiltersProps> = ({
  query,
  setQuery,
  grade,
  setGrade,
  subject,
  setSubject,
  teacher,
  setTeacher,
  onFilter,
  onAddChapter,
  onAddLesson,
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-md border border-transparent shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          <div className="md:col-span-2">
            <label className="sr-only">Search</label>
            <div className="relative">
              <Input
                placeholder="Nhập từ khoá tìm kiếm..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div>
            <label className="sr-only">Cấp học</label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Cấp học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Lớp 10">Lớp 10</SelectItem>
                <SelectItem value="Lớp 11">Lớp 11</SelectItem>
                <SelectItem value="Lớp 12">Lớp 12</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="sr-only">Môn học</label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Môn học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="Toán">Toán</SelectItem>
                <SelectItem value="Văn">Văn</SelectItem>
                <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="sr-only">Giáo viên</label>
            <Select value={teacher} onValueChange={setTeacher}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Giáo viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="GV A">Giáo viên A</SelectItem>
                <SelectItem value="GV B">Giáo viên B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 md:justify-end">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={onFilter}>
              LỌC KẾT QUẢ
            </Button>
            <Button variant="outline" onClick={() => { onAddChapter(); toast.success("Mở form thêm chương (mô phỏng)"); }}>
              THÊM CHƯƠNG
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => { onAddLesson(); toast.success("Mở form thêm bài học (mô phỏng)"); }}>
              THÊM BÀI HỌC
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonFilters;