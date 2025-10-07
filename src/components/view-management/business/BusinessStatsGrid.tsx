"use client";

import React from "react";
import BusinessStatCard from "./BusinessStatCard";
import { Gift, Users, Target, Clock } from "lucide-react";

const BusinessStatsGrid: React.FC = () => {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <BusinessStatCard
        icon={<Gift className="h-6 w-6 text-blue-600" />}
        value={<span className="text-2xl text-blue-700">2</span>}
        label="Phòng free"
        sublabel="phòng xem chung"
        bgClass="bg-white"
      />

      <BusinessStatCard
        icon={<Users className="h-6 w-6 text-violet-600" />}
        value={<span className="text-2xl text-violet-700">0</span>}
        label="Người xem free"
        sublabel="học sinh"
        bgClass="bg-white"
      />

      <BusinessStatCard
        icon={<Target className="h-6 w-6 text-emerald-600" />}
        value={<span className="text-2xl text-emerald-700">18%</span>}
        label="Tỷ lệ chuyển đổi"
        sublabel="free → paid"
        bgClass="bg-white"
      />

      <BusinessStatCard
        icon={<Clock className="h-6 w-6 text-orange-600" />}
        value={<span className="text-2xl text-orange-700">7</span>}
        label="Thời gian convert"
        sublabel="ngày trung bình"
        bgClass="bg-white"
      />
    </div>
  );
};

export default BusinessStatsGrid;