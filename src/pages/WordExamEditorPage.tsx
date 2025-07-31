import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

interface Question {
  id: string;
  text: string;
  type?: string; // Added type field for question type
  answers: { label: string; text: string; isCorrect: boolean }[];
  explanation?: string;
  audioUrl?: string;
  videoUrl?: string;
}

interface QuestionGroup {
  id: string;
  title: string;
  questions: Question[];
}

const sampleDataInitial: QuestionGroup[] = [
  {
    id: 'group1',
    title: 'PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn.',
    questions: [
      {
        id: 'q1',
        text: 'Mệnh đề toán học nào sau đây là mệnh đề sai?',
        type: 'trac-nghiem',
        answers: [
          { label: 'A', text: 'Số 2 là số nguyên.', isCorrect: false },
          { label: 'B', text: 'Số 2 là số hữu tỉ.', isCorrect: false },
          { label: 'C', text: 'Số 2 là số hữu tỉ dương.', isCorrect: false },
          { label: 'D', text: 'Số 2 không là số nguyên tố.', isCorrect: true },
        ],
        explanation: 'A đúng vì...',
        videoUrl: '',
      },
    ],
  },
  {
    id: 'group2',
    title: 'PHẦN II. Câu trắc nghiệm đúng sai.',
    questions: [
      {
        id: 'q2',
        text: 'Một cuộc thi bản cung có 20 người tham gia. Trong lần bản đầu tiên có 18 người bắn trúng mục tiêu. Trong lần bản thứ hai có 15 người bắn trúng mục tiêu. Trong lần bản thứ ba chỉ còn 10 người bắn trúng mục tiêu.',
        type: 'trac-nghiem-dung-sai',
        answers: [
          { label: 'a)', text: 'Số người bắn trượt mục tiêu trong lần đầu tiên là 2.', isCorrect: true },
          { label: 'b)', text: 'Số người bắn trượt mục tiêu trong lần bản thứ hai là 6.', isCorrect: false },
          { label: 'c)', text: 'Số người bắn trượt mục tiêu trong lần bản thứ nhất và thứ hai nhiều nhất là 8.', isCorrect: false },
          { label: 'd)', text: 'Số người bắn trúng mục tiêu trong cả ba lần bản ít nhất là 3.', isCorrect: true },
        ],
        explanation: '',
        videoUrl: '',
      },
    ],
  },
];

const questionTypeLabels: Record<string, string> = {
  'trac-nghiem': 'Trắc nghiệm',
  'trac-nghiem-dung-sai': 'Trắc nghiệm đúng sai',
  'dien-so': 'Điền số (trả lời ngắn)',
  'keo-tha': 'Kéo thả',
  'tn-nhieu-dapan': 'Trắc nghiệm nhiều đáp án',
  'dung-sai': 'Đúng (Sai)',
};

const WordExamEditorPage: React.FC = () => {
  const [sampleData, setSampleData] = useState<QuestionGroup[]>(sampleDataInitial);
  const [rawText, setRawText] = useState<string>(`[!b:$PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn.$]
Câu 1. Mệnh đề toán học nào sau đây là mệnh đề sai?
A. Số 2 là số nguyên.  B. Số 2 là số hữu tỉ.
C. Số 2 là số hữu tỉ dương. D. Số 2 không là số nguyên tố.

[!b:$PHẦN II. Câu trắc nghiệm đúng sai.$]
Câu 1. Một cuộc thi bản cung có 20 người tham gia. Trong lần bản đầu tiên có 18 người bắn trúng mục tiêu. Trong lần bản thứ hai có 15 người bắn trúng mục tiêu. Trong lần bản thứ ba chỉ còn 10 người bắn trúng mục tiêu.
a) [1,NB] Số người bắn trượt mục tiêu trong lần đầu tiên là 2.
b) [2,NB] Số người bắn trượt mục tiêu trong lần bản thứ hai là 6.
c) [0,TH] Số người bắn trượt mục tiêu trong lần bản thứ nhất và thứ hai nhiều nhất là 8.
d) [2,TH] Số người bắn trúng mục tiêu trong cả ba lần bản ít nhất là 3.
`);

  const handleVideoUrlChange = (groupId: string, questionId: string, value: string) => {
    setSampleData((prevData) =>
      prevData.map((group) => {
        if (group.id !== groupId) return group;
        return {
          ...group,
          questions: group.questions.map((q) => {
            if (q.id !== questionId) return q;
            return { ...q, videoUrl: value };
          }),
        };
      }),
    );
  };

  const handleAddQuestion = (groupId: string, questionType: string) => {
    setSampleData((prevData) =>
      prevData.map((group) => {
        if (group.id !== groupId) return group;
        const newQuestion: Question = {
          id: `q${Date.now()}`,
          text: 'Câu hỏi mới',
          type: questionType,
          answers: [],
          explanation: '',
          videoUrl: '',
        };
        return {
          ...group,
          questions: [...group.questions, newQuestion],
        };
      }),
    );
  };

  return (
    <Layout headerTitle="Chỉnh sửa đề thi Word">
      <div className="flex h-[calc(100vh-120px)] gap-4">
        {/* Left panel: vertical hierarchical question groups with part titles only */}
        <div className="w-1/2 flex flex-col border rounded-md bg-white overflow-y-auto p-4 space-y-6">
          {sampleData.map((group) => (
            <div key={group.id} className="border rounded p-4 flex flex-col">
              <h3 className="font-semibold text-lg mb-4">{group.title}</h3>
              <div className="space-y-4 flex-grow">
                {group.questions.map((q, idx) => (
                  <div key={q.id} className="border rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-sm">Câu {idx + 1}.</div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        {q.audioUrl && <Button size="xs" variant="outline">Audio</Button>}
                        <select className="border rounded px-2 py-1 text-xs">
                          <option>Trắc nghiệm</option>
                          <option>Tự luận</option>
                        </select>
                        <Button size="xs" variant="outline">...</Button>
                      </div>
                    </div>
                    <Input value={q.text} readOnly className="mb-2" />
                    <div className="grid grid-cols-2 gap-2">
                      {q.answers.map((a) => (
                        <button
                          key={a.label}
                          className={cn(
                            "border rounded p-2 text-left text-xs",
                            a.isCorrect ? "border-blue-600 bg-blue-100" : "border-gray-300"
                          )}
                        >
                          <strong>{a.label}</strong>. {a.text}
                        </button>
                      ))}
                    </div>
                    {q.explanation && (
                      <>
                        <div className="mt-2 text-orange-600 font-semibold text-xs text-center">HƯỚNG DẪN GIẢI</div>
                        <div className="text-xs text-muted-foreground">{q.explanation}</div>
                      </>
                    )}
                    {/* Video solution input and display */}
                    <div className="mt-2">
                      <label htmlFor={`video-url-${q.id}`} className="block text-xs font-medium text-muted-foreground mb-1">
                        Link video giải
                      </label>
                      <Input
                        id={`video-url-${q.id}`}
                        type="url"
                        placeholder="Nhập link video giải"
                        value={q.videoUrl || ''}
                        onChange={(e) => handleVideoUrlChange(group.id, q.id, e.target.value)}
                        className="text-xs"
                      />
                      {q.videoUrl && (
                        <a
                          href={q.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-xs mt-1 block"
                        >
                          Xem video giải
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                      Thêm câu hỏi
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {Object.entries(questionTypeLabels).map(([key, label]) => (
                      <DropdownMenuItem key={key} onClick={() => handleAddQuestion(group.id, key)}>
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>

        {/* Right panel: raw text editor */}
        <div className="w-1/2 flex flex-col border rounded-md bg-white overflow-hidden">
          <div className="flex items-center justify-between border-b p-2">
            <div className="font-semibold">Nội dung thô</div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">Upload File</Button>
              <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700">Tiếp tục</Button>
            </div>
          </div>
          <Textarea
            className="flex-1 font-mono text-xs p-4 overflow-auto"
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          <div className="border-t p-2 text-xs text-muted-foreground">
            Nội dung mẫu: Mẫu 1 | Mẫu 2 | Mẫu 3 (Có điền từ) | Mẫu 4 | Mẫu 5 (Có câu Đúng-Sai)
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default WordExamEditorPage;