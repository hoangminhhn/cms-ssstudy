import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Trash2, Clock, Target, Pencil, EyeOff, RotateCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

type PartStatus = 'active' | 'hidden' | 'deleted';

interface PartItem {
  id: string;
  name: string;
  status: PartStatus;
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
    { id: 'part1', name: 'Tư duy toán học', status: 'active', allowSubGroups: false, maxSubGroupsSelected: 1, subParts: [], splitIntoSubParts: false },
    { id: 'part2', name: 'Tư duy đọc hiểu', status: 'active', allowSubGroups: false, maxSubGroupsSelected: 1, subParts: [], splitIntoSubParts: false },
    {
      id: 'part3',
      name: 'Tư duy khoa học',
      status: 'active',
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
  const [filterStatus, setFilterStatus] = React.useState<PartStatus | 'all'>('all');

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
      if (!foundCategory.scoringPercentages) {
        setCategory(prev => prev ? { ...prev, scoringPercentages: { oneCorrect: 0, twoCorrect: 0, threeCorrect: 0, fourCorrect: 0 } } : prev);
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
    if (parts.some(p => p.name.toLowerCase() === trimmedName.toLowerCase() && p.status !== 'deleted')) {
      toast.error('Phần thi đã tồn tại.');
      return;
    }
    const newPart: PartItem = {
      id: `part-${Date.now()}`,
      name: trimmedName,
      status: 'active',
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

  const handleDeletePart = (id: string) => {
    const partToDelete = parts.find(p => p.id === id);
    if (!partToDelete) return;

    if (!window.confirm(`Bạn có chắc chắn muốn xóa phần thi "${partToDelete.name}"?`)) {
      return;
    }

    setParts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, status: 'deleted' } : p
      )
    );

    toast.success(`Đã xóa phần thi "${partToDelete.name}". Bạn có thể xem lại ở tab "Xóa".`);
  };

  const handleRestorePart = (id: string) => {
    const partToRestore = parts.find(p => p.id === id);
    if (!partToRestore) return;

    setParts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, status: 'active' } : p
      )
    );

    toast.success(`Đã khôi phục phần thi "${partToRestore.name}".`);
  };

  const handleHidePart = (id: string) => {
    const partToHide = parts.find(p => p.id === id);
    if (!partToHide) return;

    setParts(prev =>
      prev.map(p =>
        p.id === id ? { ...p, status: 'hidden' } : p
      )
    );

    toast.success(`Đã ẩn phần thi "${partToHide.name}".`);
  };

  const handleEditPart = (id: string) => {
    const part = parts.find(p => p.id === id);
    if (!part) return;
    const newName = window.prompt('Chỉnh sửa tên phần thi:', part.name);
    if (newName !== null) {
      const trimmed = newName.trim();
      if (trimmed === '') {
        toast.error('Tên phần thi không được để trống.');
        return;
      }
      setParts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name: trimmed } : p))
      );
      toast.success('Đã cập nhật tên phần thi.');
    }
  };

  const handleCancel = () => {
    navigate('/word-exam-upload?tab=exam-categories');
  };

  const handleSave = () => {
    if (!category) {
      toast.error('Không có danh mục kỳ thi để lưu!');
      return;
    }
    console.log('Lưu thay đổi cho danh mục kỳ thi:', category);
    console.log('Danh sách phần thi:', parts);
    toast.success('Đã lưu thay đổi cho danh mục kỳ thi!');
    navigate('/word-exam-upload?tab=exam-categories');
  };

  const filteredParts = parts.filter((part) => {
    if (filterStatus === 'all') return part.status !== 'deleted';
    return part.status === filterStatus;
  });

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa Danh Mục Kỳ Thi: {category?.examName || ''}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 4 fields in one row */}
          <div>
            <Label htmlFor="examName">Tên kỳ thi</Label>
            <Input id="examName" value={category?.examName || ''} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="displayMode">Hình thức hiển thị phần thi</Label>
            <Select value={category?.displayMode || 'single-screen'} onValueChange={(value) => handleSelectChange(value, 'displayMode')}>
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
            <Select value={category?.questionDisplay || 'one-per-screen'} onValueChange={(value) => handleSelectChange(value, 'questionDisplay')}>
              <SelectTrigger id="questionDisplay">
                <SelectValue placeholder="Chọn cách hiển thị" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-per-screen">1 câu trong màn</SelectItem>
                <SelectItem value="all-at-once">Tất cả cùng lúc</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="timeSettingMode">Cài đặt thời gian</Label>
            <Select value={category?.timeSettingMode || 'total'} onValueChange={(value) => handleSelectChange(value, 'timeSettingMode')}>
              <SelectTrigger id="timeSettingMode">
                <SelectValue placeholder="Chọn cài đặt thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="total">Toàn bài</SelectItem>
                <SelectItem value="per-part">Theo phần thi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gộp phần cấu hình thang điểm đúng sai vào đây */}
          <div className="col-span-full">
            <div className="flex items-center space-x-4 mb-4">
              <Switch
                id="configureScoring"
                checked={category?.configureScoring || false}
                onCheckedChange={(checked) => handleSwitchChange(!!checked, 'configureScoring')}
              />
              <Label htmlFor="configureScoring" className="cursor-pointer">
                Cấu hình thang điểm câu hỏi đúng sai
              </Label>
            </div>
            {category?.configureScoring && (
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
          </div>
        </CardContent>
      </Card>

      {/* Phân loại trạng thái phần thi */}
      <div className="flex gap-4 border-b border-gray-300 dark:border-gray-700 px-4">
        {['all', 'hidden', 'deleted'].map((status) => {
          const label = status === 'all' ? 'Tất cả' : status === 'hidden' ? 'Ẩn' : 'Xóa';
          const count = parts.filter(p => status === 'all' ? p.status !== 'deleted' : p.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status as PartStatus | 'all')}
              className={`py-2 px-4 rounded-t-lg font-semibold ${
                filterStatus === status
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Quản lý phần thi theo trạng thái */}
      <div className="w-full md:w-1/2">
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên phần thi</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-4">
                      Không có phần thi nào.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredParts.map((part) => (
                    <TableRow key={part.id}>
                      <TableCell>{part.name}</TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        {part.status === 'active' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Chỉnh sửa phần thi ${part.name}`}
                              onClick={() => handleEditPart(part.id)}
                              title="Chỉnh sửa nhanh"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDeletePart(part.id)}
                              aria-label={`Xóa phần thi ${part.name}`}
                              title="Xóa phần thi"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                              onClick={() => {
                                setParts(prev =>
                                  prev.map(p =>
                                    p.id === part.id ? { ...p, status: 'hidden' } : p
                                  )
                                );
                                toast.success(`Đã ẩn phần thi "${part.name}".`);
                              }}
                              title="Ẩn phần thi"
                            >
                              <EyeOff className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {part.status === 'hidden' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Hiện phần thi ${part.name}`}
                              onClick={() => {
                                setParts(prev =>
                                  prev.map(p =>
                                    p.id === part.id ? { ...p, status: 'active' } : p
                                  )
                                );
                                toast.success(`Đã hiện phần thi "${part.name}".`);
                              }}
                              title="Hiện phần thi"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDeletePart(part.id)}
                              aria-label={`Xóa phần thi ${part.name}`}
                              title="Xóa phần thi"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {part.status === 'deleted' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-600 hover:bg-green-50"
                            onClick={() => handleRestorePart(part.id)}
                            aria-label={`Khôi phục phần thi ${part.name}`}
                            title="Khôi phục phần thi"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU THAY ĐỔI</Button>
      </div>
    </div>
  );
};

export default EditExamFormCategory;