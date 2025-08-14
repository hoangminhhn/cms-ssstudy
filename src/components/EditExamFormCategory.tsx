import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const EditExamFormCategory: React.FC = () => {
  // --- Các state và logic của phần "Chỉnh sửa danh mục" và "Cài đặt thời gian" giữ nguyên ---
  const [examName, setExamName] = React.useState('Kỳ thi HSA');
  const [displayMode, setDisplayMode] = React.useState('single-screen');
  const [timeSettingMode, setTimeSettingMode] = React.useState('total');
  const [configureScoring, setConfigureScoring] = React.useState(false);
  const [scoringPercentages, setScoringPercentages] = React.useState({
    oneCorrect: 0,
    twoCorrect: 0,
    threeCorrect: 0,
    fourCorrect: 0
  });
  // ... các state và logic khác của trang giữ nguyên ...

  // --- Chỉ chỉnh sửa chức năng "Quản lý Phần thi" ---
  // State quản lý phần thi đơn giản: chỉ thêm mới và xóa phần thi
  const [parts, setParts] = React.useState<{ id: string; name: string }[]>([
    { id: 'part1', name: 'Phần thi 1' },
    { id: 'part2', name: 'Phần thi 2' },
    { id: 'part3', name: 'Phần thi 3' }
  ]);
  const [newPartName, setNewPartName] = React.useState('');

  const handleAddPart = () => {
    const trimmedName = newPartName.trim();
    if (!trimmedName) {
      toast.error('Vui lòng nhập tên phần thi');
      return;
    }
    if (parts.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error('Phần thi đã tồn tại');
      return;
    }
    const newPart = { id: `part-${Date.now()}`, name: trimmedName };
    setParts(prev => [...prev, newPart]);
    setNewPartName('');
    toast.success('Đã thêm phần thi mới');
  };

  const handleDeletePart = (id: string) => {
    setParts(prev => prev.filter(p => p.id !== id));
    toast.success('Đã xóa phần thi');
  };

  return (
    <div className="space-y-6">
      {/* --- Phần Chỉnh sửa Danh mục (giữ nguyên) --- */}
      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa Danh mục Kỳ thi</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="exam-name">Tên kỳ thi</Label>
            <Input 
              id="exam-name" 
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="display-mode">Hình thức hiển thị</Label>
            <Select 
              value={displayMode}
              onValueChange={setDisplayMode}
              id="display-mode"
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn hình thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-screen">1 màn hình</SelectItem>
                <SelectItem value="multi-screen">Nhiều màn hình</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="question-display">Hiển thị câu hỏi</Label>
            <Select id="question-display" defaultValue="one-per-screen">
              <SelectTrigger>
                <SelectValue placeholder="Chọn cách hiển thị" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-per-screen">1 câu/màn hình</SelectItem>
                <SelectItem value="all-at-once">Tất cả cùng lúc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* --- Phần Quản lý Phần thi được chỉnh sửa riêng --- */}
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
            <Button
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleAddPart}
            >
              Thêm
            </Button>
          </div>
          {parts.length > 0 ? (
            <div className="space-y-2">
              {parts.map((part) => (
                <div
                  key={part.id}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <span>{part.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePart(part.id)}
                    aria-label={`Xóa phần thi ${part.name}`}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              Chưa có phần thi nào
            </p>
          )}
        </CardContent>
      </Card>

      {/* --- Phần Cài đặt Thời gian (giữ nguyên) --- */}
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt Thời gian</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={timeSettingMode}
            onValueChange={setTimeSettingMode}
            className="flex items-center gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="total" id="time-total" />
              <Label htmlFor="time-total">Thời gian tổng</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="per-part" id="time-per-part" />
              <Label htmlFor="time-per-part">Theo từng phần</Label>
            </div>
          </RadioGroup>
          {/* Các cấu hình thời gian khác giữ nguyên */}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditExamFormCategory;