import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import LessonFilters from "@/components/lessons/LessonFilters";
import LessonsList from "@/components/lessons/LessonsList";
import AddLessonModal from "@/components/lessons/AddLessonModal";

const mockLessons = [
  { id: "c1", title: "Chương 1: Số nguyên", grade: "Lớp 10", subject: "Toán", meta: "", type: "chapter" },
  { id: "l1", title: "Bài 1: Khái niệm số nguyên", grade: "Lớp 10", subject: "Toán", meta: "", type: "lesson", duration: "15 phút", free: true },
  { id: "l2", title: "Bài 2: Phép cộng và trừ số nguyên", grade: "Lớp 10", subject: "Toán", meta: "", type: "lesson", duration: "20 phút", free: false },
  { id: "c2", title: "Chương 2: Phương trình bậc hai", grade: "Lớp 10", subject: "Toán", meta: "", type: "chapter" },
  { id: "l3", title: "Bài 1: Phương trình bậc hai", grade: "Lớp 10", subject: "Toán", meta: "", type: "lesson", duration: "25 phút", free: false },
  { id: "c3", title: "Chương 3: Hệ phương trình", grade: "Lớp 10", subject: "Toán", meta: "", type: "chapter" },
  { id: "l4", title: "Bài 1: Hệ phương trình tuyến tính", grade: "Lớp 10", subject: "Toán", meta: "", type: "lesson", duration: "30 phút", free: false },
];

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

  const [items, setItems] = React.useState(mockLessons);
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = React.useState(false);

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
          type: "chapter",
        },
        ...prev,
      ]);
      return;
    }

    const id = `c-${Date.now()}`;
    setItems((prev) => [{ id, title: `Chương mới ${prev.length + 1}`, grade, subject, meta: "", type: "chapter" }, ...prev]);
  };

  const handleAddLesson = (lesson?: LessonPayload) => {
    if (lesson) {
      setItems((prev) => [
        {
          id: lesson.id,
          title: lesson.title,
          grade: lesson.chapter || "",
          subject: lesson.subject || "",
          meta: lesson.description ? lesson.description.slice(0, 80) : "",
          type: "lesson",
          duration: "15 phút",
          free: lesson.free,
        },
        ...prev,
      ]);
      return;
    }
    // fallback: add simple
    const id = `l-${Date.now()}`;
    setItems((prev) => [{ id, title: `Bài học mới ${prev.length + 1}`, grade, subject, meta: "", type: "lesson", duration: "15 phút", free: false }, ...prev]);
  };

  const handleEditLesson = (lessonId: string) => {
    alert(`Chỉnh sửa bài học ${lessonId} (mô phỏng)`);
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (confirm("Bạn có chắc muốn xóa bài học này?")) {
      setItems((prev) => prev.filter(item => item.id !== lessonId));
    }
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
          onEditLesson={handleEditLesson}
          onDeleteLesson={handleDeleteLesson}
        />
      </div>

      <AddLessonModal
        open={isAddLessonModalOpen}
        onOpenChange={setIsAddLessonModalOpen}
        onSave={handleAddLesson}
      />

      <MadeWithDyad />
    </Layout>
  );
};

export default LessonManagement;