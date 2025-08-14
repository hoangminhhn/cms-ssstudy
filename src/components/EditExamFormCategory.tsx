"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PartManager, { Part } from '@/components/PartManager';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface Category {
  examName: string;
  // Thêm các trường khác nếu cần
}

const EditExamFormCategory: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  const [category, setCategory] = useState<Category>({ examName: '' });
  const [parts, setParts] = useState<Part[]>([]);

  useEffect(() => {
    if (!categoryId) {
      toast.error('Không tìm thấy danh mục!');
      navigate('/word-exam-upload?tab=exam-categories');
      return;
    }
    // Giả sử fetch dữ liệu danh mục theo categoryId
    // Ví dụ:
    // fetchCategory(categoryId).then(data => setCategory(data));
    // fetchParts(categoryId).then(data => setParts(data));
    // Ở đây tạm set dữ liệu mẫu:
    setCategory({ examName: 'Kỳ thi mẫu' });
    setParts([
      { id: '1', name: 'Phần 1' },
      { id: '2', name: 'Phần 2' },
    ]);
  }, [categoryId, navigate]);

  const handleAddPart = (name: string) => {
    if (parts.find(p => p.name === name)) {
      toast.error('Phần thi đã tồn tại.');
      return;
    }
    setParts(prev => [...prev, { id: Date.now().toString(), name }]);
    toast.success('Đã thêm phần thi mới.');
  };

  const handleRemovePart = (id: string) => {
    // Không cho xóa nếu id là 1 hoặc 2 (ví dụ giữ nguyên phần thi mặc định)
    if (id === '1' || id === '2') {
      toast.error('Không được phép xóa phần thi này.');
      return;
    }
    setParts(prev => prev.filter(p => p.id !== id));
    toast.success('Đã xóa phần thi.');
  };

  const handleSave = () => {
    // Xử lý lưu phần thi và danh mục
    toast.success('Lưu thay đổi thành công!');
    // navigate hoặc làm gì đó sau khi lưu
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chỉnh sửa Danh Mục Kỳ Thi: {category.examName}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <PartManager parts={parts} onAddPart={handleAddPart} onRemovePart={handleRemovePart} />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => navigate('/word-exam-upload?tab=exam-categories')}>
              HỦY
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSave}>
              LƯU THAY ĐỔI
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditExamFormCategory;