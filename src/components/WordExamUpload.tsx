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

const testTypes = [
  "Không",
  "Thi giữa kỳ 1",
  "Thi cuối kỳ 1",
  "Thi giữa kỳ 2",
  "Thi cuối kỳ 2",
];

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
  const [selectedTestType, setSelectedTestType] = React.useState<string>('Không');

  const handleAddOrUpdateQuestion = (partId: string, questionId: string | null, newQuestion: Question) => {
    setParts((prevParts) =>
      prevParts.map((part) => {
        if (part.id !== partId) return part;
        let updatedQuestions;
        if (questionId) {
          // Update existing question
          updatedQuestions = part.questions.map((q) => (q.id === questionId ? newQuestion : q));
        } else {
          // Add new question
          updatedQuestions = [...part.questions, newQuestion];
        }
        return { ...part, questions: updatedQuestions };
      }),
    );
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

  const handleUploadClick = () => {
    // Example: add sample questions to all parts
    const now = new Date().toLocaleDateString();
    const newQuestionsPart1: Question[] = [
      {
        id: Date.now().toString() + "1",
        correctAnswer: 'A',
        solution: 'Giải thích câu hỏi mới 1',
        uploadDate: now,
      },
    ];
    const newQuestionsPart2: Question[] = [
      {
        id: Date.now().toString() + "2",
        correctAnswer: 'B',
        solution: 'Giải thích câu hỏi mới 2',
        uploadDate: now,
      },
    ];
    const newQuestionsPart3: Question[] = [
      {
        id: Date.now().toString() + "3",
        correctAnswer: 'C',
        solution: 'Giải thích câu hỏi mới 3',
        uploadDate: now,
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

  const handleDownloadSample = (fileName: string) => {
    const link = document.createElement('a');
    link.href = `/${fileName}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Đang tải ${fileName}...`);
  };

  return (
    <div className="space-y-6">
      {/* Thông tin đề thi */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin đề thi</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* ... (giữ nguyên phần form thông tin đề thi) */}
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
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full sm:w-auto"
              onClick={() => handleDownloadSample('sample-tot-nghiep.docx')}
            >
              <Download className="h-4 w-4" /> Tải đề thi mẫu
            </Button>
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
        onAddDefaultPart={() => {
          const newPart = {
            id: `part-${Date.now()}`,
            name: `Phần mặc định ${parts.length + 1}`,
            questions: [],
          };
          setParts((prev) => [...prev, newPart]);
          toast.success('Đã thêm phần thi mặc định.');
        }}
        onAddGroupPart={() => {
          const newPart = {
            id: `group-part-${Date.now()}`,
            name: `Phần nhóm chủ đề ${parts.length + 1}`,
            questions: [],
          };
          setParts((prev) => [...prev, newPart]);
          toast.success('Đã thêm phần thi nhóm chủ đề.');
        }}
        onAddOrUpdateQuestion={handleAddOrUpdateQuestion} // Truyền hàm cập nhật câu hỏi
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