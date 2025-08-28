import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import LessonFilters from "@/components/lessons/LessonFilters";
import LessonsList from "@/components/lessons/LessonsList";

const mockLessons = [
  { id: "l1", title: "[2007] TOÁN 12", grade: "Lớp 12", subject: "Toán", meta: "" },
  { id: "l2", title: "ĐỀ THI HỌC KỲ II - TOÁN 12", grade: "", subject: "Toán", meta: "" },
  { id: "l3", title: "I. ĐỀ THI GIỮA HỌC KỲ I - TOÁN 12", grade: "", subject: "Toán", meta: "" },
  // add more mock rows if needed
];

const LessonManagement: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [grade, setGrade] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [teacher, setTeacher] = React.useState("");

  const [items, setItems] = React.useState(mockLessons);

  const handleFilter = () => {
    // For demo we just log and don't change mock content; extend to real filter later
    console.log("Filter applied", { query, grade, subject, teacher });
  };

  const handleAddChapter = () => {
    // stub: add a mock folder at top
    const id = `l-${Date.now()}`;
    setItems((prev) => [{ id, title: `Phần mới ${prev.length + 1}`, grade, subject, meta: "" }, ...prev]);
  };

  const handleAddLesson = () => {
    const id = `l-${Date.now()}`;
    setItems((prev) => [{ id, title: `Bài học mới ${prev.length + 1}`, grade, subject, meta: "" }, ...prev]);
  };

  const handleOpen = (id: string) => {
    alert(`Mở mục ${id} (mô phỏng)`);
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

      <MadeWithDyad />
    </Layout>
  );
};

export default LessonManagement;