"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Upload, Download, Check } from "lucide-react";
import ManualWordExamQuestions from "./ManualWordExamQuestions";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import GroupPartModal from "./GroupPartModal";

const sampleFiles = [
  { label: "Đề thi tốt nghiệp", fileName: "sample-tot-nghiep.docx" },
  { label: "Đề thi HSA", fileName: "sample-hsa.docx" },
  { label: "Đề thi TSA", fileName: "sample-tsa.docx" },
  { label: "Đề thi V-ACT", fileName: "sample-v-act.docx" },
];

const examPeriods = [
  "Chọn kỳ thi",
  "Kỳ thi HSA",
  "Kỳ thi TSA",
  "Kỳ thi Tốt Nghiệp",
  "Kỳ thi V-ACT",
];

const partsOptionsDefault = [
  { value: "part1", label: "Phần 1" },
  { value: "part2", label: "Phần 2" },
  { value: "part3", label: "Phần 3" },
];

const testTypes = [
  "Không",
  "Thi giữa kỳ 1",
  "Thi cuối kỳ 1",
  "Thi giữa kỳ 2",
  "Thi cuối kỳ 2",
];

const groups = ["Mặc định", "Thi thử"];
const classes = ["Lớp 1", "Lớp 2", "Lớp 3", "Lớp 4", "Lớp 5"];
const subjects = ["Toán", "Văn", "Tiếng Anh", "Vật lí", "Sinh học"];
const allowRetryOptions = ["Không cho phép", "Có"];
const cities = [
  "Chọn thành phố",
  "Hà Nội",
  "Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Nha Trang",
  "Huế",
  "Vũng Tàu",
  "Quảng Ninh",
  "Bình Dương",
];

interface Question {
  id: string;
  correctAnswer: string;
  solution: string;
  uploadDate: string;
  videoLink?: string;
  documentLink?: string;
}

interface ExamPart {
  id: string;
  name: string;
  questions: Question[];
  maxSelected?: number;
}

const WordExamUpload: React.FC = () => {
  const [parts, setParts] = useState<ExamPart[]>([
    { id: "part1", name: "Phần 1", questions: [] },
    { id: "part2", name: "Phần 2", questions: [] },
    { id: "part3", name: "Phần 3", questions: [] },
  ]);
  const [examName, setExamName] = useState("");
  const [examPeriod, setExamPeriod] = useState("");
  const [part, setPart] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [testType, setTestType] = useState("Không");
  const [group, setGroup] = useState("Mặc định");
  const [classLevel, setClassLevel] = useState("Lớp 1");
  const [subject, setSubject] = useState("Toán");
  const [allowRetry, setAllowRetry] = useState("Không cho phép");
  const [city, setCity] = useState("Chọn thành phố");
  const [openCitySelect, setOpenCitySelect] = useState(false);

  // State cho modal cài đặt nhóm chủ đề
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const handleOpenGroupModal = () => {
    setIsGroupModalOpen(true);
  };

  const handleCloseGroupModal = () => {
    setIsGroupModalOpen(false);
  };

  const handleSaveGroupPart = (groupPartName: string, maxSelected?: number) => {
    const newPart = {
      id: `group-part-${Date.now()}`,
      name: groupPartName,
      questions: [],
      maxSelected,
    };
    setParts((prev) => [...prev, newPart]);
    toast.success("Đã thêm phần thi nhóm chủ đề.");
    setIsGroupModalOpen(false);
  };

  const handleDeleteAll = () => {
    setParts((prevParts) => prevParts.map((p) => ({ ...p, questions: [] })));
    toast.success("Đã xóa tất cả câu hỏi.");
  };

  const handleDeleteQuestion = (partId: string, questionId: string) => {
    setParts((prevParts) =>
      prevParts.map((p) =>
        p.id === partId ? { ...p, questions: p.questions.filter((q) => q.id !== questionId) } : p
      )
    );
    toast.success("Đã xóa câu hỏi.");
  };

  const handleDeletePart = (partId: string) => {
    setParts((prev) => prev.filter((p) => p.id !== partId));
    toast.success("Đã xóa phần thi.");
  };

  const handleAddOrUpdateQuestion = (partId: string, questionId: string | null, newQuestion: Question) => {
    setParts((prevParts) =>
      prevParts.map((p) => {
        if (p.id !== partId) return p;
        const updatedQuestions = questionId
          ? p.questions.map((q) => (q.id === questionId ? newQuestion : q))
          : [...p.questions, newQuestion];
        return { ...p, questions: updatedQuestions };
      })
    );
  };

  const handleUploadClick = () => {
    const now = new Date().toLocaleDateString();
    const newQuestionsPart1: Question[] = [
      { id: Date.now().toString() + "1", correctAnswer: "A", solution: "Giải thích câu hỏi mới 1", uploadDate: now },
    ];
    const newQuestionsPart2: Question[] = [
      { id: Date.now().toString() + "2", correctAnswer: "B", solution: "Giải thích câu hỏi mới 2", uploadDate: now },
    ];
    const newQuestionsPart3: Question[] = [
      { id: Date.now().toString() + "3", correctAnswer: "C", solution: "Giải thích câu hỏi mới 3", uploadDate: now },
    ];

    setParts((prevParts) =>
      prevParts.map((p) => {
        if (p.id === "part1") return { ...p, questions: [...p.questions, ...newQuestionsPart1] };
        if (p.id === "part2") return { ...p, questions: [...p.questions, ...newQuestionsPart2] };
        if (p.id === "part3") return { ...p, questions: [...p.questions, ...newQuestionsPart3] };
        return p;
      })
    );
    toast.success("Đã thêm câu hỏi mẫu cho 3 phần thi.");
  };

  const handleDownloadSample = (fileName: string) => {
    const link = document.createElement("a");
    link.href = `/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Đang tải ${fileName}...`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông tin đề thi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
          <div className="col-span-1">
            <Label htmlFor="exam-code">Mã đề thi</Label>
            <Input id="exam-code" value="Tự động" disabled />
          </div>
          <div className="col-span-3">
            <Label htmlFor="exam-name">Tên đề thi</Label>
            <Input id="exam-name" value={examName} onChange={(e) => setExamName(e.target.value)} placeholder="Nhập tên đề thi" />
          </div>
          <div className="col-span-2">
            <Label htmlFor="exam-period">Kỳ thi</Label>
            <Select value={examPeriod} onValueChange={(val) => { setExamPeriod(val); setPart(""); }}>
              <SelectTrigger id="exam-period">
                <SelectValue placeholder="Chọn kỳ thi" />
              </SelectTrigger>
              <SelectContent>
                {examPeriods.map((period) => (
                  <SelectItem key={period} value={period}>{period}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <Label htmlFor="part">Phần thi</Label>
            <Select value={part} onValueChange={setPart}>
              <SelectTrigger id="part">
                <SelectValue placeholder="Chọn phần thi" />
              </SelectTrigger>
              <SelectContent>
                {[{ value: "full", label: "Đủ 3 Phần" }, ...partsOptionsDefault].map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <Label htmlFor="pdf-link">Đề thi PDF</Label>
            <Input id="pdf-link" value={pdfLink} onChange={(e) => setPdfLink(e.target.value)} placeholder="Nhập URL PDF" />
          </div>
          <div className="col-span-1">
            <Label htmlFor="test-type">Loại bài kiểm tra</Label>
            <Select value={testType} onValueChange={setTestType}>
              <SelectTrigger id="test-type">
                <SelectValue placeholder="Chọn loại bài kiểm tra" />
              </SelectTrigger>
              <SelectContent>
                {testTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <Label htmlFor="group">Nhóm đề</Label>
            <Select value={group} onValueChange={setGroup}>
              <SelectTrigger id="group">
                <SelectValue placeholder="Chọn nhóm đề" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mặc định">Mặc định</SelectItem>
                <SelectItem value="Thi thử">Thi thử</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <Label htmlFor="class-level">Lớp</Label>
            <Select value={classLevel} onValueChange={setClassLevel}>
              <SelectTrigger id="class-level">
                <SelectValue placeholder="Chọn lớp" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label htmlFor="subject">Môn học</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subj) => (
                  <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1">
            <Label htmlFor="allow-retry">Cho phép làm lại</Label>
            <Select value={allowRetry} onValueChange={setAllowRetry}>
              <SelectTrigger id="allow-retry">
                <SelectValue placeholder="Chọn tùy chọn" />
              </SelectTrigger>
              <SelectContent>
                {allowRetryOptions.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label htmlFor="city">Thành phố</Label>
            <Popover open={openCitySelect} onOpenChange={setOpenCitySelect}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCitySelect}
                  className="w-full justify-between"
                >
                  {city ? cities.find((c) => c === city) : "Chọn thành phố..."}
                  <Check className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Tìm kiếm thành phố..." />
                  <CommandEmpty>Không tìm thấy thành phố.</CommandEmpty>
                  <CommandGroup>
                    {cities.map((c) => (
                      <CommandItem
                        key={c}
                        value={c}
                        onSelect={(currentValue) => {
                          setCity(currentValue === city ? "" : currentValue);
                          setOpenCitySelect(false);
                        }}
                      >
                        <Check className={cn("mr-2 h-4 w-4", city === c ? "opacity-100" : "opacity-0")} />
                        {c}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tải lên file Word</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input id="word-file-upload" type="file" accept=".doc,.docx" className="flex-1 max-w-md" />
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
              onClick={handleUploadClick}
            >
              <Upload className="mr-2 h-4 w-4" /> Tải lên
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-auto"
              onClick={() => handleDownloadSample("sample-tot-nghiep.docx")}
            >
              <Download className="h-4 w-4" /> Tải đề thi mẫu
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Chỉ chấp nhận các định dạng .doc, .docx</p>
        </CardContent>
      </Card>

      <ManualWordExamQuestions
        parts={parts}
        onDeleteAll={handleDeleteAll}
        onDeleteQuestion={handleDeleteQuestion}
        onDeletePart={handleDeletePart}
        onAddDefaultPart={() => {
          const newPart = {
            id: `part-${Date.now()}`,
            name: `Phần mặc định ${parts.length + 1}`,
            questions: [],
          };
          setParts((prev) => [...prev, newPart]);
          toast.success("Đã thêm phần thi mặc định.");
        }}
        onAddGroupPart={handleOpenGroupModal}
        onAddOrUpdateQuestion={handleAddOrUpdateQuestion}
      />

      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline">HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">LƯU</Button>
      </div>

      <GroupPartModal isOpen={isGroupModalOpen} onClose={handleCloseGroupModal} onSave={handleSaveGroupPart} />
    </div>
  );
};

export default WordExamUpload;