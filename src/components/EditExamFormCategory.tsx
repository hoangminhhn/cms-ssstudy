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
  // ============================
  // STATE VÀ LOGIC KHUNG CHUNG
  // (giữ nguyên mọi thứ đã có)
  // ============================
  const [examName, setExamName] = React.useState('Kỳ thi HSA');
  const [displayMode, setDisplayMode] = React.useState('single-screen');
  const [timeSettingMode, setTimeSettingMode] = React.useState('total');
  const [configureScoring, setConfigureScoring] = React.useState(false);
  const [scoringPercentages, setScoringPercentages] = React.useState({
    oneCorrect: 0,
    twoCorrect: 0,
    threeCorrect: 0,
    fourCorrect: 0,
  });
  // … các state/và logic khác của trang giữ nguyên …

  // ===================================================
  // PHẦN ĐƠN GIẢN HÓA RIÊNG CHỨC NĂNG QUẢN LÝ PHẦN THI
  // ===================================================
  const [parts, setParts] = React.useState<{ id: string; name: string }[]>([
    { id: 'part1', name: 'Phần thi 1' },
    { id: 'part2', name: 'Phần thi 2' },
    { id: 'part3', name: 'Phần thi 3' },
  ]);
  const [newPartName, setNewPartName] = React.useState('');

  const handleAddPart = () => {
    const name = newPartName.trim();
    if (!name) {
      toast.error('Vui lòng nhập tên phần thi');
      return;
    }
    if (parts.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      toast.error('Phần thi đã tồn tại');
      return;
    }
    setParts(prev => [...prev, { id: `part-${Date.now()}`, name }]);
    setNewPartName('');
    toast.success('Đã thêm phần thi mới');
  };

  const handleDeletePart = (id: string) => {
    setParts(prev => prev.filter(p => p.id !== id));
    toast.success('Đã xóa phần thi');
  };

  return (
    <div className="space-y-6">
      {/* === KHUNG CHUNG: Chỉnh sửa danh mục (giữ nguyên) === */}
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
              onChange={e => setExamName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="display-mode">Hình thức hiển thị</Label>
            <Select
              id="display-mode"
              value={displayMode}
              onValueChange={setDisplayMode}
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
            <Select defaultValue="one-per-screen" id="question-display">
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

      {/* === ĐƠN GIẢN HÓA RIÊNG: Quản lý Phần thi === */}
      <Card>
        <CardHeader>
          <CardTitle>Quản lý Phần thi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Nhập tên phần thi mới"
              value={newPartName}
              onChange={e => setNewPartName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddPart()}
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
              {parts.map(part => (
                <div
                  key={part.id}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <span>{part.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePart(part.id)}
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

      {/* === KHUNG CHUNG: Cài đặt Thời gian (giữ nguyên) === */}
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
          {/* … giữ nguyên các cấu hình thời gian chi tiết … */}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditExamFormCategory;