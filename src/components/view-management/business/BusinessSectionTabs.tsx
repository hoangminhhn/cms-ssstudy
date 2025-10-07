"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import TopVideosList from "./TopVideosList";
import ConversionFunnel from "./ConversionFunnel";
import RoiAnalysis from "./RoiAnalysis";

/**
 * BusinessSectionTabs
 * - Tabs: Top Videos | Conversion Funnel | ROI Analysis
 * - Each tab is a separate component to keep code modular.
 */

const BusinessSectionTabs: React.FC = () => {
  return (
    <div className="mt-6 bg-transparent">
      <Tabs defaultValue="top-videos">
        <TabsList className="rounded-md border bg-gray-50 dark:bg-gray-800 p-1">
          <TabsTrigger value="top-videos" className="px-4 py-2 text-sm">
            Top Videos
          </TabsTrigger>
          <TabsTrigger value="funnel" className="px-4 py-2 text-sm">
            Conversion Funnel
          </TabsTrigger>
          <TabsTrigger value="roi" className="px-4 py-2 text-sm">
            ROI Analysis
          </TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="top-videos">
            <TopVideosList />
          </TabsContent>

          <TabsContent value="funnel">
            <ConversionFunnel />
          </TabsContent>

          <TabsContent value="roi">
            <RoiAnalysis />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default BusinessSectionTabs;