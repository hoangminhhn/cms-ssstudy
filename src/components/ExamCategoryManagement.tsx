import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, ChevronDown, Pencil, Trash2, RefreshCcw, EyeOff, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExamCategory {
  id: string;
  name: string;
  lastUpdated: string;
  hidden?: boolean;
  deleted?: boolean;
}

const initialMockCategories: ExamCategory[] = [
  { id: '1', name: 'Kỳ thi HSA', lastUpdated: '28/07/2025 10:00', hidden: false, deleted: false },
  { id: '2', name: 'Kỳ thi TSA', lastUpdated: '27/07/2025 14:30', hidden: false, deleted: false },
  { id: '3', name: 'Kỳ thi Tốt Nghiệp', lastUpdated: '26/07/2025 09:15', hidden: false, deleted: false },
  { id: '4', name: 'Kỳ thi V-ACT', lastUpdated: '25/07/2025 16:45', hidden: true, deleted: false },
  // example deleted
  { id: '5', name: 'Kỳ thi Thử (Đã xóa)', lastUpdated: '01/01/2024 12:00', hidden: false, deleted: true },
];

type ViewFilter = 'all' | 'hidden' | 'deleted';

const ExamCategoryManagement: React.FC = () => {
  const [categories, setCategories] = React.useState<ExamCategory[]>(initialMockCategories);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]);
  const [viewFilter, setViewFilter] = React.useState<ViewFilter>('all');
  const navigate = useNavigate();

  // Derived counts for tabs
  const countAll = categories.filter((c) => !c.deleted).length;
  const countHidden = categories.filter((c) => c.hidden && !c.deleted).length;
  const countDeleted = categories.filter((c) => c.deleted).length;

  const filteredCategoriesBase = React.useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return categories.filter((category) => {
      // apply view filter
      if (viewFilter === 'all' && category.deleted) return false;
      if (viewFilter === 'hidden' && !(category.hidden && !category.deleted)) return false;
      if (viewFilter === 'deleted' && !category.deleted) return false;

      // apply search
      if (!q) return true;
      return category.name.toLowerCase().includes(q);
    });
  }, [categories, searchTerm, viewFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCategoriesBase.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategoriesBase.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedCategories(currentCategories.map((cat) => cat.id));
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectCategory = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories((prev) => [...prev, id]);
    } else {
      setSelectedCategories((prev) => prev.filter((p) => p !== id));
    }
  };

  const handleEditCategory = (categoryId: string) => {
    navigate(`/word-exam-upload?tab=edit-category&categoryId=${categoryId}`);
  };

  const handleToggleHidden = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, hidden: !c.hidden, deleted: c.deleted ? c.deleted : c.deleted } : c)),
    );
  };

  const handleDeleteOrRestore = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    if (cat.deleted) {
      // restore
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, deleted: false, hidden: false } : c)));
    } else {
      // soft-delete
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, deleted: true } : c)));
      // also clear from selection
      setSelectedCategories((prev) => prev.filter((sid) => sid !== id));
    }
  };

  const handlePermanentDelete = (id: string) => {
    if (!confirm('Xóa vĩnh viễn mục này?')) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    setSelectedCategories((prev) => prev.filter((sid) => sid !== id));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Left: Add form */}
      <div className="lg:w-1/3">
        <Card>
          <CardHeader>
            <CardTitle>Thêm Danh Mục</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Label htmlFor="category-name">Tên</Label>
              <Input id="category-name" placeholder="" />
              <p className="text-xs text-muted-foreground mt-1">Tên là cách nó xuất hiện trên trang web của bạn.</p>
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">Thêm Danh Mục</Button>
          </CardContent>
        </Card>
      </div>

      {/* Right: Table with search + tabs */}
      <div className="lg:w-2/3">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm danh mục"
                    className="w-full pl-8"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">Áp dụng</Button>
                </div>
              </div>

              {/* Tabs row */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => { setViewFilter('all'); setCurrentPage(1); }}
                  className={`px-3 py-1 rounded-md text-sm inline-flex items-center gap-2 ${viewFilter === 'all' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
                  aria-pressed={viewFilter === 'all'}
                >
                  <span>Tất cả</span>
                  <span className={`text-sm ${viewFilter === 'all' ? 'text-white' : 'text-muted-foreground'}`}>({countAll})</span>
                </button>

                <button
                  onClick={() => { setViewFilter('hidden'); setCurrentPage(1); }}
                  className={`px-3 py-1 rounded-md text-sm inline-flex items-center gap-2 ${viewFilter === 'hidden' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
                  aria-pressed={viewFilter === 'hidden'}
                >
                  <span>Ẩn</span>
                  <span className={`text-sm ${viewFilter === 'hidden' ? 'text-white' : 'text-muted-foreground'}`}>({countHidden})</span>
                </button>

                <button
                  onClick={() => { setViewFilter('deleted'); setCurrentPage(1); }}
                  className={`px-3 py-1 rounded-md text-sm inline-flex items-center gap-2 ${viewFilter === 'deleted' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
                  aria-pressed={viewFilter === 'deleted'}
                >
                  <span>Xóa</span>
                  <span className={`text-sm ${viewFilter === 'deleted' ? 'text.white' : 'text-muted-foreground'}`}>({countDeleted})</span>
                </button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Input
                      type="checkbox"
                      checked={selectedCategories.length === currentCategories.length && currentCategories.length > 0}
                      onChange={handleSelectAll}
                      aria-label="Chọn tất cả"
                    />
                  </TableHead>
                  <TableHead>Tên <ChevronDown className="inline-block h-3 w-3 ml-1" /></TableHead>
                  <TableHead>Thời gian cập nhật <ChevronDown className="inline-block h-3 w-3 ml-1" /></TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {currentCategories.map((category) => (
                  <TableRow key={category.id} className={category.hidden && !category.deleted ? 'opacity-70' : ''}>
                    <TableCell>
                      <Input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={(e) => handleSelectCategory(category.id, e.target.checked)}
                      />
                    </TableCell>

                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{category.name}</span>
                        {category.hidden && !category.deleted && <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-800">Ẩn</span>}
                        {category.deleted && <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">Đã xóa</span>}
                      </div>
                    </TableCell>

                    <TableCell>{category.lastUpdated}</TableCell>

                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category.id)} aria-label={`Chỉnh sửa ${category.name}`}>
                          <Pencil className="h-4 w-4" />
                        </Button>

                        {/* Toggle hidden / visible (only if not in deleted) */}
                        {!category.deleted ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleHidden(category.id)}
                            title={category.hidden ? 'Hiện mục' : 'Ẩn mục'}
                            aria-label={category.hidden ? `Hiện ${category.name}` : `Ẩn ${category.name}`}
                          >
                            {category.hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          </Button>
                        ) : null}

                        {/* Delete / Restore - trigger uses Trash2 icon now */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" aria-label="Hành động">
                              <span className="sr-only">Open menu</span>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!category.deleted ? (
                              <DropdownMenuItem className="flex items-center gap-2 text-red-600" onClick={() => handleDeleteOrRestore(category.id)}>
                                <Trash2 className="h-4 w-4" /> Chuyển vào thùng rác
                              </DropdownMenuItem>
                            ) : (
                              <>
                                <DropdownMenuItem className="flex items-center gap-2" onClick={() => handleDeleteOrRestore(category.id)}>
                                  <RefreshCcw className="h-4 w-4" /> Khôi phục
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 text-red-600" onClick={() => handlePermanentDelete(category.id)}>
                                  <Trash2 className="h-4 w-4" /> Xóa vĩnh viễn
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {currentCategories.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      Không tìm thấy danh mục phù hợp.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                Hiển thị
                <Select value={String(itemsPerPage)} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger className="w-[70px] h-8">
                    <SelectValue placeholder={`${itemsPerPage}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
                từ {filteredCategoriesBase.length === 0 ? 0 : startIndex + 1} đến {Math.min(endIndex, filteredCategoriesBase.length)} trong tổng số {filteredCategoriesBase.length}
              </div>

              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
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
                          setCurrentPage(i + 1);
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
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExamCategoryManagement;