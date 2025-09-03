"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import DateRangePicker from "@/components/DateRangePicker";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type PromoTarget = "Đơn hàng" | "Sản phẩm";
type PromoType = "%" | "vnd";

interface Promotion {
  id: string;
  code: string;
  type: PromoType;
  target: PromoTarget;
  createdAt: string;
  startAt?: string;
  endAt?: string;
}

const demoPromotions: Promotion[] = [
  { id: "1", code: "TEST123ADMINTEST", type: "vnd", target: "Đơn hàng", createdAt: "2025-08-28 23:41:27", startAt: "2025-08-30 00:00:00" },
  { id: "2", code: "SBOOK1325", type: "vnd", target: "Đơn hàng", createdAt: "2024-07-13 17:02:46", endAt: "2025-03-01 00:00:00" },
  { id: "3", code: "TEHA", type: "%", target: "Đơn hàng", createdAt: "2024-01-30 15:16:11", startAt: "2024-01-30 00:00:00" },
  { id: "4", code: "T1701", type: "vnd", target: "Sản phẩm", createdAt: "2024-01-18 04:33:10", startAt: "2024-01-17 00:00:00", endAt: "2024-01-19 00:00:00" },
  { id: "5", code: "DVP", type: "%", target: "Đơn hàng", createdAt: "2023-09-30 20:59:01", startAt: "2023-09-29 00:00:00", endAt: "2023-10-31 00:00:00" },
  { id: "6", code: "TRUNG_THU", type: "%", target: "Đơn hàng", createdAt: "2023-09-24 17:41:31" },
  { id: "7", code: "test123", type: "%", target: "Sản phẩm", createdAt: "2025-04-04 01:11:48" },
  { id: "8", code: "TEST123", type: "vnd", target: "Sản phẩm", createdAt: "2022-11-29 23:19:46", startAt: "2022-10-16 00:00:00", endAt: "2022-10-18 00:00:00" },
  { id: "9", code: "LPX06", type: "vnd", target: "Đơn hàng", createdAt: "2022-02-20 16:19:33", startAt: "2022-02-08 00:00:00", endAt: "2022-02-23 00:00:00" },
];

const formatDate = (s?: string) => {
  if (!s) return "-";
  try {
    const d = new Date(s);
    if (isNaN(d.getTime())) return s;
    return d.toLocaleString();
  } catch {
    return s;
  }
};

const PromotionTable: React.FC = () => {
  const [promotions, setPromotions] = React.useState<Promotion[]>(demoPromotions);
  const [query, setQuery] = React.useState("");
  const [dateRange, setDateRange] = React.useState<{ from?: Date; to?: Date } | undefined>(undefined);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(20);
  const [page, setPage] = React.useState<number>(1);
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});

  const filtered = promotions.filter((p) => {
    const q = query.trim().toLowerCase();
    if (q) {
      if (
        p.code.toLowerCase().includes(q) ||
        p.target.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
      ) {
        // pass
      } else {
        return false;
      }
    }

    if (dateRange?.from) {
      const created = new Date(p.createdAt);
      if (created < dateRange.from) return false;
    }
    if (dateRange?.to) {
      const created = new Date(p.createdAt);
      const toEnd = new Date(dateRange.to);
      toEnd.setHours(23, 59, 59, 999);
      if (created > toEnd) return false;
    }

    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
  const pageItems = filtered.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const toggleSelectAll = (checked: boolean) => {
    const next: Record<string, boolean> = { ...selected };
    pageItems.forEach((p) => (next[p.id] = checked));
    setSelected(next);
  };

  const toggleSelect = (id: string, checked: boolean) => {
    setSelected((prev) => ({ ...prev, [id]: checked }));
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa mã khuyến mãi này?")) return;
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    toast.success("Đã xóa khuyến mãi (demo).");
  };

  const handleEdit = (id: string) => {
    toast.info(`Mở modal chỉnh sửa cho ${id} (demo).`);
  };

  const handleCreate = () => {
    const newPromo: Promotion = {
      id: Date.now().toString(),
      code: `NEW${Math.floor(Math.random() * 10000)}`,
      type: Math.random() > 0.5 ? "%" : "vnd",
      target: Math.random() > 0.5 ? "Đơn hàng" : "Sản phẩm",
      createdAt: new Date().toISOString(),
    };
    setPromotions((prev) => [newPromo, ...prev]);
    toast.success("Đã tạo mã khuyến mãi demo.");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Khuyến mãi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 bg-white rounded p-3 border">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Nhập từ khoá tìm kiếm..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <DateRangePicker date={dateRange} setDate={setDateRange} />
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => { setPage(1); toast.success('Áp dụng tìm kiếm (demo).'); }}>
                  Tìm kiếm
                </Button>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleCreate}>
                  TẠO MÃ KHUYẾN MÃI
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-orange-600 border-b">
                  <th className="w-[48px] p-3">
                    <input
                      type="checkbox"
                      onChange={(e) => toggleSelectAll(e.target.checked)}
                      aria-label="Chọn tất cả"
                    />
                  </th>
                  <th className="p-3">Mã khuyến mãi</th>
                  <th className="p-3">Loại</th>
                  <th className="p-3">Đối tượng áp dụng</th>
                  <th className="p-3">Ngày tạo khuyến mãi</th>
                  <th className="p-3">Thời gian bắt đầu</th>
                  <th className="p-3">Thời gian kết thúc</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      Không có khuyến mãi.
                    </td>
                  </tr>
                ) : (
                  pageItems.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={!!selected[p.id]}
                          onChange={(e) => toggleSelect(p.id, e.target.checked)}
                        />
                      </td>
                      <td className="p-3 font-medium">{p.code}</td>
                      <td className="p-3">{p.type}</td>
                      <td className="p-3">{p.target}</td>
                      <td className="p-3">{formatDate(p.createdAt)}</td>
                      <td className="p-3">{formatDate(p.startAt)}</td>
                      <td className="p-3">{formatDate(p.endAt)}</td>
                      <td className="p-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(p.id)}
                            title="Chỉnh sửa"
                            className="p-2 rounded hover:bg-gray-100"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            title="Xóa"
                            className="p-2 rounded hover:bg-gray-100 text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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
              </div>
              <div>
                Hiển thị {filtered.length === 0 ? 0 : startIndex + 1} đến {endIndex} trong tổng số {filtered.length}
              </div>
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

export default PromotionTable;