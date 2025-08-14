import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const EditExamFormCategory: React.FC = () => {
  const [parts, setParts] = React.useState<{ id: string; name: string }[]>([
    { id: 'part1', name: 'Phần thi 1' },
    { id: 'part2', name: 'Phần thi 2' },
    { id: 'part3', name: 'Phần thi 3' },
  ]);
  const [newPartName, setNewPartName] = React.useState('');

  const handleAddPart = () => {
    const trimmedName = newPartName.trim();
    if (!trimmedName) {
      toast.error('Tên phần thi không được để trống.');
      return;
    }
    if (parts.some(p => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      toast.error('Phần thi đã tồn tại.');
      return;
    }
    const newPart = {
      id: `part-${Date.now()}`,
      name: trimmedName,
    };
    setParts(prev => [...prev, newPart]);
    setNewPartName('');
    toast.success('Đã thêm phần thi mới.');
  };

  const handleDeletePart = (id: string) => {
    setParts(prev => prev.filter(p => p.id !== id));
    toast.success('Đã xóa phần thi.');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý Phần thi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Nhập tên phần thi mới"
            value={newPartName}
            onChange={(e) => setNewPartName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddPart();
              }
            }}
          />
          <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleAddPart}>
            Thêm
          </Button>
        </div>
        {parts.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">Chưa có phần thi nào.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-700">
                <th className="py-2 px-4">Tên phần thi</th>
                <th className="py-2 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((part) => (
                <tr key={part.id} className="border-b border-gray-200 dark:border-gray-800">
                  <td className="py-2 px-4">{part.name}</td>
                  <td className="py-2 px-4 text-right">
                    <Button
                      variant="ghost"
                      className="text-red-600 hover:bg-red-50"
                      size="sm"
                      onClick={() => handleDeletePart(part.id)}
                      aria-label={`Xóa phần thi ${part.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};

export default EditExamFormCategory;