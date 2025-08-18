import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Trash2, Pencil } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

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
  hidden?: boolean; // Thêm trường hidden để phân loại ẩn
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

type FilterStatus = 'all' | 'hidden' | 'deleted';

const EditExamFormCategory: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get('categoryId');

  const [category, setCategory] = React.useState<ExamFormCategory | null>(null);
  const [parts, setParts] = React.useState<PartItem[]>([
    { id: 'part1', name: 'Tư duy toán học', allowSubGroups: false, maxSubGroupsSelected: 1, subParts: [], splitIntoSubParts: false, hidden: false },
    { id: 'part2', name: 'Tư duy đọc hiểu', allowSubGroups: false, maxSubGroupsSelected: 1, subParts: [], splitIntoSubParts: false, hidden: false },
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
      hidden: false,
    },
  ]);
  const [newPartName, setNewPartName] = React.useState('');
  const [deletedParts, setDeletedParts] = React.useState<PartItem[]>([]);
  const [filterStatus, setFilterStatus] = React.useState<FilterStatus>('all');

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
      hidden: false,
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
    setDeletedParts(prev => [...prev, partToDelete]);

    toast(
      (t) => (
        <div className="flex items-center justify-between gap-4">
          <span>Đã xóa phần thi "{partToDelete.name}".</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setParts((prev) => [...prev, partToDelete]);
              setDeletedParts((prev) => prev.filter(p => p.id !== partToDelete.id));
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
  const filteredParts = React.useMemo(() => {
    switch (filterStatus) {
      case 'hidden':
        return parts.filter(p => p.hidden);
      case 'deleted':
        return deletedParts;
      case 'all':
      default:
        return parts;
    }
  }, [filterStatus, parts, deletedParts]);

  // Đếm số phần thi theo trạng thái
  const countAll = parts.length;
  const countHidden = parts.filter(p => p.hidden).length;
  const countDeleted = deletedParts.length;

  return (
    <div className="space-y-6 p-4">
      {/* Các phần khác giữ nguyên */}

      {/* Quản lý phần thi */}
      <div className="w-full md:w-1/2">
        <Card>
          <CardHeader>
            <CardTitle>Quản lý Phần thi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex items-center gap-2">
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

              {/* Dải tag lọc */}
              <div className="flex gap-4 text-sm">
                {[
                  { label: `Tất cả (${countAll})`, value: 'all' },
                  { label: `Ẩn (${countHidden})`, value: 'hidden' },
                  { label: `Xóa (${countDeleted})`, value: 'deleted' },
                ].map(({ label, value }) => (
                  <button
                    key={value}
                    onClick={() => setFilterStatus(value as FilterStatus)}
                    className={cn(
                      "rounded-full px-3 py-1 cursor-pointer select-none border",
                      filterStatus === value
                        ? "bg-orange-500 text-white border-orange-500"
                        : "bg-transparent text-gray-700 border-gray-300 hover:bg-gray-100"
                    )}
                    type="button"
                    aria-pressed={filterStatus === value}
                  >
                    {label}
                  </button>
                ))}
              </div>
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
                        {filterStatus !== 'deleted' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Chỉnh sửa phần thi ${part.name}`}
                            onClick={() => handleEditPart(part.id)}
                            title="Chỉnh sửa nhanh"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {filterStatus === 'all' && (
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
                        )}
                        {filterStatus === 'deleted' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setParts((prev) => [...prev, part]);
                              setDeletedParts((prev) => prev.filter(p => p.id !== part.id));
                              toast.success('Đã khôi phục phần thi.');
                            }}
                          >
                            Khôi phục
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

      {/* Các phần khác giữ nguyên */}

      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU THAY ĐỔI</Button>
      </div>
    </div>
  );
};

export default EditExamFormCategory;