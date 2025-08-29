import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { LayoutGrid, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

type Member = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  dob?: string;
  status: "Kích hoạt" | "Tạm khóa" | "Chưa kích hoạt";
  updatedAt: string;
};

const initialMembers: Member[] = [
  { id: "1", code: "0916717958", name: "Nguyễn Hữu Tạo", phone: "0916717958", email: "huutaonguyen70@gmail.com", status: "Kích hoạt", updatedAt: "24/12/2023 20:14" },
  { id: "2", code: "0327702070", name: "Nguyễn Hữu Tạo", phone: "0327702070", email: "taoxg123@gamil.com", status: "Kích hoạt", updatedAt: "18/06/2022 22:32" },
  { id: "3", code: "0364453605", name: "nguyễn xuân tạo", phone: "0364453605", email: "nguyen.xuantao093@gmail.com", status: "Kích hoạt", updatedAt: "05/01/2022 11:51" },
  { id: "4", code: "0862610120", name: "cao văn tạo", phone: "0862610120", email: "vantao250903@gmail.com", dob: "13/10/2002", status: "Kích hoạt", updatedAt: "08/07/2021 13:31" },
  { id: "5", code: "0974203718", name: "Phạm đình tạo", phone: "0974203718", email: "phamdinhtao2k3@icloud.com", status: "Kích hoạt", updatedAt: "28/01/2021 20:30" },
  { id: "6", code: "0986103020", name: "Trương Ngọc Tạo", phone: "0989038002", email: "truongngoctrai2@gmail.com", status: "Kích hoạt", updatedAt: "30/12/2020 23:16" },
];

const statusOptions = ["Tất cả", "Kích hoạt", "Tạm khóa", "Chưa kích hoạt"];

const AllMembers: React.FC = () => {
  const [members, setMembers] = React.useState<Member[]>(initialMembers);
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<string>("Tất cả");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(20);
  const [page, setPage] = React.useState<number>(1);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      if (status !== "Tất cả" && m.status !== status) return false;
      if (!q) return true;
      return (
        m.code.toLowerCase().includes(q) ||
        m.name.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
      );
    });
  }, [members, query, status]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const current = filtered.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(current.map((m) => m.id));
    } else {
      setSelectedIds((prev) => prev.filter((id) => !current.some((m) => m.id === id)));
    }
  };

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((p) => p !== id)));
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa thành viên này?")) return;
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    toast.success("Đã xóa thành viên.");
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("Chưa chọn thành viên nào.");
      return;
    }
    if (!confirm(`Xóa ${selectedIds.length} thành viên đã chọn?`)) return;
    setMembers((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
    setSelectedIds([]);
    toast.success("Đã xóa các thành viên đã chọn.");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tất cả thành viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col md:flex-row gap-3 items-center">
            <div className="flex items-center gap-2 w-full">
              <div className="relative flex-1 md:flex-1 md:min-w-[420px]">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Tìm theo mã, tên, email hoặc điện thoại..."
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                />
              </div>
            </div>

            <div className="ml-auto w-full md:w-48">
              <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
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
                      checked={current.length > 0 && current.every((m) => selectedIds.includes(m.id))}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      aria-label="Select all"
                    />
                  </th>
                  <th className="p-3 text-left">Mã</th>
                  <th className="p-3 text-left">Họ và tên</th>
                  <th className="p-3 text-left">Số điện thoại</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Ngày sinh</th>
                  <th className="p-3 text-left">Trạng thái</th>
                  <th className="p-3 text-left">Ngày cập nhật</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {current.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-muted-foreground">Không tìm thấy thành viên.</td>
                  </tr>
                ) : (
                  current.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(m.id)}
                          onChange={(e) => toggleSelect(m.id, e.target.checked)}
                        />
                      </td>
                      <td className="p-3">{m.code}</td>
                      <td className="p-3">{m.name}</td>
                      <td className="p-3">{m.phone}</td>
                      <td className="p-3">{m.email}</td>
                      <td className="p-3">{m.dob ?? "-"}</td>
                      <td className="p-3">{m.status}</td>
                      <td className="p-3">{m.updatedAt}</td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button variant="ghost" size="icon" title="Vai trò / quyền">
                            <LayoutGrid className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600" title="Xóa" onClick={() => handleDelete(m.id)}>
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
              <div>Hiển thị từ {total === 0 ? 0 : startIndex + 1} đến {Math.min(startIndex + itemsPerPage, total)} trong tổng số {total}</div>
              <div>
                <Button variant="outline" onClick={handleBulkDelete} className="ml-2">Xóa mục chọn</Button>
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

export default AllMembers;