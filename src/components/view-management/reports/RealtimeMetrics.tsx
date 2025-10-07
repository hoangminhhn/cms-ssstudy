"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BusinessHeader from "@/components/view-management/business/BusinessHeader";
import BusinessStatsGrid from "@/components/view-management/business/BusinessStatsGrid";

/**
 * RealtimeMetrics
 * Adds the requested Section 1 (business overview) using small components.
 */

const RightPill: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-sm font-medium text-slate-800 dark:text-slate-100">
      {children}
    </div>
  );
};

const RealtimeMetrics: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-0">
          <BusinessHeader
            title="Phân tích Video Miễn phí (Freemium Strategy)"
            subtitle="Đánh giá hiệu quả marketing & conversion"
            rightPill={<RightPill>18% Conversion</RightPill>}
          />
        </CardHeader>

        <CardContent>
          <BusinessStatsGrid />
        </CardContent>
      </Card>

      {/* keep the previous placeholders below the new section */}
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded border p-4">
          <div className="text-sm text-muted-foreground">Additional real-time widgets (placeholder)</div>
          <div className="mt-3 h-40 rounded border bg-white dark:bg-gray-800 flex items-center justify-center text-muted-foreground">
            Real-time widgets will render here.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeMetrics;