import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Filter, Search, MoreHorizontal, Pencil, Trash2, Eye, Copy, PieChart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Exam {
  id: string;
  name: string;
  examCode: string;
  subject: string;
  examType: string;
  totalQuestions: number;
  lastUpdated: string;
  examPeriod?: string; // New field for kỳ thi
}

const mockExams: Exam[] = [
  { id: '1', name: 'Buổi 5. BTVN', examCode: '104136', subject: 'Tiếng Anh Panda', examType: 'Trắc nghiệm', totalQuestions: 0, lastUpdated: '11/06/2025 19:44', examPeriod: 'HSA' },
  { id: '2', name: '[2K8] BTVN HỌC HÈ ĐẠI', examCode: '104082', subject: 'Toán', examType: 'Trắc nghiệm', totalQuestions: 35, lastUpdated: '24/05/2025 18:21', examPeriod: 'Tốt nghiệp' },
  { id: '3', name: 'Bài 10: Công thức Bayes', examCode: '103841', subject: 'Toán', examType: 'Trắc nghiệm', totalQuestions: 15, lastUpdated: '12/03/2025 15:50', examPeriod: 'TSA' },
  { id: '4', name: 'Bài 9: Công thức xác suất toàn phần', examCode: '103840', subject: 'Toán', examType: 'Trắc nghiệm', totalQuestions: 21, lastUpdated: '12/03/2025 14:55', examPeriod: 'V-ACT' },
  // ... các dữ liệu khác giữ nguyên, có thể thêm examPeriod tương ứng
];

const examPeriods = ['Tốt nghiệp', 'HSA', 'TSA', 'V-ACT'];

const ExamTable: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(20);
  const [selectedExamPeriod, setSelectedExamPeriod] = React.useState<string>('');
  const navigate = useNavigate();

  // Lọc theo kỳ thi nếu có chọn
  const filteredExams = selectedExamPeriod
    ? mockExams.filter(exam => exam.examPeriod === selectedExamPeriod)
    : mockExams;

  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExams = filteredExams.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
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
            <Select value={selectedExamPeriod} onValueChange={setSelectedExamPeriod}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Kỳ thi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả</SelectItem>
                {examPeriods.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            từ {startIndex + 1} đến {Math.min(endIndex, filteredExams.length)} trong tổng số {filteredExams.length}
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