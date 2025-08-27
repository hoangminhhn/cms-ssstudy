import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface ExamCategory {
  id: string;
  name: string;
  description: string;
  slug: string;
  parentId?: string;
}

// Mock data for a single category (in a real app, this would come from an API)
const mockCategoriesData: ExamCategory[] = [
  { id: '1', name: 'Kỳ thi HSA', description: 'Mô tả cho kỳ thi HSA', slug: 'ky-thi-hsa', parentId: undefined },
  { id: '2', name: 'Kỳ thi TSA', description: 'Mô tả cho kỳ thi TSA', slug: 'ky-thi-tsa', parentId: undefined },
  { id: '3', name: 'Kỳ thi Tốt Nghiệp', description: 'Mô tả cho kỳ thi Tốt Nghiệp', slug: 'ky-thi-tot-nghiep', parentId: undefined },
  { id: '4', name: 'Kỳ thi V-ACT', description: 'Mô tả cho kỳ thi V-ACT', slug: 'ky-thi-v-act', parentId: undefined },
];

const EditExamCategoryForm: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = React.useState<ExamCategory | null>(null);

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

  if (!category) {
    return <div className="p-4 text-center text-muted-foreground">Đang tải...</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Chỉnh sửa Danh Mục: {category.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label htmlFor="name">Tên</Label>
            <Input id="name" value={category.name} onChange={handleChange} />
            <p className="text-xs text-muted-foreground mt-1">Tên là cách nó xuất hiện trên trang web của bạn.</p>
          </div>
          <div>
            <Label htmlFor="slug">Đường dẫn</Label>
            <Input id="slug" value={category.slug} onChange={handleChange} />
            <p className="text-xs text-muted-foreground mt-1">"slug" là đường dẫn thân thiện của tên. Nó thường chỉ bao gồm kí tự viết thường, số và dấu gạch ngang, không dùng tiếng Việt.</p>
          </div>
          <div>
            <Label htmlFor="parentId">Danh mục cha</Label>
            <Select value={category.parentId || 'none'} onValueChange={(value) => handleSelectChange(value, 'parentId')}>
              <SelectTrigger id="parentId">
                <SelectValue placeholder="Không có" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không có</SelectItem>
                {mockCategoriesData.filter(cat => cat.id !== category.id).map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Chuyên mục khác với thẻ, bạn có thể sử dụng nhiều cấp chuyên mục. Ví dụ: Trong chuyên mục nhạc, bạn có chuyên mục con là nhạc Pop, nhạc Jazz. Việc này hoàn toàn là tùy theo ý bạn.</p>
          </div>
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea id="description" value={category.description} onChange={handleChange} />
            <p className="text-xs text-muted-foreground mt-1">Thông thường mô tả này không được sử dụng trong các giao diện, tuy nhiên có vài giao diện có thể hiển thị mô tả này.</p>
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

export default EditExamCategoryForm;