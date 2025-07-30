import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

const WordExamEditorPage: React.FC = () => {
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

  return (
    <Layout headerTitle="Chỉnh sửa đề thi Word">
      <div className="flex h-[calc(100vh-120px)] gap-4">
        {/* Left panel: vertical hierarchical question groups with part titles only */}
        <div className="w-1/2 flex flex-col border rounded-md bg-white overflow-y-auto p-4 space-y-6">
          {sampleData.map((group) => (
            <div key={group.id} className="border rounded p-4">
              <h3 className="font-semibold text-lg mb-4">{group.title}</h3>
              <div className="space-y-4">
                {group.questions.map((q, idx) => (
                  <div key={q.id} className="border rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-sm">Câu {idx + 1}.</div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <Button size="xs" variant="outline">Nhập điểm</Button>
                        {q.audioUrl && <Button size="xs" variant="outline">Audio</Button>}
                        <select className="border rounded px-2 py-1 text-xs">
                          <option>Trắc nghiệm</option>
                          <option>Tự luận</option>
                        </select>
                        <Button size="xs" variant="outline">Đổi câu khác</Button>
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
                  </div>
                ))}
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