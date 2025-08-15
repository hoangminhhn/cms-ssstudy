import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Trash2, Clock, Target } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SubSubject {
  id: string;
  name: string;
}

interface SubPart {
  id: string;
  name: string;
  type: 'Một môn' | 'Nhiều môn';
  subSubjects: SubSubject[];
  maxSubGroupsSelected?: number;
}

interface PartItem {
  id: string;
  name: string;
  allowSubGroups?: boolean;
  maxSubGroupsSelected?: number;
  subParts?: SubPart[];
  splitIntoSubParts?: boolean;
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

const groupTypeOptions = ['Một môn', 'Nhiều môn'] as const;

const availableSubjects = [
  'Toán',
  'Văn',
  'Tiếng Anh',
  'Vật lí',
  'Sinh học',
  'Hóa học',
  'Lịch sử',
  'Địa lý',
];

const EditExamFormCategory: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get('categoryId');

  const [category, setCategory] = React.useState<ExamFormCategory | null>(null);
  const [parts, setParts] = React.useState<PartItem[]>([
    { id: 'part1', name: '', allowSubGroups: false, maxSubGroupsSelected: 1, subParts: [], splitIntoSubParts: false },
    { id: 'part2', name: '', allowSubGroups: false, maxSubGroupsSelected: 1, subParts: [], splitIntoSubParts: false },
    {
      id: 'part3',
      name: '',
      allowSubGroups: true,
      maxSubGroupsSelected: 1,
      subParts: [
        {
          id: 'subpart1',
          name: 'Khoa học',
          type: 'Nhiều môn',
          subSubjects: [],
        },
      ],
      splitIntoSubParts: false,
    },
  ]);
  const [newPartName, setNewPartName] = React.useState('');
  const [newSubPartNames, setNewSubPartNames] = React.useState<Record<string, string>>({});
  const [newSubSubjectNames, setNewSubSubjectNames] = React.useState<Record<string, string>>({});
  const [expandedParts, setExpandedParts] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (!categoryId) {
      toast.error('Không tìm thấy danh mục kỳ thi!');
      navigate('/word-exam-upload?tab=exam-categories');
      return;
    }
    const foundCategory = mockExamCategories.find(cat => cat.id === categoryId);
    if (foundCategory) {
      setCategory(foundCategory);
      if (!foundCategory.scoringPercentages) {
        setCategory(prev => prev ? { ...prev, scoringPercentages: { oneCorrect: 0, twoCorrect: 0, threeCorrect: 0, fourCorrect: 0 } } : prev);
      }
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

  const handleSelectChange = (value: string, id: keyof ExamFormCategory) => {
    if (category) {
      setCategory({ ...category, [id]: value as any });
    }
  };

  const handleSwitchChange = (checked: boolean, id: keyof ExamFormCategory) => {
    if (category) {
      setCategory({ ...category, [id]: checked });
    }
  };

  const handleScoringPercentageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (category) {
      const { id, value } = e.target;
      const numValue = Number(value);
      setCategory({
        ...category,
        scoringPercentages: {
          ...category.scoringPercentages,
          [id]: isNaN(numValue) ? 0 : numValue,
        },
      });
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
      allowSubGroups: false,
      maxSubGroupsSelected: 1,
      subParts: [],
      splitIntoSubParts: false,
    };
    setParts(prev => [...prev, newPart]);
    setNewPartName('');
    toast.success('Đã thêm phần thi mới.');
  };

  const handleCancel = () => {
    navigate('/word-exam-upload?tab=exam-categories');
  };

  const handleSave = () => {
    if (category) {
      console.log('Lưu thay đổi cho danh mục kỳ thi:', category);
      console.log('Danh sách phần thi:', parts);
      toast.success('Đã lưu thay đổi cho danh mục kỳ thi!');
      navigate('/word-exam-upload?tab=exam-categories');
    }
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
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Row with 3 fields in one line */}
          <div>
            <Label htmlFor="examName">Tên kỳ thi</Label>
            <Input id="examName" value={category.examName} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="displayMode">Hình thức hiển thị phần thi</Label>
            <Select value={category.displayMode} onValueChange={(value) => handleSelectChange(value, 'displayMode')}>
              <SelectTrigger id="displayMode">
                <SelectValue placeholder="Chọn hình thức" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single-screen">Toàn bộ phần thi</SelectItem>
                <SelectItem value="per-section">Lần lượt từng phần thi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="questionDisplay">Cách hiển thị câu hỏi</Label>
            <Select value={category.questionDisplay} onValueChange={(value) => handleSelectChange(value, 'questionDisplay')}>
              <SelectTrigger id="questionDisplay">
                <SelectValue placeholder="Chọn cách hiển thị" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-per-screen">1 câu trong màn</SelectItem>
                <SelectItem value="all-at-once">Tất cả cùng lúc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Thời gian thi */}
      <Card>
        <CardHeader>
          <CardTitle>Thời gian thi</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={category.timeSettingMode || 'total'} onValueChange={(value) => setCategory(prev => prev ? { ...prev, timeSettingMode: value } : prev)} className="space-y-4">
            <div className="flex items-center gap-3 cursor-pointer">
              <RadioGroupItem value="total" id="time-total" className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-400" />
              <Label htmlFor="time-total" className="cursor-pointer">
                Thời gian tổng
              </Label>
            </div>
            <div className="flex items-center gap-3 cursor-pointer">
              <RadioGroupItem value="per-part" id="time-per-part" className="h-5 w-5 text-green-600 focus:ring-2 focus:ring-green-400" />
              <Label htmlFor="time-per-part" className="cursor-pointer">
                Theo phần thi
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Cấu hình thang điểm đúng sai */}
      <Card>
        <CardHeader>
          <CardTitle>Cấu hình thang điểm câu hỏi đúng sai</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Switch
              id="configureScoring"
              checked={category.configureScoring}
              onCheckedChange={(checked) => handleSwitchChange(!!checked, 'configureScoring')}
            />
            <Label htmlFor="configureScoring" className="cursor-pointer">
              Cấu hình thang điểm câu hỏi đúng sai
            </Label>
          </div>
          {category.configureScoring && (
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-md">
              <div className="flex items-center space-x-2">
                <Label htmlFor="oneCorrect" className="whitespace-nowrap">Trả lời đúng 1 ý</Label>
                <Input
                  id="oneCorrect"
                  type="number"
                  min={0}
                  value={category.scoringPercentages?.oneCorrect ?? 0}
                  onChange={handleScoringPercentageChange}
                  className="w-20"
                />
                <span>%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="twoCorrect" className="whitespace-nowrap">Trả lời đúng 2 ý</Label>
                <Input
                  id="twoCorrect"
                  type="number"
                  min={0}
                  value={category.scoringPercentages?.twoCorrect ?? 0}
                  onChange={handleScoringPercentageChange}
                  className="w-20"
                />
                <span>%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="threeCorrect" className="whitespace-nowrap">Trả lời đúng 3 ý</Label>
                <Input
                  id="threeCorrect"
                  type="number"
                  min={0}
                  value={category.scoringPercentages?.threeCorrect ?? 0}
                  onChange={handleScoringPercentageChange}
                  className="w-20"
                />
                <span>%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="fourCorrect" className="whitespace-nowrap">Trả lời đúng 4 ý</Label>
                <Input
                  id="fourCorrect"
                  type="number"
                  min={0}
                  value={category.scoringPercentages?.fourCorrect ?? 0}
                  onChange={handleScoringPercentageChange}
                  className="w-20"
                />
                <span>%</span>
              </div>
            </div>
          )}
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