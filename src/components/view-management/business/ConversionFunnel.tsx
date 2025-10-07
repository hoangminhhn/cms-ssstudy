"use client";

import React from "react";
import FunnelChart, { FunnelDatum } from "./FunnelChart";
import FunnelStats from "./FunnelStats";
import RetentionChart from "./RetentionChart";
import RetentionStats from "./RetentionStats";
import FinancialImpactBox from "./FinancialImpactBox";

const SAMPLE_DATA: FunnelDatum[] = [
  { name: "Xem video miễn phí", value: 1000, color: "#3b82f6" },
  { name: "Tham gia xem chung", value: 460, color: "#8b5cf6" },
  { name: "Xem hết video", value: 280, color: "#10b981" },
  { name: "Mua khóa học", value: 150, color: "#f59e0b" },
];

const computeRates = (arr: FunnelDatum[]) => {
  const v1 = arr[0]?.value ?? 0;
  const v2 = arr[1]?.value ?? 0;
  const v3 = arr[2]?.value ?? 0;
  const v4 = arr[3]?.value ?? 0;

  const step12 = v1 > 0 ? v2 / v1 : 0;
  const step23 = v2 > 0 ? v3 / v2 : 0;
  const step34 = v3 > 0 ? v4 / v3 : 0;

  return { step12, step23, step34 };
};

const ConversionFunnel: React.FC<{ data?: FunnelDatum[] }> = ({ data = SAMPLE_DATA }) => {
  const rates = computeRates(data);

  return (
    <section className="space-y-6">
      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-100">Conversion Funnel - Free Users</h4>

      <div className="mt-3 bg-white dark:bg-gray-900 border rounded-lg p-4">
        <FunnelChart data={data} />
        <FunnelStats
          rates={rates}
          labels={{
            s12: "tham gia xem chung",
            s23: "xem hết video",
            s34: "mua khóa học",
          }}
        />
      </div>

      {/* Retention section */}
      <div className="mt-4 bg-white dark:bg-gray-900 border rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Retention & Giá trị học sinh</h4>
            <p className="text-xs text-muted-foreground mt-1">Giữ chân học sinh hiệu quả hơn</p>
          </div>

          <div>
            <span className="inline-block bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">-28% Churn</span>
          </div>
        </div>

        <div className="mt-4">
          <RetentionChart />
        </div>

        <div className="mt-4">
          <RetentionStats />
        </div>

        <FinancialImpactBox />
      </div>
    </section>
  );
};

export default ConversionFunnel;