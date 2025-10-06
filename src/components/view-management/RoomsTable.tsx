"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RoomRow, { RoomRowData } from "./RoomRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface RoomsTableProps {
  rooms: RoomRowData[];
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  itemsPerPage?: number;
}

const RoomsTable: React.FC<RoomsTableProps> = ({ rooms, onOpen, onEdit, onDelete, itemsPerPage = 10 }) => {
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(rooms.length / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const current = rooms.slice(startIndex, startIndex + itemsPerPage);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách phòng</CardTitle>
        <div className="text-sm text-muted-foreground">Tìm kiếm, lọc & thao tác nhanh</div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-sm text-muted-foreground border-b">
                <th className="p-4 text-left w-[96px]">ID</th>
                <th className="p-4 text-left">Tên phòng</th>
                <th className="p-4 text-left">Khóa/Chương</th>
                <th className="p-4 text-left">Chủ phòng</th>
                <th className="p-4 text-left">Trạng thái</th>
                <th className="p-4 text-left">CCU/Tham gia</th>
                <th className="p-4 text-left">Tin nhắn</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {current.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    Không tìm thấy phòng.
                  </td>
                </tr>
              ) : (
                current.map((r) => (
                  <RoomRow key={r.id} room={r} onOpen={onOpen} onEdit={onEdit} onDelete={onDelete} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị {rooms.length === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, rooms.length)} trong {rooms.length}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>‹</Button>
            <div className="px-3 py-1 bg-white border rounded text-sm">{page}</div>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomsTable;