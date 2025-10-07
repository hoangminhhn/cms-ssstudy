"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RealtimeMetrics from "@/components/view-management/reports/RealtimeMetrics";
import TrendMetrics from "@/components/view-management/reports/TrendMetrics";
import FreemiumRetentionRegion from "@/components/view-management/business/FreemiumRetentionRegion";

/**
 * ReportsTab
 * Shows two tabs:
 *  - "Giá trị kinh doanh"  -> RealtimeMetrics component
 *  - "Real-time và Xu hướng" -> TrendMetrics component
 *
 * The FreemiumRetentionRegion is intentionally rendered as a separate region
 * under RealtimeMetrics (not inside RealtimeMetrics) so it appears visually below
 * the Video analysis and can be managed independently.
 */

const ReportsTab: React.FC = () => {
  return (
    <section className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Báo cáo xem chung</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="realtime">
            <TabsList className="border-b mb-4">
              <TabsTrigger value="realtime">Giá trị kinh doanh</TabsTrigger>
              <TabsTrigger value="trend">Real-time và Xu hướng</TabsTrigger>
            </TabsList>

            <TabsContent value="realtime" className="p-0">
              {/* Main Video analysis card */}
              <RealtimeMetrics />

              {/* Separate region placed below RealtimeMetrics */}
              <FreemiumRetentionRegion />
            </TabsContent>

            <TabsContent value="trend" className="p-0">
              <TrendMetrics />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
};

export default ReportsTab;