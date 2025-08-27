import React from 'react';
import { TemplateBlockData } from './types';
import { Card, CardContent } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TemplateBlockProps {
  block: TemplateBlockData;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isSelected: boolean;
}

const TemplateBlock: React.FC<TemplateBlockProps> = ({ block, onSelect, onDelete, isSelected }) => {
  return (
    <Card
      className={`relative p-4 border ${isSelected ? 'border-orange-500 ring-2 ring-orange-200' : 'border-gray-200'} bg-white dark:bg-gray-700 cursor-pointer`}
      onClick={() => onSelect(block.id)}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-6 w-6 text-gray-400 hover:text-red-500"
        onClick={(e) => {
          e.stopPropagation(); // Prevent selecting the block when deleting
          onDelete(block.id);
        }}
      >
        <XCircle className="h-4 w-4" />
      </Button>
      <CardContent className="p-0">
        <h4 className="font-semibold text-lg mb-1">{block.label}</h4>
        <p className="text-sm text-muted-foreground">
          {block.type === 'title' && `Nội dung: ${block.content || 'Chưa có'}`}
          {block.type === 'multiple-choice' && `Số câu: ${block.questionCount || 0}, Điểm: ${block.pointsPerQuestion || 0}`}
          {block.type === 'image' && `Nguồn: ${block.src || 'Chưa có'}`}
          {/* Add more details based on block type */}
        </p>
      </CardContent>
    </Card>
  );
};

export default TemplateBlock;