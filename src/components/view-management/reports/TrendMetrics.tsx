"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * TrendMetrics
 * Simple skeleton where charts / trend visualizations can be implemented.
 * Kept minimal so you can plug in chart libraries / fetch historical data later.
 */

const TrendMetrics: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Xu hướng (Trend)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Biểu đồ xu hướng (ví dụ: 7/30 ngày) sẽ hiển thị ở đây.
          </div>
          <div className="mt-3 h-60 rounded border bg-white dark:bg-gray-800 flex items-center justify-center text-muted-foreground">
            Chart area (placeholder)
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tổng quan theo chỉ số</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Số liệu tổng hợp cho khoảng thời gian đã chọn.</div>
            <div className="mt-3 flex gap-3">
              <div className="flex-1 h-20 rounded border bg-white dark:bg-gray-800 flex items-center justify-center">Metric A</div>
              <div className="flex-1 h-20 rounded border bg-white dark:bg-gray-800 flex items-center justify-center">Metric B</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">So sánh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">So sánh khoảng thời gian (placeholder).</div>
            <div className="mt-3 h-20 rounded border bg-white dark:bg-gray-800 flex items-center justify-center">Comparison</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrendMetrics;