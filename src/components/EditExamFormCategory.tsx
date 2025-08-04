import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Trash2, Clock, Target, PlusCircle, MinusCircle, ChevronDown, ChevronUp, X } from 'lucide-react';
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
    { id: 'part1', name: 'Phần thi 1', allowSubGroups: false, maxSubGroupsSelected: 1, subParts: [] },
    { id: 'part2', name: 'Phần thi 2', allowSubGroups: false, maxSubGroupsSelected: 1, subParts: [] },
    {
      id: 'part3',
      name: 'Phần thi 3',
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

  const togglePartExpanded = (partId: string) => {
    setExpandedParts(prev => ({ ...prev, [partId]: !prev[partId] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (category) {
      setCategory({ ...category, [e.target.id]: e.target.value });
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
    setParts(prev => prev.filter(p => p.id !== id));
    if (category?.perPartTimes) {
      const newTimes = { ...category.perPartTimes };
      delete newTimes[id];
      setCategory(prev => prev ? { ...prev, perPartTimes: newTimes } : prev);
    }
    toast.success('Đã xóa phần thi.');
  };

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

  const handleSubPartNameChange = (partId: string, subPartId: string, value: string) => {
    setParts(prev =>
      prev.map(part => {
        if (part.id === partId) {
          const updatedSubParts = (part.subParts || []).map(sp =>
            sp.id === subPartId ? { ...sp, name: value } : sp
          );
          return { ...part, subParts: updatedSubParts };
        }
        return part;
      })
    );
  };

  const handleSubPartTypeChange = (partId: string, subPartId: string, value: 'Một môn' | 'Nhiều môn') => {
    setParts(prev =>
      prev.map(part => {
        if (part.id === partId) {
          const updatedSubParts = (part.subParts || []).map(sp =>
            sp.id === subPartId ? { ...sp, type: value } : sp
          );
          return { ...part, subParts: updatedSubParts };
        }
        return part;
      })
    );
  };

  const handleAddSubPart = (partId: string) => {
    const newSubPart: SubPart = {
      id: `subpart-${Date.now()}`,
      name: 'Nhóm chủ đề mới',
      type: 'Nhiều môn',
      subSubjects: [],
    };
    setParts(prev =>
      prev.map(part => {
        if (part.id === partId) {
          const existingSubParts = part.subParts || [];
          return { ...part, subParts: [...existingSubParts, newSubPart] };
        }
        return part;
      }),
    );
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

  const handleSubSubjectNameChange = (partId: string, subPartId: string, subSubjectId: string, value: string) => {
    setParts(prev =>
      prev.map(part => {
        if (part.id === partId) {
          const updatedSubParts = (part.subParts || []).map(sp => {
            if (sp.id === subPartId) {
              const updatedSubSubjects = sp.subSubjects.map(ss =>
                ss.id === subSubjectId ? { ...ss, name: value } : ss
              );
              return { ...sp, subSubjects: updatedSubSubjects };
            }
            return sp;
          });
          return { ...part, subParts: updatedSubParts };
        }
        return part;
      })
    );
  };

  const handleAddSubSubject = (partId: string, subPartId: string, selectedSubject: string) => {
    if (!selectedSubject) {
      toast.error('Vui lòng chọn môn học.');
      return;
    }
    setParts(prev =>
      prev.map(part => {
        if (part.id === partId) {
          const updatedSubParts = (part.subParts || []).map(sp => {
            if (sp.id === subPartId) {
              const existingSubSubjects = sp.subSubjects || [];
              if (existingSubSubjects.some(ss => ss.name.toLowerCase() === selectedSubject.toLowerCase())) {
                toast.error('Môn học con đã tồn tại.');
                return sp;
              }
              const newSubSubject: SubSubject = {
                id: `subsubject-${Date.now()}`,
                name: selectedSubject,
              };
              return { ...sp, subSubjects: [...existingSubSubjects, newSubSubject] };
            }
            return sp;
          });
          return { ...part, subParts: updatedSubParts };
        }
        return part;
      }),
    );
    setNewSubSubjectNames(prev => {
      const key = `${partId}-${subPartId}`;
      return { ...prev, [key]: '' };
    });
    toast.success('Đã thêm môn học con mới.');
  };

  const handleDeleteSubSubject = (partId: string, subPartId: string, subSubjectId: string) => {
    setParts(prev =>
      prev.map(part => {
        if (part.id === partId) {
          const updatedSubParts = (part.subParts || []).map(sp => {
            if (sp.id === subPartId) {
              const filteredSubSubjects = (sp.subSubjects || []).filter(ss => ss.id !== subSubjectId);
              return { ...sp, subSubjects: filteredSubSubjects };
            }
            return sp;
          });
          return { ...part, subParts: updatedSubParts };
        }
        return part;
      }),
    );
    toast.success('Đã xóa môn học con.');
  };

  const handleTimeSettingModeChange = (value: 'total' | 'per-part') => {
    if (category) {
      setCategory({
        ...category,
        timeSettingMode: value,
      });
    }
  };

  const handleTotalTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (category) {
      setCategory({
        ...category,
        totalTimeMinutes: isNaN(val) ? 0 : val,
      });
    }
  };

  const handlePerPartTimeChange = (partId: string, value: number) => {
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

  const totalPerPartTime = React.useMemo(() => {
    if (!category?.perPartTimes) return 0;
    return Object.values(category.perPartTimes).reduce((acc, cur) => acc + (cur || 0), 0);
  }, [category?.perPartTimes]);

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
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
        <CardContent className="grid gap-6">
          {/* Row 1: Tên kỳ thi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <Label htmlFor="examName">Tên kỳ thi</Label>
              <Input id="examName" value={category.examName} onChange={handleChange} />
            </div>
          </div>

          {/* Row 2: 3 dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <Label htmlFor="navigationMode">Cách di chuyển giữa các phần thi</Label>
              <Select value={category.navigationMode} onValueChange={(value) => handleSelectChange(value, 'navigationMode')}>
                <SelectTrigger id="navigationMode">
                  <SelectValue placeholder="Chọn cách di chuyển" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Tự do</SelectItem>
                  <SelectItem value="fixed">Cố định</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="questionSelection">Cách chọn câu hỏi</Label>
              <Select value={category.questionSelection} onValueChange={(value) => handleSelectChange(value, 'questionSelection')}>
                <SelectTrigger id="questionSelection">
                  <SelectValue placeholder="Chọn cách chọn câu hỏi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Làm bất kỳ</SelectItem>
                  <SelectItem value="current-section-only">Chỉ phần hiện tại</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: 'Cách hiển thị câu hỏi' and 'Phần thi' */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
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

            <div>
              <Label htmlFor="partSelection">Phần thi</Label>
              <Select value={category.partSelection} onValueChange={(value) => handleSelectChange(value, 'partSelection')}>
                <SelectTrigger id="partSelection">
                  <SelectValue placeholder="Chọn phần thi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Đầy đủ 3 phần thi</SelectItem>
                  <SelectItem value="part1">Phần thi 1</SelectItem>
                  <SelectItem value="part2">Phần thi 2</SelectItem>
                  <SelectItem value="part3">Phần thi 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 4: Cấu hình thang điểm đúng sai full width */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="configureScoring"
                checked={category.configureScoring}
                onCheckedChange={(checked) => handleSwitchChange(checked, 'configureScoring')}
              />
              <Label htmlFor="configureScoring">Cấu hình thang điểm đúng sai</Label>
            </div>
            {category.configureScoring && (
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Label className="whitespace-nowrap">Trả lời đúng 1 ý</Label>
                  <Input
                    id="oneCorrect"
                    type="number"
                    min={0}
                    max={100}
                    value={category.scoringPercentages?.oneCorrect ?? 0}
                    onChange={handleScoringPercentageChange}
                    className="w-20"
                  />
                  <span>%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="whitespace-nowrap">Trả lời đúng 2 ý</Label>
                  <Input
                    id="twoCorrect"
                    type="number"
                    min={0}
                    max={100}
                    value={category.scoringPercentages?.twoCorrect ?? 0}
                    onChange={handleScoringPercentageChange}
                    className="w-20"
                  />
                  <span>%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="whitespace-nowrap">Trả lời đúng 3 ý</Label>
                  <Input
                    id="threeCorrect"
                    type="number"
                    min={0}
                    max={100}
                    value={category.scoringPercentages?.threeCorrect ?? 0}
                    onChange={handleScoringPercentageChange}
                    className="w-20"
                  />
                  <span>%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Label className="whitespace-nowrap">Trả lời đúng 4 ý</Label>
                  <Input
                    id="fourCorrect"
                    type="number"
                    min={0}
                    max={100}
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

      {/* New Section: Parts management and Time Settings side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <div className="space-y-6">
                {parts.map((part) => {
                  const isExpanded = expandedParts[part.id] || false;
                  return (
                    <div key={part.id} className="border rounded-md p-4">
                      <div className="flex items-center justify-between mb-2 cursor-pointer select-none" onClick={() => togglePartExpanded(part.id)}>
                        <div className="flex items-center gap-2">
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          <h4 className="font-semibold">{part.name}</h4>
                          {part.subParts && part.subParts.length > 0 && (
                            <span className="ml-2 rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-medium select-none">
                              Có chủ đề ({part.subParts.length})
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          className="text-red-600 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePart(part.id);
                          }}
                          aria-label={`Xóa phần thi ${part.name}`}
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      {isExpanded && (
                        <>
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
                              <div className="space-y-4 border rounded-md p-4 bg-blue-50 dark:bg-blue-900">
                                <Label className="font-semibold flex justify-between items-center">
                                  Nhóm chủ đề
                                  {(!part.subParts || part.subParts.length === 0) && (
                                    <Button
                                      className="bg-blue-600 hover:bg-blue-700 text-white"
                                      onClick={() => handleAddSubPart(part.id)}
                                      size="sm"
                                    >
                                      + Thêm nhóm
                                    </Button>
                                  )}
                                </Label>
                                {part.subParts && part.subParts.length > 0 ? (
                                  part.subParts.map((subPart) => {
                                    const subSubjectKey = `${part.id}-${subPart.id}`;
                                    // Collect names of selected subjects for disabling in select
                                    const selectedSubjectNames = subPart.subSubjects.map(ss => ss.name.toLowerCase());
                                    return (
                                      <div key={subPart.id} className="space-y-2 border rounded-md p-3 bg-white dark:bg-gray-800">
                                        <div className="flex items-center gap-2">
                                          <Input
                                            value={subPart.name}
                                            onChange={(e) => handleSubPartNameChange(part.id, subPart.id, e.target.value)}
                                            placeholder="Tên nhóm chủ đề"
                                            className="flex-1"
                                          />
                                          <Select
                                            value={subPart.type}
                                            onValueChange={(val) => handleSubPartTypeChange(part.id, subPart.id, val as 'Một môn' | 'Nhiều môn')}
                                          >
                                            <SelectTrigger className="w-[120px]">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {groupTypeOptions.map((opt) => (
                                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                          <Button
                                            variant="ghost"
                                            className="text-red-600 hover:bg-red-50"
                                            onClick={() => handleDeleteSubPart(part.id, subPart.id)}
                                            size="sm"
                                            aria-label="Xóa nhóm chủ đề"
                                          >
                                            <X className="h-5 w-5" />
                                          </Button>
                                        </div>
                                        {/* New field for 'Chọn tối đa' only for 'Nhiều môn' */}
                                        {subPart.type === 'Nhiều môn' && (
                                          <div className="mb-4">
                                            <Label htmlFor={`maxSubGroupsSelected-${subPart.id}`} className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                              Chọn tối đa
                                            </Label>
                                            <Input
                                              id={`maxSubGroupsSelected-${subPart.id}`}
                                              type="number"
                                              min={1}
                                              value={subPart.maxSubGroupsSelected ?? part.maxSubGroupsSelected ?? 1}
                                              onChange={(e) => {
                                                const val = Number(e.target.value);
                                                setParts(prev =>
                                                  prev.map(p => {
                                                    if (p.id === part.id) {
                                                      const updatedSubParts = (p.subParts || []).map(sp => {
                                                        if (sp.id === subPart.id) {
                                                          return { ...sp, maxSubGroupsSelected: val };
                                                        }
                                                        return sp;
                                                      });
                                                      return { ...p, subParts: updatedSubParts };
                                                    }
                                                    return p;
                                                  }),
                                                );
                                              }}
                                              className="w-24"
                                            />
                                            <p className="text-sm text-muted-foreground mt-1">
                                              Chọn {subPart.maxSubGroupsSelected ?? part.maxSubGroupsSelected ?? 1} trong {subPart.subSubjects.length + (newSubSubjectNames[subSubjectKey] ? 1 : 0)} môn
                                            </p>
                                          </div>
                                        )}
                                        <div>
                                          <Label className="mb-1 block font-medium">Môn học con</Label>
                                          {subPart.type === 'Một môn' ? (
                                            <Select
                                              value={subPart.subSubjects.length > 0 ? subPart.subSubjects[0].name : ''}
                                              onValueChange={(val) => {
                                                setParts(prev =>
                                                  prev.map(part => {
                                                    if (part.id === part.id) {
                                                      const updatedSubParts = (part.subParts || []).map(sp => {
                                                        if (sp.id === subPart.id) {
                                                          const newSubSubjects = val
                                                            ? [{ id: `subsubject-${Date.now()}`, name: val }]
                                                            : [];
                                                          return { ...sp, subSubjects: newSubSubjects };
                                                        }
                                                        return sp;
                                                      });
                                                      return { ...part, subParts: updatedSubParts };
                                                    }
                                                    return part;
                                                  }),
                                                );
                                              }}
                                              className="w-full"
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Lựa chọn môn" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {availableSubjects.map((subject) => (
                                                  <SelectItem key={subject} value={subject}>
                                                    {subject}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          ) : (
                                            <>
                                              {subPart.subSubjects && subPart.subSubjects.length > 0 ? (
                                                subPart.subSubjects.map((subSubject) => (
                                                  <div key={subSubject.id} className="flex items-center gap-2 mb-1">
                                                    <Input
                                                      value={subSubject.name}
                                                      onChange={(e) => handleSubSubjectNameChange(part.id, subPart.id, subSubject.id, e.target.value)}
                                                      placeholder="Tên môn học con"
                                                      className="flex-1"
                                                    />
                                                    <Button
                                                      variant="ghost"
                                                      className="text-red-600 hover:bg-red-50"
                                                      onClick={() => handleDeleteSubSubject(part.id, subPart.id, subSubject.id)}
                                                      size="sm"
                                                      aria-label="Xóa môn học con"
                                                    >
                                                      <X className="h-5 w-5" />
                                                    </Button>
                                                  </div>
                                                ))
                                              ) : (
                                                <p className="text-sm text-muted-foreground">Chưa có môn học con.</p>
                                              )}
                                              <div className="flex gap-2 mt-1">
                                                <Select
                                                  value={newSubSubjectNames[subSubjectKey] || ''}
                                                  onValueChange={(val) => setNewSubSubjectNames(prev => ({ ...prev, [subSubjectKey]: val }))}
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                      e.preventDefault();
                                                      handleAddSubSubject(part.id, subPart.id, newSubSubjectNames[subSubjectKey] || '');
                                                    }
                                                  }}
                                                  className="flex-1"
                                                >
                                                  <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Lựa chọn môn" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                    {availableSubjects.map((subject) => {
                                                      const isSelected = selectedSubjectNames.includes(subject.toLowerCase());
                                                      return (
                                                        <SelectItem
                                                          key={subject}
                                                          value={subject}
                                                          disabled={isSelected}
                                                          className={isSelected ? 'opacity-50 italic' : ''}
                                                        >
                                                          {subject} {isSelected && '(Đã sử dụng)'}
                                                        </SelectItem>
                                                      );
                                                    })}
                                                  </SelectContent>
                                                </Select>
                                                <Button
                                                  className="bg-green-500 hover:bg-green-600 text-white"
                                                  onClick={() => handleAddSubSubject(part.id, subPart.id, newSubSubjectNames[subSubjectKey] || '')}
                                                  size="sm"
                                                >
                                                  + Thêm môn
                                                </Button>
                                              </div>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : null}
                                {part.subParts && part.subParts.length > 0 && (
                                  <Button
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    onClick={() => handleAddSubPart(part.id)}
                                    size="sm"
                                  >
                                    + Thêm nhóm
                                  </Button>
                                )}
                              </div>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
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
            <RadioGroup value={category.timeSettingMode || 'total'} onValueChange={handleTimeSettingModeChange} className="space-y-4">
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
                      onChange={handleTotalTimeChange}
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
                      <span>Tổng: {formatTime(totalPerPartTime)}</span>
                    </div>
                    <div className="space-y-3">
                      {parts.map((part, index) => (
                        <div key={part.id} className="flex items-center gap-4">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-200 text-green-700 dark:bg-green-700 dark:text-green-200">
                            {index + 1}
                          </div>
                          <div className="flex-1">{part.name}</div>
                          <Input
                            type="number"
                            min={0}
                            value={category.perPartTimes?.[part.id] ?? 0}
                            onChange={(e) => handlePerPartTimeChange(part.id, Number(e.target.value))}
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
      </div>

      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU THAY ĐỔI</Button>
      </div>
    </div>
  );
};

export default EditExamFormCategory;