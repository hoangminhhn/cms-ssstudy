import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, Plus, EyeOff, Eye } from "lucide-react";
import { toast } from "sonner";

type FilterMode = "all" | "hidden" | "deleted";

interface PartItem {
  id: string;
  name: string;
  questions: number;
  hidden?: boolean;
  deleted?: boolean;
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
  const [filter, setFilter] = React.useState<FilterMode>("all");

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
      hidden: false,
      deleted: false,
    };
    setParts((prev) => [newPart, ...prev]);
    setNewPartName("");
    toast.success("Đã thêm phần thi.");
  };

  const handleSoftDelete = (id: string) => {
    setParts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              deleted: !p.deleted ? true : p.deleted,
            }
          : p,
      ),
    );
    toast.success("Phần đã được chuyển vào thùng rác.");
  };

  const handlePermanentDelete = (id: string) => {
    setParts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Đã xóa vĩnh viễn phần thi.");
  };

  const handleDeleteClick = (p: PartItem) => {
    if (!p.deleted) {
      // mark as deleted (soft)
      handleSoftDelete(p.id);
    } else {
      // already soft-deleted -> remove permanently
      handlePermanentDelete(p.id);
    }
    if (editingId === p.id) {
      setEditingId(null);
      setEditingName("");
    }
  };

  const handleToggleHidden = (id: string) => {
    setParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, hidden: !p.hidden } : p)),
    );
    toast.success("Đã cập nhật trạng thái ẩn/hiện.");
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

  // counts for pills:
  const countAll = parts.filter((p) => !p.hidden && !p.deleted).length;
  const countHidden = parts.filter((p) => p.hidden && !p.deleted).length;
  const countDeleted = parts.filter((p) => p.deleted).length;

  // visibleParts per current filter:
  const visibleParts = parts.filter((p) => {
    if (filter === "all") return !p.hidden && !p.deleted; // only show non-hidden, non-deleted
    if (filter === "hidden") return !!p.hidden && !p.deleted;
    if (filter === "deleted") return !!p.deleted;
    return true;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Quản lý phần thi</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex flex-col sm:flex-row sm:items-center gap-2">
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

        {/* Filter pills under the input row with counts in parentheses */}
        <div className="mb-4 flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-md text-sm inline-flex items-center gap-2 ${filter === "all" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"}`}
            aria-pressed={filter === "all"}
            aria-label={`Tất cả (${countAll})`}
            title={`Tất cả (${countAll})`}
          >
            <span>Tất cả</span>
            <span className={`text-sm ${filter === "all" ? "text-white" : "text-muted-foreground"}`}>({countAll})</span>
          </button>

          <button
            onClick={() => setFilter("hidden")}
            className={`px-3 py-1 rounded-md text-sm inline-flex items-center gap-2 ${filter === "hidden" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"}`}
            aria-pressed={filter === "hidden"}
            aria-label={`Ẩn (${countHidden})`}
            title={`Ẩn (${countHidden})`}
          >
            <span>Ẩn</span>
            <span className={`text-sm ${filter === "hidden" ? "text-white" : "text-muted-foreground"}`}>({countHidden})</span>
          </button>

          <button
            onClick={() => setFilter("deleted")}
            className={`px-3 py-1 rounded-md text-sm inline-flex items-center gap-2 ${filter === "deleted" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"}`}
            aria-pressed={filter === "deleted"}
            aria-label={`Xóa (${countDeleted})`}
            title={`Xóa (${countDeleted})`}
          >
            <span>Xóa</span>
            <span className={`text-sm ${filter === "deleted" ? "text-white" : "text-muted-foreground"}`}>({countDeleted})</span>
          </button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              {/* Removed Mã and Số câu columns as requested */}
              <TableHead>Tên phần</TableHead>
              <TableHead className="text-right w-[140px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleParts.map((p) => (
              <TableRow key={p.id} className={p.hidden && !p.deleted ? "opacity-60" : ""}>
                <TableCell>
                  {editingId === p.id ? (
                    <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="font-medium truncate">{p.name}</div>
                      {p.hidden && !p.deleted && (
                        <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">Ẩn</span>
                      )}
                      {p.deleted && (
                        <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">Đã xóa</span>
                      )}
                    </div>
                  )}
                </TableCell>

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

                      {/* Hide/Unhide icon placed between edit and delete */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleHidden(p.id)}
                        aria-label={p.hidden ? `Hiện phần ${p.name}` : `Ẩn phần ${p.name}`}
                        title={p.hidden ? "Hiện phần" : "Ẩn phần"}
                      >
                        {p.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteClick(p)}
                        aria-label={p.deleted ? `Xóa vĩnh viễn ${p.name}` : `Xóa ${p.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}

            {visibleParts.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-muted-foreground py-8">
                  Không có phần phù hợp.
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