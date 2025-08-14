"use client";

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface Part {
  id: string;
  name: string;
}

interface PartManagerProps {
  parts: Part[];
  onAddPart: (name: string) => void;
  onRemovePart: (id: string) => void;
}

const PartManager: React.FC<PartManagerProps> = ({ parts, onAddPart, onRemovePart }) => {
  const [name, setName] = useState('');

  const handleAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onAddPart(trimmed);
    setName('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý Phần thi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Nhập tên phần thi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleAdd}>
            Thêm
          </Button>
        </div>
        <ul className="list-disc pl-5 space-y-1">
          {parts.map((part) => (
            <li key={part.id} className="flex justify-between items-center">
              <span>{part.name}</span>
              <Button variant="ghost" size="icon" onClick={() => onRemovePart(part.id)}>
                Xóa
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PartManager;