"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BusinessStatCardProps {
  icon?: React.ReactNode;
  value: React.ReactNode;
  label: string;
  sublabel?: string;
  bgClass?: string;
}

const BusinessStatCard: React.FC<BusinessStatCardProps> = ({ icon, value, label, sublabel, bgClass = "bg-white" }) => {
  return (
    <div className={cn("rounded-lg p-4 shadow-sm min-h-[96px] flex flex-col justify-between", bgClass)}>
      <div className="flex items-start gap-3">
        {icon && <div className="text-2xl text-gray-600">{icon}</div>}
        <div className="flex-1">
          <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{value}</div>
          <div className="text-sm text-muted-foreground mt-1">{label}</div>
        </div>
      </div>

      {sublabel && <div className="mt-3 text-xs text-muted-foreground">{sublabel}</div>}
    </div>
  );
};

export default BusinessStatCard;