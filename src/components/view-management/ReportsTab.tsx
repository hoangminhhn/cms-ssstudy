"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type ReportRow = {
  id: string;
  key: string;
  metric: string;
  value: string;
  time: string;
};

const demo: ReportRow[] = [
  { id: "1", key: "avg_viewers", metric: "Average Viewers", value: "120", time: "Today" },
  { id: "2", key: "max_viewers", metric: "Max Viewers", value: "320", time: "Today" },
  { id: "3", key: "reports", metric: "Reports", value: "8", time: "Today" },
];

const ReportsTab: React.FC = () => {
  const [range, setRange] = React.useState<string>("today");

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Báo cáo nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Select value={range} onValueChange={setRange}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="7d">7 ngày</SelectItem>
                  <SelectItem value="30d">30 ngày</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => toast.success("Tải báo cáo (demo)")}>Tải báo cáo</Button>
            </div>

            <div className="text-sm text-muted-foreground">Range: {range}</div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khoá báo cáo</TableHead>
                  <TableHead>Metric</TableHead>
                  <TableHead>Giá trị</TableHead>
                  <TableHead>Thời gian</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demo.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.key}</TableCell>
                    <TableCell>{r.metric}</TableCell>
                    <TableCell>{r.value}</TableCell>
                    <TableCell>{r.time}</TableCell>
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

export default ReportsTab;