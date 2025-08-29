import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MoreHorizontal, Eye, Edit, Trash2, Download } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Document {
  id: string;
  title: string;
  category: string;
  subject: string;
  grade: string;
  uploadDate: string;
  fileSize: string;
  downloads: number;
  status: 'Active' | 'Inactive';
}

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Giáo trình Toán lớp 10',
    category: 'Giáo trình',
    subject: 'Toán',
    grade: 'Lớp 10',
    uploadDate: '2025-07-10',
    fileSize: '15.2 MB',
    downloads: 245,
    status: 'Active'
  },
  {
    id: '2',
    title: 'Bài tập Văn lớp 11',
    category: 'Bài tập',
    subject: 'Văn',
    grade: 'Lớp 11',
    uploadDate: '2025-07-15',
    fileSize: '8.5 MB',
    downloads: 189,
    status: 'Active'
  },
  {
    id: '3',
    title: 'Tài liệu Hóa học ôn thi',
    category: 'Tài liệu ôn thi',
    subject: 'Hóa học',
    grade: 'Lớp 12',
    uploadDate: '2025-07-20',
    fileSize: '22.1 MB',
    downloads: 412,
    status: 'Active'
  },
  {
    id: '4',
    title: 'Luyện thi Tiếng Anh',
    category: 'Tài liệu ôn thi',
    subject: 'Tiếng Anh',
    grade: 'Lớp 12',
    uploadDate: '2025-07-18',
    fileSize: '30.5 MB',
    downloads: 356,
    status: 'Inactive'
  },
  {
    id: '5',
    title: 'Vật lý nâng cao',
    category: 'Giáo trình',
    subject: 'Vật lý',
    grade: 'Lớp 11',
    uploadDate: '2025-07-12',
    fileSize: '18.7 MB',
    downloads: 178,
    status: 'Active'
  }
];

const categories = ['-- Tất cả --', 'Giáo trình', 'Bài tập', 'Tài liệu ôn thi'];
const subjects = ['-- Tất cả --', 'Toán', 'Văn', 'Hóa học', 'Vật lý', 'Tiếng Anh'];
const grades = ['-- Tất cả --', 'Lớp 10', 'Lớp 11', 'Lớp 12'];
const statuses = ['-- Tất cả --', 'Active', 'Inactive'];

const DocumentTable: React.FC = () => {
  const [documents, setDocuments] = React.useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState(categories[0]);
  const [subjectFilter, setSubjectFilter] = React.useState(subjects[0]);
  const [gradeFilter, setGradeFilter] = React.useState(grades[0]);
  const [statusFilter, setStatusFilter] = React.useState(statuses[0]);

  const filteredDocuments = React.useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           doc.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === categories[0] || doc.category === categoryFilter;
      const matchesSubject = subjectFilter === subjects[0] || doc.subject === subjectFilter;
      const matchesGrade = gradeFilter === grades[0] || doc.grade === gradeFilter;
      const matchesStatus = statusFilter === statuses[0] || doc.status === statusFilter;

      return matchesSearch && matchesCategory && matchesSubject && matchesGrade && matchesStatus;
    });
  }, [documents, searchTerm, categoryFilter, subjectFilter, gradeFilter, statusFilter]);

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    setDocuments(documents.map(doc => 
      doc.id === id 
        ? { ...doc, status: doc.status === 'Active' ? 'Inactive' : 'Active' } 
        : doc
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách tài liệu</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(subject => (
                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {grades.map(grade => (
                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên tài liệu</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Môn học</TableHead>
                <TableHead>Lớp</TableHead>
                <TableHead>Ngày tải lên</TableHead>
                <TableHead>Kích thước</TableHead>
                <TableHead>Lượt tải</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Không tìm thấy tài liệu nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>{doc.category}</TableCell>
                    <TableCell>{doc.subject}</TableCell>
                    <TableCell>{doc.grade}</TableCell>
                    <TableCell>{doc.uploadDate}</TableCell>
                    <TableCell>{doc.fileSize}</TableCell>
                    <TableCell>{doc.downloads}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        doc.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {doc.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon" title="Xem">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Chỉnh sửa">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Tải xuống">
                          <Download className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleToggleStatus(doc.id)}>
                              {doc.status === 'Active' ? 'Ẩn' : 'Hiện'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(doc.id)}
                              className="text-red-600"
                            >
                              Xóa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentTable;