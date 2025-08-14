import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PartItem {
  id: string;
  name: string;
}

interface ExamFormCategory {
  id: string;
  examName: string;
  displayMode: 'single-screen' | 'per-section';
  questionDisplay: 'one-per-screen' | 'all-at-once';
  configureScoring: boolean;
  partSelection: 'full' | 'part1' | 'part2' | 'part3';
  scoringPercentages?: {
    oneCorrect: number;
    twoCorrect: number;
    threeCorrect: number;
    fourCorrect: number;
  };
  timeSettingMode?: 'total' | 'per-part';
  totalTimeMinutes?: number;
  perPartTimes?: Record<string, number>;
}

const mockExamCategories: ExamFormCategory[] = [
  {
    id: '1',
    examName: 'Kỳ thi HSA',
    displayMode: 'single-screen',
    questionDisplay: 'one-per-screen',
    configureScoring: true,
    partSelection: 'full',
    scoringPercentages: {
      oneCorrect: 0,
      twoCorrect: 0,
      threeCorrect: 0,
      fourCorrect: 0,
    },
    timeSettingMode: 'per-part',
    totalTimeMinutes: 120,
    perPartTimes: {
      part1: 30,
      part2: 30,
      part3: 60,
    },
  },
  {
    id: '2',
    examName: 'Kỳ thi TSA',
    displayMode: 'per-section',
    questionDisplay: 'all-at-once',
    configureScoring: false,
    partSelection: 'full',
    scoringPercentages: {
      oneCorrect: 0,
      twoCorrect: 0,
      threeCorrect: 0,
      fourCorrect: 0,
    },
    timeSettingMode: 'total',
    totalTimeMinutes: 90,
    perPartTimes: {},
  },
];

const EditExamFormCategory: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get('categoryId');

  const [category, setCategory] = React.useState<ExamFormCategory | null>(null);
  const [parts, setParts] = React.useState<PartItem[]>([]);
  const [newPartName, setNewPartName] = React.useState('');

  React.useEffect(() => {
    if (!categoryId) {
      toast.error('Không tìm thấy danh mục kỳ thi!');
      navigate('/word-exam-upload?tab=exam-categories');
      return;
    }
    const foundCategory = mockExamCategories.find(cat => cat.id === categoryId);
    if (foundCategory) {
      setCategory(foundCategory);
      setParts([
        { id: 'part1', name: 'Phần 1' },
        { id: 'part2', name: 'Phần 2' },
        { id: 'part3', name: 'Phần 3' },
      ]);
    } else {
      toast.error('Không tìm thấy danh mục kỳ thi!');
      navigate('/word-exam-upload?tab=exam-categories');
    }
  }, [categoryId, navigate]);

  // Handlers for part management (add/delete)
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
    const newPart: PartItem = {
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

  // Handlers for category fields (part 1)
  const handleChangeCategoryField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (category) {
      setCategory({ ...category, examName: value });
    }
  };

  const handleChangeDisplayMode = (value: 'single-screen' | 'per-section') => {
    if (category) {
      setCategory({ ...category, displayMode: value });
    }
  };

  const handleChangeQuestionDisplay = (value: 'one-per-screen' | 'all-at-once') => {
    if (category) {
      setCategory({ ...category, questionDisplay: value });
    }
  };

  const handleToggleConfigureScoring = (checked: boolean) => {
    if (category) {
      setCategory({ ...category, configureScoring: checked });
    }
  };

  const handleScoringPercentageChange = (field: keyof NonNullable<ExamFormCategory['scoringPercentages']>, value: number) => {
    if (category) {
      setCategory({
        ...category,
        scoringPercentages: {
          ...category.scoringPercentages,
          [field]: value,
        },
      });
    }
  };

  // Handlers for time settings (part 3)
  const handleChangeTimeSettingMode = (value: 'total' | 'per-part') => {
    if (category) {
      setCategory({ ...category, timeSettingMode: value });
    }
  };

  const handleChangeTotalTime = (value: number) => {
    if (category) {
      setCategory({ ...category, totalTimeMinutes: value });
    }
  };

  const handleChangePerPartTime = (partId: string, value: number) => {
    if (category) {
      setCategory({
        ...category,
        perPartTimes: {
          ...category.perPartTimes,
          [partId]: value,
        },
      });
    }
  };

  const handleSave = () => {
    if (category) {
      console.log('Lưu thay đổi cho danh mục kỳ thi:', category);
      console.log('Danh sách phần thi:', parts);
      toast.success('Đã lưu thay đổi cho danh mục kỳ thi!');
      navigate('/word-exam-upload?tab=exam-categories');
    }
  };

  const handleCancel = () => {
    navigate('/word-exam-upload?tab=exam-categories');
  };

  if (!category) {
    return <div className="p-4 text-center text-muted-foreground">Đang tải...</div>;
  }

  const totalPerPartTime = category.perPartTimes
    ? Object.values(category.perPartTimes).reduce((acc, val) => acc + val, 0)
    : 0;

  return (
    <div className="space-y-6 p-4">
      {/* Phần 1: Thông tin danh mục kỳ thi */}
      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa Danh Mục Kỳ Thi: {category.examName}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="examName">Tên kỳ thi</Label>
            <Input id="examName" value={category.examName} onChange={handleChangeCategoryField} />
          </div>
          <div>
            <Label>Hiển thị phần thi</Label>
            <RadioGroup value={category.displayMode} onValueChange={handleChangeDisplayMode} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="single-screen" id="single-screen" />
                <Label htmlFor="single-screen">Toàn bộ phần thi</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="per-section" id="per-section" />
                <Label htmlFor="per-section">Lần lượt từng phần thi</Label>
              </div>
            </RadioGroup>
          </div>
          <div>
            <Label>Hiển thị câu hỏi</Label>
            <RadioGroup value={category.questionDisplay} onValueChange={handleChangeQuestionDisplay} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one-per-screen" id="one-per-screen" />
                <Label htmlFor="one-per-screen">1 câu trong màn</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all-at-once" id="all-at-once" />
                <Label htmlFor="all-at-once">Tất cả cùng lúc</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="col-span-full">
            <div className="flex items-center space-x-2">
              <Switch checked={category.configureScoring} onCheckedChange={handleToggleConfigureScoring} id="configureScoring" />
              <Label htmlFor="configureScoring">Cấu hình thang điểm đúng sai</Label>
            </div>
            {category.configureScoring && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div>
                  <Label htmlFor="oneCorrect">1 ý đúng (%)</Label>
                  <Input
                    id="oneCorrect"
                    type="number"
                    min={0}
                    max={100}
                    value={category.scoringPercentages?.oneCorrect || 0}
                    onChange={(e) => handleScoringPercentageChange('oneCorrect', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="twoCorrect">2 ý đúng (%)</Label>
                  <Input
                    id="twoCorrect"
                    type="number"
                    min={0}
                    max={100}
                    value={category.scoringPercentages?.twoCorrect || 0}
                    onChange={(e) => handleScoringPercentageChange('twoCorrect', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="threeCorrect">3 ý đúng (%)</Label>
                  <Input
                    id="threeCorrect"
                    type="number"
                    min={0}
                    max={100}
                    value={category.scoringPercentages?.threeCorrect || 0}
                    onChange={(e) => handleScoringPercentageChange('threeCorrect', Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="fourCorrect">4 ý đúng (%)</Label>
                  <Input
                    id="fourCorrect"
                    type="number"
                    min={0}
                    max={100}
                    value={category.scoringPercentages?.fourCorrect || 0}
                    onChange={(e) => handleScoringPercentageChange('fourCorrect', Number(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>
          <div>
            <Label>Chọn phần thi</Label>
            <Select value={category.partSelection} onValueChange={(val) => setCategory({ ...category, partSelection: val as any })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Toàn bộ</SelectItem>
                <SelectItem value="part1">Phần 1</SelectItem>
                <SelectItem value="part2">Phần 2</SelectItem>
                <SelectItem value="part3">Phần 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Phần 2: Quản lý phần thi (tối giản) */}
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
            <ul className="space-y-2">
              {parts.map((part) => (
                <li key={part.id} className="flex items-center justify-between border rounded-md p-3">
                  <span>{part.name}</span>
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:bg-red-50"
                    onClick={() => handleDeletePart(part.id)}
                    size="sm"
                    aria-label={`Xóa phần thi ${part.name}`}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Phần 3: Cài đặt thời gian */}
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt thời gian</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={category.timeSettingMode || 'total'} onValueChange={handleChangeTimeSettingMode} className="space-y-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="total" id="time-total" />
              <Label htmlFor="time-total">Tổng thời gian</Label>
            </div>
            {category.timeSettingMode === 'total' && (
              <Input
                type="number"
                min={0}
                value={category.totalTimeMinutes || 0}
                onChange={(e) => handleChangeTotalTime(Number(e.target.value))}
                className="max-w-[120px]"
              />
            )}

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="per-part" id="time-per-part" />
              <Label htmlFor="time-per-part">Theo phần thi</Label>
            </div>
            {category.timeSettingMode === 'per-part' && (
              <div className="space-y-2">
                {parts.map((part) => (
                  <div key={part.id} className="flex items-center space-x-2">
                    <Label className="w-32">{part.name}</Label>
                    <Input
                      type="number"
                      min={0}
                      value={category.perPartTimes?.[part.id] || 0}
                      onChange={(e) => handleChangePerPartTime(part.id, Number(e.target.value))}
                      className="max-w-[120px]"
                    />
                  </div>
                ))}
                <div className="mt-2 font-semibold">
                  Tổng thời gian: {parts.reduce((acc, part) => acc + (category.perPartTimes?.[part.id] || 0), 0)} phút
                </div>
              </div>
            )}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Nút hành động */}
      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU THAY ĐỔI</Button>
      </div>
    </div>
  );
};

export default EditExamFormCategory;