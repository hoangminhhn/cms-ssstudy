"use client";

import React from "react";

interface BusinessHeaderProps {
  title: string;
  subtitle?: string; // kept for compatibility, but not used directly
  rightPill?: React.ReactNode;
}

const BusinessHeader: React.FC<BusinessHeaderProps> = ({ title, rightPill }) => {
  return (
    <div className="flex items-start justify-between w-full">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">Đánh giá hiệu quả phòng xem chung miễn phí</p>
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