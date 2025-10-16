"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

export type BookIdRecord = {
  id: string;
  title: string;
  author?: string;
  owners?: number;
  price?: string;
  updatedAt?: string;
};

const MOCK: BookIdRecord[] = [
  { id: "BID-1001", title: "Kỹ thuật CASIO từ A đến Z", author: "NXB Toán", owners: 120, price: "249000", updatedAt: "04/07/2025" },
  { id: "BID-1002", title: "Sách 7 Ngày đạt điểm tối đa", author: "NXB Lý", owners: 85, price: "199000", updatedAt: "18/01/2025" },
  { id: "BID-1003", title: "Kỹ thuật CASIO nâng cao", author: "NXB CASIO", owners: 42, price: "299000", updatedAt: "12/03/2025" },
];

interface Props {
  query?: string;
}

const BookIdList: React.FC<Props> = ({ query = "" }) => {
  const navigate = useNavigate();
  const [items, setItems] = React.useState<BookIdRecord[]>(MOCK);
  const [q, setQ] = React.useState(query);

  const filtered = React.useMemo(() => {
    const qq = q.trim().toLowerCase();
    if (!qq) return items;
    return items.filter((it) => {
      return (
        it.title.toLowerCase().includes(qq) ||
        (it.author ?? "").toLowerCase().includes(qq) ||
        it.id.toLowerCase().includes(qq)
      );
    });
  }, [items, q]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách Sách ID</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-4">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" placeholder="Tìm sách ID..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Mã ID</TableHead>
                <TableHead>Tên sách</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead className="text-center">Sở hữu</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Ngày cập nhật</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-8 text-center text-muted-foreground">Không tìm thấy Sách ID nào.</TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.id}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => navigate(`/books-id/${encodeURIComponent(r.id)}`)}
                        className="text-left text-sm text-blue-600 hover:underline"
                      >
                        {r.title}
                      </button>
                    </TableCell>
                    <TableCell>{r.author ?? "-"}</TableCell>
                    <TableCell className="text-center">{r.owners ?? 0}</TableCell>
                    <TableCell>{r.price ?? "-"}</TableCell>
                    <TableCell>{r.updatedAt ?? "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" onClick={() => navigate(`/books-id/${encodeURIComponent(r.id)}`)}>Chi tiết</Button>
                        <Button variant="ghost" onClick={() => alert(`Chỉnh sửa ${r.id} (demo)`)}>Sửa</Button>
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

export default BookIdList;