"use client";

import React from "react";
import RetentionTable from "./RetentionTable";
import FinancialImpactBox from "./FinancialImpactBox";

/**
 * FreemiumRetentionRegion
 * Standalone region (not part of RealtimeMetrics) that appears below
 * the "Phân tích Video Miễn phí" area. It contains:
 * - title + summary pill
 * - retention comparison table (RetentionTable)
 * - financial impact explanation (FinancialImpactBox)
 *
 * This is intentionally separate so it can be placed independently on the page.
 */

const FreemiumRetentionRegion: React.FC = () => {
  return (
    <section className="space-y-4 mt-6">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Retention & Giá trị học sinh</h4>
          <p className="text-xs text-muted-foreground mt-1">So sánh retention giữa người xem tham gia 'xem chung' và không tham gia.</p>
        </div>

        <div>
          <span className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">-28% Churn</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border rounded-lg p-4">
        <div className="mb-4">
          <RetentionTable />
        </div>

        <FinancialImpactBox />
      </div>
    </section>
  );
};

export default FreemiumRetentionRegion;