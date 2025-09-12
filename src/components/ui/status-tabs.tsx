import React from "react";

type ViewFilter = "all" | "hidden" | "deleted";

interface StatusTabsProps {
  value: ViewFilter;
  counts: { all: number; hidden: number; deleted: number };
  onChange: (v: ViewFilter) => void;
  className?: string;
}

const StatusTabs: React.FC<StatusTabsProps> = ({ value, counts, onChange, className }) => {
  return (
    <div className={className ?? "flex items-center gap-3"}>
      <button
        onClick={() => onChange("all")}
        className={`px-3 py-1 rounded-md text-sm inline-flex items-center gap-2 ${
          value === "all" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
        }`}
        aria-pressed={value === "all"}
        aria-label={`Tất cả (${counts.all})`}
        title={`Tất cả (${counts.all})`}
      >
        <span>Tất cả</span>
        <span className={`text-sm ${value === "all" ? "text-white" : "text-muted-foreground"}`}>({counts.all})</span>
      </button>

      <button
        onClick={() => onChange("hidden")}
        className={`px-3 py-1 rounded-md text-sm inline-flex items-center gap-2 ${
          value === "hidden" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
        }`}
        aria-pressed={value === "hidden"}
        aria-label={`Ẩn (${counts.hidden})`}
        title={`Ẩn (${counts.hidden})`}
      >
        <span>Ẩn</span>
        <span className={`text-sm ${value === "hidden" ? "text-white" : "text-muted-foreground"}`}>({counts.hidden})</span>
      </button>

      <button
        onClick={() => onChange("deleted")}
        className={`px-3 py-1 rounded-md text-sm inline-flex items-center gap-2 ${
          value === "deleted" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
        }`}
        aria-pressed={value === "deleted"}
        aria-label={`Xóa (${counts.deleted})`}
        title={`Xóa (${counts.deleted})`}
      >
        <span>Xóa</span>
        <span className={`text-sm ${value === "deleted" ? "text-white" : "text-muted-foreground"}`}>({counts.deleted})</span>
      </button>
    </div>
  );
};

export default StatusTabs;