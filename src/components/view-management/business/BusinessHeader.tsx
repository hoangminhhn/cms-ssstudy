"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BusinessHeaderProps {
  title: string;
  subtitle?: string;
  rightPill?: React.ReactNode;
}

const BusinessHeader: React.FC<BusinessHeaderProps> = ({ title, subtitle, rightPill }) => {
  return (
    <div className="flex items-start justify-between w-full">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>

      {rightPill ? (
        <div className="ml-4 flex-shrink-0 flex items-center">
          {rightPill}
        </div>
      ) : null}
    </div>
  );
};

export default BusinessHeader;