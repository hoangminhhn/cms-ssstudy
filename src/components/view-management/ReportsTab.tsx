"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RealtimeMetrics from "./reports/RealtimeMetrics";
import TrendMetrics from "./reports/TrendMetrics";

/**
 * ReportsTab
 * Shows two tabs:
 *  - "Giá trị kinh doanh / Real-time"  -> RealtimeMetrics component
 *  - "Xu hướng"                        -> TrendMetrics component
 *
 * Components are kept separate for easier maintenance and future updates.
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
              <TabsTrigger value="realtime">Giá trị kinh doanh / Real-time</TabsTrigger>
              <TabsTrigger value="trend">Xu hướng</TabsTrigger>
            </TabsList>

            <TabsContent value="realtime" className="p-0">
              <RealtimeMetrics />
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