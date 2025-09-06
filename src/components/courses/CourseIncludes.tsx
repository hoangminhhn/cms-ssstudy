"use client";

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

const CourseIncludes: React.FC = () => {
  const [items, setItems] = React.useState<string[]>(['Bài giảng 1', 'Bài giảng 2']);

  const addItem = (value?: string) => {
    const next = value ?? `Khóa học ${items.length + 1}`;
    setItems((prev) => [...prev, next]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader />
      <CardContent>
        <div className="space-y-3">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border">
              <div className="text-sm">{it}</div>
              <Button variant="ghost" onClick={() => removeItem(idx)} aria-label={`Xóa ${it}`}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex items-center space-x-2">
            <Input
              placeholder="Thêm tên khóa học..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value.trim();
                  if (val) {
                    addItem(val);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => addItem()}>
              Thêm
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseIncludes;