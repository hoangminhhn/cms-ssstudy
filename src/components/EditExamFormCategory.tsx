import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Trash2, Clock, Target, ChevronDown, ChevronUp, X } from 'lucide-react';
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
  name: string; // This will store only the descriptive part, e.g. "Tư duy đọc hiểu"
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
      if (!foundCategory.perPartTimes) {
        const initialTimes: Record<string, number> = {};
        parts.forEach(p => {
          initialTimes[p.id] = 30;
        });
        setCategory(prev => prev ? { ...prev, perPartTimes: initialTimes } : prev);
      }
    } else {
      toast.error('Không tìm thấy danh mục kỳ thi!');
      navigate('/word-exam-upload?tab=exam-categories');
    }
  }, [categoryId, navigate, parts]);

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
    if (category?.timeSettingMode === 'per-part') {
      setCategory(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          perPartTimes: {
            ...prev.perPartTimes,
            [newPart.id]: 30,
          },
        };
      });
    }
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

      {/* Tối giản phần Quản lý phần thi chỉ giữ chức năng thêm phần thi mới */}
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
        </CardContent>
      </Card>

      {/* Cài đặt thời gian */}
      <Card>
        <CardHeader>
          <CardTitle>Cài đặt thời gian</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={category.timeSettingMode || 'total'} onValueChange={(value) => setCategory(prev => prev ? { ...prev, timeSettingMode: value } : prev)} className="space-y-4">
            <div className="flex items-center gap-3 rounded-md border border-gray-300 p-4 cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              <RadioGroupItem value="total" id="time-total" className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-400" />
              <Label htmlFor="time-total" className="flex flex-col cursor-pointer">
                <span className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" /> Thời gian tổng
                </span>
                <span className="text-sm text-muted-foreground">Áp dụng cho toàn bộ bài thi</span>
                {category.timeSettingMode === 'total' && (
                  <Input
                    id="totalTimeMinutes"
                    type="number"
                    min={0}
                    value={category.totalTimeMinutes ?? 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCategory(prev => prev ? { ...prev, totalTimeMinutes: isNaN(val) ? 0 : val } : prev);
                    }}
                    className="mt-2 w-32"
                    placeholder="Nhập thời gian tổng (phút)"
                  />
                )}
              </Label>
            </div>
            <div className="flex flex-col gap-2 rounded-md border border-gray-300 p-4 cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="per-part" id="time-per-part" className="h-5 w-5 text-green-600 focus:ring-2 focus:ring-green-400" />
                <Label htmlFor="time-per-part" className="flex flex-col cursor-pointer">
                  <span className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" /> Theo phần thi
                  </span>
                  <span className="text-sm text-muted-foreground">Mỗi phần có thời gian riêng</span>
                </Label>
              </div>
              {category.timeSettingMode === 'per-part' && (
                <div className="mt-4 rounded-md bg-green-50 p-4 dark:bg-green-900">
                  <div className="mb-2 flex justify-between font-semibold text-green-700 dark:text-green-400">
                    <span>Thời gian từng phần thi</span>
                    <span>
                      Tổng: {category.perPartTimes ? Object.values(category.perPartTimes).reduce((acc, cur) => acc + (cur || 0), 0) : 0}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {parts.map((part, index) => (
                      <div key={part.id} className="flex items-center gap-4">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-200 text-green-700 dark:bg-green-700 dark:text-green-200">
                          {index + 1}
                        </div>
                        <div className="flex-1">{part.name ? `Phần ${index + 1}: ${part.name}` : `Phần ${index + 1}`}</div>
                        <Input
                          type="number"
                          min={0}
                          value={category.perPartTimes?.[part.id] ?? 0}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setCategory(prev => prev ? { ...prev, perPartTimes: { ...prev.perPartTimes, [part.id]: val } } : prev);
                          }}
                          className="w-20"
                        />
                        <span>phút</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </RadioGroup>
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