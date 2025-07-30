import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';

const WordExamUpload: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Thông tin đề thi */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin đề thi</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          {/* First row with 4 fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="exam-code">Mã đề thi</Label>
              <Input id="exam-code" placeholder="Nhập mã đề thi" className="max-w-sm" />
            </div>
            <div>
              <Label htmlFor="exam-name">Tên đề thi</Label>
              <Input id="exam-name" placeholder="Nhập tên đề thi" className="max-w-sm" />
            </div>
            <div>
              <Label htmlFor="exam-type">Loại đề thi</Label>
              <Select defaultValue="tot-nghiep">
                <SelectTrigger id="exam-type" className="max-w-sm">
                  <SelectValue placeholder="Tốt nghiệp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tot-nghiep">Tốt nghiệp</SelectItem>
                  <SelectItem value="kiem-tra">Kiểm tra</SelectItem>
                  <SelectItem value="on-tap">Ôn tập</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="allow-retry">Cho phép làm lại</Label>
              <Select defaultValue="no">
                <SelectTrigger id="allow-retry" className="max-w-sm">
                  <SelectValue placeholder="Không cho phép" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Có</SelectItem>
                  <SelectItem value="no">Không cho phép</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Second row with 4 fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="exam-group">Nhóm đề</Label>
              <Select defaultValue="default">
                <SelectTrigger id="exam-group" className="max-w-sm">
                  <SelectValue placeholder="Mặc định" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Mặc Định</SelectItem>
                  <SelectItem value="test">Thi Thử</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="grade-level">Lớp học</Label>
              <Select defaultValue="lop-hoc">
                <SelectTrigger id="grade-level" className="max-w-sm">
                  <SelectValue placeholder="-- Lớp học --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lop-hoc">-- Lớp học --</SelectItem>
                  <SelectItem value="10">Lớp 10</SelectItem>
                  <SelectItem value="11">Lớp 11</SelectItem>
                  <SelectItem value="12">Lớp 12</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subject">Môn học</Label>
              <Select defaultValue="chon-mon-hoc">
                <SelectTrigger id="subject" className="max-w-sm">
                  <SelectValue placeholder="-- Chọn môn học --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="chon-mon-hoc">-- Chọn môn học --</SelectItem>
                  <SelectItem value="toan">Toán</SelectItem>
                  <SelectItem value="van">Văn</SelectItem>
                  <SelectItem value="anh">Tiếng Anh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="exam-time">Thời gian (phút)</Label>
              <Input id="exam-time" type="number" defaultValue={90} className="max-w-sm" />
            </div>
          </div>

          {/* Third row with 2 fields and 1 switch */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="exam-pdf-link">Link đề thi PDF</Label>
              <Input id="exam-pdf-link" placeholder="Nhập link đề thi PDF" className="max-w-sm" />
            </div>
            <div>
              <Label htmlFor="answer-pdf-link">Link đáp án PDF</Label>
              <Input id="answer-pdf-link" placeholder="Nhập link đáp án PDF" className="max-w-sm" />
            </div>
            <div className="flex items-center space-x-2 mt-6">
              <Switch id="configure-scoring" />
              <Label htmlFor="configure-scoring">Cấu hình thang điểm câu hỏi đúng sai</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phần thi */}
      <Card>
        <CardHeader>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white w-fit">
            <Plus className="mr-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="section-name">Tên phần thi</Label>
              <Input id="section-name" placeholder="Nhập tên phần thi" className="max-w-sm" />
            </div>
            <div>
              <Label htmlFor="section-type">Loại phần thi</Label>
              <Select defaultValue="default">
                <SelectTrigger id="section-type" className="max-w-sm">
                  <SelectValue placeholder="Mặc định" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Mặc định</SelectItem>
                  <SelectItem value="multiple-choice">Trắc nghiệm</SelectItem>
                  <SelectItem value="essay">Tự luận</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white w-fit">
            <Plus className="mr-2 h-4 w-4" /> Thêm mới phần thi
          </Button>
        </CardContent>
      </Card>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline">HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">LƯU</Button>
      </div>
    </div>
  );
};

export default WordExamUpload;