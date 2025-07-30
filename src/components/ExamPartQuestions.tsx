import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';

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
  onAddQuestion: (partId: string) => void;
  onDeleteQuestion: (partId: string, questionId: string) => void;
}

const ExamPartQuestions: React.FC<ExamPartQuestionsProps> = ({
  parts,
  onDeleteAll,
  onAddQuestion,
  onDeleteQuestion,
}) => {
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Câu hỏi đề thi</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={onDeleteAll}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Xóa tất cả
          </Button>
          {/* Optionally, a global add question button could be here */}
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="space-y-4">
          {parts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Chưa có phần thi nào.
            </div>
          ) : (
            parts.map((part) => (
              <AccordionItem key={part.id} value={part.id}>
                <AccordionTrigger className="text-lg font-semibold">
                  {part.name} ({part.questions.length} câu hỏi)
                </AccordionTrigger>
                <AccordionContent>
                  <div className="mb-4 flex justify-end">
                    <Button
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={() => onAddQuestion(part.id)}
                    >
                      <Plus className="mr-1 h-4 w-4" /> Thêm câu hỏi
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
                          <TableHead>Mã câu hỏi</TableHead>
                          <TableHead>Đáp án đúng</TableHead>
                          <TableHead>Lời giải</TableHead>
                          <TableHead>Tài liệu</TableHead>
                          <TableHead>Video</TableHead>
                          <TableHead>Ngày tải lên</TableHead>
                          <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {part.questions.map((q) => (
                          <TableRow key={q.id}>
                            <TableCell>{q.id}</TableCell>
                            <TableCell>{q.correctAnswer}</TableCell>
                            <TableCell>{q.solution}</TableCell>
                            <TableCell>
                              {q.documentLink ? (
                                <a href={q.documentLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  Tài liệu
                                </a>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>
                              {q.videoLink ? (
                                <a href={q.videoLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                  Video
                                </a>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>{q.uploadDate}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
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
                </AccordionContent>
              </AccordionItem>
            ))
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ExamPartQuestions;