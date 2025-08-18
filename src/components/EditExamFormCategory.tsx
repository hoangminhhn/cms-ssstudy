import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Trash2, Pencil, EyeOff, RotateCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type PartStatus = 'active' | 'hidden' | 'deleted';

interface PartItem {
  id: string;
  name: string;
  status: PartStatus;
  // other fields omitted for brevity
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

const EditExamFormCategory: React.FC = () => {
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(window.location.search);
  const categoryId = searchParams.get('categoryId');

  const [category, setCategory] = React.useState<ExamFormCategory | null>(null);
  const [parts, setParts] = React.useState<PartItem[]>([
    { id: 'part1', name: 'Tư duy toán học', status: 'active' },
    { id: 'part2', name: 'Tư duy đọc hiểu', status: 'active' },
    { id: 'part3', name: 'Tư duy khoa học', status: 'active' },
  ]);
  const [filterStatus, setFilterStatus] = React.useState<PartStatus | 'all'>('all');

  React.useEffect(() => {
    // Simulate fetching category data
    if (!categoryId) {
      toast.error('Không tìm thấy danh mục kỳ thi!');
      navigate('/word-exam-upload?tab=exam-categories');
      return;
    }
    // Mock category data
    setCategory({
      id: categoryId,
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
    });
  }, [categoryId, navigate]);

  const filteredParts = parts.filter((part) => {
    if (filterStatus === 'all') return part.status !== 'deleted';
    return part.status === filterStatus;
  });

  const handleDeletePart = (id: string) => {
    setParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'deleted' } : p))
    );
    toast.success('Đã xóa phần thi.');
  };

  const handleHidePart = (id: string) => {
    setParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'hidden' } : p))
    );
    toast.success('Đã ẩn phần thi.');
  };

  const handleRestorePart = (id: string) => {
    setParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'active' } : p))
    );
    toast.success('Đã khôi phục phần thi.');
  };

  const handleEditPart = (id: string) => {
    const part = parts.find((p) => p.id === id);
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

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa Danh Mục Kỳ Thi: {category?.examName || ''}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Các trường chỉnh sửa danh mục giữ nguyên (bạn có thể thêm lại nếu cần) */}
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold px-4">Quản lý phần thi</h2>

      {/* Tag phân loại trạng thái */}
      <div className="flex gap-3 px-4 mb-4">
        {['all', 'hidden', 'deleted'].map((status) => {
          const label = status === 'all' ? 'Tất cả' : status === 'hidden' ? 'Ẩn' : 'Xóa';
          const count = parts.filter(p => status === 'all' ? p.status !== 'deleted' : p.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(status as PartStatus | 'all')}
              className={`px-3 py-1 rounded-full font-semibold cursor-pointer transition-colors ${
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

      {/* Bảng quản lý phần thi */}
      <div className="w-full md:w-1/2 px-4">
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
                              className="text-gray-600 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                              onClick={() => handleHidePart(part.id)}
                              title="Ẩn phần thi"
                            >
                              <EyeOff className="h-4 w-4" />
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
                        {part.status === 'hidden' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Hiện phần thi ${part.name}`}
                              onClick={() => handleRestorePart(part.id)}
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
    </div>
  );
};

export default EditExamFormCategory;