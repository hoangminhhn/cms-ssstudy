import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

interface BookReview {
  id: string;
  bookTitle: string;
  reviewer: string;
  reviewText: string;
  stars: number;
  active: boolean;
  updatedAt: string;
}

const initialReviews: BookReview[] = [
  {
    id: "r1",
    bookTitle: "Sách 20 đề chọn lọc THPTQG môn Toán 2024",
    reviewer: "Biên",
    reviewText: "sách rất hay và bổ ích",
    stars: 4,
    active: true,
    updatedAt: "02/07/2024 15:52",
  },
  {
    id: "r2",
    bookTitle: "Sách 7 Ngày đạt điểm tối đa mũ và logarit",
    reviewer: "Nguyễn Quang Hải",
    reviewText: "Sách quá hay",
    stars: 5,
    active: true,
    updatedAt: "18/01/2024 04:07",
  },
];

const BookReviews: React.FC = () => {
  const [reviews, setReviews] = React.useState<BookReview[]>(initialReviews);
  const [query, setQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(20);

  const filtered = reviews.filter(
    (r) =>
      r.bookTitle.toLowerCase().includes(query.toLowerCase()) ||
      r.reviewer.toLowerCase().includes(query.toLowerCase()) ||
      r.reviewText.toLowerCase().includes(query.toLowerCase())
  );

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, total);
  const current = filtered.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsPerPage, totalPages]);

  const handleToggleActive = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active, updatedAt: new Date().toLocaleString() } : r))
    );
    toast.success("Đã cập nhật trạng thái kích hoạt.");
  };

  const handleStarsChange = (id: string, value: string) => {
    const num = Number(value);
    if (!Number.isFinite(num) || num < 0) return;
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, stars: num, updatedAt: new Date().toLocaleString() } : r)));
    toast.success("Đã cập nhật số sao.");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast.success("Đã xóa đánh giá.");
  };

  const handleEdit = (id: string) => {
    const rev = reviews.find((r) => r.id === id);
    if (!rev) return;
    const newText = window.prompt("Chỉnh sửa nội dung đánh giá:", rev.reviewText);
    if (newText === null) return;
    const trimmed = newText.trim();
    if (!trimmed) {
      toast.error("Nội dung đánh giá không được để trống.");
      return;
    }
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reviewText: trimmed, updatedAt: new Date().toLocaleString() } : r)));
    toast.success("Đã cập nhật đánh giá.");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Đánh giá sách</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative max-w-lg">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Nhập từ khoá tìm kiếm..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setCurrentPage(1);
                }}
                aria-label="Tìm kiếm đánh giá sách"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y border">
              <thead className="bg-white">
                <tr className="text-sm text-left text-orange-600">
                  <th className="w-[48px] p-3"><input type="checkbox" disabled /></th>
                  <th className="p-3">Tên sách</th>
                  <th className="p-3">Người đánh giá</th>
                  <th className="p-3">Đánh giá</th>
                  <th className="p-3">Số sao</th>
                  <th className="p-3">Kích hoạt</th>
                  <th className="p-3">Ngày cập nhật</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {current.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      Không tìm thấy đánh giá nào.
                    </td>
                  </tr>
                ) : (
                  current.map((r) => (
                    <tr key={r.id} className="text-sm">
                      <td className="p-3 align-top">
                        <input type="checkbox" />
                      </td>
                      <td className="p-3 align-top">{r.bookTitle}</td>
                      <td className="p-3 align-top">{r.reviewer}</td>
                      <td className="p-3 align-top">{r.reviewText}</td>
                      <td className="p-3 align-top">
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
                      <td className="p-3 align-top">
                        <Switch checked={r.active} onCheckedChange={() => handleToggleActive(r.id)} />
                      </td>
                      <td className="p-3 align-top">{r.updatedAt}</td>
                      <td className="p-3 align-top text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(r.id)} aria-label="Chỉnh sửa">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(r.id)} aria-label="Xóa">
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

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div>
                <Select value={String(itemsPerPage)} onValueChange={(v) => { setItemsPerPage(Number(v)); setCurrentPage(1); }}>
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
                Hiển thị từ {total === 0 ? 0 : startIndex + 1} đến {endIndex} trong tổng số {total}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 rounded border disabled:opacity-50"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Prev page"
              >
                «
              </button>
              <div className="px-3 py-1 bg-white text-sm">{currentPage}</div>
              <button
                className="px-3 py-1 rounded border disabled:opacity-50 bg-orange-50"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
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

export default BookReviews;