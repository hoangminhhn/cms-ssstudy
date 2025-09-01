"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Bell, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Notification {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  selected?: boolean;
}

const sampleNotifications: Notification[] = [
  {
    id: "n1",
    title: "Đề:test 1234 cho lớp: LỚP TEST WEB - KHÔNG XÓA",
    content: "LỚP TEST WEB - KHÔNG XÓA có đề thi: test 1234. Chúc các em làm bài tốt.",
    createdAt: "2021-09-02T16:01:08",
    updatedAt: "2021-09-02T16:01:09",
    enabled: true,
  },
  {
    id: "n2",
    title: "Đề:TIẾNG ANH TEST 1 cho lớp: TIẾNG ANH TEST 1",
    content: "TIẾNG ANH TEST 1 có đề thi: TIẾNG ANH TEST 1. Chúc các em làm bài tốt.",
    createdAt: "2021-07-13T17:48:32",
    updatedAt: "2021-07-13T17:48:33",
    enabled: true,
  },
  {
    id: "n3",
    title: "Test 16",
    content: "test 16 https://vnexpress.net",
    createdAt: "2020-11-29T19:53:58",
    updatedAt: "2020-11-29T21:39:06",
    enabled: false,
  },
];

const formatDatetime = (iso?: string) => {
  if (!iso) return "-";
  try {
    return format(new Date(iso), "dd/MM/yyyy HH:mm:ss");
  } catch {
    return iso;
  }
};

const AllNotifications: React.FC = () => {
  const [items, setItems] = React.useState<Notification[]>(sampleNotifications);
  const [query, setQuery] = React.useState("");
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(20);
  const [page, setPage] = React.useState<number>(1);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (it) =>
        it.title.toLowerCase().includes(q) ||
        it.content.toLowerCase().includes(q)
    );
  }, [items, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, total);
  const pageItems = filtered.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const toggleSelectAllOnPage = (checked: boolean) => {
    const pageIds = pageItems.map((p) => p.id);
    setItems((prev) => prev.map((it) => (pageIds.includes(it.id) ? { ...it, selected: checked } : it)));
  };

  const toggleSelectOne = (id: string, checked: boolean) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, selected: checked } : it)));
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa thông báo này?")) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
    toast.success("Đã xóa thông báo (demo).");
  };

  const handleEdit = (id: string) => {
    toast.info(`Mở form chỉnh sửa (demo) - id: ${id}`);
  };

  const toggleEnabled = (id: string) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, enabled: !it.enabled } : it)));
    toast.success("Đã cập nhật trạng thái kích hoạt (demo).");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Tất cả thông báo</CardTitle>
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
                  setPage(1);
                }}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-orange-600 border-b">
                  <th className="w-[48px] p-3">
                    <input
                      type="checkbox"
                      onChange={(e) => toggleSelectAllOnPage(e.target.checked)}
                      aria-label="Chọn tất cả trên trang"
                    />
                  </th>
                  <th className="p-3">Tên thông báo</th>
                  <th className="p-3">Nội dung</th>
                  <th className="p-3">Ngày tạo</th>
                  <th className="p-3">Ngày cập nhật</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-muted-foreground">
                      Không tìm thấy thông báo.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((it) => (
                    <tr key={it.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <input type="checkbox" checked={!!it.selected} onChange={(e) => toggleSelectOne(it.id, e.target.checked)} />
                      </td>
                      <td className="p-3 font-medium max-w-[320px]">
                        <div className="truncate text-sm">{it.title}</div>
                      </td>
                      <td className="p-3 max-w-[640px]">
                        <div className="text-sm text-muted-foreground line-clamp-3">{it.content}</div>
                      </td>
                      <td className="p-3">{formatDatetime(it.createdAt)}</td>
                      <td className="p-3">{formatDatetime(it.updatedAt)}</td>
                      <td className="p-3 text-right flex items-center justify-end gap-2">
                        <button title="Chỉnh sửa" className="p-2 rounded hover:bg-gray-100" onClick={() => handleEdit(it.id)}>
                          <Pencil className="h-4 w-4" />
                        </button>
                        {/* Tooltip/title changed: when enabled show "Gửi thông báo" instead of "Tắt thông báo" */}
                        <button
                          title={it.enabled ? "Gửi thông báo" : "Bật thông báo"}
                          className="p-2 rounded hover:bg-gray-100"
                          onClick={() => toggleEnabled(it.id)}
                          aria-label={it.enabled ? "Gửi thông báo" : "Bật thông báo"}
                        >
                          <Bell className="h-4 w-4" />
                        </button>
                        <button title="Xóa" className="p-2 rounded hover:bg-gray-100 text-red-600" onClick={() => handleDelete(it.id)}>
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* footer */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div>Hiển thị</div>
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
              <div>
                từ {total === 0 ? 0 : startIndex + 1} đến {endIndex} trong tổng số {total}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                aria-label="Trang trước"
              >
                «
              </button>
              <div className="px-3 py-1 bg-white border rounded text-sm">{page}</div>
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                aria-label="Trang sau"
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

export default AllNotifications;