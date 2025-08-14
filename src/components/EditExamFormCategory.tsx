import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Trash2, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PartItem {
  id: string;
  name: string;
  additionalName?: string;
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
  const [parts, setParts] = React.useState<PartItem[]>([
    { id: 'part1', name: 'Phần 1', additionalName: '' },
    { id: 'part2', name: 'Phần 2', additionalName: '' },
    { id: 'part3', name: 'Phần 3', additionalName: '' },
  ]);
  const [newPartName, setNewPartName] = React.useState('');
  const [expandedParts, setExpandedParts] = React.useState<Record<string, boolean>>({});
  const [scoringEnabled, setScoringEnabled] = React.useState(false);
  const [scoringValues, setScoringValues] = React.useState({
    oneCorrect: 0,
    twoCorrect: 0,
    threeCorrect: 0,
    fourCorrect: 0,
  });
  const [timeSettingMode, setTimeSettingMode] = React.useState<'total' | 'per-part'>('total');
  const [totalTimeMinutes, setTotalTimeMinutes] = React.useState(120);
  const [perPartTimes, setPerPartTimes] = React.useState<Record<string, number>>({
    part1: 30,
    part2: 30,
    part3: 60,
  });

  React.useEffect(() => {
    if (!categoryId) {
      toast.error('Không tìm thấy danh mục kỳ thi!');
      navigate('/word-exam-upload?tab=exam-categories');
      return;
    }
    const foundCategory = mockExamCategories.find(cat => cat.id === categoryId);
    if (foundCategory) {
      setCategory(foundCategory);
      setScoringEnabled(foundCategory.configureScoring);
      setScoringValues({
        oneCorrect: foundCategory.scoringPercentages?.oneCorrect || 0,
        twoCorrect: foundCategory.scoringPercentages?.twoCorrect || 0,
        threeCorrect: foundCategory.scoringPercentages?.threeCorrect || 0,
        fourCorrect: foundCategory.scoringPercentages?.fourCorrect || 0,
      });
      setTimeSettingMode(foundCategory.timeSettingMode || 'total');
      setTotalTimeMinutes(foundCategory.totalTimeMinutes || 120);
      setPerPartTimes(foundCategory.perPartTimes || { part1: 30, part2: 30, part3: 60 });
    } else {
      toast.error('Không tìm thấy danh mục kỳ thi!');
      navigate('/word-exam-upload?tab=exam-categories');
    }
  }, [categoryId, navigate]);

  const togglePartExpanded = (partId: string) => {
    setExpandedParts(prev => ({ ...prev, [partId]: !prev[partId] }));
  };

  const handleAdditionalNameChange = (partId: string, value: string) => {
    setParts(prev =>
      prev.map(p => (p.id === partId ? { ...p, additionalName: value } : p))
    );
  };

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
      additionalName: '',
    };
    setParts(prev => [...prev, newPart]);
    setNewPartName('');
    toast.success('Đã thêm phần thi mới.');
  };

  const handleDeletePart = (id: string) => {
    setParts(prev => prev.filter(p => p.id !== id));
    toast.success('Đã xóa phần thi.');
  };

  const handleScoringToggle = () => {
    setScoringEnabled(!scoringEnabled);
  };

  const handleScoringValueChange = (field: keyof typeof scoringValues, value: number) => {
    setScoringValues(prev => ({ ...prev, [field]: value }));
  };

  const handleTimeSettingChange = (value: 'total' | 'per-part') => {
    setTimeSettingMode(value);
  };

  const handleTotalTimeChange = (value: number) => {
    setTotalTimeMinutes(value);
  };

  const handlePerPartTimeChange = (partId: string, value: number) => {
    setPerPartTimes(prev => ({ ...prev, [partId]: value }));
  };

  const handleSave = () => {
    if (category) {
      // Here you would send updated data to backend or state management
      console.log('Lưu thay đổi cho danh mục kỳ thi:', category);
      console.log('Danh sách phần thi:', parts);
      console.log('Cấu hình thang điểm:', scoringEnabled, scoringValues);
      console.log('Cài đặt thời gian:', timeSettingMode, totalTimeMinutes, perPartTimes);
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

  return (
    <div className="space-y-6 p-4">
      {/* Phần trên cùng: Tên kỳ thi, hình thức hiển thị, cách hiển thị câu hỏi, cấu hình thang điểm */}
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label htmlFor="examName">Tên kỳ thi</Label>
            <Input id="examName" value={category.examName} readOnly />
          </div>
          <div>
            <Label htmlFor="displayMode">Hình thức hiển thị phần thi</Label>
            <Input id="displayMode" value={category.displayMode} readOnly />
          </div>
          <div>
            <Label htmlFor="questionDisplay">Cách hiển thị câu hỏi</Label>
            <Input id="questionDisplay" value={category.questionDisplay} readOnly />
          </div>
        </CardContent>
        <CardContent className="border-t border-border pt-4">
          <div className="flex items-center space-x-4">
            <Switch checked={scoringEnabled} onCheckedChange={handleScoringToggle} id="scoring-toggle" />
            <Label htmlFor="scoring-toggle" className="font-semibold">Cấu hình thang điểm đúng sai</Label>
          </div>
          {scoringEnabled && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <Label>Trả lời đúng 1 ý</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={scoringValues.oneCorrect}
                  onChange={(e) => handleScoringValueChange('oneCorrect', Number(e.target.value))}
                  suffix="%"
                />
              </div>
              <div>
                <Label>Trả lời đúng 2 ý</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={scoringValues.twoCorrect}
                  onChange={(e) => handleScoringValueChange('twoCorrect', Number(e.target.value))}
                  suffix="%"
                />
              </div>
              <div>
                <Label>Trả lời đúng 3 ý</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={scoringValues.threeCorrect}
                  onChange={(e) => handleScoringValueChange('threeCorrect', Number(e.target.value))}
                  suffix="%"
                />
              </div>
              <div>
                <Label>Trả lời đúng 4 ý</Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={scoringValues.fourCorrect}
                  onChange={(e) => handleScoringValueChange('fourCorrect', Number(e.target.value))}
                  suffix="%"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Phần chính: Quản lý phần thi và Cài đặt thời gian */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quản lý phần thi */}
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
              <div className="space-y-2">
                {parts.map((part, index) => (
                  <div key={part.id} className="border rounded-md">
                    <button
                      type="button"
                      onClick={() => togglePartExpanded(part.id)}
                      className="flex w-full items-center justify-between px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100"
                      aria-expanded={!!expandedParts[part.id]}
                      aria-controls={`part-content-${part.id}`}
                    >
                      <span>{part.name}</span>
                      {expandedParts[part.id] ? <ChevronUp /> : <ChevronDown />}
                    </button>
                    {expandedParts[part.id] && (
                      <div id={`part-content-${part.id}`} className="border-t border-border px-4 py-2 bg-gray-50 dark:bg-gray-800">
                        <Input
                          placeholder="Tên bổ sung (ví dụ: Tư duy)"
                          value={part.additionalName || ''}
                          onChange={(e) => handleAdditionalNameChange(part.id, e.target.value)}
                        />
                        <Button
                          variant="ghost"
                          className="mt-2 text-red-600 hover:bg-red-50"
                          onClick={() => handleDeletePart(part.id)}
                          aria-label={`Xóa phần thi ${part.name}`}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cài đặt thời gian */}
        <Card>
          <CardHeader>
            <CardTitle>Cài đặt thời gian</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={timeSettingMode} onValueChange={handleTimeSettingChange}>
              <div className="flex items-center space-x-2 mb-4">
                <RadioGroupItem id="time-total" value="total" />
                <Label htmlFor="time-total" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <div>Thời gian tổng</div>
                      <div className="text-sm text-muted-foreground">Áp dụng cho toàn bộ bài thi</div>
                    </div>
                  </div>
                </Label>
                {timeSettingMode === 'total' && (
                  <Input
                    type="number"
                    min={1}
                    value={totalTimeMinutes}
                    onChange={(e) => handleTotalTimeChange(Number(e.target.value))}
                    className="w-24"
                  />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="time-per-part" value="per-part" />
                <Label htmlFor="time-per-part" className="flex-1 cursor-pointer">
                  <div>
                    <div>Theo phần thi</div>
                    <div className="text-sm text-muted-foreground">Mỗi phần có thời gian riêng</div>
                  </div>
                </Label>
              </div>
              {timeSettingMode === 'per-part' && (
                <div className="mt-4 space-y-2">
                  {parts.map((part) => (
                    <div key={part.id} className="flex items-center gap-2">
                      <Label className="flex-1">{part.name}</Label>
                      <Input
                        type="number"
                        min={1}
                        value={perPartTimes[part.id] || 0}
                        onChange={(e) => handlePerPartTimeChange(part.id, Number(e.target.value))}
                        className="w-24"
                      />
                    </div>
                  ))}
                </div>
              )}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU THAY ĐỔI</Button>
      </div>
    </div>
  );
};

export default EditExamFormCategory;