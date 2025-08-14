"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2 } from 'lucide-react';

interface EditExamFormCategoryProps {
  onAddPart: (partName: string) => void;
}

interface Part {
  id: string;
  name: string;
}

const EditExamFormCategory: React.FC<EditExamFormCategoryProps> = ({ onAddPart }) => {
  const [newPartName, setNewPartName] = useState('');
  const [parts, setParts] = useState<Part[]>([
    { id: 'part-1', name: 'Phần 1' },
    { id: 'part-2', name: 'Phần 2' },
    { id: 'part-3', name: 'Phần 3' },
  ]);

  const handleAddPart = () => {
    const trimmedName = newPartName.trim();
    if (!trimmedName) {
      toast.error('Vui lòng nhập tên phần thi');
      return;
    }
    // Tạo id đơn giản, bạn có thể thay bằng uuid nếu muốn
    const newPart: Part = {
      id: `part-${Date.now()}`,
      name: trimmedName,
    };
    setParts((prev) => [...prev, newPart]);
    onAddPart(trimmedName);
    toast.success(`Đã thêm phần thi: ${trimmedName}`);
    setNewPartName('');
  };

  const handlePartNameChange = (id: string, newName: string) => {
    setParts((prev) =>
      prev.map((part) => (part.id === id ? { ...part, name: newName } : part))
    );
  };

  const handleDeletePart = (id: string) => {
    setParts((prev) => prev.filter((part) => part.id !== id));
    toast.success('Đã xóa phần thi.');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý Phần thi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
          <Input
            placeholder="Nhập tên phần thi mới"
            value={newPartName}
            onChange={(e) => setNewPartName(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAddPart} className="whitespace-nowrap">
            Thêm
          </Button>
        </div>

        <Accordion type="multiple" className="w-full">
          {parts.map((part) => (
            <AccordionItem key={part.id} value={part.id}>
              <AccordionTrigger className="flex justify-between items-center">
                <span>{part.name || 'Phần chưa đặt tên'}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-600 hover:bg-red-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePart(part.id);
                  }}
                  aria-label={`Xóa phần thi ${part.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AccordionTrigger>
              <AccordionContent>
                <Input
                  value={part.name}
                  onChange={(e) => handlePartNameChange(part.id, e.target.value)}
                  placeholder="Tên phần thi"
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default EditExamFormCategory;