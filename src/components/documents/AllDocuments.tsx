import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

type Doc = {
  id: string;
  title: string;
  teacher: string;
  subject: string;
  className: string;
  updatedAt: string;
};

const demoDocs: Doc[] = [
  {
    id: "d1",
    title: "MINDMAP SƠ ĐỒ TƯ DUY",
    teacher: "Thầy Dĩ Thâm",
    subject: "Vật Lý Online",
    className: "[2K4] Lớp tổng ôn Pro S2 Vật Lý thầy Dĩ Thâm",
    updatedAt: "04/07/2024 23:49:10",
  },
  {
    id: "d2",
    title: "Bài giảng Toán - Đại số",
    teacher: "Cô Lan",
    subject: "Toán",
    className: "Lớp 10A1",
    updatedAt: "01/06/2025 10:12:03",
  },
  {
    id: "d3",
    title: "Sơ đồ tư duy Hóa học",
    teacher: "Thầy Nam",
    subject: "Hóa",
    className: "Lớp 11B2",
    updatedAt: "15/05/2025 08:30:50",
  },
];

const subjects = ["Tất cả môn", "Toán", "Văn", "Tiếng Anh", "Vật Lý", "Hóa"];

const AllDocuments: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [subject, setSubject] = React.useState<string>(subjects[0]);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(20);
  const [page, setPage] = React.useState<number>(1);
  const [docs, setDocs] = React.useState<Doc[]>(demoDocs);

  const filtered = React.useMemo(() => {
    let list = docs.slice();
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.teacher.toLowerCase().includes(q) ||
          d.className.toLowerCase().includes(q)
      );
    }
    if (subject !== subjects[0]) {
      list = list.filter((d) => d.subject === subject);
    }
    return list;
  }, [docs, query, subject]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const current = filtered.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa tài liệu này?")) return;
    setDocs((prev) => prev.filter((d) => d.id !== id));
    toast.success("Đã xóa tài liệu.");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tất cả tài liệu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Nhập từ khoá tìm kiếm..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              />
            </div>

            <div>
              <Select value={subject} onValueChange={(v) => { setSubject(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((s) => (
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
                  <th className="w-[48px] p-3"><input type="checkbox" aria-label="select all" /></th>
                  <th className="p-3 text-left">Tên tài liệu</th>
                  <th className="p-3 text-left">Giáo viên</th>
                  <th className="p-3 text-left">Môn học</th>
                  <th className="p-3 text-left">Lớp học</th>
                  <th className="p-3 text-left">Thời gian cập nhật</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {current.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">Không có tài liệu.</td>
                  </tr>
                ) : (
                  current.map((d) => (
                    <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3"><input type="checkbox" /></td>
                      <td className="p-3">{d.title}</td>
                      <td className="p-3">{d.teacher}</td>
                      <td className="p-3">{d.subject}</td>
                      <td className="p-3">{d.className}</td>
                      <td className="p-3">{d.updatedAt}</td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button variant="ghost" size="icon" title="Chỉnh sửa">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600" title="Xóa" onClick={() => handleDelete(d.id)}>
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
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                «
              </button>
              <div className="px-3 py-1 bg-white border rounded text-sm">{page}</div>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
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

export default AllDocuments;