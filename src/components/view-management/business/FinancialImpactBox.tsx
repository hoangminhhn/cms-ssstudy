"use client";

import React from "react";

const FinancialImpactBox: React.FC = () => {
  return (
    <div className="mt-4 rounded-lg border border-green-100 bg-green-50/60 p-4 text-sm">
      <div className="font-medium text-gray-800 mb-2">Tác động tài chính</div>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
        <li><strong>Giữ chân tốt hơn:</strong> Học sinh xem chung ở lại lâu hơn 6 tháng so với bình thường</li>
        <li><strong>Tăng LTV:</strong> Lifetime Value cao hơn 45% - học sinh mua thêm nhiều khóa học khác</li>
        <li><strong>Giảm Support Cost:</strong> Học sinh giúp nhau qua chat, giảm ~35% ticket support</li>
        <li><strong>Organic Growth:</strong> 68% học sinh xem chung mời bạn bè tham gia platform</li>
      </ul>
    </div>
  );
};

export default FinancialImpactBox;