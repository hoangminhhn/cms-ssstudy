import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronRight, Pencil, Trash2, Plus } from 'lucide-react';

interface SubPart {
  id: string;
  name: string;
}

interface Part {
  id: string;
  name: string;
  subParts: SubPart[];
}

const PartWithSubPartsManager: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([
    {
      id: 'part1',
      name: 'Phần 1',
      subParts: [
        { id: 'part1-1', name: 'Phần 1.1' },
        { id: 'part1-2', name: 'Phần 1.2' },
      ],
    },
    {
      id: 'part2',
      name: 'Phần 2',
      subParts: [],
    },
    {
      id: 'part3',
      name: 'Phần 3',
      subParts: [],
    },
  ]);

  const [expandedParts, setExpandedParts] = useState<Record<string, boolean>>({});
  const [editingPartId, setEditingPartId] = useState<string | null>(null);
  const [editingSubPartId, setEditingSubPartId] = useState<string | null>(null);
  const [newSubPartName, setNewSubPartName] = useState<Record<string, string>>({});

  // Toggle expand/collapse part
  const toggleExpand = (partId: string) => {
    setExpandedParts((prev) => ({ ...prev, [partId]: !prev[partId] }));
  };

  // Update part name
  const updatePartName = (partId: string, newName: string) => {
    setParts((prev) =>
      prev.map((p) => (p.id === partId ? { ...p, name: newName } : p))
    );
  };

  // Update subpart name
  const updateSubPartName = (partId: string, subPartId: string, newName: string) => {
    setParts((prev) =>
      prev.map((p) => {
        if (p.id === partId) {
          const updatedSubParts = p.subParts.map((sp) =>
            sp.id === subPartId ? { ...sp, name: newName } : sp
          );
          return { ...p, subParts: updatedSubParts };
        }
        return p;
      })
    );
  };

  // Delete part
  const deletePart = (partId: string) => {
    setParts((prev) => prev.filter((p) => p.id !== partId));
    setExpandedParts((prev) => {
      const copy = { ...prev };
      delete copy[partId];
      return copy;
    });
  };

  // Delete subpart
  const deleteSubPart = (partId: string, subPartId: string) => {
    setParts((prev) =>
      prev.map((p) => {
        if (p.id === partId) {
          const filteredSubParts = p.subParts.filter((sp) => sp.id !== subPartId);
          return { ...p, subParts: filteredSubParts };
        }
        return p;
      })
    );
  };

  // Add new subpart inline
  const addSubPart = (partId: string) => {
    const name = newSubPartName[partId]?.trim();
    if (!name) return;
    setParts((prev) =>
      prev.map((p) => {
        if (p.id === partId) {
          const newSubPart: SubPart = {
            id: `subpart-${Date.now()}`,
            name,
          };
          return { ...p, subParts: [...p.subParts, newSubPart] };
        }
        return p;
      })
    );
    setNewSubPartName((prev) => ({ ...prev, [partId]: '' }));
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4 bg-white dark:bg-gray-800 rounded-md shadow">
      <h2 className="text-xl font-semibold mb-4">Quản lý Phần thi và Phần con</h2>
      {parts.length === 0 && (
        <p className="text-center text-muted-foreground">Chưa có phần thi nào.</p>
      )}
      <ul className="space-y-4">
        {parts.map((part) => {
          const isExpanded = expandedParts[part.id] || false;
          return (
            <li key={part.id} className="border rounded-md p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleExpand(part.id)}
                    aria-label={isExpanded ? 'Thu gọn phần thi' : 'Mở rộng phần thi'}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                  </button>
                  {editingPartId === part.id ? (
                    <Input
                      value={part.name}
                      onChange={(e) => updatePartName(part.id, e.target.value)}
                      onBlur={() => setEditingPartId(null)}
                      autoFocus
                      className="font-semibold text-lg w-48"
                    />
                  ) : (
                    <h3
                      className="font-semibold text-lg cursor-pointer select-none"
                      onClick={() => setEditingPartId(part.id)}
                      title="Click để chỉnh sửa tên phần thi"
                    >
                      {part.name}
                    </h3>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingPartId(part.id)}
                    aria-label="Chỉnh sửa phần thi"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deletePart(part.id)}
                    aria-label="Xóa phần thi"
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 pl-8 space-y-3">
                  {part.subParts.length === 0 && (
                    <p className="text-muted-foreground">Chưa có phần con nào.</p>
                  )}
                  <ul className="space-y-2">
                    {part.subParts.map((subPart) => (
                      <li key={subPart.id} className="flex items-center justify-between">
                        {editingSubPartId === subPart.id ? (
                          <Input
                            value={subPart.name}
                            onChange={(e) =>
                              updateSubPartName(part.id, subPart.id, e.target.value)
                            }
                            onBlur={() => setEditingSubPartId(null)}
                            autoFocus
                            className="w-44"
                          />
                        ) : (
                          <span
                            className="cursor-pointer select-none"
                            onClick={() => setEditingSubPartId(subPart.id)}
                            title="Click để chỉnh sửa tên phần con"
                          >
                            {subPart.name}
                          </span>
                        )}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingSubPartId(subPart.id)}
                            aria-label="Chỉnh sửa phần con"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteSubPart(part.id, subPart.id)}
                            aria-label="Xóa phần con"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      placeholder="Tên phần con mới"
                      value={newSubPartName[part.id] || ''}
                      onChange={(e) =>
                        setNewSubPartName((prev) => ({
                          ...prev,
                          [part.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSubPart(part.id);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => addSubPart(part.id)}
                      aria-label="Thêm phần con mới"
                      className="p-2"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PartWithSubPartsManager;