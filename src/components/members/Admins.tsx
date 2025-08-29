import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, Pencil, Settings, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Admin = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email?: string;
  role: string;
  status: "Kích hoạt" | "Tạm khóa";
  updatedAt: string;
};

const initialAdmins: Admin[] = [
  { id: "a1", code: "0837706666", name: "Thầy Thành Đạt", phone: "0837706666", email: "", role: "Giáo viên", status: "Kích hoạt", updatedAt: "25/07/2025" },
  { id: "a2", code: "0903288889", name: "Thầy Nguyễn Tiến Đạt", phone: "0903288889", email: "tiendatnguyen2510@gmail.com", role: "Giáo viên", status: "Kích hoạt", updatedAt: "28/07/2025" },
];

const groups = ["Tất cả nhóm", "Super Admin", "Biên tập viên", "Giáo viên"];
const statuses = ["Tất cả", "Kích hoạt", "Tạm khóa"];

const Admins: React.FC = () => {
  const [admins, setAdmins] = React.useState<Admin[]>(initialAdmins);
  const [query, setQuery] = React.useState("");
  const [group, setGroup] = React.useState<string>(groups[0]);
  const [status, setStatus] = React.useState<string>(statuses[0]);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(20);
  const [page, setPage] = React.useState<number>(1);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return admins.filter((a) => {
      if (group !== groups[0]) {
        // demo: simple name-based group filtering (in real app use actual group field)
        if (!a.role.toLowerCase().includes(group.toLowerCase())) return false;
      }
      if (status !== statuses[0] && a.status !== status) return false;
      if (!q) return true;
      return (
        a.code.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.phone.toLowerCase().includes(q) ||
        (a.email || "").toLowerCase().includes(q)
      );
    });
  }, [admins, query, group, status]);

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
    if (checked) setSelectedIds(current.map((a) => a.id));
    else setSelectedIds((prev) => prev.filter((id) => !current.some((a) => a.id === id)));
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa quản trị viên này?")) return;
    setAdmins((prev) => prev.filter((a) => a.id !== id));
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    toast.success("Đã xóa quản trị viên.");
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("Chưa chọn mục nào.");
      return;
    }
    if (!confirm(`Xóa ${selectedIds.length} quản trị viên đã chọn?`)) return;
    setAdmins((prev) => prev.filter((a) => !selectedIds.includes(a.id)));
    setSelectedIds([]);
    toast.success("Đã xóa các quản trị viên đã chọn.");
  };

  const handleEdit = (id: string) => {
    toast.info(`Mở modal chỉnh sửa (demo): ${id}`);
  };

  const handleSettings = (id: string) => {
    toast.info(`Mở cài đặt (demo): ${id}`);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Quản trị viên</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_200px_200px] gap-3 items-center">
            <div className="relative md:col-span-1 md:min-w-0">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10 md:min-w-[460px]"
                placeholder="Nhập từ khoá tìm kiếm..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              />
            </div>

            <div>
              <Select value={group} onValueChange={(v) => { setGroup(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                      checked={current.length > 0 && current.every((a) => selectedIds.includes(a.id))}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      aria-label="Select all"
                    />
                  </th>
                  <th className="p-3 text-left">Mã</th>
                  <th className="p-3 text-left">Họ và tên</th>
                  <th className="p-3 text-left">Số điện thoại</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Quyền hạn</th>
                  <th className="p-3 text-left">Trạng thái</th>
                  <th className="p-3 text-left">Ngày cập nhật</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {current.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-muted-foreground">Không có quản trị viên.</td>
                  </tr>
                ) : (
                  current.map((a) => (
                    <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <input type="checkbox" checked={selectedIds.includes(a.id)} onChange={(e) => toggleSelect(a.id, e.target.checked)} />
                      </td>
                      <td className="p-3">{a.code}</td>
                      <td className="p-3">{a.name}</td>
                      <td className="p-3">{a.phone}</td>
                      <td className="p-3">{a.email ?? "-"}</td>
                      <td className="p-3">{a.role}</td>
                      <td className="p-3">{a.status}</td>
                      <td className="p-3">{a.updatedAt}</td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button variant="ghost" size="icon" title="Chỉnh sửa" onClick={() => handleEdit(a.id)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Cài đặt" onClick={() => handleSettings(a.id)}>
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600" title="Xóa" onClick={() => handleDelete(a.id)}>
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
                Hiển thị từ {total === 0 ? 0 : startIndex + 1} đến {Math.min(startIndex + itemsPerPage, total)} trong tổng số {total}
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

export default Admins;