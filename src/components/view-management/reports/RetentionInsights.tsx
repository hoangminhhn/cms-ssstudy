"use client";

import React from "react";

const RetentionInsights: React.FC<{ points?: string[] }> = ({ points }) => {
  const list = points ?? [
    "Giữ chân tốt hơn: Học sinh xem chung ở lại lâu hơn 6 tháng so với bình thường",
    "Tăng LTV: Lifetime Value cao hơn 45% - học sinh mua thêm nhiều khóa học khác",
    "Giảm Support Cost: Học sinh giúp nhau qua chat, giảm 35% ticket support",
    "Organic Growth: 68% học sinh xem chung mời bạn bè tham gia platform",
  ];

  return (
    <div className="mt-4 bg-green-50 border border-green-100 rounded-md p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-green-700 font-semibold">Tác động tài chính</div>
      </div>

      <ul className="list-disc ml-5 space-y-2 text-sm text-gray-700 dark:text-gray-200">
        {list.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
};

export default RetentionInsights;