import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, FileText, Video, BookOpen, Clock } from "lucide-react";
import { toast } from "sonner";

interface ChapterContentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chapter: {
    id: string;
    title: string;
    grade?: string;
    subject?: string;
  };
}

const mockLessons = [
  {
    id: "lesson1",
    title: "Bài 1: Khái niệm số nguyên",
    type: "lesson",
    duration: "15 phút",
    free: true,
  },
  {
    id: "lesson2",
    title: "Bài 2: Phép cộng và trừ số nguyên",
    type: "lesson",
    duration: "20 phút",
    free: false,
  },
  {
    id: "lesson3",
    title: "Bài 3: Phép nhân số nguyên",
    type: "lesson",
    duration: "25 phút",
    free: false,
  },
  {
    id: "lesson4",
    title: "Bài 4: Phép chia số nguyên",
    type: "lesson",
    duration: "30 phút",
    free: false,
  },
  {
    id: "lesson5",
    title: "Bài 5: Bài tập tổng hợp",
    type: "lesson",
    duration: "40 phút",
    free: false,
  },
];

const ChapterContentModal: React.FC<ChapterContentModalProps> = ({ open, onOpenChange, chapter }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newLesson, setNewLesson] = React.useState({
    title: "",
    type: "lesson",
    duration: "",
    free: false,
  });

  const filteredLessons = mockLessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLesson = () => {
    if (!newLesson.title.trim()) {
      toast.error("Vui lòng nhập tên bài học");
      return;
    }
    toast.success(`Đã thêm bài học: ${newLesson.title}`);
    setNewLesson({ title: "", type: "lesson", duration: "", free: false });
    setShowAddForm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto p-0">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
          <DialogTitle className="text-xl font-bold">
            {chapter.title}
          </DialogTitle>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {chapter.grade || "Lớp 10"}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full">
              {chapter.subject || "Toán"}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              5 bài học
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              130 phút
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-80">
              <Input
                placeholder="Tìm kiếm bài học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 absolute left-3 top-3 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-4 w-4" />
              Thêm bài học
            </Button>
          </div>

          {showAddForm && (
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-orange-800 dark:text-orange-200 mb-3">
                Thêm bài học mới
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="lesson-title">Tên bài học</Label>
                  <Input
                    id="lesson-title"
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                    placeholder="Nhập tên bài học"
                  />
                </div>
                <div>
                  <Label htmlFor="lesson-duration">Thời lượng</Label>
                  <Input
                    id="lesson-duration"
                    value={newLesson.duration}
                    onChange={(e) => setNewLesson({...newLesson, duration: e.target.value})}
                    placeholder="Ví dụ: 15 phút"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleAddLesson}
                  >
                    Thêm
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {filteredLessons.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Không tìm thấy bài học nào
              </div>
            ) : (
              filteredLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">{lesson.title}</h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          {lesson.duration}
                        </span>
                        {lesson.free && (
                          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                            Miễn phí
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Chỉnh sửa
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      Xóa
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChapterContentModal;