import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Trash2, Clock, Target, Pencil } from 'lucide-react';
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

interface PartItem {
  id: string;
  name: string;
  allowSubGroups?: boolean;
  maxSubGroupsSelected?: number;
  subParts?: SubPart[];
  splitIntoSubParts?: boolean;
  status?: number; // 0 = Tất cả, 1 = Ẩn, 3 = Xóa
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
    { id: 'part1', name: 'Tư duy toán học', allowSubGroups: false, maxSubGroupsSelected: 1, subParts: [], splitIntoSubParts: false, status: 0 },
    { id: 'part2', name: 'Tư duy đọc hiểu', allowSubGroups: false, maxSubGroupsSelected: 1, subParts: [], splitIntoSubParts: false, status: 1 },
    {
      id: 'part3',
      name: 'Tư duy khoa học',
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
      status: 3,
    },
  ]);
  const [newPartName, setNewPartName] = React.useState('');
  const [newSubPartNames, setNewSubPartNames] = React.useState<Record<string, string>>({});
  const [newSubSubjectNames, setNewSubSubjectNames] = React.useState<Record<string, string>>({});
  const [expandedParts, setExpandedParts] = React.useState<Record<string, boolean>>({});
  const [deletedPart, setDeletedPart] = React.useState<PartItem | null>(null);

  // New state for filter status
  const [filterStatus, setFilterStatus] = React.useState<number>(0); // 0 = Tất cả

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
      status: 0, // Mặc định là Tất cả
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

    setParts(prev => prev.filter(p => p.id !== id));
    setDeletedPart(partToDelete);

    toast(
      (t) => (
        <div className="flex items-center justify-between gap-4">
          <span>Đã xóa phần thi "{partToDelete.name}".</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setParts((prev) => [...prev, partToDelete]);
              setDeletedPart(null);
              toast.dismiss(t.id);
              toast.success('Đã khôi phục phần thi.');
            }}
          >
            Hoàn tác
          </Button>
        </div>
      ),
      { duration: 8000 }
    );
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
    if (category) {
      console.log('Lưu thay đổi cho danh mục kỳ thi:', category);
      console.log('Danh sách phần thi:', parts);
      toast.success('Đã lưu thay đổi cho danh mục kỳ thi!');
      navigate('/word-exam-upload?tab=exam-categories');
    }
  };

  // Lọc phần thi theo filterStatus
  const filteredParts = filterStatus === 0 ? parts : parts.filter(p => p.status === filterStatus);

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa Danh Mục Kỳ Thi: {category?.examName}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 4 fields in one row */}
          <div>
            <Label htmlFor="examName">Tên kỳ thi</Label>
            <Input id="examName" value={category?.examName || ''} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="displayMode">Hình thức hiển thị phần thi</Label>
            <Select value={category?.displayMode || ''} onValueChange={(value) => handleSelectChange(value, 'displayMode')}>
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
            <Select value={category?.questionDisplay || ''} onValueChange={(value) => handleSelectChange(value, 'questionDisplay')}>
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

      {/* Quản lý phần thi */}
      <div className="w-full md:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle>Quản lý Phần thi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
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

            {/* Dải tag phân loại */}
            <div className="flex gap-4 mb-4">
              {[
                { label: 'Tất cả', value: 0 },
                { label: 'Ẩn', value: 1 },
                { label: 'Xóa', value: 3 },
              ].map((tag) => (
                <button
                  key={tag.value}
                  type="button"
                  onClick={() => setFilterStatus(tag.value)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    filterStatus === tag.value
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {tag.label} ({parts.filter(p => p.status === tag.value).length})
                </button>
              ))}
            </div>

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
                      Không có phần thi phù hợp.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredParts.map((part) => (
                    <TableRow key={part.id}>
                      <TableCell>{part.name}</TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
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