import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Order {
  id: string;
  orderDate: string;
  customerName: string;
  value: string;
  paymentMethod: string;
  status: string;
}

const mockOrders: Order[] = [
  { id: '1001481', orderDate: '16/07/2025 23:11:21', customerName: 'Phạm Phương Anh', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001480', orderDate: '16/07/2025 17:17:35', customerName: 'Lê Khánh Linh', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001479', orderDate: '16/07/2025 08:26:11', customerName: 'nguyetanht le', value: '3.590.000đ', paymentMethod: 'Chưa xác thực', status: 'Thành công' },
  { id: '1001478', orderDate: '12/07/2025 01:44:07', customerName: 'Phùng Hoàng Minh', value: '900.000đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001477', orderDate: '10/07/2025 22:30:55', customerName: 'Phùng Hoàng Minh', value: '1.000.000đ', paymentMethod: 'Chưa xác thực', status: 'Chờ xử lý' },
  { id: '1001476', orderDate: '10/07/2025 22:29:51', customerName: 'Phùng Hoàng Minh', value: '1.000.000đ', paymentMethod: 'Chưa xác thực', status: 'Chờ xử lý' },
  { id: '1001475', orderDate: '10/07/2025 22:22:51', customerName: 'Phùng Hoàng Minh', value: '1.000.000đ', paymentMethod: 'Chưa xác thực', status: 'Chờ xử lý' },
  { id: '1001474', orderDate: '10/07/2025 22:21:54', customerName: 'Phùng Hoàng Minh', value: '1.249.000đ', paymentMethod: 'Chưa xác thực', status: 'Chờ xử lý' },
  { id: '1001473', orderDate: '08/07/2025 22:17:27', customerName: 'Ân Vũ', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001472', orderDate: '08/07/2025 10:16:41', customerName: 'Nguyễn Văn Mạnh', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001471', orderDate: '08/07/2025 10:16:21', customerName: 'Nguyễn Văn Mạnh', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001470', orderDate: '08/07/2025 10:06:28', customerName: 'Nguyễn Văn Mạnh', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001469', orderDate: '07/07/2025 22:21:17', customerName: 'Test đề thi mới', value: '700.000đ', paymentMethod: 'Chưa xác thực', status: 'Chờ xử lý' },
  { id: '1001468', orderDate: '07/07/2025 22:07:19', customerName: 'Phùng Hoàng Minh', value: '249.000đ', paymentMethod: 'Chưa xác thực', status: 'Chờ xử lý' },
  { id: '1001467', orderDate: '07/07/2025 22:04:09', customerName: 'Phùng Hoàng Minh', value: '249.000đ', paymentMethod: 'Chưa xác thực', status: 'Chờ xử lý' },
  { id: '1001466', orderDate: '07/07/2025 21:43:32', customerName: 'Phùng Hoàng Minh', value: '1.300.000đ', paymentMethod: 'Chưa xác thực', status: 'Chờ xử lý' },
  { id: '1001465', orderDate: '07/07/2025 20:25:41', customerName: 'Bùi thị quỳnh', value: '900.000đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001464', orderDate: '07/07/2025 17:36:00', customerName: 'Hai Rong Du', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001463', orderDate: '06/07/2025 23:22:36', customerName: 'Đỗ Văn Quý', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001462', orderDate: '06/07/2025 14:21:06', customerName: 'Nguyễn Duy Hưng', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001461', orderDate: '05/07/2025 12:58:19', customerName: 'Cao Việt Anh', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001460', orderDate: '05/07/2025 10:56:56', customerName: 'Phùng Hoàng Minh', value: '799.999đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001459', orderDate: '04/07/2025 23:24:52', customerName: 'OSAKA JP', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001458', orderDate: '04/07/2025 10:18:26', customerName: 'Dora', value: '900.000đ', paymentMethod: 'Chưa xác thực', status: 'Chờ xử lý' },
  { id: '1001457', orderDate: '03/07/2025 06:42:27', customerName: 'Phan Chí Thành', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001456', orderDate: '02/07/2025 23:34:48', customerName: 'Trường Phú', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001455', orderDate: '02/07/2025 23:32:35', customerName: 'Trường Phú', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001454', orderDate: '02/07/2025 15:57:49', customerName: 'Phạm Tuệ Nhi', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001453', orderDate: '02/07/2025 10:35:13', customerName: 'Nguyễn Thu Trang', value: '2.000.000đ', paymentMethod: 'Chưa xác thực', status: 'Chờ xử lý' },
  { id: '1001452', orderDate: '01/07/2025 21:01:10', customerName: 'Lê Tường Vy', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001451', orderDate: '01/07/2025 20:49:56', customerName: 'Lê Tường Vy', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001450', orderDate: '01/07/2025 14:10:43', customerName: 'Tuấn Nguyễn', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001449', orderDate: '01/07/2025 08:57:34', customerName: 'Trần Việt Khánh Chi', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
  { id: '1001448', orderDate: '01/07/2025 08:52:34', customerName: 'Đào Thanh Ân', value: '0đ', paymentMethod: 'Chưa xác thực', status: 'Chưa xác định' },
];

const RecentOrdersTable: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(20);

  const totalPages = Math.ceil(mockOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = mockOrders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Đơn hàng mới</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã đơn hàng</TableHead>
              <TableHead>Ngày đặt hàng</TableHead>
              <TableHead>Người đặt</TableHead>
              <TableHead>Giá trị</TableHead>
              <TableHead>Hình thức thanh toán</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.value}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                      <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                      <DropdownMenuItem>Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            Hiển thị
            <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-[70px] h-8">
                <SelectValue placeholder={itemsPerPage} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            từ {startIndex + 1} đến {Math.min(endIndex, mockOrders.length)} trong tổng số {mockOrders.length}
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentOrdersTable;