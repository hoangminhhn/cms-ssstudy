"use client";

import React from "react";
import RetentionChart from "./RetentionChart";
import RetentionStats from "./RetentionStats";
import FinancialImpactBox from "./FinancialImpactBox";

/**
 * FreemiumRetentionSection
 * Section 3 under "Phân tích Video Miễn phí"
 * - title + top-right pill (summary)
 * - retention chart
 * - three retention stat cards
 * - financial impact box
 *
 * This component groups related pieces so it's easy to replace/extend individually.
 */

const FreemiumRetentionSection: React.FC = () => {
  return (
    <section className="space-y-4 mt-6">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Retention & Giá trị học sinh</h4>
          <p className="text-xs text-muted-foreground mt-1">So sánh retention giữa người xem có tham gia xem chung và không</p>
        </div>

        <div>
          <span className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">-28% Churn</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border rounded-lg p-4">
        <RetentionChart />
        <div className="mt-4">
          <RetentionStats />
        </div>
        <FinancialImpactBox />
      </div>
    </section>
  );
};

export default FreemiumRetentionSection;