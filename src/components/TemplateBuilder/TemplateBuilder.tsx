import React from 'react';
import TemplatePalette from './TemplatePalette';
import TemplateCanvas from './TemplateCanvas';
import BlockPropertiesPanel from './BlockPropertiesPanel';
import { TemplateBlockData } from './types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const TemplateBuilder: React.FC = () => {
  const [blocks, setBlocks] = React.useState<TemplateBlockData[]>([]);
  const [selectedBlockId, setSelectedBlockId] = React.useState<string | null>(null);

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, type: TemplateBlockData['type'], label: string) => {
    event.dataTransfer.setData('blockType', type);
    event.dataTransfer.setData('blockLabel', label);
  };

  const handleSelectBlock = (id: string) => {
    setSelectedBlockId(id);
  };

  const handleUpdateBlock = (updatedBlock: TemplateBlockData) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) => (block.id === updatedBlock.id ? updatedBlock : block))
    );
  };

  const handleSaveTemplate = () => {
    // In a real application, you would send 'blocks' data to your backend
    console.log('Saving template:', blocks);
    toast.success('Template đã được lưu thành công!');
    // You might want to clear the canvas or navigate away after saving
    // setBlocks([]);
    // setSelectedBlockId(null);
  };

  const selectedBlock = blocks.find(block => block.id === selectedBlockId) || null;

  return (
    <div className="flex h-[calc(100vh-120px)]"> {/* Adjust height to fit layout */}
      <TemplatePalette onDragStart={handleDragStart} />
      <TemplateCanvas
        blocks={blocks}
        setBlocks={setBlocks}
        selectedBlockId={selectedBlockId}
        onSelectBlock={handleSelectBlock}
      />
      <BlockPropertiesPanel
        selectedBlock={selectedBlock}
        onUpdateBlock={handleUpdateBlock}
      />
      <div className="absolute bottom-0 right-0 p-4 border-t bg-gray-50 dark:bg-gray-800 flex justify-end gap-2 w-full">
        <Button variant="outline" onClick={() => { setBlocks([]); setSelectedBlockId(null); toast.info('Đã hủy tạo template.'); }}>HỦY</Button>
        <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleSaveTemplate}>LƯU TEMPLATE</Button>
      </div>
    </div>
  );
};

export default TemplateBuilder;