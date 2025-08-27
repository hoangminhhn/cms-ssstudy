import React from 'react';
import { TemplateBlockData } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BlockPropertiesPanelProps {
  selectedBlock: TemplateBlockData | null;
  onUpdateBlock: (updatedBlock: TemplateBlockData) => void;
}

const BlockPropertiesPanel: React.FC<BlockPropertiesPanelProps> = ({ selectedBlock, onUpdateBlock }) => {
  if (!selectedBlock) {
    return (
      <div className="w-72 p-4 border-l bg-gray-50 dark:bg-gray-800 flex flex-col gap-4">
        <h3 className="text-lg font-semibold mb-2">Thuộc tính khối</h3>
        <p className="text-sm text-muted-foreground">Chọn một khối trên khu vực thiết kế để chỉnh sửa thuộc tính.</p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    onUpdateBlock({
      ...selectedBlock,
      [id]: id === 'questionCount' || id === 'pointsPerQuestion' ? Number(value) : value,
    });
  };

  return (
    <div className="w-72 p-4 border-l bg-gray-50 dark:bg-gray-800 flex flex-col gap-4">
      <h3 className="text-lg font-semibold mb-2">Thuộc tính khối: {selectedBlock.label}</h3>
      <Card>
        <CardContent className="p-4 grid gap-4">
          {selectedBlock.type === 'title' && (
            <div>
              <Label htmlFor="content">Nội dung tiêu đề</Label>
              <Input id="content" value={selectedBlock.content || ''} onChange={handleChange} />
            </div>
          )}
          {selectedBlock.type === 'multiple-choice' && (
            <>
              <div>
                <Label htmlFor="questionCount">Số lượng câu hỏi</Label>
                <Input id="questionCount" type="number" value={selectedBlock.questionCount || 0} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="pointsPerQuestion">Điểm mỗi câu</Label>
                <Input id="pointsPerQuestion" type="number" value={selectedBlock.pointsPerQuestion || 0} onChange={handleChange} />
              </div>
            </>
          )}
          {selectedBlock.type === 'image' && (
            <div>
              <Label htmlFor="src">Link hình ảnh</Label>
              <Input id="src" value={selectedBlock.src || ''} onChange={handleChange} placeholder="URL hình ảnh" />
            </div>
          )}
          {selectedBlock.type === 'audio' && (
            <div>
              <Label htmlFor="src">Link âm thanh</Label>
              <Input id="src" value={selectedBlock.src || ''} onChange={handleChange} placeholder="URL file âm thanh" />
            </div>
          )}
          {selectedBlock.type === 'instructions' && (
            <div>
              <Label htmlFor="content">Nội dung hướng dẫn</Label>
              <Textarea id="content" value={selectedBlock.content || ''} onChange={handleChange} placeholder="Nhập hướng dẫn..." />
            </div>
          )}
          {/* Add more properties based on block type */}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlockPropertiesPanel;