import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Search, MoreHorizontal, Eye, Trash2, Download } from "lucide-react";
import { cn } from "@/lib/utils";

type QuizRecord = {
  id: string;
  code: string;
  quizName: string;
  studentCode: string;
  studentName: string;
  className: string;
  subject: string;
  score: number | null;
  submittedAt?: string | null;
};

const demoData: QuizRecord[] = [
  {
    id: "1",
    code: "Q-2025-001",
    quizName: "Kiểm tra giữa kỳ Toán",
    studentCode: "HS-1001",
    studentName: "Nguyễn Văn A",
    className: "Lớp 10A1",
    subject: "Toán",
    score: 8.5,
    submittedAt: "2025-07-12 10:22",
  },
  {
    id: "2",
    code: "Q-2025-002",
    quizName: "Kiểm tra giữa kỳ Văn",
    studentCode: "HS-1002",
    studentName: "Trần Thị B",
    className: "Lớp 10A2",
    subject: "Văn",
    score: 7,
    submittedAt: "2025-07-13 11:05",
  },
  {
    id: "3",
    code: "Q-2025-003",
    quizName: "Thi thử HSA - Toán",
    studentCode: "HS-1003",
    studentName: "Lê Văn C",
    className: "Lớp 9B1",
    subject: "Toán",
    score: null,
    submittedAt: null,
  },
  // Add a few more demo rows
  {
    id: "4",
    code: "Q-2025-004",
    quizName: "Bài kiểm tra nhanh Anh văn",
    studentCode: "HS-1004",
    studentName: "Phạm D",
    className: "Lớp 11C1",
    subject: "Tiếng Anh",
    score: 9.2,
    submittedAt: "2025-07-14 09:33",
  },
  {
    id: "5",
    code: "Q-2025-005",
    quizName: "Kiểm tra 15'",    studentCode: "HS-1005",
    studentName: "Hoàng E",
    className: "Lớp 10A1",
    subject: "Toán",
    score: 6.5,
    submittedAt: "2025-07-15 14:02",
  },
];

const subjects = ["-- Chọn Môn --", "Toán", "Văn", "Tiếng Anh"];
const classes = ["-- Chọn Lớp --", "Lớp 9B1", "Lớp 10A1", "Lớp 10A2", "Lớp 11C1"];
const sortOptions = ["Điểm tăng dần", "Điểm giảm dần", "Giờ nộp cũ->mới", "Giờ nộp mới->cũ"];
const extraOptions = ["Tùy chọn tải", "Tải CSV", "Tải Excel"];

const QuizManagement: React.FC = () => {
  const [subjectFilter, setSubjectFilter] = React.useState<string>(subjects[0]);
  const [classFilter, setClassFilter] = React.useState<string>(classes[0]);
  const [search, setSearch] = React.useState<string>("");
  const [sortBy, setSortBy] = React.useState<string>(sortOptions[0]);
  const [exportOpt, setExportOpt] = React.useState<string>(extraOptions[0]);

  const [page, setPage] = React.useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(20);

  // filter + search
  const filtered = React.useMemo(() => {
    let list = demoData.slice();

    if (subjectFilter !== subjects[0]) {
      list = list.filter((r) => r.subject === subjectFilter);
    }
    if (classFilter !== classes[0]) {
      list = list.filter((r) => r.className === classFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (r) =>
          r.code.toLowerCase().includes(q) ||
          r.studentCode.toLowerCase().includes(q) ||
          r.studentName.toLowerCase().includes(q) ||
          r.quizName.toLowerCase().includes(q)
      );
    }

    // sort
    if (sortBy === "Điểm tăng dần") {
      list.sort((a, b) => (a.score ?? -1) - (b.score ?? -1));
    } else if (sortBy === "Điểm giảm dần") {
      list.sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    } else if (sortBy === "Giờ nộp cũ->mới") {
      list.sort((a, b) => {
        const ta = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const tb = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return ta - tb;
      });
    } else if (sortBy === "Giờ nộp mới->cũ") {
      list.sort((a, b) => {
        const ta = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
        const tb = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
        return tb - ta;
      });
    }

    return list;
  }, [subjectFilter, classFilter, search, sortBy]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const currentPageItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    // reset page if filtering reduces total
    if (page > totalPages) setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  return (
    <Layout headerTitle="Bài kiểm tra">
      <div className="flex flex-col gap-6 w-full">
        <Card>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
              <div>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={classFilter} onValueChange={setClassFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="Bạn có thể tìm kiếm theo mã đề, học sinh, lớp và môn"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select value={exportOpt} onValueChange={setExportOpt}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {extraOptions.map((o) => (
                      <SelectItem key={o} value={o}>
                        {o}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách bài kiểm tra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="text-left text-sm text-orange-600 border-b border-orange-200">
                    <th className="w-[48px] p-3"><input type="checkbox" aria-label="select all" /></th>
                    <th className="p-3">Mã đề</th>
                    <th className="p-3">Tên đề</th>
                    <th className="p-3">Mã HS</th>
                    <th className="p-3">Tên HS</th>
                    <th className="p-3">Lớp</th>
                    <th className="p-3">Môn học</th>
                    <th className="p-3">Điểm</th>
                    <th className="p-3">Giờ nộp</th>
                    <th className="p-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageItems.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-8 text-center text-muted-foreground">
                        Không có bản ghi nào
                      </td>
                    </tr>
                  ) : (
                    currentPageItems.map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="p-3"><input type="checkbox" /></td>
                        <td className="p-3">{r.code}</td>
                        <td className="p-3">{r.quizName}</td>
                        <td className="p-3">{r.studentCode}</td>
                        <td className="p-3">{r.studentName}</td>
                        <td className="p-3">{r.className}</td>
                        <td className="p-3">{r.subject}</td>
                        <td className="p-3">{r.score !== null ? r.score : <span className="text-muted-foreground">Chưa nộp</span>}</td>
                        <td className="p-3">{r.submittedAt ?? <span className="text-muted-foreground">-</span>}</td>
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-2">
                            <Button variant="ghost" size="icon" title="Xem">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-600" title="Xóa">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" title="Tải">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div>
                  <select
                    className="border rounded px-2 py-1"
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setPage(1);
                    }}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="text-sm text-muted-foreground">
                  Hiển thị từ {total === 0 ? 0 : startIndex + 1} đến {Math.min(startIndex + itemsPerPage, total)} trong tổng số {total}
                </div>
              </div>

              <div>
                <Pagination
                  // reuse simple controls: previous/next
                >
                  <div className="inline-flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      ‹
                    </Button>
                    <div className="px-3 py-1 bg-white border rounded text-sm">{page}</div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      ›
                    </Button>
                  </div>
                </Pagination>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default QuizManagement;