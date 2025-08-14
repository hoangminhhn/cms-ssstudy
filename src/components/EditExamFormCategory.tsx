import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

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
  const [parts, setParts] = React.useState<PartItem[]>([
    { id: 'part1', name: 'Phần 1' },
    { id: 'part2', name: 'Phần 2' },
    { id: 'part3', name: 'Phần 3' },
  ]);
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
    } else {
      toast.error('Không tìm thấy danh mục kỳ thi!');
      navigate('/word-exam-upload?tab=exam-categories');
    }
  }, [categoryId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, dataset } = e.target;
    const partId = dataset.partId;
    if (partId) {
      setParts(prev =>
        prev.map(p => (p.id === partId ? { ...p, name: value } : p))
      );
    }
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
    };
    setParts(prev => [...prev, newPart]);
    setNewPartName('');
    toast.success('Đã thêm phần thi mới.');
  };

  const handleDeletePart = (id: string) => {
    setParts(prev => prev.filter(p => p.id !== id));
    toast.success('Đã xóa phần thi.');
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

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa Danh Mục Kỳ Thi: {category.examName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
          </div>

          {/* Quản lý phần thi đơn giản */}
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
                <div className="space-y-4">
                  {parts.map((part, index) => (
                    <div key={part.id} className="flex items-center justify-between border rounded-md p-3">
                      <span className="font-semibold">{part.name || `Phần ${index + 1}`}</span>
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDeletePart(part.id)}
                        size="sm"
                        aria-label={`Xóa phần thi ${part.name || `Phần ${index + 1}`}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>

      </Card>

      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU THAY ĐỔI</Button>
      </div>
    </div>
  );
};

export default EditExamFormCategory;