"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import PartManager, { Part } from '@/components/PartManager';   // import PartManager
import type { ExamFormCategory } from './types';                  // adjust path as needed

// Mock data etc. remain unchanged above...

const EditExamFormCategory: React.FC = () => {
  // ... existing hooks and category load logic

  // Thay vì state parts phức tạp, chỉ giữ mảng đơn giản
  const [parts, setParts] = React.useState<Part[]>([]);

  const handleAddPart = (name: string) => {
    setParts(prev => [...prev, { id: Date.now().toString(), name }]);
    toast.success('Đã thêm phần thi mới.');
  };
  const handleRemovePart = (id: string) => {
    setParts(prev => prev.filter(p => p.id !== id));
    toast.success('Đã xóa phần thi.');
  };

  // ... các phần khác của form vẫn giữ nguyên

  return (
    <div className="space-y-6 p-4">
      {/* ... các Card trước đó (Tên kỳ thi, cài đặt điểm, cài đặt thời gian) */}

      {/* Chỉ giữ mỗi PartManager */}
      <PartManager parts={parts} onAddPart={handleAddPart} onRemovePart={handleRemovePart} />

      {/* Footer Buttons */}
      <div className="flex justify-end gap-2 p-4 border-t bg-gray-50 dark:bg-gray-800">
        <Button variant="outline" onClick={() => navigate('/word-exam-upload?tab=exam-categories')}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white">LƯU THAY ĐỔI</Button>
      </div>
    </div>
);

export default EditExamFormCategory;
"