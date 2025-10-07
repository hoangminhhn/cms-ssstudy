"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BusinessHeader from "@/components/view-management/business/BusinessHeader";
import BusinessStatsGrid from "@/components/view-management/business/BusinessStatsGrid";
import BusinessSectionTabs from "@/components/view-management/business/BusinessSectionTabs";

/**
 * RealtimeMetrics
 * Keeps focus on the "Phân tích Video Miễn phí" area (header, stats, tabs).
 * The retention region is intentionally not rendered here; it will be placed separately by the page/container.
 */

const RealtimeMetrics: React.FC = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-0">
          <BusinessHeader
            title="Phân tích Video Miễn phí (Freemium Strategy)"
          />
        </CardHeader>

        <CardContent>
          <BusinessStatsGrid />

          {/* Section 2: Tabs - Top Videos / Conversion Funnel / ROI Analysis */}
          <BusinessSectionTabs />
        </CardContent>
      </Card>

      {/* Additional placeholders if needed */}
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