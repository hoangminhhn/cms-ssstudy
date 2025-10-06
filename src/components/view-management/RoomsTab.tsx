"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

type Room = {
  id: string;
  name: string;
  viewers: number;
  status: "live" | "idle" | "ended";
  updatedAt: string;
};

const demoRooms: Room[] = [
  { id: "r1", name: "Phòng Toán 10A1", viewers: 120, status: "live", updatedAt: "10:12" },
  { id: "r2", name: "Phòng Văn 12B", viewers: 34, status: "idle", updatedAt: "09:55" },
  { id: "r3", name: "Phòng Luyện HSA", viewers: 320, status: "live", updatedAt: "11:00" },
];

const RoomsTab: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [rooms, setRooms] = React.useState<Room[]>(demoRooms);

  const handleDelete = (id: string) => {
    if (!confirm("Xóa phòng này?")) return;
    setRooms((prev) => prev.filter((r) => r.id !== id));
    toast.success("Đã xóa phòng (demo).");
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Danh sách phòng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10" placeholder="Tìm phòng..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <Button onClick={() => toast.success("Tải lại danh sách (demo)")}>Làm mới</Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên phòng</TableHead>
                  <TableHead>Số lượt xem</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms
                  .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
                  .map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell>{r.viewers}</TableCell>
                      <TableCell className="capitalize">{r.status}</TableCell>
                      <TableCell>{r.updatedAt}</TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-2">
                          <Button variant="ghost" size="icon" title="Xem" onClick={() => toast.info(`Xem phòng ${r.name} (demo)`)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleDelete(r.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomsTab;