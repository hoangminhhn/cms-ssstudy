import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ManualWordExamQuestions: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Câu hỏi đề thi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700">
            <Trash2 className="mr-2 h-4 w-4" /> Xóa tất cả
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Tạo câu hỏi thủ công
          </Button>
        </div>
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
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                Chưa có câu hỏi nào!
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ManualWordExamQuestions;