import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Trash2, Pencil, EyeOff, RotateCcw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type PartStatus = 'published' | 'draft' | 'core';

interface PartItem {
  id: string;
  name: string;
  status: PartStatus;
}

interface ExamFormCategory {
  id: string;
  examName: string;
  // other fields omitted for brevity
}

const EditExamFormCategory: React.FC = () => {
  const [category, setCategory] = React.useState<ExamFormCategory | null>({
    id: '1',
    examName: 'Kỳ thi HSA',
  });

  const [parts, setParts] = React.useState<PartItem[]>([
    { id: 'part1', name: 'Tư duy toán học', status: 'published' },
    { id: 'part2', name: 'Tư duy đọc hiểu', status: 'published' },
    { id: 'part3', name: 'Tư duy khoa học', status: 'draft' },
    { id: 'part4', name: 'Phần cốt lõi', status: 'core' },
  ]);

  const [newPartName, setNewPartName] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<PartStatus | 'all'>('all');

  const filteredParts = parts.filter((part) => {
    if (filterStatus === 'all') return true;
    return part.status === filterStatus;
  });

  const counts = {
    all: parts.length,
    published: parts.filter(p => p.status === 'published').length,
    draft: parts.filter(p => p.status === 'draft').length,
    core: parts.filter(p => p.status === 'core').length,
  };

  const handleAddPart = () => {
    const trimmed = newPartName.trim();
    if (!trimmed) {
      toast.error('Tên phần thi không được để trống.');
      return;
    }
    setParts(prev => [...prev, { id: `part-${Date.now()}`, name: trimmed, status: 'draft' }]);
    setNewPartName('');
    toast.success('Đã thêm phần thi mới.');
  };

  const handleDeletePart = (id: string) => {
    setParts(prev => prev.filter(p => p.id !== id));
    toast.success('Đã xóa phần thi.');
  };

  const handleEditPart = (id: string) => {
    const part = parts.find(p => p.id === id);
    if (!part) return;
    const newName = window.prompt('Chỉnh sửa tên phần thi:', part.name);
    if (newName !== null) {
      const trimmed = newName.trim();
      if (!trimmed) {
        toast.error('Tên phần thi không được để trống.');
        return;
      }
      setParts(prev => prev.map(p => (p.id === id ? { ...p, name: trimmed } : p)));
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
          {/* Các trường chỉnh sửa danh mục giữ nguyên */}
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold px-4">Quản lý phần thi</h2>

      {/* Ô nhập tên phần thi mới */}
      <div className="flex items-center gap-2 px-4 mb-2">
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
          className="flex-1"
        />
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleAddPart}>
          Thêm
        </Button>
      </div>

      {/* Dải tag phân loại */}
      <div className="flex gap-4 px-4 mb-4 text-sm">
        <button
          onClick={() => setFilterStatus('all')}
          className={`cursor-pointer font-semibold ${filterStatus === 'all' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
        >
          Tất cả ({counts.all})
        </button>
        <button
          onClick={() => setFilterStatus('published')}
          className={`cursor-pointer font-semibold ${filterStatus === 'published' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
        >
          Đã xuất bản ({counts.published})
        </button>
        <button
          onClick={() => setFilterStatus('draft')}
          className={`cursor-pointer font-semibold ${filterStatus === 'draft' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
        >
          Bản nháp ({counts.draft})
        </button>
        <button
          onClick={() => setFilterStatus('core')}
          className={`cursor-pointer font-semibold ${filterStatus === 'core' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
        >
          Nội dung cốt lõi ({counts.core})
        </button>
      </div>

      {/* Bảng danh sách phần thi */}
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
    </div>
  );
};

export default EditExamFormCategory;