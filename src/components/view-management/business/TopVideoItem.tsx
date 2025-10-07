"use client";

import React from "react";
import { User, CheckCircle } from "lucide-react";

interface TopVideoItemProps {
  rank: number;
  title: string;
  views: number;
  conversions: number;
  percent: number;
}

const TopVideoItem: React.FC<TopVideoItemProps> = ({ rank, title, views, conversions, percent }) => {
  const percentLabel = `${percent}% convert`;
  const percentBg =
    percent >= 20 ? "bg-green-100 text-green-700" : percent >= 18 ? "bg-sky-100 text-sky-700" : "bg-indigo-100 text-indigo-700";

  return (
    <div className="flex items-center justify-between gap-4 bg-white dark:bg-gray-900 rounded-lg p-3 shadow-sm border">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center justify-center h-12 w-12 rounded-lg text-white font-semibold"
             style={{ background: "linear-gradient(135deg,#7c3aed,#6366f1)" }}>
          <div className="text-sm">{rank}</div>
        </div>

        <div className="min-w-0">
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{title}</div>
          <div className="mt-1 text-xs text-muted-foreground flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <User className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs">{views} lượt xem</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs">{conversions} conversions</span>
            </span>
          </div>
        </div>
      </div>

      <div className={`text-xs px-3 py-1 rounded-full ${percentBg} whitespace-nowrap select-none`}>{percentLabel}</div>
    </div>
  );
};

export default TopVideoItem;