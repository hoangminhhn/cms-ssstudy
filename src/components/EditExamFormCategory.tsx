import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Mock data for an exam category (in a real app, this would come from an API)
interface ExamFormCategory {
  id: string;
  examName: string;
  displayMode: 'single-screen' | 'per-section';
  navigationMode: 'free' | 'fixed';
  questionSelection: 'any' | 'current-section-only';
  questionDisplay: 'one-per-screen' | 'all-at-once';
  configureScoring: boolean;
  multiChoiceScoringRule: 'all-correct' | 'partial-correct';
  scoringPercentages?: {
    oneCorrect: number;
    twoCorrect: number;
    threeCorrect: number;
    fourCorrect: number;
  };
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
    multiChoiceScoringRule: 'all-correct',
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
    multiChoiceScoringRule: 'partial-correct',
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

  React.useEffect(() => {
    if (!categoryId) {
      toast.error('Không tìm thấy danh mục kỳ thi!');
      navigate('/word-exam-upload?tab=exam-categories');
      return;
    }
    // Simulate fetching data based on categoryId
    const foundCategory = mockExamCategories.find(cat => cat.id === categoryId);
    if (foundCategory) {
      setCategory(foundCategory);
    } else {
      toast.error('Không tìm thấy danh mục kỳ thi!');
      navigate('/word-exam-upload?tab=exam-categories'); // Redirect if not found
    }
  }, [categoryId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (category) {
      setCategory({ ...category, [e.target.id]: e.target.value });
    }
  };

  const handleSelectChange = (value: string, id: keyof ExamFormCategory) => {
    if (category) {
      setCategory({ ...category, [id]: value as any }); // Type assertion for select values
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

  const handleSave = () => {
    if (category) {
      console.log('Lưu thay đổi cho danh mục kỳ thi:', category);
      toast.success('Đã lưu thay đổi cho danh mục kỳ thi!');
      navigate('/word-exam-upload?tab=exam-categories'); // Go back to list
    }
  };

  const handleCancel = () => {
    navigate('/word-exam-upload?tab=exam-categories'); // Go back to list
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

          {/* Row 2: 4 dropdowns in 3 columns, last two share one column */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="displayMode">Hình thức hiển thị phần thi</Label>
              <Select value={category.displayMode} onValueChange={(value) => handleSelectChange(value, 'displayMode')}>
                <SelectTrigger id="displayMode">
                  <SelectValue placeholder="Chọn hình thức" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-screen">1 màn hình</SelectItem>
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

          {/* Row 3: 1 dropdown, 1 switch, 1 dropdown */}
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

            <div className="flex flex-col space-y-2">
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

            <div>
              <Label htmlFor="multiChoiceScoringRule">Quy tắc tính điểm nhiều ý</Label>
              <Select value={category.multiChoiceScoringRule} onValueChange={(value) => handleSelectChange(value, 'multiChoiceScoringRule')}>
                <SelectTrigger id="multiChoiceScoringRule">
                  <SelectValue placeholder="Chọn quy tắc" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-correct">Có điểm khi đúng toàn bộ</SelectItem>
                  <SelectItem value="partial-correct">Cho phép tính điểm theo số đáp án đúng</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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