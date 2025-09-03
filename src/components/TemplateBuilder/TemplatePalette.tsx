import React from 'react';
import { Button } from '@/components/ui/button';
import { BlockType } from './types';
import { cn } from '@/lib/utils';

interface TemplatePaletteProps {
  onDragStart: (event: React.DragEvent<HTMLDivElement>, type: BlockType, label: string) => void;
}

const paletteItems: { type: BlockType; label: string }[] = [
  { type: 'title', label: 'Tiêu đề chính' },
  { type: 'section', label: 'Phần thi' },
  { type: 'multiple-choice', label: 'Câu hỏi trắc nghiệm' },
  { type: 'essay', label: 'Câu hỏi tự luận' },
  { type: 'image', label: 'Hình ảnh' },
  { type: 'audio', label: 'Âm thanh' },
  { type: 'instructions', label: 'Hướng dẫn' },
];

const TemplatePalette: React.FC<TemplatePaletteProps> = ({ onDragStart }) => {
  return (
    <div className="w-64 p-4 border-r bg-gray-50 dark:bg-gray-800 flex flex-col gap-2">
      <h3 className="text-lg font-semibold mb-2">Thành phần</h3>
      {paletteItems.map((item) => (
        <div
          key={item.type}
          className={cn(
            "p-3 border rounded-md bg-white dark:bg-gray-700 text-center cursor-grab",
            "hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          )}
          draggable
          onDragStart={(e) => onDragStart(e, item.type, item.label)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

export default TemplatePalette;