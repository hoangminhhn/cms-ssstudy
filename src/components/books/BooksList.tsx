"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Search, Filter, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

export type Book = {
  id: string;
  name: string;
  subject: string;
  author?: string;
  price?: string;
  order?: number;
  featured?: boolean;
  display?: boolean;
  lastUpdated?: string;
};

const MOCK_BOOKS: Book[] = [
  { id: "1", name: "Kỹ thuật CASIO từ A đến Z", subject: "Toán", author: "NXB Toán", price: "249000", order: 1, featured: true, display: true, lastUpdated: "04/07/2025" },
  { id: "2", name: "7 Ngày đạt điểm tối đa", subject: "Toán", author: "NXB Lý", price: "199000", order: 2, featured: false, display: true, lastUpdated: "18/01/2025" },
  { id: "3", name: "Kỹ thuật CASIO nâng cao", subject: "Toán", author: "NXB CASIO", price: "299000", order: 3, featured: false, display: false, lastUpdated: "12/03/2025" },
];

interface Props {
  initialQuery?: string;
}

const BooksList: React.FC<Props> = ({ initialQuery = "" }) => {
  const [books, setBooks] = React.useState<Book[]>(MOCK_BOOKS);
  const [query, setQuery] = React.useState<string>(initialQuery);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(10);
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [subjectFilter, setSubjectFilter] = React.useState<string>("all");
  const navigate = useNavigate();

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return books.filter((b) => {
      if (subjectFilter !== "all" && b.subject !== subjectFilter) return false;
      if (!q) return true;
      return (
        b.name.toLowerCase().includes(q) ||
        (b.author ?? "").toLowerCase().includes(q) ||
        (b.id ?? "").toLowerCase().includes(q)
      );
    });
  }, [books, query, subjectFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
  const pageItems = filtered.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sách này?")) return;
    setBooks((prev) => prev.filter((b) => b.id !== id));
    alert("Đã xóa (demo).");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Tìm sách..." value={query} onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }} />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto mt-3 md:mt-0">
            <Select value={subjectFilter} onValueChange={(v) => { setSubjectFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Môn học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả môn</SelectItem>
                <SelectItem value="Toán">Toán</SelectItem>
                <SelectItem value="Văn">Văn</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => alert("Áp dụng lọc (demo).")}>
              <Filter className="mr-2 h-4 w-4" /> Lọc
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-sm text-orange-600 border-b">
                <th className="w-[50px] p-3">#</th>
                <th className="p-3">Tên sách</th>
                <th className="p-3">Tác giả</th>
                <th className="p-3">Môn</th>
                <th className="p-3">Giá</th>
                <th className="p-3">Nổi bật</th>
                <th className="p-3">Hiển thị</th>
                <th className="p-3">Cập nhật</th>
                <th className="p-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-muted-foreground">Không có sách.</td>
                </tr>
              ) : (
                pageItems.map((b, idx) => (
                  <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3">{startIndex + idx + 1}</td>
                    <td className="p-3 font-medium">
                      <button className="text-blue-600 hover:underline" onClick={() => navigate(`/books/${b.id}`)}>
                        {b.name}
                      </button>
                    </td>
                    <td className="p-3">{b.author ?? "-"}</td>
                    <td className="p-3">{b.subject}</td>
                    <td className="p-3">{b.price ?? "-"}</td>
                    <td className="p-3"><Switch checked={!!b.featured} readOnly /></td>
                    <td className="p-3"><Switch checked={!!b.display} readOnly /></td>
                    <td className="p-3">{b.lastUpdated ?? "-"}</td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button className="p-2 rounded hover:bg-gray-100" onClick={() => alert(`Edit ${b.id} (demo)`)} title="Sửa"><Pencil className="h-4 w-4" /></button>
                        <button className="p-2 rounded hover:bg-gray-100 text-red-600" onClick={() => handleDelete(b.id)} title="Xóa"><Trash2 className="h-4 w-4" /></button>
                        <button className="p-2 rounded hover:bg-gray-100" title="Tùy chọn"><MoreHorizontal className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Hiển thị
            <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
            từ {filtered.length === 0 ? 0 : startIndex + 1} đến {endIndex} trong tổng số {filtered.length}
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>«</button>
            <div className="px-3 py-1 bg-white border rounded text-sm">{currentPage}</div>
            <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>»</button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BooksList;