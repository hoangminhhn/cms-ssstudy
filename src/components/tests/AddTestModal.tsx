import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Calendar, Clock } from "lucide-react";

interface TestPayload {
  id: string;
  title: string;
  grade: string;
  subject: string;
  teacher: string;
  duration: string;
  questions: number;
  startDate: string;
  endDate: string;
  description: string;
  active: boolean;
}

interface AddTestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (test: TestPayload) => void;
}

const AddTestModal: React.FC<AddTestModalProps> = ({ open, onOpenChange, onSave }) => {
  const [title, setTitle] = React.useState("");
  const [grade, setGrade] = React.useState("Lớp 10");
  const [subject, setSubject] = React.useState("Toán");
  const [teacher, setTeacher] = React.useState("GV A");
  const [duration, setDuration] = React.useState("60");
  const [questions, setQuestions] = React.useState("20");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [active, setActive] = React.useState(true);

  React.useEffect(() => {
    if (open) {
      // Reset form when modal opens
      setTitle("");
      setGrade("Lớp 10");
      setSubject("Toán");
      setTeacher("GV A");
      setDuration("60");
      setQuestions("20");
      setStartDate("");
      setEndDate("");
      setDescription("");
      setActive(true);
    }
  }, [open]);

  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên bài kiểm tra");
      return;
    }
    if (!startDate) {
      toast.error("Vui lòng chọn ngày bắt đầu");
      return;
    }
    if (!endDate) {
      toast.error("Vui lòng chọn ngày kết thúc");
      return;
    }

    const test: TestPayload = {
      id: `test-${Date.now()}`,
      title: title.trim(),
      grade,
      subject,
      teacher,
      duration,
      questions: parseInt(questions),
      startDate,
      endDate,
      description: description.trim(),
      active,
    };

    onSave(test);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-orange-600 font-semibold">Thêm bài kiểm tra mới</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="test-title" className="text-sm">Tên bài kiểm tra</Label>
              <Input id="test-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nhập tên bài kiểm tra" />
            </div>
            <div>
              <Label htmlFor="test-grade" className="text-sm">Cấp học</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger id="test-grade" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lớp 10">Lớp 10</SelectItem>
                  <SelectItem value="Lớp 11">Lớp 11</SelectItem>
                  <SelectItem value="Lớp 12">Lớp 12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="test-subject" className="text-sm">Môn học</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="test-subject" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Toán">Toán</SelectItem>
                  <SelectItem value="Văn">Văn</SelectItem>
                  <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                  <SelectItem value="Vật lí">Vật lí</SelectItem>
                  <SelectItem value="Sinh học">Sinh học</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="test-teacher" className="text-sm">Giáo viên</Label>
              <Select value={teacher} onValueChange={setTeacher}>
                <SelectTrigger id="test-teacher" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GV A">Giáo viên A</SelectItem>
                  <SelectItem value="GV B">Giáo viên B</SelectItem>
                  <SelectItem value="GV C">Giáo viên C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="test-duration" className="text-sm">Thời gian làm bài (phút)</Label>
              <Input id="test-duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="60" />
            </div>
            <div>
              <Label htmlFor="test-questions" className="text-sm">Số câu hỏi</Label>
              <Input id="test-questions" type="number" value={questions} onChange={(e) => setQuestions(e.target.value)} placeholder="20" />
            </div>

            <div>
              <Label htmlFor="test-start" className="text-sm">Ngày bắt đầu</Label>
              <div className="relative">
                <Input id="test-start" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <Label htmlFor="test-end" className="text-sm">Ngày kết thúc</Label>
              <div className="relative">
                <Input id="test-end" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                <Calendar className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="test-description" className="text-sm">Mô tả</Label>
            <Textarea id="test-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Nhập mô tả bài kiểm tra..." className="min-h-[100px]" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Label className="mb-0">Kích hoạt</Label>
              <Switch checked={active} onCheckedChange={(v) => setActive(!!v)} />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{duration} phút</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>HỦY</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTestModal;