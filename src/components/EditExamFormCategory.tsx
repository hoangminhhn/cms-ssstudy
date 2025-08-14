import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useState } from 'react';

const EditExamFormCategory: React.FC = () => {
  // Các state và logic khác giữ nguyên

  // State quản lý phần thi đơn giản
  const [parts, setParts] = React.useState<{ id: string; name: string }[]>([
    { id: 'part1', name: 'Phần thi 1' },
    { id: 'part2', name: 'Phần thi 2' },
    { id: 'part3', name: 'Phần thi 3' },
  ]);
  const [newPartName, setNewPartName] = React.useState('');

  const handleAddPart = () => {
    const trimmedName = newPartName.trim();
    if (!trimmedName) {
      toast.error('Tên phần thi không được để trống.');
      return;
    }
    if (parts.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error('Phần thi đã tồn tại.');
      return;
    }
    const newPart = {
      id: `part-${Date.now()}`,
      name: trimmedName,
    };
    setParts(prev => [...prev, newPart]);
    setNewPartName('');
    toast.success('Đã thêm phần thi mới.');
  };

  const handleDeletePart = (id: string) => {
    setParts(prev => prev.filter(p => p.id !== id));
    toast.success('Đã xóa phần thi.');
  };

  return (
    <div className="space-y-6">
      {/* Giữ nguyên toàn bộ các phần cấu hình khác như ảnh */}
      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa Danh Mục Kỳ Thi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="exam-name">Tên kỳ thi</Label>
              <Input id="exam-name" defaultValue="Kỳ thi HSA" />
            </div>
            <div>
              <Label htmlFor="display-mode">Hình thức hiển thị phần thi</Label>
              <Select defaultValue="1 màn hình" id="display-mode">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 màn hình">1 màn hình</SelectItem>
                  <SelectItem value="nhiều màn hình">Nhiều màn hình</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="navigation-mode">Cách di chuyển giữa các phần thi</Label>
              <Select defaultValue="Tự do" id="navigation-mode">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tự do">Tự do</SelectItem>
                  <SelectItem value="tuần tự">Tuần tự</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="question-selection">Cách chọn câu hỏi</Label>
              <Select defaultValue="Làm bất kỳ" id="question-selection">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Làm bất kỳ">Làm bất kỳ</SelectItem>
                  <SelectItem value="Làm theo thứ tự">Làm theo thứ tự</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="question-display">Cách hiển thị câu hỏi</Label>
              <Select defaultValue="1 câu trong màn" id="question-display">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1 câu trong màn">1 câu trong màn</SelectItem>
                  <SelectItem value="nhiều câu trong màn">Nhiều câu trong màn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="part-display">Phần thi</Label>
              <Select defaultValue="Đầy đủ 3 phần thi" id="part-display">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Đầy đủ 3 phần thi">Đầy đủ 3 phần thi</SelectItem>
                  <SelectItem value="rút gọn">Rút gọn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 col-span-full">
              <Switch id="score-scale" />
              <Label htmlFor="score-scale" className="mb-0">
                Cấu hình thang điểm đúng sai
              </Label>
            </div>
            <div>
              <Label htmlFor="score-1">Trả lời đúng 1 ý</Label>
              <Input id="score-1" type="number" defaultValue={0} />
            </div>
            <div>
              <Label htmlFor="score-2">Trả lời đúng 2 ý</Label>
              <Input id="score-2" type="number" defaultValue={0} />
            </div>
            <div>
              <Label htmlFor="score-3">Trả lời đúng 3 ý</Label>
              <Input id="score-3" type="number" defaultValue={0} />
            </div>
            <div>
              <Label htmlFor="score-4">Trả lời đúng 4 ý</Label>
              <Input id="score-4" type="number" defaultValue={0} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* --- Đơn giản hóa phần Quản lý Phần thi --- */}
      <Card>
        <CardHeader>
          <CardTitle>Quản lý Phần thi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Nhập tên phần thi mới"
              value={newPartName}
              onChange={(e) => setNewPartName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddPart();
                }
              }}
            />
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleAddPart}>
              Thêm
            </Button>
          </div>
          {parts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">Chưa có phần thi nào.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700">
                  <th className="py-2 px-4">Tên phần thi</th>
                  <th className="py-2 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {parts.map((part) => (
                  <tr key={part.id} className="border-b border-gray-200 dark:border-gray-800">
                    <td className="py-2 px-4">{part.name}</td>
                    <td className="py-2 px-4 text-right">
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                        size="sm"
                        onClick={() => handleDeletePart(part.id)}
                        aria-label={`Xóa phần thi ${part.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Giữ nguyên các phần khác nếu có */}
    </div>
  );
};

export default EditExamFormCategory;