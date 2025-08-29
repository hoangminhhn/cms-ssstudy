import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";
import AddTestModal from "./AddTestModal";

interface TestFiltersProps {
  query: string;
  setQuery: (q: string) => void;
  grade: string;
  setGrade: (g: string) => void;
  subject: string;
  setSubject: (s: string) => void;
  teacher: string;
  setTeacher: (t: string) => void;
  onFilter: () => void;
  onAddTest: () => void;
}

const TestFilters: React.FC<TestFiltersProps> = ({
  query,
  setQuery,
  grade,
  setGrade,
  subject,
  setSubject,
  teacher,
  setTeacher,
  onFilter,
  onAddTest
}) => {
  const [isAddTestModalOpen, setIsAddTestModalOpen] = React.useState(false);

  const handleOpenAddTest = () => {
    setIsAddTestModalOpen(true);
  };

  const handleSaveTest = (test: any) => {
    // In a real app, you would add the test to your state or API
    toast.success("Đã thêm bài kiểm tra mới");
    setIsAddTestModalOpen(false);
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
                <SelectItem value="Vật lí">Vật lí</SelectItem>
                <SelectItem value="Sinh học">Sinh học</SelectItem>
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
                <SelectItem value="GV C">Giáo viên C</SelectItem>
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
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleOpenAddTest}
            >
              THÊM BÀI KIỂM TRA
            </Button>
          </div>
        </div>
      </div>

      <AddTestModal
        open={isAddTestModalOpen}
        onOpenChange={setIsAddTestModalOpen}
        onSave={handleSaveTest}
      />
    </>
  );
};

export default TestFilters;