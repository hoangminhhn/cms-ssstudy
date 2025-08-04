import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2 } from 'lucide-react';

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
}

interface PartItem {
  id: string;
  name: string;
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
  },
];

const EditExamFormCategory: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoryId = searchParams.get('categoryId');

  const [category, setCategory] = React.useState<ExamFormCategory | null>(null);
  const [parts, setParts] = React.useState<PartItem[]>([
    { id: 'part1', name: 'Phần thi 1' },
    { id: 'part2', name: 'Phần thi 2' },
    { id: 'part3', name: 'Phần thi 3' },
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
                  <SelectItem value="per-section">Từng phần</SelectItem>
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

      {/* New Section: Parts management */}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên phần thi</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                    Chưa có phần thi nào.
                  </TableCell>
                </TableRow>
              ) : (
                parts.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell>{part.name}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDeletePart(part.id)}
                        aria-label={`Xóa phần thi ${part.name}`}
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

      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU THAY ĐỔI</Button>
      </div>
    </div>
  );
};

export default EditExamFormCategory;