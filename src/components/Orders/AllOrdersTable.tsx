import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DateRangePicker } from "@/components/DateRangePicker";
import { Search, Eye, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

type OrderStatus = "Chờ xử lý" | "Đang xử lý" | "Đã thanh toán" | "Đang giao" | "Hoàn thành" | "Huỷ";

type OrderRecord = {
  id: string;
  orderCode: string;
  product: string;
  orderDate: string; // ISO or display
  customerName: string;
  phone: string;
  address: string;
  paymentMethod: string;
  amountVND: number;
  discountVND: number;
  status: OrderStatus;
};

const demoOrders: OrderRecord[] = [
  {
    id: "1",
    orderCode: "1001481",
    product: "Kỹ thuật CASIO từ A đến Z",
    orderDate: "2025-07-16T23:11:21",
    customerName: "Phạm Phương Anh",
    phone: "0912345678",
    address: "Hà Nội",
    paymentMethod: "Chuyển khoản",
    amountVND: 249000,
    discountVND: 0,
    status: "Chờ xử lý",
  },
  {
    id: "2",
    orderCode: "1001479",
    product: "Sách luyện thi HSA",
    orderDate: "2025-07-16T08:26:11",
    customerName: "Nguyệt An",
    phone: "0987654321",
    address: "Hồ Chí Minh",
    paymentMethod: "COD",
    amountVND: 3590000,
    discountVND: 590000,
    status: "Đã thanh toán",
  },
  {
    id: "3",
    orderCode: "1001478",
    product: "Combo Toán 10",
    orderDate: "2025-07-12T01:44:07",
    customerName: "Phùng Hoàng Minh",
    phone: "0327702070",
    address: "Đà Nẵng",
    paymentMethod: "Thẻ tín dụng",
    amountVND: 900000,
    discountVND: 0,
    status: "Đang giao",
  },
  {
    id: "4",
    orderCode: "1001467",
    product: "Bộ đề thi TSA",
    orderDate: "2025-07-07T22:04:09",
    customerName: "Lê Khánh Linh",
    phone: "0901112222",
    address: "Hải Phòng",
    paymentMethod: "Chuyển khoản",
    amountVND: 249000,
    discountVND: 0,
    status: "Hoàn thành",
  },
  {
    id: "5",
    orderCode: "1001466",
    product: "Sách luyện thi V-ACT",
    orderDate: "2025-07-07T21:43:32",
    customerName: "Ân Vũ",
    phone: "0919988776",
    address: "Cần Thơ",
    paymentMethod: "COD",
    amountVND: 1300000,
    discountVND: 100000,
    status: "Đang xử lý",
  },
];

const statusOptions = [
  { value: "all", label: "-- Trạng thái --" },
  { value: "Chờ xử lý", label: "Chờ xử lý" },
  { value: "Đang xử lý", label: "Đang xử lý" },
  { value: "Đã thanh toán", label: "Đã thanh toán" },
  { value: "Đang giao", label: "Đang giao" },
  { value: "Hoàn thành", label: "Hoàn thành" },
  { value: "Huỷ", label: "Huỷ" },
];

const paymentOptions = [
  { value: "all", label: "-- Phương thức thanh toán --" },
  { value: "COD", label: "COD" },
  { value: "Chuyển khoản", label: "Chuyển khoản" },
  { value: "Thẻ tín dụng", label: "Thẻ tín dụng" },
  { value: "Ví điện tử", label: "Ví điện tử" },
];

const formatVnd = (n: number) =>
  n.toLocaleString("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 });

const AllOrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<OrderRecord[]>(demoOrders);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date } | undefined>(undefined);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Derived list after filtering
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      // search across several fields
      const q = query.trim().toLowerCase();
      if (q) {
        const match =
          o.orderCode.toLowerCase().includes(q) ||
          o.product.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q) ||
          o.address.toLowerCase().includes(q);
        if (!match) return false;
      }

      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (paymentFilter !== "all" && o.paymentMethod !== paymentFilter) return false;

      if (dateRange?.from) {
        const od = new Date(o.orderDate);
        if (od < dateRange.from) return false;
      }
      if (dateRange?.to) {
        const od = new Date(o.orderDate);
        // include end of day
        const toEnd = new Date(dateRange.to);
        toEnd.setHours(23, 59, 59, 999);
        if (od > toEnd) return false;
      }

      return true;
    });
  }, [orders, query, statusFilter, paymentFilter, dateRange]);

  useEffect(() => {
    // reset page if filters change
    setCurrentPage(1);
  }, [query, statusFilter, paymentFilter, dateRange, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filtered.length);
  const pageItems = filtered.slice(startIndex, endIndex);

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa đơn hàng này?")) return;
    setOrders((prev) => prev.filter((o) => o.id !== id));
    toast.success("Đã xóa đơn hàng (demo).");
  };

  const handleView = (id: string) => {
    toast.info(`Xem chi tiết đơn hàng ${id} (demo).`);
  };

  const handleEdit = (id: string) => {
    toast.info(`Chỉnh sửa đơn hàng ${id} (demo).`);
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Tất cả đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters row */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-[1fr_180px_220px_220px_1fr] gap-3 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Nhập từ khoá tìm kiếm..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>

              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                  <SelectTrigger className="w-full h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentOptions.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <DateRangePicker date={dateRange} setDate={setDateRange} />
              </div>

              <div className="flex items-center gap-2 justify-end">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => toast.success("Áp dụng bộ lọc (demo).")}>
                  Tìm kiếm
                </Button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-sm text-orange-600 border-b">
                    <th className="p-3">Mã đơn hàng</th>
                    <th className="p-3">Sản phẩm</th>
                    <th className="p-3">Ngày đặt hàng</th>
                    <th className="p-3">Khách hàng</th>
                    <th className="p-3">SĐT</th>
                    <th className="p-3">Địa chỉ</th>
                    <th className="p-3">Phương thức</th>
                    <th className="p-3 text-right">Số tiền (vnd)</th>
                    <th className="p-3 text-right">Giảm giá</th>
                    <th className="p-3">Trạng thái</th>
                    <th className="p-3 text-right">Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {pageItems.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="p-8 text-center text-muted-foreground">
                        Không có bản ghi nào.
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((o) => (
                      <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3">{o.orderCode}</td>
                        <td className="p-3">{o.product}</td>
                        <td className="p-3">{new Date(o.orderDate).toLocaleString()}</td>
                        <td className="p-3">{o.customerName}</td>
                        <td className="p-3">{o.phone}</td>
                        <td className="p-3">{o.address}</td>
                        <td className="p-3">{o.paymentMethod}</td>
                        <td className="p-3 text-right">{formatVnd(o.amountVND)}</td>
                        <td className="p-3 text-right">{o.discountVND ? formatVnd(o.discountVND) : "-"}</td>
                        <td className={cn("p-3 font-medium", o.status === "Huỷ" ? "text-red-600" : o.status === "Đã thanh toán" ? "text-green-600" : "text-orange-600")}>
                          {o.status}
                        </td>
                        <td className="p-3 text-right flex gap-2 justify-end">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => handleView(o.orderCode)} title="Xem">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Xem</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(o.orderCode)} title="Chỉnh sửa">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Chỉnh sửa</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(o.id)} title="Xóa">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Xóa</TooltipContent>
                          </Tooltip>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination / footer */}
            <div className="flex items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Hiển thị
                <Select value={String(itemsPerPage)} onValueChange={(v) => setItemsPerPage(Number(v))}>
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                từ {filtered.length === 0 ? 0 : startIndex + 1} đến {endIndex} trong tổng số {filtered.length}
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  «
                </button>
                <div className="px-3 py-1 bg-white border rounded text-sm">{currentPage}</div>
                <button
                  className="px-3 py-1 border rounded disabled:opacity-50"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  »
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default AllOrdersTable;