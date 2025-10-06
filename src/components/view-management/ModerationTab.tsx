"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Check, MessageSquare } from "lucide-react";
import { toast } from "sonner";

type Report = {
  id: string;
  target: string;
  reason: string;
  reportedBy: string;
  time: string;
};

const demoReports: Report[] = [
  { id: "rep1", target: "Phòng Toán 10A1", reason: "Nội dung không phù hợp", reportedBy: "hn_user", time: "11:02" },
  { id: "rep2", target: "Bình luận #234", reason: "Spam", reportedBy: "admin", time: "10:21" },
];

const ModerationTab: React.FC = () => {
  const [reports, setReports] = React.useState<Report[]>(demoReports);

  const handleResolve = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast.success("Đã xử lý báo cáo (demo).");
  };

  const handleRemove = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    toast.success("Đã xóa mục vi phạm (demo).");
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Moderation - Báo cáo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Đối tượng</TableHead>
                  <TableHead>Lý do</TableHead>
                  <TableHead>Người báo</TableHead>
                  <TableHead>Thời gian</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {reports.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.target}</TableCell>
                    <TableCell className="max-w-xs truncate">{r.reason}</TableCell>
                    <TableCell>{r.reportedBy}</TableCell>
                    <TableCell>{r.time}</TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleResolve(r.id)} title="Đánh dấu đã xử lý">
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleRemove(r.id)} className="text-red-600" title="Xóa nội dung">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toast.info('Mở trang chat (demo)')}>
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}

                {reports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="p-8 text-center text-muted-foreground">
                      Không có báo cáo nào.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModerationTab;