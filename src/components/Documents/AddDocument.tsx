import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const subjects = ["Toán", "Văn", "Tiếng Anh", "Vật Lý", "Hóa"];

const AddDocument: React.FC = () => {
  const [title, setTitle] = React.useState("");
  const [teacher, setTeacher] = React.useState("");
  const [subject, setSubject] = React.useState(subjects[0]);
  const [className, setClassName] = React.useState("");
  const [fileUrl, setFileUrl] = React.useState("");
  const handleSave = () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề tài liệu.");
      return;
    }
    toast.success("Tài liệu đã được thêm (demo).");
    setTitle("");
    setTeacher("");
    setClassName("");
    setFileUrl("");
    setSubject(subjects[0]);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Thêm mới tài liệu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Tên tài liệu</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <Label>Giáo viên</Label>
              <Input value={teacher} onChange={(e) => setTeacher(e.target.value)} />
            </div>
            <div>
              <Label>Môn học</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Lớp học</Label>
              <Input value={className} onChange={(e) => setClassName(e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <Label>Link / File</Label>
              <Input value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} placeholder="Nhập URL hoặc đường dẫn file" />
            </div>
            <div className="md:col-span-2">
              <Label>Mô tả</Label>
              <Textarea value={""} onChange={() => {}} placeholder="Mô tả (demo)" />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline">HỦY</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddDocument;