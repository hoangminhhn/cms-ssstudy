"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Trash2, Search, Pencil } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  category: string;
  published: boolean;
  featured: boolean;
  updatedAt: string;
  selected?: boolean;
}

const initialPosts: Post[] = [
  {
    id: "p1",
    title: "Hướng dẫn học tại SSStudy",
    category: "Chính Sách",
    published: true,
    featured: false,
    updatedAt: "2025-07-05T11:51:00",
  },
  {
    id: "p2",
    title: "Tin tức sự kiện tháng 8",
    category: "Sự kiện",
    published: false,
    featured: true,
    updatedAt: "2025-08-10T09:20:00",
  },
];

const AddPostPage: React.FC = () => {
  const [posts, setPosts] = React.useState<Post[]>(initialPosts);
  const [query, setQuery] = React.useState("");
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(20);
  const [page, setPage] = React.useState<number>(1);
  const [selectedAll, setSelectedAll] = React.useState(false);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [posts, query]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, total);
  const pageItems = filtered.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  const togglePublished = (id: string) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p)));
    toast.success("Đã cập nhật trạng thái.");
  };

  const toggleFeatured = (id: string) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)));
    toast.success("Đã cập nhật status nổi bật.");
  };

  const handleDelete = (id: string) => {
    if (!confirm("Xác nhận xóa bài viết này?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Đã xóa bài viết.");
  };

  const handleEdit = (id: string) => {
    toast.info(`Chỉnh sửa bài viết ${id} (demo).`);
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedAll(checked);
    setPosts((prev) => prev.map((p) => ({ ...p, selected: checked })));
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, selected: checked } : p)));
  };

  const handleBulkTrash = () => {
    const toDelete = posts.filter((p) => p.selected).map((p) => p.id);
    if (toDelete.length === 0) {
      toast.error("Chưa chọn bài viết để chuyển vào thùng rác.");
      return;
    }
    if (!confirm(`Chuyển ${toDelete.length} bài viết vào thùng rác?`)) return;
    setPosts((prev) => prev.filter((p) => !p.selected));
    toast.success("Đã chuyển vào thùng rác.");
  };

  const handleCreateDummy = () => {
    const newPost: Post = {
      id: `p${Date.now()}`,
      title: `Bài viết mới ${posts.length + 1}`,
      category: "Tin Tức",
      published: false,
      featured: false,
      updatedAt: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
    toast.success("Tạo bài viết mẫu (demo).");
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded border p-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => handleBulkTrash()} aria-label="Thùng rác">
            <Trash2 className="h-4 w-4" />
          </Button>

          <div className="flex-1 max-w-lg">
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white" onClick={handleCreateDummy}>TẠO BÀI VIẾT</Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bài viết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-orange-600 border-b">
                  <th className="w-[48px] p-3">
                    <input type="checkbox" checked={selectedAll} onChange={(e) => handleSelectAll(e.target.checked)} aria-label="select all" />
                  </th>
                  <th className="p-3">Tiêu đề</th>
                  <th className="p-3">Danh mục</th>
                  <th className="p-3">Trạng thái</th>
                  <th className="p-3">Nổi bật</th>
                  <th className="p-3">Thời gian cập nhật</th>
                  <th className="p-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">Không có bài viết.</td>
                  </tr>
                ) : (
                  pageItems.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                      <td className="p-3">
                        <input type="checkbox" checked={!!p.selected} onChange={(e) => handleSelectOne(p.id, e.target.checked)} />
                      </td>
                      <td className="p-3">{p.title}</td>
                      <td className="p-3">{p.category}</td>
                      <td className="p-3">
                        <Switch checked={p.published} onCheckedChange={() => togglePublished(p.id)} />
                      </td>
                      <td className="p-3">
                        <Switch checked={p.featured} onCheckedChange={() => toggleFeatured(p.id)} />
                      </td>
                      <td className="p-3">{format(new Date(p.updatedAt), "dd/MM/yyyy HH:mm:ss")}</td>
                      <td className="p-3 text-right flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(p.id)} title="Chỉnh sửa">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(p.id)} title="Xóa">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
              <div>Hiển thị {total === 0 ? 0 : startIndex + 1} đến {endIndex} trong tổng số {total}</div>
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>«</button>
              <div className="px-3 py-1 bg-white border rounded text-sm">{page}</div>
              <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>»</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddPostPage;