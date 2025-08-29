import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import LessonFilters from "@/components/lessons/LessonFilters";
import LessonsList from "@/components/lessons/LessonsList";
import { toast } from "sonner";

const mockChapters = [
  { id: "c1", title: "Chương 1: Số nguyên", grade: "Lớp 10", subject: "Toán", meta: "" },
  { id: "c2", title: "Chương 2: Phương trình bậc hai", grade: "Lớp 10", subject: "Toán", meta: "" },
  { id: "c3", title: "Chương 3: Hình học", grade: "Lớp 10", subject: "Toán", meta: "" },
];

const mockLessons = {
  "c1": [
    { id: "l1", title: "Bài 1: Khái niệm số nguyên", duration: "15 phút", free: true },
    { id: "l2", title: "Bài 2: Phép cộng và trừ số nguyên", duration: "20 phút", free: false },
    { id: "l3", title: "Bài 3: Phép nhân số nguyên", duration: "25 phút", free: false },
  ],
  "c2": [
    { id: "l4", title: "Bài 1: Khái niệm phương trình bậc hai", duration: "20 phút", free: true },
    { id: "l5", title: "Bài 2: Giải phương trình bậc hai", duration: "30 phút", free: false },
  ],
  "c3": [
    { id: "l6", title: "Bài 1: Điểm, đường thẳng", duration: "25 phút", free: true },
    { id: "l7", title: "Bài 2: Đường tròn", duration: "30 phút", free: false },
  ],
};

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

const LessonManagement: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [grade, setGrade] = React.useState("all");
  const [subject, setSubject] = React.useState("all");
  const [teacher, setTeacher] = React.useState("all");

  const [items, setItems] = React.useState(mockChapters);
  const [expandedChapterId, setExpandedChapterId] = React.useState<string | null>(null);

  const handleFilter = () => {
    console.log("Filter applied", { query, grade, subject, teacher });
  };

  const handleAddChapter = (chapter?: ChapterData) => {
    if (chapter) {
      setItems((prev) => [
        {
          id: chapter.id,
          title: `${chapter.code} - ${chapter.title}`,
          grade: chapter.grade,
          subject: chapter.subject,
          meta: "",
        },
        ...prev,
      ]);
      return;
    }

    const id = `c-${Date.now()}`;
    setItems((prev) => [{ id, title: `Chương mới ${prev.length + 1}`, grade, subject, meta: "" }, ...prev]);
  };

  const handleAddLesson = (lesson?: LessonPayload) => {
    toast.success("Đã thêm bài học mới");
  };

  const handleToggleExpand = (id: string) => {
    setExpandedChapterId(prev => prev === id ? null : id);
  };

  const handleEditLesson = (id: string) => {
    toast.info(`Chỉnh sửa bài học ${id}`);
  };

  const handleDeleteLesson = (id: string) => {
    toast.info(`Xóa bài học ${id}`);
  };

  return (
    <Layout headerTitle="Quản lý bài học">
      <div className="flex flex-col gap-6 w-full overflow-x-hidden">
        <LessonFilters
          query={query}
          setQuery={setQuery}
          grade={grade}
          setGrade={setGrade}
          subject={subject}
          setSubject={setSubject}
          teacher={teacher}
          setTeacher={setTeacher}
          onFilter={handleFilter}
          onAddChapter={handleAddChapter}
          onAddLesson={handleAddLesson}
        />

        <LessonsList 
          items={items} 
          expandedChapterId={expandedChapterId}
          onToggleExpand={handleToggleExpand}
          chapterLessons={mockLessons}
          onEditLesson={handleEditLesson}
          onDeleteLesson={handleDeleteLesson}
        />
      </div>

      <MadeWithDyad />
    </Layout>
  );
};

export default LessonManagement;