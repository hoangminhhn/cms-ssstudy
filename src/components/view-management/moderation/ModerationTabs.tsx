"use client";

import React from "react";

interface ModerationTabsProps {
  flaggedCount: number;
  violationsCount: number;
  active: "flagged" | "violations";
  onChange: (v: "flagged" | "violations") => void;
}

const ModerationTabs: React.FC<ModerationTabsProps> = ({ flaggedCount, violationsCount, active, onChange }) => {
  return (
    <div className="flex items-center gap-3 mb-4">
      <button
        onClick={() => onChange("flagged")}
        className={`px-4 py-2 rounded-md ${active === "flagged" ? "bg-white shadow-sm" : "bg-gray-100 dark:bg-gray-700"} text-sm`}
      >
        Tin nhắn đánh dấu <span className="ml-2 text-xs text-muted-foreground">({flaggedCount})</span>
      </button>

      <button
        onClick={() => onChange("violations")}
        className={`px-4 py-2 rounded-md ${active === "violations" ? "bg-white shadow-sm" : "bg-gray-100 dark:bg-gray-700"} text-sm`}
      >
        Báo cáo vi phạm <span className="ml-2 text-xs text-muted-foreground">({violationsCount})</span>
      </button>
    </div>
  );
};

export default ModerationTabs;