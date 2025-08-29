import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  order: number;
  homepage: boolean;
  active: boolean;
  updatedAt: string;
}

const initialCategories: Category[] = [
  { id: "1", name: "Tiếng Anh THCS", order: 999, homepage: true, active: true, updatedAt: "28/05/2025 19:31" },
  { id: "2", name: "Sách luyện thi", order: 6, homepage: true, active: true, updatedAt: "26/12/2024 03:05" },
  { id: "3", name: "Ngữ văn THCS", order: 0, homepage: false, active: false, updatedAt: "26/12/2024 02:06" },
  { id: "4", name: "Lớp 8 - Lớp 9", order: 0, homepage: false, active: false, updatedAt: "26/12/2024 02:06" },
  { id: "5", name: "Luyện thi vào 10", order: 4, homepage: true, active: true, updatedAt: "16/05/2025 10:32" },
  { id: "6", name: "Lớp 10 - Lớp 11", order: 3, homepage: true, active: true, updatedAt: "16/05/2025 10:32" },
  { id: "7", name: "Lớp 12 - Luyện thi ĐH", order: 2, homepage: true, active: true, updatedAt: "28/12/2024 10:53" },
  { id: "8", name: "Luyện thi DGNL-ĐGTD", order: 5, homepage: true, active: true, updatedAt: "16/05/2025 10:32" },
  { id: "9", name: "Lớp 8", order: 0, homepage: false, active: false, updatedAt: "26/12/2024 02:07" },
];

const Categories: React.FC = () => {
  const [categories, setCategories] = React.useState<Category[]>(initialCategories);
  const [query, setQuery] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);
  const [page, setPage] = React.useState<number>(1);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, total);
  const current = filtered.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((p) => p !== id)));
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) setSelectedIds(current.map((c) => c.id));
    else setSelectedIds((prev) => prev.filter((id) => !current.some((c) => c.id === id)));
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("Chưa chọn danh mục nào.");
      return;
    }
    if (!confirm(`Xóa ${selectedIds.length} danh mục đã chọn?`)) return;
    setCategories((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    setSelectedIds([]);
    toast.success("Đã xóa danh mục đã chọn.");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    toast.success("Đã xóa danh mục.");
  };

  const handleEdit = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    const newName = prompt("Chỉnh sửa tên danh mục:", cat.name);
    if (newName === null) return;
    const trimmed = newName.trim();
    if (!trimmed) {
      toast.error("Tên không được để trống.");
      return;
    }
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name: trimmed, updatedAt: new Date().toLocaleString() } : c)));
    toast.success("Đã cập nhật tên danh mục.");
  };

  const handleOrderChange = (id: string, value: string) => {
    const num = Number(value);
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, order: isNaN(num) ? 0 : num } : c)));
  };

  const handleToggle = (id: string, field: "homepage" | "active", value: boolean) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, [field]: value, updatedAt: new Date().toLocaleString() } : c)));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Danh mục khóa học</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Nhập từ khoá tìm kiếm..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              />
            </div>
          </div>

          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => { setQuery(""); setPage(1); toast.info("Đã xóa tìm kiếm."); }}>Đặt lại</Button>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => toast.info("Thêm danh mục (demo)")}>Thêm danh mục</Button>
              <Button variant="outline" onClick={handleBulkDelete}>Xóa mục chọn</Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">Hiển thị</div>
              <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-sm text-orange-600 border-b">
                  <th className="w-[48px] p-3">
                    <input
                      type="checkbox"
                      checked={current.length > 0 && current.every((c) => selectedIds.includes(c.id))}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      aria-label="Chọn tất cả"
                    />
                  </th>
                  <th className="p-3 text-left">Tên</th>
                  <th className="p-3 text-left">Thứ tự</th>
                  <th className="p-3 text-left">Trang chủ</th>
                  <th className="p-3 text-left">Kích hoạt</th>
                  <th className="p-3 text-left">Thời gian cập nhật</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {current.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">Không tìm thấy danh mục.</td>
                  </tr>
                ) : (
                  current.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={(e) => toggleSelect(c.id, e.target.checked)} />
                      </td>
                      <td className="p-3">{c.name}</td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={c.order}
                          onChange={(e) => handleOrderChange(c.id, e.target.value)}
                          className="w-20 rounded border px-2 py-1"
                          aria-label={`Thứ tự ${c.name}`}
                        />
                      </td>
                      <td className="p-3">
                        <Switch checked={c.homepage} onCheckedChange={(v) => handleToggle(c.id, "homepage", !!v)} />
                      </td>
                      <td className="p-3">
                        <Switch checked={c.active} onCheckedChange={(v) => handleToggle(c.id, "active", !!v)} />
                      </td>
                      <td className="p-3">{c.updatedAt}</td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(c.id)} title="Chỉnh sửa">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(c.id)} title="Xóa">
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
            <div className="text-sm text-muted-foreground">
              Hiển thị từ {total === 0 ? 0 : startIndex + 1} đến {endIndex} trong tổng số {total}
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

export default Categories;