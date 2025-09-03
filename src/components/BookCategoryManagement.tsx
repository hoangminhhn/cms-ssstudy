import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Pencil, Trash2, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface BookCategory {
  id: string;
  name: string;
  lastUpdated: string;
}

const initialCategories: BookCategory[] = [
  { id: "1", name: "CASIO", lastUpdated: "14/05/2025 14:52" },
  { id: "2", name: "Văn", lastUpdated: "30/09/2024 15:02" },
  { id: "3", name: "HSA", lastUpdated: "09/08/2024 22:18" },
  { id: "4", name: "Hóa học", lastUpdated: "25/02/2023 23:10" },
  { id: "5", name: "Tiếng Anh", lastUpdated: "02/09/2022 15:27" },
  { id: "6", name: "Toán", lastUpdated: "13/07/2022 22:58" },
  { id: "7", name: "Vật Lý", lastUpdated: "13/07/2022 22:58" },
];

const BookCategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<BookCategory[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = categories.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const current = filtered.slice(startIndex, endIndex);

  const handleItemsPerPageChange = (val: string) => {
    setItemsPerPage(Number(val));
    setCurrentPage(1);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(current.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((p) => p !== id)));
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success("Đã xóa danh mục.");
  };

  const handleEdit = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    const newName = window.prompt("Chỉnh sửa tên danh mục:", cat.name);
    if (newName === null) return;
    const nameTrim = newName.trim();
    if (!nameTrim) {
      toast.error("Tên danh mục không được để trống.");
      return;
    }
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name: nameTrim } : c)));
    toast.success("Đã cập nhật danh mục.");
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("Chưa chọn danh mục nào để xóa.");
      return;
    }
    setCategories((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    setSelectedIds([]);
    toast.success("Đã xóa danh mục đã chọn.");
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <div className="relative flex-1 w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Nhập từ khoá tìm kiếm..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleBulkDelete}>Xóa mục chọn</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === current.length && current.length > 0}
                    onChange={handleSelectAll}
                    aria-label="Chọn tất cả"
                  />
                </TableHead>
                <TableHead>Tên danh mục</TableHead>
                <TableHead className="text-center"><span>Ngày cập nhật</span></TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {current.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(cat.id)}
                      onChange={(e) => handleSelect(cat.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-center">{cat.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(cat.id)} aria-label={`Chỉnh sửa ${cat.name}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(cat.id)} aria-label={`Xóa ${cat.name}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {current.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    Không tìm thấy danh mục nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              Hiển thị
              <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue placeholder={`${itemsPerPage}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              từ {filtered.length === 0 ? 0 : startIndex + 1} đến {Math.min(endIndex, filtered.length)} trong tổng số {filtered.length}
            </div>

            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground">Trang</div>
              <div className="inline-flex items-center gap-2 border rounded-md overflow-hidden">
                <button
                  className="px-3 py-1 disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <div className="px-3 py-1 bg-white text-sm">{currentPage}</div>
                <button
                  className="px-3 py-1 disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookCategoryManagement;