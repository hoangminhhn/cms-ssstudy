import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CourseReview {
  id: string;
  reviewer: string;
  course: string;
  comment?: string;
  stars: number;
  active: boolean;
  updatedAt: string;
}

const initialReviews: CourseReview[] = [
  { id: "r1", reviewer: "Trần Thành Trung", course: "[2K8 - SSSstudy Live] S2: Tổng ôn - Toán học 12", comment: "", stars: 5, active: false, updatedAt: "03/07/2025 02:56:51" },
  { id: "r2", reviewer: "Trần Thành Trung", course: "[2K8 - SSLIVE] S1: Chuyên đề - Toán học 12", comment: "", stars: 5, active: false, updatedAt: "03/07/2025 02:55:45" },
  { id: "r3", reviewer: "nguyễn trung kiên", course: "Khóa: Luyện thi Đánh giá năng lực Đại học Quốc gia Hà Nội (HSA)", comment: "", stars: 5, active: false, updatedAt: "27/05/2025 19:45:04" },
  { id: "r4", reviewer: "Trung", course: "Test đánh giá khóa học 1711", comment: "Ok, cảm ơn bạn nhiều", stars: 4, active: false, updatedAt: "25/12/2023 22:49:44" },
];

const CourseReviews: React.FC = () => {
  const [reviews, setReviews] = React.useState<CourseReview[]>(initialReviews);
  const [query, setQuery] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(20);
  const [page, setPage] = React.useState<number>(1);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return reviews;
    return reviews.filter((r) =>
      r.reviewer.toLowerCase().includes(q) ||
      r.course.toLowerCase().includes(q) ||
      (r.comment || "").toLowerCase().includes(q)
    );
  }, [reviews, query]);

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
    if (checked) setSelectedIds(current.map((r) => r.id));
    else setSelectedIds((prev) => prev.filter((id) => !current.some((r) => r.id === id)));
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    setReviews((prev) => prev.filter((r) => r.id !== id));
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    toast.success("Đã xóa đánh giá.");
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      toast.error("Chưa chọn đánh giá nào.");
      return;
    }
    if (!confirm(`Xóa ${selectedIds.length} đánh giá đã chọn?`)) return;
    setReviews((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
    setSelectedIds([]);
    toast.success("Đã xóa các đánh giá đã chọn.");
  };

  const handleStarsChange = (id: string, value: string) => {
    const num = Number(value);
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, stars: num, updatedAt: new Date().toLocaleString() } : r)));
    toast.success("Đã cập nhật số sao.");
  };

  const handleToggleActive = (id: string, v: boolean | undefined) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, active: !!v, updatedAt: new Date().toLocaleString() } : r)));
    toast.success("Đã cập nhật trạng thái kích hoạt.");
  };

  const handleEdit = (id: string) => {
    const rev = reviews.find((r) => r.id === id);
    if (!rev) return;
    const newComment = prompt("Chỉnh sửa nội dung đánh giá:", rev.comment ?? "");
    if (newComment === null) return;
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, comment: newComment, updatedAt: new Date().toLocaleString() } : r)));
    toast.success("Đã lưu thay đổi.");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Đánh giá khóa học</CardTitle>
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

          {/* Action bar */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => { setQuery(""); setPage(1); toast.info("Đã xóa tìm kiếm."); }}>Đặt lại</Button>
              <Button variant="ghost" onClick={handleBulkDelete}>Xóa mục chọn</Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Hiển thị {total === 0 ? 0 : startIndex + 1} đến {endIndex} trong tổng số {total}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-sm text-orange-600 border-b">
                  <th className="w-[48px] p-3">
                    <input
                      type="checkbox"
                      checked={current.length > 0 && current.every((r) => selectedIds.includes(r.id))}
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      aria-label="Chọn tất cả"
                    />
                  </th>
                  <th className="p-3 text-left">Tên</th>
                  <th className="p-3 text-left">Lớp</th>
                  <th className="p-3 text-left">Đánh giá</th>
                  <th className="p-3 text-left">Số sao</th>
                  <th className="p-3 text-left">Kích hoạt</th>
                  <th className="p-3 text-left">Thời gian cập nhật</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {current.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">Không có đánh giá.</td>
                  </tr>
                ) : (
                  current.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <input type="checkbox" checked={selectedIds.includes(r.id)} onChange={(e) => toggleSelect(r.id, e.target.checked)} />
                      </td>
                      <td className="p-3">{r.reviewer}</td>
                      <td className="p-3">{r.course}</td>
                      <td className="p-3">{r.comment ?? <span className="text-muted-foreground">Chưa có</span>}</td>
                      <td className="p-3">
                        <Select value={String(r.stars)} onValueChange={(v) => handleStarsChange(r.id, v)}>
                          <SelectTrigger className="w-20 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="p-3">
                        <Switch checked={r.active} onCheckedChange={(v) => handleToggleActive(r.id, v)} />
                      </td>
                      <td className="p-3">{r.updatedAt}</td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(r.id)} title="Chỉnh sửa">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(r.id)} title="Xóa">
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

          {/* Pagination */}
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
              <div>Hiển thị từ {total === 0 ? 0 : startIndex + 1} đến {endIndex} trong tổng số {total}</div>
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

export default CourseReviews;