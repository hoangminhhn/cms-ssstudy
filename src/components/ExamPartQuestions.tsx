import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2 } from 'lucide-react';

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
}

const ExamPartHeader: React.FC<{ onDeleteAll: () => void }> = ({ onDeleteAll }) => (
  <div className="flex items-center justify-between px-4 py-2 border-b border-border">
    <h2 className="text-lg font-semibold truncate flex-grow m-0">Đề thi</h2>
    <Button
      variant="outline"
      className="flex-shrink-0 whitespace-nowrap text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 ml-4"
      onClick={onDeleteAll}
    >
      <Trash2 className="mr-2 h-4 w-4" /> Xóa tất cả
    </Button>
  </div>
);

const ExamPartQuestions: React.FC<ExamPartQuestionsProps> = ({
  parts,
  onDeleteAll,
  onDeleteQuestion,
}) => {
  const [selectedTab, setSelectedTab] = React.useState(parts.length > 0 ? parts[0].id : '');

  React.useEffect(() => {
    if (parts.length > 0 && !parts.find(p => p.id === selectedTab)) {
      setSelectedTab(parts[0].id);
    }
  }, [parts, selectedTab]);

  return (
    <Card>
      <ExamPartHeader onDeleteAll={onDeleteAll} />
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
              <TabsContent key={part.id} value={part.id} className="p-0">
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
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamPartQuestions;