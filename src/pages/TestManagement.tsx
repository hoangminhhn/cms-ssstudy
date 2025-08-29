import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import TestFilters from "@/components/tests/TestFilters";
import TestsList from "@/components/tests/TestsList";
import { TestItem } from "@/components/tests/TestRow";

// Demo data for tests
const mockTests: TestItem[] = [
  {
    id: "test1",
    title: "Kiểm tra giữa kỳ 1 - Toán 10",
    grade: "Lớp 10",
    subject: "Toán",
    teacher: "GV A",
    duration: "60",
    questions: 20,
    startDate: "2023-09-15",
    endDate: "2023-09-15",
    description: "Bài kiểm tra giữa kỳ 1 môn Toán lớp 10, bao gồm các chủ đề từ đầu kỳ đến giữa kỳ 1.",
    active: true,
    participants: 45,
    completed: 42,
  },
  {
    id: "test2",
    title: "Kiểm tra cuối kỳ 1 - Văn 11",
    grade: "Lớp 11",
    subject: "Văn",
    teacher: "GV B",
    duration: "90",
    questions: 25,
    startDate: "2023-10-20",
    endDate: "2023-10-20",
    description: "Bài kiểm tra cuối kỳ 1 môn Văn lớp 11, bao gồm các dạng bài đọc hiểu và làm văn.",
    active: true,
    participants: 38,
    completed: 35,
  },
  {
    id: "test3",
    title: "Kiểm tra 45 phút - Tiếng Anh 12",
    grade: "Lớp 12",
    subject: "Tiếng Anh",
    teacher: "GV C",
    duration: "45",
    questions: 30,
    startDate: "2023-11-10",
    endDate: "2023-11-10",
    description: "Bài kiểm tra 45 phút môn Tiếng Anh lớp 12, bao gồm các phần từ vựng, ngữ pháp và đọc hiểu.",
    active: false,
    participants: 50,
    completed: 48,
  },
  {
    id: "test4",
    title: "Kiểm tra định kỳ - Vật lý 10",
    grade: "Lớp 10",
    subject: "Vật lý",
    teacher: "GV A",
    duration: "45",
    questions: 15,
    startDate: "2023-12-05",
    endDate: "2023-12-05",
    description: "Bài kiểm tra định kỳ môn Vật lý lớp 10, bao gồm các chủ đề cơ học và điện học.",
    active: true,
    participants: 40,
    completed: 38,
  },
  {
    id: "test5",
    title: "Kiểm tra học kỳ 2 - Sinh học 11",
    grade: "Lớp 11",
    subject: "Sinh học",
    teacher: "GV B",
    duration: "60",
    questions: 20,
    startDate: "2024-01-15",
    endDate: "2024-01-15",
    description: "Bài kiểm tra học kỳ 2 môn Sinh học lớp 11, bao gồm các chủ đề về tế bào, di truyền và tiến hóa.",
    active: true,
    participants: 42,
    completed: 40,
  },
  {
    id: "test6",
    title: "Kiểm tra cuối năm - Toán 12",
    grade: "Lớp 12",
    subject: "Toán",
    teacher: "GV C",
    duration: "120",
    questions: 30,
    startDate: "2024-05-20",
    endDate: "2024-05-20",
    description: "Bài kiểm tra cuối năm môn Toán lớp 12, bao gồm toàn bộ kiến thức trong năm học.",
    active: false,
    participants: 48,
    completed: 45,
  },
];

const TestManagement: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [grade, setGrade] = React.useState("all");
  const [subject, setSubject] = React.useState("all");
  const [teacher, setTeacher] = React.useState("all");

  const [items, setItems] = React.useState<TestItem[]>(mockTests);

  const handleFilter = () => {
    console.log("Filter applied", { query, grade, subject, teacher });
  };

  const handleAddTest = (test: any) => {
    setItems((prev) => [test, ...prev]);
  };

  const handleEditTest = (id: string) => {
    alert(`Chỉnh sửa bài kiểm tra ${id} (mô phỏng)`);
  };

  const handleDeleteTest = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa bài kiểm tra này?")) {
      setItems((prev) => prev.filter(item => item.id !== id));
    }
  };

  const handleViewTest = (id: string) => {
    alert(`Xem chi tiết bài kiểm tra ${id} (mô phỏng)`);
  };

  const handleToggleActive = (id: string, active: boolean) => {
    setItems((prev) => 
      prev.map(item => 
        item.id === id ? { ...item, active } : item
      )
    );
  };

  return (
    <Layout headerTitle="Quản lý bài kiểm tra">
      <div className="flex flex-col gap-6 w-full overflow-x-hidden">
        <TestFilters
          query={query}
          setQuery={setQuery}
          grade={grade}
          setGrade={setGrade}
          subject={subject}
          setSubject={setSubject}
          teacher={teacher}
          setTeacher={setTeacher}
          onFilter={handleFilter}
          onAddTest={handleAddTest}
        />

        <TestsList 
          items={items}
          onEdit={handleEditTest}
          onDelete={handleDeleteTest}
          onView={handleViewTest}
          onToggleActive={handleToggleActive}
        />
      </div>

      <MadeWithDyad />
    </Layout>
  );
};

export default TestManagement;