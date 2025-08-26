import React, { useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Upload, Calendar as CalendarIcon } from "lucide-react";

const gradeOptions = [
  { value: "cap1", label: "Cấp 1" },
  { value: "cap2", label: "Cấp 2" },
  { value: "cap3", label: "Cấp 3" },
];

const subjectOptions = [
  { value: "toan", label: "Toán" },
  { value: "van", label: "Văn" },
  { value: "anh", label: "Tiếng Anh" },
];

const categoryOptions = [
  { value: "cat1", label: "Danh mục 1" },
  { value: "cat2", label: "Danh mục 2" },
];

const teacherOptions = [
  { value: "gv1", label: "Giáo viên A" },
  { value: "gv2", label: "Giáo viên B" },
];

const AddClass: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [courseCode, setCourseCode] = useState("");
  const [courseName, setCourseName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [grade, setGrade] = useState<string | undefined>(undefined);
  const [room, setRoom] = useState("");
  const [subject, setSubject] = useState<string | undefined>(undefined);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [teacher, setTeacher] = useState<string | undefined>(undefined);
  const [featured, setFeatured] = useState(false);
  const [visible, setVisible] = useState(true);

  const handleChooseImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now just log the values; saving logic can be added later
    console.log({
      courseCode,
      courseName,
      startDate,
      endDate,
      grade,
      room,
      subject,
      category,
      teacher,
      featured,
      visible,
    });
    alert("Lưu thông tin (demo). Kiểm tra console để xem payload.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chung</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Image upload area */}
            <div className="lg:col-span-3">
              <div className="border border-dashed rounded-md p-4 flex flex-col items-center justify-center min-h-[160px]">
                {imagePreview ? (
                  <div className="relative w-full">
                    <img src={imagePreview} alt="preview" className="w-full h-40 object-cover rounded-md" />
                    <div className="mt-2 flex gap-2">
                      <Button variant="outline" onClick={clearImage}>Xóa</Button>
                      <Button onClick={handleChooseImage}>Thay đổi</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="h-8 w-8 text-orange-500" />
                    <Button onClick={handleChooseImage} className="bg-white border border-orange-300 text-orange-600 hover:bg-orange-50">
                      THÊM HÌNH
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">Kích thước gợi ý: 800x600, định dạng JPG/PNG</p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Form fields */}
            <div className="lg:col-span-9 grid grid-cols-1 gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <Label htmlFor="course-code">Mã khóa học</Label>
                  <Input id="course-code" value={courseCode} onChange={(e) => setCourseCode(e.target.value)} placeholder="Nhập mã khóa học" />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="course-name">Tên khóa học</Label>
                  <Input id="course-name" value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="Nhập tên khóa học" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="start-date">Ngày khai giảng</Label>
                  <div className="relative">
                    <Input
                      id="start-date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="pr-10"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="end-date">Ngày bế giảng</Label>
                  <div className="relative">
                    <Input
                      id="end-date"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="pr-10"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="grade">Phân loại</Label>
                  <Select value={grade} onValueChange={(val) => setGrade(val)}>
                    <SelectTrigger id="grade" className="w-full">
                      <SelectValue placeholder="Chọn cấp học" />
                    </SelectTrigger>
                    <SelectContent>
                      {gradeOptions.map((g) => (
                        <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="room">Phòng học</Label>
                  <Input id="room" value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Nhập phòng học" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <Label htmlFor="subject">Môn học</Label>
                  <Select value={subject} onValueChange={(val) => setSubject(val)}>
                    <SelectTrigger id="subject" className="w-full">
                      <SelectValue placeholder="-- Chọn môn học --" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjectOptions.map((s) => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Danh mục</Label>
                  <Select value={category} onValueChange={(val) => setCategory(val)}>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="-- Chọn danh mục --" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="teacher">Giáo viên</Label>
                  <Select value={teacher} onValueChange={(val) => setTeacher(val)}>
                    <SelectTrigger id="teacher" className="w-full">
                      <SelectValue placeholder="-- Chọn giáo viên --" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacherOptions.map((t) => (
                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch id="featured" checked={featured} onCheckedChange={(v) => setFeatured(!!v)} />
                    <Label htmlFor="featured">Nổi bật</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch id="visible" checked={visible} onCheckedChange={(v) => setVisible(!!v)} />
                    <Label htmlFor="visible">Hiển thị</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <Button variant="outline" className="mr-2" onClick={() => {
                  // reset
                  setCourseCode("");
                  setCourseName("");
                  setStartDate("");
                  setEndDate("");
                  setGrade(undefined);
                  setRoom("");
                  setSubject(undefined);
                  setCategory(undefined);
                  setTeacher(undefined);
                  setFeatured(false);
                  setVisible(true);
                  clearImage();
                }}>HỦY</Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">LƯU</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default AddClass;