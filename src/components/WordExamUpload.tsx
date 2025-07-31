import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Upload, Download, ChevronDown } from 'lucide-react';
import ManualWordExamQuestions from './ManualWordExamQuestions';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface Question {
  id: string;
  correctAnswer: string;
  solution: string;
  documentLink?: string;
  videoLink?: string;
  uploadDate: string;
}

interface ExamPart {
  id: string;
  name: string;
  questions: Question[];
  uploadedFileName?: string;
}

const sampleFiles = [
  { label: 'Đề thi tốt nghiệp', fileName: 'sample-tot-nghiep.docx' },
  { label: 'Đề thi HSA', fileName: 'sample-hsa.docx' },
  { label: 'Đề thi TSA', fileName: 'sample-tsa.docx' },
  { label: 'Đề thi V-ACT', fileName: 'sample-v-act.docx' },
];

const cities = [
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

const WordExamUpload: React.FC = () => {
  const [parts, setParts] = React.useState<ExamPart[]>([
    {
      id: 'part1',
      name: 'Phần 1',
      questions: [],
    },
    {
      id: 'part2',
      name: 'Phần 2',
      questions: [],
    },
    {
      id: 'part3',
      name: 'Phần 3',
      questions: [],
    },
  ]);

  const [selectedExamType, setSelectedExamType] = React.useState<string>('');
  const [selectedExamGroup, setSelectedExamGroup] = React.useState<string>('default');
  const [selectedCity, setSelectedCity] = React.useState<string>('');
  const navigate = useNavigate();

  const handleUploadClick = () => {
    const newQuestionsPart1: Question[] = [
      {
        id: `Q${Date.now()}1`,
        correctAnswer: 'A',
        solution: 'Giải thích câu hỏi mới 1',
        uploadDate: new Date().toLocaleDateString(),
      },
    ];
    const newQuestionsPart2: Question[] = [
      {
        id: `Q${Date.now()}2`,
        correctAnswer: 'B',
        solution: 'Giải thích câu hỏi mới 2',
        uploadDate: new Date().toLocaleDateString(),
      },
    ];
    const newQuestionsPart3: Question[] = [
      {
        id: `Q${Date.now()}3`,
        correctAnswer: 'C',
        solution: 'Giải thích câu hỏi mới 3',
        uploadDate: new Date().toLocaleDateString(),
      },
    ];

    setParts((prevParts) =>
      prevParts.map((part) => {
        if (part.id === 'part1') {
          return { ...part, questions: [...part.questions, ...newQuestionsPart1] };
        }
        if (part.id === 'part2') {
          return { ...part, questions: [...part.questions, ...newQuestionsPart2] };
        }
        if (part.id === 'part3') {
          return { ...part, questions: [...part.questions, ...newQuestionsPart3] };
        }
        return part;
      }),
    );

    toast.success('Đã thêm câu hỏi mẫu cho 3 phần thi.');
  };

  const handleDeleteAll = () => {
    setParts((prev) => prev.map((part) => ({ ...part, questions: [] })));
    toast.success('Đã xóa tất cả câu hỏi.');
  };

  const handleDeleteQuestion = (partId: string, questionId: string) => {
    setParts((prev) =>
      prev.map((part) =>
        part.id === partId
          ? {
              ...part,
              questions: part.questions.filter((q) => q.id !== questionId),
            }
          : part,
      ),
    );
    toast.success('Đã xóa câu hỏi.');
  };

  const handleDeletePart = (partId: string) => {
    setParts((prev) => prev.filter((part) => part.id !== partId));
    toast.success('Đã xóa phần thi.');
  };

  const handleDownloadSample = (fileName: string) => {
    const link = document.createElement('a');
    link.href = `/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Đang tải ${fileName}...`);
  };

  const handleFileChange = (partId: string, file: File | null) => {
    if (!file) return;
    setParts((prev) =>
      prev.map((part) =>
        part.id === partId ? { ...part, uploadedFileName: file.name } : part
      )
    );
    toast.success(`Đã tải lên file "${file.name}" cho ${partId}`);
  };

  const renderPartHeader = (partId: string) => {
    const part = parts.find(p => p.id === partId);
    return (
      <div className="flex items-center gap-4">
        <Label htmlFor={`upload-${partId}`} className="min-w-[120px]">Tải lên file Word</Label>
        <Input
          id={`upload-${partId}`}
          type="file"
          accept=".doc,.docx"
          onChange={(e) => handleFileChange(partId, e.target.files ? e.target.files[0] : null)}
          className="max-w-xs"
        />
        {part?.uploadedFileName && (
          <span className="text-sm text-muted-foreground truncate max-w-xs" title={part.uploadedFileName}>
            Đã tải lên: {part.uploadedFileName}
          </span>
        )}
      </div>
    );
  };

  // New handlers for adding parts
  const handleAddDefaultPart = () => {
    const newPart: ExamPart = {
      id: `part-${Date.now()}`,
      name: `Phần mặc định ${parts.length + 1}`,
      questions: [],
    };
    setParts((prev) => [...prev, newPart]);
    toast.success('Đã thêm phần thi mặc định.');
  };

  const handleAddGroupPart = () => {
    const newPart: ExamPart = {
      id: `group-part-${Date.now()}`,
      name: `Phần nhóm chủ đề ${parts.length + 1}`,
      questions: [],
    };
    setParts((prev) => [...prev, newPart]);
    toast.success('Đã thêm phần thi nhóm chủ đề.');
  };

  return (
    <div className="space-y-6">
      {/* Thông tin đề thi */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin đề thi</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-10 gap-4">
            <div>
              <Label htmlFor="exam-code">Mã đề thi</Label>
              <Input
                id="exam-code"
                placeholder="Tự động"
                readOnly
                className="max-w-[120px] bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
              />
            </div>
            <div className="lg:col-span-4">
              <Label htmlFor="exam-name">Tên đề thi</Label>
              <Input id="exam-name" placeholder="Nhập tên đề thi" />
            </div>
            <div>
              <Label htmlFor="city-select">Thành phố</Label>
              <Select
                value={selectedCity}
                onValueChange={setSelectedCity}
                name="city-select"
                aria-label="Chọn thành phố"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thành phố" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Thành phố</SelectLabel>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exam-type">Kỳ thi</Label>
              <Select
                value={selectedExamType}
                onValueChange={(value) => setSelectedExamType(value)}
                className="max-w-sm"
              >
                <SelectTrigger id="exam-type">
                  <SelectValue placeholder="Chọn kỳ thi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tot-nghiep">Tốt nghiệp</SelectItem>
                  <SelectItem value="hsa">HSA</SelectItem>
                  <SelectItem value="tsa">TSA</SelectItem>
                  <SelectItem value="v-act">V-ACT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {selectedExamType && (
              <div>
                <Label htmlFor="part-selection">Phần thi</Label>
                <Select defaultValue="full" className="max-w-sm">
                  <SelectTrigger id="part-selection">
                    <SelectValue placeholder="Đầy đủ 3 phần" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Đầy đủ 3 phần</SelectItem>
                    <SelectItem value="part1">Phần 1</SelectItem>
                    <SelectItem value="part2">Phần 2</SelectItem>
                    <SelectItem value="part3">Phần 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="exam-group">Nhóm đề</Label>
              <Select
                value={selectedExamGroup}
                onValueChange={(value) => setSelectedExamGroup(value)}
                className="max-w-sm"
              >
                <SelectTrigger id="exam-group">
                  <SelectValue placeholder="Mặc định" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Mặc định</SelectItem>
                  <SelectItem value="mock">Thi thử</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="grade-level">Lớp</Label>
              <Select defaultValue="class1" className="max-w-sm">
                <SelectTrigger id="grade-level">
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class1">Lớp 1</SelectItem>
                  <SelectItem value="class2">Lớp 2</SelectItem>
                  <SelectItem value="class3">Lớp 3</SelectItem>
                  <SelectItem value="class4">Lớp 4</SelectItem>
                  <SelectItem value="class5">Lớp 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subject">Môn học</Label>
              <Select defaultValue="toan" className="max-w-sm">
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toan">Toán</SelectItem>
                  <SelectItem value="van">Văn</SelectItem>
                  <SelectItem value="anh">Tiếng Anh</SelectItem>
                  <SelectItem value="ly">Vật lí</SelectItem>
                  <SelectItem value="hoa">Hóa học</SelectItem>
                  <SelectItem value="sinh">Sinh học</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="allow-retry">Cho phép làm lại</Label>
              <Select defaultValue="no" className="max-w-sm">
                <SelectTrigger id="allow-retry">
                  <SelectValue placeholder="Không cho phép" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Có</SelectItem>
                  <SelectItem value="no">Không cho phép</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tải lên file Word và tải đề thi mẫu */}
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
              <Upload className="mr-2 h-4 w-4" /> TH Full 3 phần
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                  <Download className="h-4 w-4" /> Tải đề thi mẫu <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {sampleFiles.map((file) => (
                  <DropdownMenuItem
                    key={file.fileName}
                    onClick={() => handleDownloadSample(file.fileName)}
                  >
                    {file.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-muted-foreground">Chỉ chấp nhận các định dạng .doc, .docx</p>
        </CardContent>
      </Card>

      {/* Câu hỏi đề thi (Manual Input) */}
      <ManualWordExamQuestions
        parts={parts}
        onDeleteAll={handleDeleteAll}
        onDeleteQuestion={handleDeleteQuestion}
        onDeletePart={handleDeletePart}
        renderPartHeader={renderPartHeader}
        onAddDefaultPart={handleAddDefaultPart}
        onAddGroupPart={handleAddGroupPart}
      />

      {/* Footer Buttons */}
      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline">HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">LƯU</Button>
      </div>
    </div>
  );
};

export default WordExamUpload;