import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import LessonFilters from "@/components/lessons/LessonFilters";
import LessonsList from "@/components/lessons/LessonsList";
import ChapterContentModal from "@/components/lessons/ChapterContentModal";

const mockLessons = [
  { id: "l1", title: "[2007] TOÁN 12", grade: "Lớp 12", subject: "Toán", meta: "", type: "lesson" },
  { id: "l2", title: "ĐỀ THI HỌC KỲ II - TOÁN 12", grade: "", subject: "Toán", meta: "", type: "lesson" },
  { id: "l3", title: "I. ĐỀ THI GIỮA HỌC KỲ I - TOÁN 12", grade: "", subject: "Toán", meta: "", type: "lesson" },
  { id: "c1", title: "Chương 1: Số nguyên", grade: "Lớp 10", subject: "Toán", meta: "", type: "chapter" },
  { id: "c2", title: "Chương 2: Phương trình bậc hai", grade: "Lớp 10", subject: "Toán", meta: "", type: "chapter" },
  // add more mock rows if needed
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
  const [selectedChapter, setSelectedChapter] = React.useState<typeof mockLessons[0] | null>(null);
  const [isChapterModalOpen, setIsChapterModalOpen] = React.useState(false);

  const handleFilter = () => {
    // For demo we just log and don't change mock content; extend to real filter later
    console.log("Filter applied", { query, grade, subject, teacher });
  };

  const handleAddChapter = (chapter?: ChapterData) => {
    // If chapter data provided from modal, add it with the provided title and meta
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

    // Fallback: add a default mock chapter when no data provided
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
        },
        ...prev,
      ]);
      return;
    }
    // fallback: add simple
    const id = `l-${Date.now()}`;
    setItems((prev) => [{ id, title: `Bài học mới ${prev.length + 1}`, grade, subject, meta: "", type: "lesson" }, ...prev]);
  };

  const handleOpen = (id: string, type?: "chapter" | "lesson") => {
    if (type === "chapter") {
      const chapter = items.find(item => item.id === id && item.type === "chapter");
      if (chapter) {
        setSelectedChapter(chapter);
        setIsChapterModalOpen(true);
      }
    } else {
      alert(`Mở bài học ${id} (mô phỏng)`);
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

        <LessonsList items={items} onOpen={handleOpen} />
      </div>

      {selectedChapter && (
        <ChapterContentModal
          open={isChapterModalOpen}
          onOpenChange={setIsChapterModalOpen}
          chapter={selectedChapter}
        />
      )}

      <MadeWithDyad />
    </Layout>
  );
};

export default LessonManagement;