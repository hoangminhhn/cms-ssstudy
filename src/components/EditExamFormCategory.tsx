import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Trash2, Clock, Target, PlusCircle, MinusCircle } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SubPart {
  id: string;
  name: string;
}

interface PartItem {
  id: string;
  name: string;
  allowSubGroups?: boolean;
  maxSubGroupsSelected?: number;
  subParts?: SubPart[];
}

interface ExamFormCategory {
  id: string;
  examName: string;
  displayMode: 'single-screen' | 'per-section';
  navigationMode: 'free' | 'fixed';
  questionSelection: 'any' | 'current-section-only';
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
    navigationMode: 'free',
    questionSelection: 'any',
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
    navigationMode: 'fixed',
    questionSelection: 'current-section-only',
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
    { id: 'part1', name: 'Phần thi 1', allowSubGroups: false, maxSubGroupsSelected: 1 },
    { id: 'part2', name: 'Phần thi 2', allowSubGroups: false, maxSubGroupsSelected: 1 },
    {
      id: 'part3',
      name: 'Phần thi 3',
      allowSubGroups: true,
      maxSubGroupsSelected: 1,
      subParts: [
        { id: 'subpart1', name: 'Khoa học (3 trong 5 môn)' },
        { id: 'subpart2', name: 'Tiếng Anh' },
      ],
    },
  ]);
  const [newSubPartNames, setNewSubPartNames] = React.useState<Record<string, string>>({});

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

  const handleAllowSubGroupsChange = (partId: string, checked: boolean) => {
    setParts(prev =>
      prev.map(part => (part.id === partId ? { ...part, allowSubGroups: checked } : part))
    );
    if (!checked) {
      setParts(prev =>
        prev.map(part => (part.id === partId ? { ...part, subParts: [] } : part))
      );
    }
  };

  const handleMaxSubGroupsSelectedChange = (partId: string, value: number) => {
    setParts(prev =>
      prev.map(part => (part.id === partId ? { ...part, maxSubGroupsSelected: value } : part))
    );
  };

  const handleAddSubPart = (partId: string) => {
    const name = newSubPartNames[partId]?.trim();
    if (!name) {
      toast.error('Tên nhóm chủ đề không được để trống.');
      return;
    }
    setParts(prev =>
      prev.map(part => {
        if (part.id === partId) {
          const existingSubParts = part.subParts || [];
          if (existingSubParts.some(sp => sp.name.toLowerCase() === name.toLowerCase())) {
            toast.error('Nhóm chủ đề đã tồn tại.');
            return part;
          }
          const newSubPart: SubPart = {
            id: `subpart-${Date.now()}`,
            name,
          };
          return { ...part, subParts: [...existingSubParts, newSubPart] };
        }
        return part;
      }),
    );
    setNewSubPartNames(prev => ({ ...prev, [partId]: '' }));
    toast.success('Đã thêm nhóm chủ đề mới.');
  };

  const handleDeleteSubPart = (partId: string, subPartId: string) => {
    setParts(prev =>
      prev.map(part => {
        if (part.id === partId) {
          const filteredSubParts = (part.subParts || []).filter(sp => sp.id !== subPartId);
          return { ...part, subParts: filteredSubParts };
        }
        return part;
      }),
    );
    toast.success('Đã xóa nhóm chủ đề.');
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
      {/* ... other UI parts unchanged ... */}

      {/* Quản lý phần thi */}
      <Card>
        <CardHeader>
          <CardTitle>Quản lý Phần thi</CardTitle>
        </CardHeader>
        <CardContent>
          {/* ... add part input and button unchanged ... */}
          {parts.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">Chưa có phần thi nào.</div>
          ) : (
            <div className="space-y-6">
              {parts.map((part) => (
                <div key={part.id} className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{part.name}</h4>
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDeletePart(part.id)}
                      aria-label={`Xóa phần thi ${part.name}`}
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mb-2">
                    <label className="inline-flex items-center space-x-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!part.allowSubGroups}
                        onChange={(e) => handleAllowSubGroupsChange(part.id, e.target.checked)}
                        className="form-checkbox h-4 w-4 text-orange-600"
                      />
                      <span>Cho phép chọn nhóm chủ đề</span>
                    </label>
                  </div>
                  {part.allowSubGroups && (
                    <>
                      <div className="mb-4">
                        <Label htmlFor={`maxSubGroupsSelected-${part.id}`} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Số nhóm chủ đề tối đa được chọn
                        </Label>
                        <Input
                          id={`maxSubGroupsSelected-${part.id}`}
                          type="number"
                          min={1}
                          value={part.maxSubGroupsSelected ?? 1}
                          onChange={(e) => handleMaxSubGroupsSelectedChange(part.id, Number(e.target.value))}
                          className="w-24"
                        />
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">Nhóm chủ đề</span>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => {
                            // You can implement modal or other logic here
                            const newName = prompt('Nhập tên nhóm chủ đề mới:');
                            if (newName && newName.trim() !== '') {
                              setParts(prev =>
                                prev.map(p => {
                                  if (p.id === part.id) {
                                    const existingSubParts = p.subParts || [];
                                    if (existingSubParts.some(sp => sp.name.toLowerCase() === newName.toLowerCase())) {
                                      toast.error('Nhóm chủ đề đã tồn tại.');
                                      return p;
                                    }
                                    const newSubPart: SubPart = {
                                      id: `subpart-${Date.now()}`,
                                      name: newName.trim(),
                                    };
                                    return { ...p, subParts: [...existingSubParts, newSubPart] };
                                  }
                                  return p;
                                }),
                              );
                              toast.success('Đã thêm nhóm chủ đề mới.');
                            }
                          }}
                        >
                          + Thêm nhóm
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {(part.subParts && part.subParts.length > 0) && part.subParts.map((subPart) => (
                          <div key={subPart.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-md px-3 py-1">
                            <span>{subPart.name}</span>
                            <Button
                              variant="ghost"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteSubPart(part.id, subPart.id)}
                              size="sm"
                              aria-label={`Xóa nhóm chủ đề ${subPart.name}`}
                            >
                              <MinusCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ... other UI parts unchanged ... */}
    </div>
  );
};

export default EditExamFormCategory;