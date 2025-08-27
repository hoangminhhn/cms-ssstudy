import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

interface PartItem {
  id: string;
  name: string;
  questions: number;
}

const initialParts: PartItem[] = [
  { id: "p-1", name: "Phần 1", questions: 0 },
  { id: "p-2", name: "Phần 2", questions: 0 },
  { id: "p-3", name: "Phần 3", questions: 0 },
];

const ExamPartManager: React.FC = () => {
  const [parts, setParts] = React.useState<PartItem[]>(initialParts);
  const [newPartName, setNewPartName] = React.useState<string>("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editingName, setEditingName] = React.useState<string>("");

  const handleAddPart = () => {
    const name = newPartName.trim();
    if (!name) {
      toast.error("Vui lòng nhập tên phần.");
      return;
    }
    const newPart: PartItem = {
      id: `p-${Date.now()}`,
      name,
      questions: 0,
    };
    setParts((prev) => [newPart, ...prev]);
    setNewPartName("");
    toast.success("Đã thêm phần thi.");
  };

  const handleDelete = (id: string) => {
    setParts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Đã xóa phần thi.");
    if (editingId === id) {
      setEditingId(null);
      setEditingName("");
    }
  };

  const startEdit = (p: PartItem) => {
    setEditingId(p.id);
    setEditingName(p.name);
  };

  const saveEdit = (id: string) => {
    const name = editingName.trim();
    if (!name) {
      toast.error("Tên phần không được để trống.");
      return;
    }
    setParts((prev) => prev.map((p) => (p.id === id ? { ...p, name } : p)));
    setEditingId(null);
    setEditingName("");
    toast.success("Đã cập nhật tên phần.");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quản lý phần thi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="flex-1">
            <Input
              placeholder="Tên phần mới (ví dụ: Phần 4)"
              value={newPartName}
              onChange={(e) => setNewPartName(e.target.value)}
            />
          </div>
          <div className="flex-shrink-0">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleAddPart} aria-label="Thêm phần thi">
              <Plus className="mr-2 h-4 w-4" /> Thêm phần
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Mã</TableHead>
              <TableHead>Tên phần</TableHead>
              <TableHead className="w-[120px]">Số câu</TableHead>
              <TableHead className="text-right w-[140px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parts.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.id}</TableCell>
                <TableCell>
                  {editingId === p.id ? (
                    <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                  ) : (
                    <div className="truncate">{p.name}</div>
                  )}
                </TableCell>
                <TableCell>{p.questions}</TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  {editingId === p.id ? (
                    <>
                      <Button size="sm" onClick={() => saveEdit(p.id)} className="bg-green-600 hover:bg-green-700 text-white">
                        Lưu
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { setEditingId(null); setEditingName(""); }}>
                        Hủy
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => startEdit(p)} aria-label={`Chỉnh sửa ${p.name}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50" onClick={() => handleDelete(p.id)} aria-label={`Xóa ${p.name}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {parts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  Chưa có phần thi nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ExamPartManager;