import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  text: string;
  answers: { label: string; text: string; isCorrect: boolean }[];
  explanation?: string;
  audioUrl?: string;
}

interface QuestionGroup {
  id: string;
  title: string;
  questions: Question[];
}

const sampleData: QuestionGroup[] = [
  {
    id: 'group1',
    title: 'PHẦN I. Câu trắc nghiệm nhiều phương án lựa chọn.',
    questions: [
      {
        id: 'q1',
        text: 'Mệnh đề toán học nào sau đây là mệnh đề sai?',
        answers: [
          { label: 'A', text: 'Số 2 là số nguyên.', isCorrect: false },
          { label: 'B', text: 'Số 2 là số hữu tỉ.', isCorrect: false },
          { label: 'C', text: 'Số 2 là số hữu tỉ dương.', isCorrect: false },
          { label: 'D', text: 'Số 2 không là số nguyên tố.', isCorrect: true },
        ],
        explanation: 'A đúng vì...',
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
        answers: [
          { label: 'a)', text: 'Số người bắn trượt mục tiêu trong lần đầu tiên là 2.', isCorrect: true },
          { label: 'b)', text: 'Số người bắn trượt mục tiêu trong lần bản thứ hai là 6.', isCorrect: false },
          { label: 'c)', text: 'Số người bắn trượt mục tiêu trong lần bản thứ nhất và thứ hai nhiều nhất là 8.', isCorrect: false },
          { label: 'd)', text: 'Số người bắn trúng mục tiêu trong cả ba lần bản ít nhất là 3.', isCorrect: true },
        ],
        explanation: '',
      },
    ],
  },
];

interface WordExamEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WordExamEditorModal: React.FC<WordExamEditorModalProps> = ({ open, onOpenChange }) => {
  const [selectedGroupId, setSelectedGroupId] = useState(sampleData[0].id);
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

  const selectedGroup = sampleData.find(g => g.id === selectedGroupId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 m-0 w-full max-w-full max-h-full p-0 rounded-none overflow-hidden flex flex-col">
        <DialogHeader className="flex items-center justify-between border-b border-border p-4 flex-shrink-0">
          <DialogTitle>Chỉnh sửa đề thi Word</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="icon" aria-label="Close">
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="flex flex-1 overflow-hidden">
          {/* Left panel */}
          <div className="w-1/2 flex flex-col border-r border-border overflow-auto p-4 bg-white">
            <Tabs value={selectedGroupId} onValueChange={setSelectedGroupId} className="flex flex-col h-full">
              <TabsList className="mb-4 flex-shrink-0">
                {sampleData.map(group => (
                  <TabsTrigger key={group.id} value={group.id}>
                    {group.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="flex-1 overflow-auto">
                {selectedGroup?.questions.map((q, idx) => (
                  <div key={q.id} className="mb-4 border rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">Câu {idx + 1}</div>
                      <Button size="sm" variant="outline">Nhập điểm</Button>
                    </div>
                    <div className="mb-2">{q.text}</div>
                    <div className="grid grid-cols-2 gap-2">
                      {q.answers.map((a) => (
                        <button
                          key={a.label}
                          className={cn(
                            "border rounded p-2 text-left",
                            a.isCorrect ? "border-blue-600 bg-blue-100" : "border-gray-300"
                          )}
                        >
                          <strong>{a.label}</strong>. {a.text}
                        </button>
                      ))}
                    </div>
                    {q.explanation && (
                      <div className="mt-2 text-sm text-orange-600 font-semibold">HƯỚNG DẪN GIẢI</div>
                    )}
                    {q.explanation && (
                      <div className="text-sm text-muted-foreground">{q.explanation}</div>
                    )}
                  </div>
                ))}
              </div>
            </Tabs>
          </div>

          {/* Right panel */}
          <div className="w-1/2 flex flex-col bg-white overflow-hidden">
            <div className="flex items-center justify-between border-b border-border p-2 flex-shrink-0">
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
            <div className="border-t border-border p-2 text-xs text-muted-foreground flex-shrink-0">
              Nội dung mẫu: Mẫu 1 | Mẫu 2 | Mẫu 3 (Có điền từ) | Mẫu 4 | Mẫu 5 (Có câu Đúng-Sai)
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WordExamEditorModal;