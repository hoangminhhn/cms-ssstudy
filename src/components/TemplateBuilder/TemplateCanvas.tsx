import React from 'react';
import { TemplateBlockData, BlockType } from './types';
import TemplateBlock from './TemplateBlock';
import { v4 as uuidv4 } from 'uuid'; // For unique IDs

interface TemplateCanvasProps {
  blocks: TemplateBlockData[];
  setBlocks: React.Dispatch<React.SetStateAction<TemplateBlockData[]>>;
  selectedBlockId: string | null;
  onSelectBlock: (id: string) => void;
}

const TemplateCanvas: React.FC<TemplateCanvasProps> = ({ blocks, setBlocks, selectedBlockId, onSelectBlock }) => {
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Allow dropping
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('blockType') as BlockType;
    const label = event.dataTransfer.getData('blockLabel');

    if (type) {
      const newBlock: TemplateBlockData = {
        id: uuidv4(),
        type,
        label,
        // Default properties based on type
        ...(type === 'title' && { content: 'Tiêu đề mới' }),
        ...(type === 'multiple-choice' && { questionCount: 10, pointsPerQuestion: 1 }),
      };
      setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
      onSelectBlock(newBlock.id); // Select the newly added block
    }
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks((prevBlocks) => prevBlocks.filter(block => block.id !== id));
    if (selectedBlockId === id) {
      onSelectBlock(null); // Deselect if the deleted block was selected
    }
  };

  return (
    <div
      className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 border-x overflow-y-auto"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h3 className="text-lg font-semibold mb-4">Khu vực thiết kế Template</h3>
      {blocks.length === 0 ? (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center text-muted-foreground min-h-[300px] flex items-center justify-center">
          Kéo và thả các thành phần từ bên trái vào đây để xây dựng template của bạn.
        </div>
      ) : (
        <div className="grid gap-4">
          {blocks.map((block) => (
            <TemplateBlock
              key={block.id}
              block={block}
              onSelect={onSelectBlock}
              onDelete={handleDeleteBlock}
              isSelected={block.id === selectedBlockId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateCanvas;