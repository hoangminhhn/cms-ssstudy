"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Trash2, Pencil, Search } from "lucide-react";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
  updatedAt: string; // ISO
  selected?: boolean;
};

const initialCategories: Category[] = [
  { id: "c1", name: "Hoạt Động - Sự Kiện", updatedAt: "2025-08-24T22:19:00" },
  { id: "c2", name: "Vinh Danh Học Viên", updatedAt: "2025-08-24T22:19:00" },
  { id: "c3", name: "Lịch Livestream", updatedAt: "2025-08-24T22:12:00" },
  { id: "c4", name: "Câu Chuyện Học Viên", updatedAt: "2025-07-30T01:12:00" },
  { id: "c5", name: "Báo chí nói về thầy Nguyễn Tiến Đạt", updatedAt: "2025-06-30T11:24:00" },
  { id: "c6", name: "Giới Thiệu", updatedAt: "2025-04-15T10:07:00" },
  { id: "c7", name: "Đối Tác", updatedAt: "2025-03-02T11:00:00" },
  { id: "c8", name: "Tin Tức", updatedAt: "2025-03-02T10:47:00" },
  { id: "c9", name: "Khuyến Mãi", updatedAt: "2025-03-02T10:44:00" },
  { id: "c10", name: "Chính Sách", updatedAt: "2024-05-14T21:17:00" },
  { id: "c11", name: "Bài viết Báo chí", updatedAt: "2024-04-13T10:28:00" },
  { id: "c12", name: "Thông báo", updatedAt: "2024-04-13T10:28:00" },
];

function formatDate(iso?: string) {
  if (!iso) return "-";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

const CategoriesList: React.FC = () => {
  const [categories, setCategories] = React.useState<Category[]>(initialCategories);
  const [query, setQuery] = React.useState("");
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(20);
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
  const pageItems = filtered.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const toggleSelectAll = (checked: boolean) => {
    setCategories((prev) =>
      prev.map((c) => {
        // only select items on current filtered page when toggling from table header
        const onPage = filtered.slice(startIndex, endIndex).some((p) => p.id === c.id);
        return onPage ? { ...c, selected: checked } : c;
      }),
    );
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, selected: checked } : c)));
  };

  const bulkDelete = () => {
    const selectedIds = categories.filter((c) => c.selected).map((c) => c.id);
    if (selectedIds.length === 0) {
      toast.error("Chưa chọn danh mục nào để xóa.");
      return;
    }
    if (!confirm(`Xóa ${selectedIds.length} danh mục đã chọn?`)) return;
    setCategories((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    toast.success("Đã xóa danh mục đã chọn.");
  };

  const handleEdit = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    const newName = prompt("Chỉnh sửa tên danh mục:", cat.name);
    if (newName === null) return;
    const trimmed = newName.trim();
    if (!trimmed) {
      toast.error("Tên danh mục không được để trống.");
      return;
    }
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name: trimmed, updatedAt: new Date().toISOString() } : c)));
    toast.success("Đã cập nhật danh mục.");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa danh mục này?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Đã xóa danh mục.");
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded border p-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Nhập từ khoá tìm kiếm..." value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => { setQuery(""); setPage(1); toast.success("Đã đặt lại bộ lọc tìm kiếm."); }}>Đặt lại</Button>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => toast.info("Tạo danh mục (demo).")}>Thêm danh mục</Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh mục bài viết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-orange-600 border-b">
                  <th className="w-[48px] p-3">
                    <input
                      type="checkbox"
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      aria-label="Chọn tất cả trên trang"
                    />
                  </th>
                  <th className="p-3">Tên danh mục</th>
                  <th className="p-3">Ngày cập nhật</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">Không tìm thấy danh mục.</td>
                  </tr>
                ) : (
                  pageItems.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="p-3">
                        <input type="checkbox" checked={!!c.selected} onChange={(e) => toggleSelectOne(c.id, e.target.checked)} />
                      </td>
                      <td className="p-3">{c.name}</td>
                      <td className="p-3">{formatDate(c.updatedAt)}</td>
                      <td className="p-3 text-right flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(c.id)} title="Chỉnh sửa">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(c.id)} title="Xóa">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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

              <div>
                Hiển thị {total === 0 ? 0 : startIndex + 1} đến {endIndex} trong tổng số {total}
              </div>

              <div>
                <Button variant="outline" onClick={bulkDelete}>Xóa mục chọn</Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>«</button>
              <div className="px-3 py-1 bg-white border rounded text-sm">{page}</div>
              <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>»</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesList;