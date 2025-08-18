import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Trash2, Pencil } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ExamCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  parentId?: string;
}

type PartStatus = 'visible' | 'hidden' | 'deleted';

interface PartItem {
  id: string;
  name: string;
  status: PartStatus;
}

const mockCategoriesData: ExamCategory[] = [
  { id: '1', name: 'Kỳ thi HSA', description: 'Mô tả cho kỳ thi HSA', slug: 'ky-thi-hsa', parentId: undefined },
  { id: '2', name: 'Kỳ thi TSA', description: 'Mô tả cho kỳ thi TSA', slug: 'ky-thi-tsa', parentId: undefined },
  { id: '3', name: 'Kỳ thi Tốt Nghiệp', description: 'Mô tả cho kỳ thi Tốt Nghiệp', slug: 'ky-thi-tot-nghiep', parentId: undefined },
  { id: '4', name: 'Kỳ thi V-ACT', description: 'Mô tả cho kỳ thi V-ACT', slug: 'ky-thi-v-act', parentId: undefined },
];

const EditExamFormCategory: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = React.useState<ExamCategory | null>(null);

  const [parts, setParts] = React.useState<PartItem[]>([
    { id: 'part1', name: 'Tư duy toán học', status: 'visible' },
    { id: 'part2', name: 'Tư duy đọc hiểu', status: 'visible' },
    { id: 'part3', name: 'Tư duy khoa học', status: 'hidden' },
    { id: 'part4', name: 'Phần đã xóa', status: 'deleted' },
  ]);

  const [newPartName, setNewPartName] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<PartStatus | 'all'>('all');

  React.useEffect(() => {
    // Simulate fetching data
    const foundCategory = mockCategoriesData.find(cat => cat.id === categoryId);
    if (foundCategory) {
      setCategory(foundCategory);
    } else {
      toast.error('Không tìm thấy danh mục!');
      navigate('/word-exam-upload?tab=exam-categories'); // Redirect if not found
    }
  }, [categoryId, navigate]);

  const filteredParts = parts.filter((part) => {
    if (filterStatus === 'all') return true;
    return part.status === filterStatus;
  });

  const counts = {
    all: parts.length,
    visible: parts.filter(p => p.status === 'visible').length,
    hidden: parts.filter(p => p.status === 'hidden').length,
    deleted: parts.filter(p => p.status === 'deleted').length,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (category) {
      setCategory({ ...category, [e.target.id]: e.target.value });
    }
  };

  const handleSelectChange = (value: string, id: string) => {
    if (category) {
      setCategory({ ...category, [id]: value });
    }
  };

  const handleSave = () => {
    if (category) {
      console.log('Lưu thay đổi cho danh mục:', category);
      toast.success('Đã lưu thay đổi cho danh mục!');
      navigate('/word-exam-upload?tab=exam-categories'); // Go back to list
    }
  };

  const handleCancel = () => {
    navigate('/word-exam-upload?tab=exam-categories'); // Go back to list
  };

  const handleAddPart = () => {
    const trimmed = newPartName.trim();
    if (!trimmed) {
      toast.error('Tên phần thi không được để trống.');
      return;
    }
    setParts(prev => [...prev, { id: `part-${Date.now()}`, name: trimmed, status: 'visible' }]);
    setNewPartName('');
    toast.success('Đã thêm phần thi mới.');
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

  const handleDeletePart = (id: string) => {
    setParts(prev => prev.filter(p => p.id !== id));
    toast.success('Đã xóa phần thi.');
  };

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa Danh Mục Kỳ Thi: {category?.name || ''}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="name">Tên</Label>
            <Input id="name" value={category?.name || ''} onChange={handleChange} />
            <p className="text-xs text-muted-foreground mt-1">Tên là cách nó xuất hiện trên trang web của bạn.</p>
          </div>
          <div>
            <Label htmlFor="slug">Đường dẫn</Label>
            <Input id="slug" value={category?.slug || ''} onChange={handleChange} />
            <p className="text-xs text-muted-foreground mt-1">"slug" là đường dẫn thân thiện của tên. Nó thường chỉ bao gồm kí tự viết thường, số và dấu gạch ngang, không dùng tiếng Việt.</p>
          </div>
          <div>
            <Label htmlFor="parentId">Danh mục cha</Label>
            <Select value={category?.parentId || 'none'} onValueChange={(value) => handleSelectChange(value, 'parentId')}>
              <SelectTrigger id="parentId">
                <SelectValue placeholder="Không có" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không có</SelectItem>
                {mockCategoriesData.filter(cat => cat.id !== category?.id).map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Chuyên mục khác với thẻ, bạn có thể sử dụng nhiều cấp chuyên mục. Ví dụ: Trong chuyên mục nhạc, bạn có chuyên mục con là nhạc Pop, nhạc Jazz. Việc này hoàn toàn là tùy theo ý bạn.</p>
          </div>
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea id="description" value={category?.description || ''} onChange={handleChange} />
            <p className="text-xs text-muted-foreground mt-1">Thông thường mô tả này không được sử dụng trong các giao diện, tuy nhiên có vài giao diện có thể hiển thị mô tả này.</p>
          </div>
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
          onClick={() => setFilterStatus('hidden')}
          className={`cursor-pointer font-semibold ${filterStatus === 'hidden' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
        >
          Ẩn ({counts.hidden})
        </button>
        <button
          onClick={() => setFilterStatus('deleted')}
          className={`cursor-pointer font-semibold ${filterStatus === 'deleted' ? 'text-orange-600' : 'text-gray-600 hover:text-orange-600'}`}
        >
          Xóa ({counts.deleted})
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
                    <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
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

      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline" onClick={handleCancel}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>LƯU THAY ĐỔI</Button>
      </div>
    </div>
  );
};

export default EditExamFormCategory;