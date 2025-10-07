"use client";

import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

/**
 * ReportsTab
 * - Stripped of demo/sample data and actions.
 * - Provides a simple, neutral skeleton (filters + empty report area) so new reporting features can be implemented.
 */

const ReportsTab: React.FC = () => {
  // Local state for filters (no demo behavior attached)
  const [period, setPeriod] = React.useState<string>("today");
  const [query, setQuery] = React.useState<string>("");

  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Báo cáo xem chung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
            <div>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="7d">7 ngày</SelectItem>
                  <SelectItem value="30d">30 ngày</SelectItem>
                  <SelectItem value="custom">Tùy chọn</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3">
              <Input
                placeholder="Tìm kiếm báo cáo (mã / tên / ghi chú...)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              {/* Buttons are placeholders; wire to real actions when implementing features */}
              <Button variant="outline" disabled>
                Tải báo cáo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kết quả báo cáo</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Empty state - replace with real content (charts, tables, etc.) */}
          <div className="text-sm text-muted-foreground p-8 border rounded text-center">
            Chưa có dữ liệu báo cáo. Triển khai thu thập và hiển thị báo cáo ở đây.
          </div>

          {/* Kept table markup as skeleton for later implementation */}
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b">
                  <th className="p-3">Mục</th>
                  <th className="p-3">Giá trị</th>
                  <th className="p-3">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {/* Intentionally left empty for future data rows */}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ReportsTab;