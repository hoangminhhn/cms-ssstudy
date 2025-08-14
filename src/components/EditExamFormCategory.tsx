"use client";

import React, { useEffect, useState } from 'react';
import PartManager, { Part } from '@/components/PartManager';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const EditExamFormCategory: React.FC = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();

  useEffect(() => {
    if (!categoryId) {
      toast.error('Không tìm thấy danh mục!');
      navigate('/word-exam-upload?tab=exam-categories');
    }
  }, [categoryId, navigate]);

  const [parts, setParts] = useState<Part[]>([]);

  const handleAddPart = (name: string) => {
    setParts(prev => [...prev, { id: Date.now().toString(), name }]);
    toast.success('Đã thêm phần thi mới.');
  };

  const handleRemovePart = (id: string) => {
    setParts(prev => prev.filter(p => p.id !== id));
    toast.success('Đã xóa phần thi.');
  };

  return (
    <div className="space-y-6 p-4">
      <PartManager parts={parts} onAddPart={handleAddPart} onRemovePart={handleRemovePart} />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => navigate('/word-exam-upload?tab=exam-categories')}>
          HỦY
        </Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">
          LƯU THAY ĐỔI
        </Button>
      </div>
    </div>
  );
};

export default EditExamFormCategory;