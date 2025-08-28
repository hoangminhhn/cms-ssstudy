import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

interface ChapterData {
  id: string;
  code: string;
  title: string;
  grade: string;
  subject: string;
}

interface AddChapterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (chapter: ChapterData) => void;
  initial?: Partial<ChapterData>;
}

const AddChapterModal: React.FC<AddChapterModalProps> = ({ open, onOpenChange, onSave, initial }) => {
  const [code, setCode] = React.useState(initial?.code ?? "");
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [grade, setGrade] = React.useState(initial?.grade ?? "Cấp học");
  const [subject, setSubject] = React.useState(initial?.subject ?? "-- Chọn môn học --");

  React.useEffect(() => {
    if (open) {
      // reset when opened
      setCode(initial?.code ?? "");
      setTitle(initial?.title ?? "");
      setGrade(initial?.grade ?? "Cấp học");
      setSubject(initial?.subject ?? "-- Chọn môn học --");
    }
  }, [open, initial]);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập Tên chương.");
      return;
    }
    if (!code.trim()) {
      toast.error("Vui lòng nhập Mã chương.");
      return;
    }
    if (grade === "Cấp học") {
      toast.error("Vui lòng chọn phân loại (Cấp học).");
      return;
    }
    if (subject === "-- Chọn môn học --") {
      toast.error("Vui lòng chọn môn học.");
      return;
    }

    const chapter = {
      id: `ch-${Date.now()}`,
      code: code.trim(),
      title: title.trim(),
      grade,
      subject,
    };

    onSave(chapter);
    onOpenChange(false);
    toast.success("Đã thêm chương.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-orange-600">Thông tin chương</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="chapter-code" className="text-sm">Mã chương</Label>
            <Input id="chapter-code" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Nhập mã chương" />
          </div>
          <div>
            <Label htmlFor="chapter-title" className="text-sm">Tên chương</Label>
            <Input id="chapter-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tên chương" />
          </div>

          <div>
            <Label htmlFor="chapter-grade" className="text-sm">Phân loại</Label>
            <Select value={grade} onValueChange={setGrade}>
              <SelectTrigger id="chapter-grade" className="w-full">
                <SelectValue placeholder="Cấp học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cấp học">Cấp học</SelectItem>
                <SelectItem value="Lớp 1">Lớp 1</SelectItem>
                <SelectItem value="Lớp 2">Lớp 2</SelectItem>
                <SelectItem value="Lớp 3">Lớp 3</SelectItem>
                <SelectItem value="Lớp 4">Lớp 4</SelectItem>
                <SelectItem value="Lớp 5">Lớp 5</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="chapter-subject" className="text-sm">Môn học</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="chapter-subject" className="w-full">
                <SelectValue placeholder="-- Chọn môn học --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-- Chọn môn học --">-- Chọn môn học --</SelectItem>
                <SelectItem value="Toán">Toán</SelectItem>
                <SelectItem value="Văn">Văn</SelectItem>
                <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                <SelectItem value="Vật lí">Vật lí</SelectItem>
                <SelectItem value="Sinh học">Sinh học</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>HỦY THAY ĐỔI</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>THÊM CHƯƠNG</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddChapterModal;