import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Search, Pencil, SlidersHorizontal, Users, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface OfflineClass {
  id: string;
  code: string;
  name: string;
  subject: string;
  teacher: string;
  status: boolean;
  featured: boolean;
  order: number | string;
  updatedAt: string;
}

const INITIAL: OfflineClass[] = [
  { id: "c1", code: "[2K8] Vật Lý 12L4", name: "[2K8] Vật Lý 12L4", subject: "Vật Lý Offline", teacher: "Thầy Vũ Đình Phúc", status: true, featured: false, order: 999, updatedAt: "25/08/2025 16:56:54" },
  { id: "c2", code: "[2K8] Vật Lý 12L3", name: "[2K8] Vật Lý 12L3", subject: "Vật Lý Offline", teacher: "Thầy Vũ Đình Phúc", status: true, featured: false, order: 999, updatedAt: "25/08/2025 14:28:58" },
  { id: "c3", code: "[2K7] LÝ 12 THẦY PHÚC", name: "[2K7] LÝ 12 THẦY PHÚC", subject: "Vật Lý Offline", teacher: "Thầy Vũ Đình Phúc", status: true, featured: true, order: 999, updatedAt: "07/05/2025 15:52:13" },
  { id: "c4", code: "[2K8] Vật Lý 12L2", name: "[2K8] Vật Lý 12L2", subject: "Vật Lý Offline", teacher: "Thầy Vũ Đình Phúc", status: true, featured: true, order: 999, updatedAt: "25/08/2025 14:55:01" },
  { id: "c5", code: "[2K8] Vật Lý 12L1", name: "[2K8] Vật Lý 12L1", subject: "Vật Lý Offline", teacher: "Thầy Vũ Đình Phúc", status: true, featured: true, order: 999, updatedAt: "27/08/2025 15:20:51" },
];

const OfflineClasses: React.FC = () => {
  const [items, setItems] = React.useState<OfflineClass[]>(INITIAL);
  const [query, setQuery] = React.useState("");
  const [teacherFilter, setTeacherFilter] = React.useState<string>("Tất cả");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(20);
  const [page, setPage] = React.useState<number>(1);

  const teachers = Array.from(new Set(items.map((i) => i.teacher)));
  const filtered = items.filter((i) => {
    const q = query.trim().toLowerCase();
    if (teacherFilter !== "Tất cả" && i.teacher !== teacherFilter) return false;
    if (!q) return true;
    return (
      i.code.toLowerCase().includes(q) ||
      i.name.toLowerCase().includes(q) ||
      i.subject.toLowerCase().includes(q) ||
      i.teacher.toLowerCase().includes(q)
    );
  });

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
    if (checked) setSelectedIds(current.map((c) => c.id));
    else setSelectedIds((prev) => prev.filter((id) => !current.some((c) => c.id === id)));
  };

  const toggleStatus = (id: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: !it.status } : it)));
    toast.success("Cập nhật trạng thái.");
  };

  const toggleFeatured = (id: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, featured: !it.featured } : it)));
    toast.success("Cập nhật nổi bật.");
  };

  const updateOrder = (id: string, value: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, order: value === "" ? "" : Number(value) } : it)));
  };

  const handleEdit = (id: string) => toast.info(`Chỉnh sửa lớp ${id} (demo)`);
  const handleSettings = (id: string) => toast.info(`Cài đặt lớp ${id} (demo)`);
  const handleStudents = (id: string) => toast.info(`Danh sách học viên ${id} (demo)`);
  const handleCopy = (id: string) => {
    const orig = items.find((x) => x.id === id);
    if (!orig) return;
    const copy = { ...orig, id: Date.now().toString(), code: `${orig.code}-C`, name: `${orig.name} copy`, updatedAt: new Date().toLocaleString() };
    setItems((prev) => [copy, ...prev]);
    toast.success("Đã nhân bản lớp.");
  };
  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa lớp này?")) return;
    setItems((prev) => prev.filter((x) => x.id !== id));
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    toast.success("Đã xóa lớp.");
  };
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("Chưa chọn mục nào.");
      return;
    }
    if (!confirm(`Xóa ${selectedIds.length} lớp đã chọn?`)) return;
    setItems((prev) => prev.filter((x) => !selectedIds.includes(x.id)));
    setSelectedIds([]);
    toast.success("Đã xóa các lớp đã chọn.");
  };

  return (
    <div>
      <div className="mb-4 bg-white p-4 rounded border">
        <div className="flex flex-col md:flex-row md:items-center md:gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Nhập từ khoá tìm kiếm..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            />
          </div>

          <div className="mt-3 md:mt-0 flex items-center gap-3">
            <Select value={teacherFilter} onValueChange={(v) => setTeacherFilter(v)}>
              <SelectTrigger className="w-[220px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tất cả">Tất cả</SelectItem>
                {teachers.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>

            <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2" onClick={() => { setPage(1); toast.success('Đã áp dụng bộ lọc (demo)'); }}>
              <Filter className="h-4 w-4" /> LỌC
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lớp Offline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-sm text-orange-600 border-b">
                  <th className="w-[48px] p-3">
                    <input
                      type="checkbox"
                      checked={current.length > 0 && current.every((c) => selectedIds.includes(c.id))}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      aria-label="Select all"
                    />
                  </th>
                  <th className="p-3 text-left">Mã lớp</th>
                  <th className="p-3 text-left">Tên lớp</th>
                  <th className="p-3 text-left">Môn học</th>
                  <th className="p-3 text-left">Giáo viên</th>
                  <th className="p-3 text-left">Trạng thái</th>
                  <th className="p-3 text-left">Nổi bật</th>
                  <th className="p-3 text-left">Thứ tự</th>
                  <th className="p-3 text-left">Ngày cập nhật</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {current.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-muted-foreground">Không tìm thấy lớp nào.</td>
                  </tr>
                ) : (
                  current.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <input type="checkbox" checked={selectedIds.includes(c.id)} onChange={(e) => toggleSelect(c.id, e.target.checked)} />
                      </td>
                      <td className="p-3 font-medium">{c.code}</td>
                      <td className="p-3">{c.name}</td>
                      <td className="p-3">{c.subject}</td>
                      <td className="p-3">{c.teacher}</td>
                      <td className="p-3">
                        <Switch checked={c.status} onCheckedChange={() => toggleStatus(c.id)} />
                      </td>
                      <td className="p-3">
                        <Switch checked={c.featured} onCheckedChange={() => toggleFeatured(c.id)} />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={String(c.order)}
                          onChange={(e) => updateOrder(c.id, e.target.value)}
                          className="w-24 rounded border px-2 py-1"
                        />
                      </td>
                      <td className="p-3">{c.updatedAt}</td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(c.id)} title="Chỉnh sửa">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleSettings(c.id)} title="Cài đặt">
                            <SlidersHorizontal className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleStudents(c.id)} title="Học viên">
                            <Users className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleCopy(c.id)} title="Nhân bản">
                            <Copy className="h-4 w-4" />
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
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div>
                <select
                  className="border rounded px-2 py-1"
                  value={itemsPerPage}
                  onChange={(e) => { setItemsPerPage(Number(e.target.value)); setPage(1); }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div>
                Hiển thị {total === 0 ? 0 : startIndex + 1} đến {Math.min(startIndex + itemsPerPage, total)} trong tổng số {total}
              </div>

              <div>
                <Button variant="outline" onClick={handleBulkDelete}>Xóa mục chọn</Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Prev page"
              >
                «
              </button>
              <div className="px-3 py-1 bg-white border rounded text-sm">{page}</div>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Next page"
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

export default OfflineClasses;