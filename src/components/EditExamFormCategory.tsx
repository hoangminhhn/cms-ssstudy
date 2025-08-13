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

  const togglePartExpanded = (partId: string) => {
    setExpandedParts(prev => ({ ...prev, [partId]: !prev[partId] }));
  };

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
      prev.map(part => {
        if (part.id === partId) {
          return { ...part, allowSubGroups: checked };
        }
        return part;
      })
    );
  };

  const handleSplitIntoSubPartsChange = (partId: string, checked: boolean) => {
    setParts(prev =>
      prev.map(part => {
        if (part.id === partId) {
          let updatedSubParts = part.subParts || [];
          if (checked && updatedSubParts.length > 0) {
            const parentIndex = prev.findIndex(p => p.id === partId) + 1;
            updatedSubParts = updatedSubParts.map((sp, idx) => ({
              ...sp,
              name: `Phần ${parentIndex}.${idx + 1}`,
            }));
          }
          if (checked) {
            setCategory(prev => prev ? { ...prev, allowSubGroups: false } : prev);
          }
          return { ...part, splitIntoSubParts: checked, subParts: updatedSubParts };
        }
        return part;
      }),
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

  const handleAddSubPartChild = (partId: string) => {
    const newSubPartChild: SubPart = {
      id: `subpartchild-${Date.now()}`,
      name: `Phần con ${Date.now()}`,
      type: 'Nhiều môn',
      subSubjects: [],
    };
    setParts(prev =>
      prev.map(part => {
        if (part.id === partId) {
          const existingSubParts = part.subParts || [];
          return { ...part, subParts: [...existingSubParts, newSubPartChild] };
        }
        return part;
      }),
    );
    toast.success('Đã thêm phần con mới.');
  };

  const handleDeleteSubPartChild = (partId: string, subPartId: string) => {
    setParts(prev =>
      prev.map(part => {
        if (part.id === partId) {
          const filteredSubParts = (part.subParts || []).filter(sp => sp.id !== subPartId);
          return { ...part, subParts: filteredSubParts };
        }
        return part;
      }),
    );
    toast.success('Đã xóa phần con.');
  };

  const handleSubPartChildNameChange = (partId: string, subPartId: string, value: string) => {
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

  const handleSplitIntoSubPartsToggle = (partId: string, checked: boolean) => {
    setParts(prev =>
      prev.map(part => {
        if (part.id === partId) {
          if (checked && part.subParts && part.subParts.length > 0) {
            const parentIndex = prev.findIndex(p => p.id === partId) + 1;
            const renamedSubParts = part.subParts.map((sp, idx) => ({
              ...sp,
              name: `Phần ${parentIndex}.${idx + 1}`,
            }));
            setCategory(prev => prev ? { ...prev, allowSubGroups: false } : prev);
            return { ...part, splitIntoSubParts: checked, subParts: renamedSubParts };
          }
          return { ...part, splitIntoSubParts: checked };
        }
        return part;
      }),
    );
  };

  const handleAllowSubGroupsToggle = (partId: string, checked: boolean) => {
    setParts(prev =>
      prev.map(part => (part.id === partId ? { ...part, allowSubGroups: checked } : part))
    );
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
                <SelectValue />
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
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-per-screen">1 câu trong màn</SelectItem>
                <SelectItem value="all-at-once">Tất cả cùng lúc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>

        {/* Row 4: Cấu hình thang điểm đúng sai full width */}
        <CardContent>
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
              <div className="grid grid-cols-2 gap-x-2 gap-y-2 text-sm">
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

      {/* ... phần còn lại giữ nguyên */}
    </div>
  );
};

export default EditExamFormCategory;