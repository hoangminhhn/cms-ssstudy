"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface EditExamFormCategoryProps {
  onAddPart: (partName: string) => void;
}

const EditExamFormCategory: React.FC<EditExamFormCategoryProps> = ({ onAddPart }) => {
  const [newPartName, setNewPartName] = useState('');

  const handleAddPart = () => {
    const trimmedName = newPartName.trim();
    if (!trimmedName) {
      toast.error('Vui lòng nhập tên phần thi');
      return;
    }
    onAddPart(trimmedName);
    toast.success(`Đã thêm phần thi: ${trimmedName}`);
    setNewPartName('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý Phần thi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Input
            placeholder="Nhập tên phần thi mới"
            value={newPartName}
            onChange={(e) => setNewPartName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddPart} className="whitespace-nowrap">
            Thêm phần thi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditExamFormCategory;