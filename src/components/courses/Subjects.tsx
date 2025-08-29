import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Subject {
  id: string;
  name: string;
  code: string;
  order: number;
  updatedAt: string;
}

const initialSubjects: Subject[] = [
  { id: "s1", name: "Toán Cao Cấp", code: "993", order: 0, updatedAt: "10/12/2024 21:14" },
  { id: "s2", name: "Toán", code: "12", order: 4, updatedAt: "28/07/2025 15:12" },
];

const Subjects: React.FC = () => {
  const [items, setItems] = React.useState<Subject[]>(initialSubjects);
  const [query, setQuery] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(20);
  const [page, setPage] = React.useState<number>(1);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toString().toLowerCase().includes(q)
    );
  }, [items, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const current = filtered.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((p) => p !== id)));
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(current.map((s) => s.id));
    else setSelectedIds((prev) => prev.filter((id) => !current.some((s) => s.id === id)));
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa môn học này?")) return;
    setItems((prev) => prev.filter((s) => s.id !== id));
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    toast.success("Đã xóa môn học.");
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("Chưa chọn mục nào.");
      return;
    }
    if (!confirm(`Xóa ${selectedIds.length} mục đã chọn?`)) return;
    setItems((prev) => prev.filter((s) => !selectedIds.includes(s.id)));
    setSelectedIds([]);
    toast.success("Đã xóa các môn đã chọn.");
  };

  const handleEdit = (id: string) => {
    toast.info(`Mở modal chỉnh sửa (demo) cho ${id}`);
  };

  const handleOrderChange = (id: string, value: string) => {
    const num = Number(value);
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, order: isNaN(num) ? 0 : num } : s)));
  };

  const handleOrderBlur = (id: string) => {
    toast.success("Đã cập nhật thứ tự.");
  };

  return (
    <div>
      <div className="mb-4 bg-white p-4 rounded border">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Tìm theo tên hoặc mã môn học..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              aria-label="Tìm môn học"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => { setQuery(""); setPage(1); toast.info("Đã xóa bộ lọc tìm kiếm."); }}>
              Đặt lại
            </Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => toast.info("Thêm môn học (demo)")}>
              Thêm môn học
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Môn học</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-sm text-orange-600 border-b">
                  <th className="w-[48px] p-3">
                    <input
                      type="checkbox"
                      checked={current.length > 0 && current.every((s) => selectedIds.includes(s.id))}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      aria-label="Chọn tất cả"
                    />
                  </th>
                  <th className="p-3 text-left">Tên môn học</th>
                  <th className="p-3 text-left">Mã môn học</th>
                  <th className="p-3 text-left">Thứ tự</th>
                  <th className="p-3 text-left">Ngày cập nhật</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {current.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">Không tìm thấy môn học.</td>
                  </tr>
                ) : (
                  current.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(s.id)}
                          onChange={(e) => toggleSelect(s.id, e.target.checked)}
                          aria-label={`Chọn ${s.name}`}
                        />
                      </td>
                      <td className="p-3">{s.name}</td>
                      <td className="p-3">{s.code}</td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={s.order}
                          onChange={(e) => handleOrderChange(s.id, e.target.value)}
                          onBlur={() => handleOrderBlur(s.id)}
                          className="w-20 rounded border px-2 py-1"
                          aria-label={`Thứ tự ${s.name}`}
                        />
                      </td>
                      <td className="p-3">{s.updatedAt}</td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(s.id)} title="Chỉnh sửa">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(s.id)} title="Xóa">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div>
                <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setPage(1); }}>
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>Hiển thị từ {total === 0 ? 0 : startIndex + 1} đến {Math.min(startIndex + itemsPerPage, total)} trong tổng số {total}</div>
              <div>
                <Button variant="outline" onClick={handleBulkDelete}>Xóa mục chọn</Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Trang trước"
              >
                «
              </button>
              <div className="px-3 py-1 bg-white border rounded text-sm">{page}</div>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Trang sau"
              >
                »
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subjects;