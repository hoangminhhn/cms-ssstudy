"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BusinessHeader from "@/components/view-management/business/BusinessHeader";
import BusinessStatsGrid from "@/components/view-management/business/BusinessStatsGrid";
import BusinessSectionTabs from "@/components/view-management/business/BusinessSectionTabs";
import RetentionAndValueSection from "./RetentionAndValueSection";

/**
 * RealtimeMetrics
 * Adds the requested Section 1 (business overview) using small components.
 * Section 2 (Top Videos / Conversion / ROI) implemented via BusinessSectionTabs.
 * Section 3 (Retention & Value) added as requested underneath Section 2.
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

          {/* Section 3: Retention & Value (chart + stats + insights) */}
          <RetentionAndValueSection />
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