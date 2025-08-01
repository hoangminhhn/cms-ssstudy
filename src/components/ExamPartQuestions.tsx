"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Pencil } from 'lucide-react';
import AddMultipleChoiceQuestionModal, { MultipleChoiceQuestion } from './AddMultipleChoiceQuestionModal';

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
}

interface ExamPartQuestionsProps {
  parts: ExamPart[];
  onDeleteAll: () => void;
  onDeleteQuestion: (partId: string, questionId: string) => void;
  onDeletePart: (partId: string) => void;
  onAddDefaultPart: () => void;
  onAddGroupPart: () => void;
  renderPartHeader?: (partId: string) => React.ReactNode;
  onAddOrUpdateQuestion: (partId: string, questionId: string | null, newQuestion: Question) => void;
}

const ExamPartQuestions: React.FC<ExamPartQuestionsProps> = ({
  parts,
  onDeleteAll,
  onDeleteQuestion,
  onDeletePart,
  onAddDefaultPart,
  onAddGroupPart,
  renderPartHeader,
  onAddOrUpdateQuestion,
}) => {
  const [selectedTab, setSelectedTab] = React.useState(parts.length > 0 ? parts[0].id : '');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingQuestion, setEditingQuestion] = React.useState<MultipleChoiceQuestion | null>(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = React.useState<number | null>(null);
  const [editingPartId, setEditingPartId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (parts.length > 0 && !parts.find(p => p.id === selectedTab)) {
      setSelectedTab(parts[0].id);
    }
  }, [parts, selectedTab]);

  const handleAddMultipleChoice = () => {
    setEditingQuestion(null);
    setEditingQuestionIndex(null);
    setEditingPartId(selectedTab);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
    setEditingQuestionIndex(null);
    setEditingPartId(null);
  };

  const handleSaveQuestion = (question: MultipleChoiceQuestion) => {
    if (!editingPartId) return;

    const newQuestion: Question = {
      id: editingQuestionIndex !== null && parts.find(p => p.id === editingPartId)?.questions[editingQuestionIndex]
        ? parts.find(p => p.id === editingPartId)!.questions[editingQuestionIndex].id
        : Date.now().toString(),
      correctAnswer: String.fromCharCode(65 + question.correctOptionIndex),
      solution: question.explanation,
      videoLink: question.videoLink,
      uploadDate: new Date().toLocaleDateString(),
      documentLink: undefined,
    };

    onAddOrUpdateQuestion(editingPartId, editingQuestionIndex !== null ? newQuestion.id : null, newQuestion);

    handleModalClose();
  };

  const handleEditQuestion = (partId: string, questionIndex: number) => {
    const part = parts.find(p => p.id === partId);
    if (!part) return;
    const question = part.questions[questionIndex];
    if (!question) return;

    const options = Array(5).fill("");
    const correctOptionIndex = question.correctAnswer.charCodeAt(0) - 65;

    const editingQ: MultipleChoiceQuestion = {
      questionText: "", // No question text stored
      options,
      correctOptionIndex: correctOptionIndex >= 0 && correctOptionIndex < 5 ? correctOptionIndex : 0,
      difficulty: "Nhận biết",
      explanation: question.solution || "",
      videoLink: question.videoLink || "",
    };

    setEditingQuestion(editingQ);
    setEditingQuestionIndex(questionIndex);
    setEditingPartId(partId);
    setIsModalOpen(true);
  };

  return (
    <>
      <Card>
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <h2 className="text-lg font-semibold truncate">Đề thi</h2>
          <div className="flex items-center gap-2">
            <Button
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              onClick={onAddDefaultPart}
            >
              + Phần thi mặc định
            </Button>
            <Button
              className="bg-cyan-500 hover:bg-cyan-600 text-white"
              onClick={onAddGroupPart}
            >
              + Phần thi nhóm chủ đề
            </Button>
            <Button
              variant="outline"
              className="whitespace-nowrap text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={onDeleteAll}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Xóa tất cả
            </Button>
          </div>
        </div>
        <CardContent>
          {parts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Chưa có phần thi nào.
            </div>
          ) : (
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex flex-col">
              <TabsList className="mb-4 overflow-x-auto">
                {parts.map((part) => (
                  <TabsTrigger key={part.id} value={part.id} className="whitespace-nowrap">
                    {part.name} ({part.questions.length})
                  </TabsTrigger>
                ))}
              </TabsList>
              {parts.map((part) => (
                <TabsContent key={part.id} value={part.id} className="p-0 relative">
                  {renderPartHeader && (
                    <div className="p-4 border-b border-border">
                      {renderPartHeader(part.id)}
                    </div>
                  )}
                  <div className="absolute top-2 right-2 z-10">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeletePart(part.id)}
                      aria-label={`Xóa phần thi ${part.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">Xóa phần thi</span>
                    </Button>
                  </div>
                  {part.questions.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      Chưa có câu hỏi nào trong phần này.
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[80px]">#</TableHead>
                          <TableHead>Mã câu hỏi</TableHead>
                          <TableHead>Đáp án</TableHead>
                          <TableHead>Loại câu hỏi</TableHead>
                          <TableHead>Lời giải</TableHead>
                          <TableHead>Video</TableHead>
                          <TableHead>Ngày tải lên</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {part.questions.map((q, index) => (
                          <TableRow key={q.id}>
                            <TableCell>{`Câu ${index + 1}`}</TableCell>
                            <TableCell>{q.id}</TableCell>
                            <TableCell>{q.correctAnswer}</TableCell>
                            <TableCell>TRẮC NGHIỆM</TableCell>
                            <TableCell>
                              {q.documentLink ? (
                                <a
                                  href={q.documentLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block rounded-md bg-pink-100 px-2 py-1 text-xs font-medium text-pink-700 hover:underline"
                                >
                                  Có
                                </a>
                              ) : (
                                <span className="inline-block rounded-md bg-pink-100 px-2 py-1 text-xs font-medium text-pink-700 select-none">
                                  Chưa có
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {q.videoLink ? (
                                <a
                                  href={q.videoLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block rounded-md bg-pink-100 px-2 py-1 text-xs font-medium text-pink-700 hover:underline"
                                >
                                  Có
                                </a>
                              ) : (
                                <span className="inline-block rounded-md bg-pink-100 px-2 py-1 text-xs font-medium text-pink-700 select-none">
                                  Chưa có
                                </span>
                              )}
                            </TableCell>
                            <TableCell>{q.uploadDate}</TableCell>
                            <TableCell className="text-right flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label={`Chỉnh sửa câu hỏi ${q.id}`}
                                onClick={() => handleEditQuestion(part.id, index)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:bg-red-50"
                                onClick={() => onDeleteQuestion(part.id, q.id)}
                                aria-label={`Xóa câu hỏi ${q.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                  <div className="flex flex-wrap gap-2 mt-4 px-2">
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-white flex-1 min-w-[120px]" onClick={handleAddMultipleChoice}>
                      +TRẮC NGHIỆM
                    </Button>
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-white flex-1 min-w-[120px]">
                      +TRẮC NGHIỆM ĐÚNG SAI
                    </Button>
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-white flex-1 min-w-[120px]">
                      +ĐIỀN SỐ/TRẢ LỜI NGẮN
                    </Button>
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-white flex-1 min-w-[120px]">
                      +KÉO THẢ
                    </Button>
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-white flex-1 min-w-[120px]">
                      +TN NHIỀU ĐÁP ÁN
                    </Button>
                    <Button className="bg-cyan-500 hover:bg-cyan-600 text-white flex-1 min-w-[120px]">
                      +ĐÚNG/SAI
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      <AddMultipleChoiceQuestionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveQuestion}
        questionNumber={editingQuestionIndex !== null ? editingQuestionIndex + 1 : parts.findIndex(p => p.id === editingPartId) + 1}
        {...(editingQuestion ? { ...editingQuestion } : {})}
      />
    </>
  );
};

export default ExamPartQuestions;