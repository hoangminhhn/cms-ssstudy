import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface ExamCategory {
  id: string;
  name: string;
}

type PartType = 'default' | 'group';

interface ExamPart {
  id: string;
  name: string;
  type: PartType;
  questionsCount: number;
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

  // New: parts management state
  const [parts, setParts] = React.useState<ExamPart[]>([
    { id: 'part1', name: 'Phần 1', type: 'default', questionsCount: 0 },
    { id: 'part2', name: 'Phần 2', type: 'default', questionsCount: 0 },
    { id: 'part3', name: 'Phần 3', type: 'default', questionsCount: 0 },
  ]);
  const [newPartName, setNewPartName] = React.useState('');
  const [newPartType, setNewPartType] = React.useState<PartType>('default');
  const [editingPartId, setEditingPartId] = React.useState<string | null>(null);
  const [editingPartName, setEditingPartName] = React.useState('');

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

  // Parts management handlers
  const handleAddPart = () => {
    const name = newPartName.trim();
    if (!name) {
      toast.error('Vui lòng nhập tên phần.');
      return;
    }
    const id = `part-${Date.now()}`;
    const part: ExamPart = { id, name, type: newPartType, questionsCount: 0 };
    setParts((prev) => [...prev, part]);
    setNewPartName('');
    setNewPartType('default');
    toast.success('Đã thêm phần mới.');
  };

  const startEditPart = (p: ExamPart) => {
    setEditingPartId(p.id);
    setEditingPartName(p.name);
  };

  const saveEditPart = () => {
    if (!editingPartId) return;
    const name = editingPartName.trim();
    if (!name) {
      toast.error('Tên phần không được để trống.');
      return;
    }
    setParts((prev) => prev.map((p) => (p.id === editingPartId ? { ...p, name } : p)));
    setEditingPartId(null);
    setEditingPartName('');
    toast.success('Đã cập nhật phần.');
  };

  const cancelEditPart = () => {
    setEditingPartId(null);
    setEditingPartName('');
  };

  const deletePart = (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa phần này?')) return;
    setParts((prev) => prev.filter((p) => p.id !== id));
    toast.success('Đã xóa phần.');
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

      {/* New: Quản lý phần thi — this section is arranged as two columns; left column is half width */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column: half width card with parts management */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Quản lý phần thi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2 items-center">
                  <Input
                    placeholder="Tên phần mới"
                    value={newPartName}
                    onChange={(e) => setNewPartName(e.target.value)}
                  />
                  <Select value={newPartType} onValueChange={(val) => setNewPartType(val as PartType)}>
                    <SelectTrigger className="w-[140px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Phần mặc định</SelectItem>
                      <SelectItem value="group">Phần nhóm</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleAddPart}>
                    <Plus className="h-4 w-4 mr-2" /> Thêm
                  </Button>
                </div>

                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Mã</TableHead>
                        <TableHead>Tên phần</TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead className="text-right">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parts.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="font-medium">{p.id}</TableCell>
                          <TableCell>
                            {editingPartId === p.id ? (
                              <div className="flex items-center gap-2">
                                <Input value={editingPartName} onChange={(e) => setEditingPartName(e.target.value)} />
                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={saveEditPart}>Lưu</Button>
                                <Button size="sm" variant="outline" onClick={cancelEditPart}>Hủy</Button>
                              </div>
                            ) : (
                              <span>{p.name}</span>
                            )}
                          </TableCell>
                          <TableCell>{p.type === 'default' ? 'Mặc định' : 'Nhóm'}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => startEditPart(p)} aria-label={`Chỉnh sửa ${p.name}`}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-red-600" onClick={() => deletePart(p.id)} aria-label={`Xóa ${p.name}`}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {parts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                            Chưa có phần nào.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: placeholder (you can extend with details for the selected part) */}
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Chi tiết phần (dự phòng)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[160px] flex items-center justify-center text-sm text-muted-foreground">
                Chọn một phần bên trái để xem hoặc chỉnh sửa chi tiết phần ở đây (nơi này dành cho mở rộng tính năng).
              </div>
            </CardContent>
          </Card>
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