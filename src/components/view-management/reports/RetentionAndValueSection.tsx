"use client";

import React from "react";
import RetentionChart from "./RetentionChart";
import RetentionStatsCards from "./RetentionStatsCards";
import RetentionInsights from "./RetentionInsights";

const RetentionAndValueSection: React.FC = () => {
  return (
    <section className="mt-6">
      <RetentionChart />
      <RetentionStatsCards />
      <RetentionInsights />
    </section>
  );
};

export default RetentionAndValueSection;