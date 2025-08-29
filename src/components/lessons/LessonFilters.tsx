import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";
import AddChapterModal from "./AddChapterModal";
import AddLessonModal from "./AddLessonModal";

interface ChapterData {
  id: string;
  code: string;
  title: string;
  grade: string;
  subject: string;
}

interface LessonPayload {
  id: string;
  title: string;
  free: boolean;
  freeFrom?: string;
  freeTo?: string;
  maxViews: number;
  subject: string;
  chapter: string;
  linkWithAnswer?: string;
  linkWithoutAnswer?: string;
  videos: any[];
  exam?: string;
  description?: string;
}

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
  onAddChapter: (chapter?: ChapterData) => void;
  onAddLesson: (lesson?: LessonPayload) => void;
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
  const [isAddChapterOpen, setIsAddChapterOpen] = React.useState(false);
  const [isAddLessonOpen, setIsAddLessonOpen] = React.useState(false);

  const handleOpenAddChapter = () => {
    setIsAddChapterOpen(true);
  };

  const handleSaveChapter = (chapter: ChapterData) => {
    onAddChapter(chapter);
  };

  const handleOpenAddLesson = () => {
    setIsAddLessonOpen(true);
  };

  const handleSaveLesson = (lesson: LessonPayload) => {
    onAddLesson(lesson);
  };

  return (
    <>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-md border border-transparent shadow-sm overflow-x-auto">
        <div className="flex items-center gap-3 min-w-max">
          {/* Search - flexible but with a reasonable min width */}
          <div className="flex-1 min-w-[260px] max-w-[680px]">
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

          {/* Cấp học */}
          <div className="min-w-[160px]">
            <label className="sr-only">Cấp học</label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Cấp học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cấp học</SelectItem>
                <SelectItem value="Lớp 10">Lớp 10</SelectItem>
                <SelectItem value="Lớp 11">Lớp 11</SelectItem>
                <SelectItem value="Lớp 12">Lớp 12</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Môn học */}
          <div className="min-w-[160px]">
            <label className="sr-only">Môn học</label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Môn học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Môn học</SelectItem>
                <SelectItem value="Toán">Toán</SelectItem>
                <SelectItem value="Văn">Văn</SelectItem>
                <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Giáo viên */}
          <div className="min-w-[160px]">
            <label className="sr-only">Giáo viên</label>
            <Select value={teacher} onValueChange={setTeacher}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Giáo viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Giáo viên</SelectItem>
                <SelectItem value="GV A">Giáo viên A</SelectItem>
                <SelectItem value="GV B">Giáo viên B</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions - fixed min width so they stay to the right */}
          <div className="min-w-[220px] flex items-center gap-2 justify-end">
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={onFilter}
            >
              LỌC KẾT QUẢ
            </Button>
            <Button
              variant="outline"
              onClick={handleOpenAddChapter}
            >
              THÊM CHƯƠNG
            </Button>
          </div>
        </div>
      </div>

      <AddChapterModal
        open={isAddChapterOpen}
        onOpenChange={setIsAddChapterOpen}
        onSave={handleSaveChapter}
      />

      <AddLessonModal
        open={isAddLessonOpen}
        onOpenChange={setIsAddLessonOpen}
        onSave={handleSaveLesson}
        defaultSubject={subject !== "all" ? subject : undefined}
        defaultChapter={undefined}
      />
    </>
  );
};

export default LessonFilters;