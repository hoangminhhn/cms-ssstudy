import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Pencil } from 'lucide-react';

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
  onAddDefaultPart: () => void; // New prop for adding default part
  onAddGroupPart: () => void;   // New prop for adding group part
  renderPartHeader?: (partId: string) => React.ReactNode;
}

const ExamPartQuestions: React.FC<ExamPartQuestionsProps> = ({
  parts,
  onDeleteAll,
  onDeleteQuestion,
  onDeletePart,
  onAddDefaultPart,
  onAddGroupPart,
  renderPartHeader,
}) => {
  const [selectedTab, setSelectedTab] = React.useState(parts.length > 0 ? parts[0].id : '');

  React.useEffect(() => {
    if (parts.length > 0 && !parts.find(p => p.id === selectedTab)) {
      setSelectedTab(parts[0].id);
    }
  }, [parts, selectedTab]);

  return (
    <Card>
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <div className="flex gap-2">
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
        </div>
        <Button
          variant="outline"
          className="whitespace-nowrap text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={onDeleteAll}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Xóa tất cả
        </Button>
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
                          <TableCell>{q.id.slice(0, 6)}</TableCell>
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
                  <Button className="bg-cyan-500 hover:bg-cyan-600 text-white flex-1 min-w-[120px]">
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
  );
};

export default ExamPartQuestions;