import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Filter, Search, MoreHorizontal, Pencil, Trash2, Eye, Copy, PieChart } from 'lucide-react'; // Import PieChart
import { useNavigate } from 'react-router-dom'; // Import useNavigate

interface Exam {
  id: string;
  name: string;
  examCode: string;
  subject: string;
  examType: string;
  totalQuestions: number;
  lastUpdated: string;
}

const mockExams: Exam[] = [
  { id: '1', name: 'Buổi 5. BTVN', examCode: '104136', subject: 'Tiếng Anh Panda', examType: 'Trắc nghiệm', totalQuestions: 0, lastUpdated: '11/06/2025 19:44' },
  { id: '2', name: '[2K8] BTVN HỌC HÈ ĐẠI', examCode: '104082', subject: 'Toán', examType: 'Trắc nghiệm', totalQuestions: 35, lastUpdated: '24/05/2025 18:21' },
  { id: '3', name: 'Bài 10: Công thức Bayes', examCode: '103841', subject: 'Toán', examType: 'Trắc nghiệm', totalQuestions: 15, lastUpdated: '12/03/2025 15:50' },
  { id: '4', name: 'Bài 9: Công thức xác suất toàn phần', examCode: '103840', subject: 'Toán', examType: 'Trắc nghiệm', totalQuestions: 21, lastUpdated: '12/03/2025 14:55' },
  { id: '5', name: 'Bài 8: Công thức xác suất có điều kiện (Phần 3)', examCode: '103838', subject: 'Toán', examType: 'Trắc nghiệm', totalQuestions: 17, lastUpdated: '19/02/2025 14:22' },
  { id: '6', name: 'Bài 7: Công thức xác suất có điều kiện (Phần 2)', examCode: '103837', subject: 'Toán', examType: 'Trắc nghiệm', totalQuestions: 11, lastUpdated: '18/02/2025 14:05' },
  { id: '7', name: 'Bài 6: Công thức xác suất có điều kiện (Phần 1)-Copy', examCode: '104044', subject: 'Toán', examType: 'Trắc nghiệm', totalQuestions: 26, lastUpdated: '17/02/2025 13:59' },
  { id: '8', name: 'Bài 6: Công thức xác suất có điều kiện (Phần 1)', examCode: '103836', subject: 'Toán', examType: 'Trắc nghiệm', totalQuestions: 26, lastUpdated: '12/03/2025 14:52' },
  { id: '9', name: 'Bài 5: Quy tắc cộng và quy tắc nhân', examCode: '103832', subject: 'Toán', examType: 'Trắc nghiệm', totalQuestions: 20, lastUpdated: '17/02/2025 14:18' },
  { id: '10', name: 'Bài 4: Chỉnh phục xác suất không có điều kiện (Phần 2)', examCode: '103830', subject: 'Toán', examType: 'Trắc nghiệm', totalQuestions: 22, lastUpdated: '12/02/2025 14:29' },
  { id: '11', name: 'Bài 3: Chỉnh phục xác suất không có điều kiện (Phần 1)', examCode: '103823', subject: 'Toán', examType: 'Trắc nghiệm', totalQuestions: 30, lastUpdated: '22/01/2025 11:45' },
  { id: '12', name: 'Bài 34. BTVN tổng ôn', examCode: '103822', subject: 'Vật lí', examType: 'Trắc nghiệm', totalQuestions: 36, lastUpdated: '14/01/2025 11:28' },
  { id: '13', name: 'Bài 3. Thể tích khối chóp & lăng trụ chứa góc và khoảng cách', examCode: '103821', subject: 'Toán', examType: 'Trắc nghiệm', totalQuestions: 35, lastUpdated: '09/01/2025 16:47' },
  { id: '14', name: '[2008] đổ lượng giác bằng Casio', examCode: '103820', subject: 'Vật Lý Offline', examType: 'Trắc nghiệm', totalQuestions: 0, lastUpdated: '07/01/2025 14:40' },
  { id: '15', name: 'Bài 31: BTVN Phản ứng hạt nhân', examCode: '103819', subject: 'Vật lí', examType: 'Trắc nghiệm', totalQuestions: 65, lastUpdated: '06/01/2025 17:36' },
  { id: '16', name: 'Bài tập thêm Logic/PTSL', examCode: '103818', subject: 'SSSTUDY', examType: 'Trắc nghiệm', totalQuestions: 32, lastUpdated: '21/12/2024 17:24' },
  { id: '17', name: '[Sinh học] Bài 28: Bài tập tự luyện 6', examCode: '103817', subject: 'SSSTUDY', examType: 'Trắc nghiệm', totalQuestions: 24, lastUpdated: '11/12/2024 16:44' },
  { id: '18', name: '[Sinh học] Bài 26: Bài tập tự luyện 4', examCode: '103816', subject: 'SSSTUDY', examType: 'Trắc nghiệm', totalQuestions: 27, lastUpdated: '11/12/2024 16:32' },
  { id: '19', name: '[Sinh học] Bài 27: Bài tập tự luyện 5', examCode: '103815', subject: 'SSSTUDY', examType: 'Trắc nghiệm', totalQuestions: 19, lastUpdated: '11/12/2024 16:36' },
  { id: '20', name: '[Sinh học] Bài 25: Bài tập tự luyện 3', examCode: '103814', subject: 'SSSTUDY', examType: 'Trắc nghiệm', totalQuestions: 30, lastUpdated: '11/12/2024 16:21' },
];

const ExamTable: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(20);
  const navigate = useNavigate(); // Initialize useNavigate

  const totalPages = Math.ceil(mockExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExams = mockExams.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handleReportScoreClick = (examId: string) => {
    navigate(`/score-reports/${examId}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Nhập từ khóa tìm kiếm..."
              className="w-full pl-8"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <Select>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="toan">Toán</SelectItem>
                <SelectItem value="van">Văn</SelectItem>
                <SelectItem value="anh">Tiếng Anh</SelectItem>
                <SelectItem value="ly">Vật lí</SelectItem>
                <SelectItem value="sinh">Sinh học</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" /> Lọc kết quả
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"><Input type="checkbox" /></TableHead>
              <TableHead>Đề thi</TableHead>
              <TableHead>Mã đề</TableHead>
              <TableHead>Môn học</TableHead>
              <TableHead>Loại đề thi</TableHead>
              <TableHead>Tổng số câu</TableHead>
              <TableHead>Ngày cập nhật</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentExams.map((exam) => (
              <TableRow key={exam.id}>
                <TableCell><Input type="checkbox" /></TableCell>
                <TableCell className="font-medium">{exam.name}</TableCell>
                <TableCell>{exam.examCode}</TableCell>
                <TableCell>{exam.subject}</TableCell>
                <TableCell>{exam.examType}</TableCell>
                <TableCell>{exam.totalQuestions}</TableCell>
                <TableCell>{exam.lastUpdated}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Eye className="h-4 w-4" /> Xem chi tiết
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Pencil className="h-4 w-4" /> Chỉnh sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleReportScoreClick(exam.id)}>
                        <PieChart className="h-4 w-4" /> Báo cáo điểm
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Copy className="h-4 w-4" /> Sao chép
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                        <Trash2 className="h-4 w-4" /> Xóa
                      </DropdownMenuItem>
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
            từ {startIndex + 1} đến {Math.min(endIndex, mockExams.length)} trong tổng số {mockExams.length}
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

export default ExamTable;