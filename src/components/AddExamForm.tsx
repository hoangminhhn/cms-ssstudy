import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Trash2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const AddExamForm: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Thông tin đề thi */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin đề thi</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="exam-code">Mã đề thi</Label>
              <Input id="exam-code" placeholder="Nhập mã đề thi" />
            </div>
            <div>
              <Label htmlFor="exam-name">Tên đề thi</Label>
              <Input id="exam-name" placeholder="Nhập tên đề thi" />
            </div>
            <div>
              <Label htmlFor="solution-link">Link video lời giải</Label>
              <Input id="solution-link" placeholder="Nhập link video lời giải" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="exam-time">Thời gian làm bài</Label>
              <Input id="exam-time" placeholder="Nhập thời gian làm bài" />
            </div>
            <div>
              <Label htmlFor="exam-type">Loại đề thi</Label>
              <Select>
                <SelectTrigger id="exam-type">
                  <SelectValue placeholder="-- Chọn danh mục --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trac-nghiem">Trắc nghiệm</SelectItem>
                  <SelectItem value="tu-luan">Tự luận</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="allow-retry">Cho phép làm lại</Label>
              <Select>
                <SelectTrigger id="allow-retry">
                  <SelectValue placeholder="Không cho phép" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Có</SelectItem>
                  <SelectItem value="no">Không</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="grade-level">Lớp học</Label>
              <Select>
                <SelectTrigger id="grade-level">
                  <SelectValue placeholder="Cấp học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cap1">Cấp 1</SelectItem>
                  <SelectItem value="cap2">Cấp 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subject">Môn học</Label>
              <Select>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="-- Chọn môn học --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="toan">Toán</SelectItem>
                  <SelectItem value="van">Văn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exam-group">Nhóm đề</Label>
              <Select>
                <SelectTrigger id="exam-group">
                  <SelectValue placeholder="Mặc định" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Mặc định</SelectItem>
                  <SelectItem value="group1">Nhóm 1</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="exam-format">Hình thức thi</Label>
              <Select>
                <SelectTrigger id="exam-format">
                  <SelectValue placeholder="Trắc nghiệm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multiple-choice">Trắc nghiệm</SelectItem>
                  <SelectItem value="essay">Tự luận</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exam-link">Link đề</Label>
              <Input id="exam-link" placeholder="Nhập link đề" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Đề thi (PDF)</Label>
              <RadioGroup defaultValue="google-drive" className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="google-drive" id="google-drive" />
                  <Label htmlFor="google-drive">GOOGLE DRIVE</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label htmlFor="pdf">PDF</Label>
                </div>
              </RadioGroup>
              <Input placeholder="Nhập link tài liệu" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Đề thi */}
      <Card>
        <CardHeader>
          <CardTitle>Đề thi</CardTitle>
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

      {/* Footer Buttons */}
      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline">HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">TẠO MỚI</Button>
      </div>
    </div>
  );
};

export default AddExamForm;