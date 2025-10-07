"use client";

import React from "react";
import RetentionTable from "./RetentionTable";
import FinancialImpactBox from "./FinancialImpactBox";

/**
 * FreemiumRetentionSection (table variant)
 * - Renders a separate retention table (component RetentionTable) as requested.
 * - Keeps the financial impact box below.
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
        {/* The retention data is intentionally presented as a dedicated table component */}
        <RetentionTable />

        {/* Keep the financial impact box as explanatory content */}
        <FinancialImpactBox />
      </div>
    </section>
  );
};

export default FreemiumRetentionSection;