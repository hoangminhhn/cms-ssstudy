import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import ExamPartManager from './ExamPartManager';

interface ExamCategory {
  id: string;
  name: string;
}

const mockCategoriesData: ExamCategory[] = [
  { id: '1', name: 'Kỳ thi HSA' },
  { id: '2', name: 'Kỳ thi TSA' },
  { id: '3', name: 'Kỳ thi Tốt Nghiệp' },
  { id: '4', name: 'Kỳ thi V-ACT' },
];

const displayModeOptions = [
  { value: 'all', label: 'Toàn bộ phần thi' },
  { value: 'per-part', label: 'Theo từng phần' },
];

const questionDisplayOptions = [
  { value: 'one-per-screen', label: '1 câu trong màn' },
  { value: 'list', label: 'Danh sách' },
];

const timeSettingOptions = [
  { value: 'per-part', label: 'Theo phần thi' },
  { value: 'total', label: 'Tổng thời gian' },
];

const EditExamFormCategory: React.FC = () => {
  const params = useParams<{ categoryId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const categoryIdFromSearch = searchParams.get('categoryId');

  const categoryId = params.categoryId || categoryIdFromSearch || undefined;

  const [category, setCategory] = React.useState<ExamCategory | null>(null);

  // extra fields to match requested UI
  const [displayMode, setDisplayMode] = React.useState<string>(displayModeOptions[0].value);
  const [questionDisplay, setQuestionDisplay] = React.useState<string>(questionDisplayOptions[0].value);
  const [timeSetting, setTimeSetting] = React.useState<string>(timeSettingOptions[0].value);

  const [useScoringConfig, setUseScoringConfig] = React.useState<boolean>(false);
  const [percent1, setPercent1] = React.useState<number>(0);
  const [percent2, setPercent2] = React.useState<number>(0);
  const [percent3, setPercent3] = React.useState<number>(0);
  const [percent4, setPercent4] = React.useState<number>(0);

  React.useEffect(() => {
    // simulate fetch by id (use mock data)
    if (!categoryId) {
      toast.error('categoryId không được cung cấp.');
      navigate('/word-exam-upload?tab=exam-categories');
      return;
    }

    const found = mockCategoriesData.find((c) => c.id === categoryId);
    if (found) {
      setCategory(found);
    } else {
      toast.error('Không tìm thấy danh mục!');
      navigate('/word-exam-upload?tab=exam-categories');
    }
  }, [categoryId, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!category) return;
    setCategory({ ...category, [e.target.id]: e.target.value } as ExamCategory);
  };

  const handleSave = () => {
    // In a real app you'd submit the form to an API. For now we just show a toast.
    console.log('Saving category with values:', {
      category,
      displayMode,
      questionDisplay,
      timeSetting,
      useScoringConfig,
      percent1,
      percent2,
      percent3,
      percent4,
    });
    toast.success('Đã lưu thay đổi cho danh mục!');
    navigate('/word-exam-upload?tab=exam-categories');
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
          <CardTitle>Chỉnh sửa Danh Mục Kỳ Thi: {category.name}</CardTitle>
        </CardHeader>

        <CardContent className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            <div>
              <Label htmlFor="name">Tên kỳ thi</Label>
              <Input id="name" value={category.name} onChange={handleChange} />
            </div>

            <div>
              <Label>Hình thức hiển thị phần thi</Label>
              <Select value={displayMode} onValueChange={setDisplayMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {displayModeOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Cách hiển thị câu hỏi</Label>
              <Select value={questionDisplay} onValueChange={setQuestionDisplay}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {questionDisplayOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Cài đặt thời gian</Label>
              <Select value={timeSetting} onValueChange={setTimeSetting}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSettingOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="py-4 border-t">
            <div className="flex items-center gap-3">
              <Switch checked={useScoringConfig} onCheckedChange={(v) => setUseScoringConfig(!!v)} />
              <div>
                <div className="font-medium">Cấu hình thang điểm câu hỏi đúng sai</div>
                <div className="text-sm text-muted-foreground">Bật để cấu hình phần trăm điểm theo số đáp án đúng.</div>
              </div>
            </div>

            {/* Fixed-width two-column layout with exactly 40px horizontal gap.
                Each column is constrained so the pair doesn't stretch across the whole container,
                removing the large empty area you circled. */}
            {useScoringConfig && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-[minmax(0,260px)_minmax(0,260px)] gap-y-2 gap-x-[40px] items-center">
                <div className="flex items-center gap-2">
                  <div className="text-sm leading-none">Trả lời đúng 1 ý</div>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={percent1}
                    onChange={(e) => setPercent1(Number(e.target.value || 0))}
                    className="w-14 h-8 px-2 py-1 text-center"
                  />
                  <span className="text-sm">%</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-sm leading-none">Trả lời đúng 2 ý</div>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={percent2}
                    onChange={(e) => setPercent2(Number(e.target.value || 0))}
                    className="w-14 h-8 px-2 py-1 text-center"
                  />
                  <span className="text-sm">%</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-sm leading-none">Trả lời đúng 3 ý</div>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={percent3}
                    onChange={(e) => setPercent3(Number(e.target.value || 0))}
                    className="w-14 h-8 px-2 py-1 text-center"
                  />
                  <span className="text-sm">%</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-sm leading-none">Trả lời đúng 4 ý</div>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={percent4}
                    onChange={(e) => setPercent4(Number(e.target.value || 0))}
                    className="w-14 h-8 px-2 py-1 text-center"
                  />
                  <span className="text-sm">%</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* New layout row: left column = ExamPartManager (half width), right column reserved for future content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-1">
          <ExamPartManager />
        </div>
        <div className="md:col-span-1">
          {/* Placeholder column (empty) to keep manager width as half */}
          <div className="h-full border rounded-md bg-gray-50 dark:bg-gray-800 p-4 flex items-center justify-center text-sm text-muted-foreground">
            Khu vực trống — bạn có thể thêm nội dung phụ trợ tại đây.
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU THAY ĐỔI</Button>
      </div>
    </div>
  );
};

export default EditExamFormCategory;