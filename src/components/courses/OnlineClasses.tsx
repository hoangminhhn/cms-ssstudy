import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Search, Filter, Pencil, BarChart2, Users, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface OnlineClass {
  id: string;
  code: string;
  name: string;
  subject: string;
  teacher: string;
  status: boolean;
  featured: boolean;
  order: number;
  updatedAt: string;
}

const MOCK_CLASSES: OnlineClass[] = [
  {
    id: "1",
    code: "DC10",
    name: "[2K10 - SSLIVE] Dualcore - Toán học 10",
    subject: "Toán",
    teacher: "Thầy Nguyễn Tiến Đạt",
    status: true,
    featured: true,
    order: 5,
    updatedAt: "29/08/2025 19:50:54",
  },
  {
    id: "2",
    code: "B002",
    name: "[2008] Toán 10 - Chinh phục toàn diện ...",
    subject: "Toán",
    teacher: "Thầy Nguyễn Tiến Đạt",
    status: false,
    featured: false,
    order: 68,
    updatedAt: "17/07/2025 16:05:03",
  },
];

const OnlineClasses: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [classFilter, setClassFilter] = React.useState("Tất cả");
  const [teacherFilter, setTeacherFilter] = React.useState("Tất cả");
  const [items, setItems] = React.useState<OnlineClass[]>(MOCK_CLASSES);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(20);
  const [page, setPage] = React.useState<number>(1);

  const teachers = Array.from(new Set(MOCK_CLASSES.map((c) => c.teacher)));
  const classes = ["Tất cả", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12"];

  const filtered = items.filter((c) => {
    const q = query.trim().toLowerCase();
    if (classFilter !== "Tất cả") {
      // in mock we don't map class to items; skip filtering by class for demo
    }
    if (teacherFilter !== "Tất cả" && c.teacher !== teacherFilter) return false;
    if (!q) return true;
    return (
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q) ||
      c.subject.toLowerCase().includes(q) ||
      c.teacher.toLowerCase().includes(q)
    );
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const current = filtered.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const toggleStatus = (id: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status: !it.status } : it)));
    toast.success("Đã cập nhật trạng thái.");
  };

  const toggleFeatured = (id: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, featured: !it.featured } : it)));
    toast.success("Đã cập nhật trạng thái nổi bật.");
  };

  const updateOrder = (id: string, value: number) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, order: value } : it)));
  };

  const handleEdit = (id: string) => {
    toast.info(`Chỉnh sửa lớp ${id} (demo).`);
  };
  const handleStats = (id: string) => {
    toast.info(`Thống kê lớp ${id} (demo).`);
  };
  const handleStudents = (id: string) => {
    toast.info(`Danh sách học viên lớp ${id} (demo).`);
  };
  const handleCopy = (id: string) => {
    const orig = items.find((i) => i.id === id);
    if (!orig) return;
    const copy: OnlineClass = {
      ...orig,
      id: Date.now().toString(),
      code: `${orig.code}-C`,
      name: `${orig.name} copy`,
      updatedAt: new Date().toLocaleString(),
    };
    setItems((prev) => [copy, ...prev]);
    toast.success("Đã nhân bản lớp.");
  };
  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa lớp này?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.success("Đã xóa lớp.");
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
            <Select value={classFilter} onValueChange={(v) => setClassFilter(v)}>
              <SelectTrigger className="w-[140px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={teacherFilter} onValueChange={(v) => setTeacherFilter(v)}>
              <SelectTrigger className="w-[220px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Tất cả">Tất cả</SelectItem>
                {teachers.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>

            <Button className="bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2">
              <Filter className="h-4 w-4" /> LỌC KẾT QUẢ
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lớp Online</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]"><input type="checkbox" /></TableHead>
                <TableHead>Mã lớp</TableHead>
                <TableHead>Tên lớp</TableHead>
                <TableHead>Môn học</TableHead>
                <TableHead>Giáo viên</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Nổi bật</TableHead>
                <TableHead>Thứ tự</TableHead>
                <TableHead>Ngày cập nhật</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {current.map((c) => (
                <TableRow key={c.id}>
                  <TableCell><input type="checkbox" /></TableCell>
                  <TableCell className="font-medium">{c.code}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.subject}</TableCell>
                  <TableCell>{c.teacher}</TableCell>
                  <TableCell>
                    <Switch checked={c.status} onCheckedChange={() => toggleStatus(c.id)} />
                  </TableCell>
                  <TableCell>
                    <Switch checked={c.featured} onCheckedChange={() => toggleFeatured(c.id)} />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={c.order}
                      onChange={(e) => updateOrder(c.id, Number(e.target.value || 0))}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>{c.updatedAt}</TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(c.id)} title="Chỉnh sửa">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleStats(c.id)} title="Thống kê">
                      <BarChart2 className="h-4 w-4" />
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
              <div>Hiển thị {total === 0 ? 0 : startIndex + 1} đến {Math.min(startIndex + itemsPerPage, total)} trong tổng số {total}</div>
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

export default OnlineClasses;