"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, Power, Slash, Download } from "lucide-react";
import type { RoomStatus } from "./ViewFilters";

export interface Room {
  id: string;
  name: string;
  course?: string;
  owner?: string;
  status: RoomStatus;
  isPublic: boolean;
  participants: number;
  flagged: boolean;
  startAt?: string;
  endAt?: string;
  createdAt: string;
}

interface Props {
  rooms: Room[];
  onView: (r: Room) => void;
  onToggleOpen: (id: string) => void;
  onForceEnd: (id: string) => void;
  page: number;
  setPage: (p: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (n: number) => void;
}

const ViewList: React.FC<Props> = ({ rooms, onView, onToggleOpen, onForceEnd, page, setPage, itemsPerPage, setItemsPerPage }) => {
  const total = rooms.length;
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));
  const startIndex = (page - 1) * itemsPerPage;
  const pageItems = rooms.slice(startIndex, startIndex + itemsPerPage);

  const exportCSV = (roomId?: string) => {
    const rows = (roomId ? rooms.filter(r => r.id === roomId) : rooms).map(r => ({
      id: r.id,
      name: r.name,
      course: r.course ?? "",
      owner: r.owner ?? "",
      status: r.status,
      public: r.isPublic ? "public" : "private",
      participants: r.participants,
      flagged: r.flagged ? "yes" : "no",
      createdAt: r.createdAt,
    }));
    const csv = [
      Object.keys(rows[0] || {}).join(","),
      ...rows.map(r => Object.values(r).map(val => `"${String(val).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = roomId ? `room-${roomId}.csv` : `rooms-export.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Xuất CSV thành công (mô phỏng).");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danh sách phòng xem chung</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <div className="relative md:col-span-2">
            <Input placeholder="Tìm theo ID, tên, chủ phòng..." />
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => exportCSV()}>
              <Download className="mr-2 h-4 w-4" /> Xuất CSV
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[90px]">ID</TableHead>
                <TableHead>Tên phòng</TableHead>
                <TableHead>Bài học/Khoá</TableHead>
                <TableHead>Chủ phòng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Số tham gia</TableHead>
                <TableHead>Vi phạm</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Không có phòng.
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map(room => (
                  <TableRow key={room.id}>
                    <TableCell>{room.id}</TableCell>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{room.course ?? "-"}</TableCell>
                    <TableCell>{room.owner ?? "-"}</TableCell>
                    <TableCell>{room.status}</TableCell>
                    <TableCell>{room.participants}</TableCell>
                    <TableCell>{room.flagged ? "⚑" : "-"}</TableCell>
                    <TableCell className="text-right flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onView(room)} title="Xem chi tiết">
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant={room.status === "live" ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => onToggleOpen(room.id)}
                        title={room.status === "live" ? "Đóng phòng" : "Mở phòng"}
                      >
                        <Power className="h-4 w-4 mr-1" /> {room.status === "live" ? "Đóng" : "Mở"}
                      </Button>

                      <Button variant="ghost" size="sm" onClick={() => { onForceEnd(room.id); }} title="Kết thúc cưỡng bức">
                        <Slash className="h-4 w-4 mr-1" /> Force end
                      </Button>

                      <Button variant="outline" size="icon" onClick={() => exportCSV(room.id)} title="Export room">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Hiển thị {total === 0 ? 0 : startIndex + 1} - {Math.min(startIndex + itemsPerPage, total)} trong {total}
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>‹</button>
            <div className="px-3 py-1 bg-white border rounded">{page}</div>
            <button className="px-3 py-1 border rounded disabled:opacity-50" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>›</button>

            <select className="border rounded px-2 py-1 ml-2" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ViewList;