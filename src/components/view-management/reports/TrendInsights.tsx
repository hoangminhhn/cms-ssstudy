"use client";

import React from "react";
import { Activity } from "lucide-react";

const TrendInsights: React.FC = () => {
  return (
    <section>
      <div className="rounded-lg border bg-cyan-50 dark:bg-cyan-900/10 p-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-md bg-white/80 dark:bg-white/5 flex items-center justify-center shadow-sm">
              <Activity className="h-5 w-5 text-sky-600" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-sky-700">Phân tích Xu hướng</h3>

            <ul className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <li>
                <strong>Giờ vàng:</strong> 19h-21h tối có lượng tham gia cao nhất (65% phòng tạo trong khung này)
              </li>
              <li>
                <strong>Cuối tuần:</strong> Thứ 7-CN có thời lượng xem trung bình cao hơn 40%
              </li>
              <li>
                <strong>Nhóm nhỏ hiệu quả:</strong> Phòng 4-6 người có engagement cao nhất
              </li>
              <li>
                <strong>Mùa cao điểm:</strong> Tháng 9-12 và 3-6 (mùa thi) có nhu cầu xem chung tăng 80%
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendInsights;