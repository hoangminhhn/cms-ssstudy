"use client";

import React from "react";
import TopVideoItem from "./TopVideoItem";

export type TopVideo = {
  rank: number;
  title: string;
  views: number;
  conversions: number;
  percent: number;
};

const SAMPLE: TopVideo[] = [
  { rank: 1, title: "Toán 12 - Bài 1: Giới thiệu", views: 245, conversions: 52, percent: 21 },
  { rank: 2, title: "Văn 12 - Bài mở đầu", views: 198, conversions: 38, percent: 19 },
  { rank: 3, title: "Tiếng Anh - Unit 1 Demo", views: 167, conversions: 31, percent: 19 },
  { rank: 4, title: "Vật lý - Chương 1 Intro", views: 134, conversions: 24, percent: 18 },
  { rank: 5, title: "Hóa học - Bài học thử", views: 112, conversions: 19, percent: 17 },
];

const TopVideosList: React.FC<{ items?: TopVideo[] }> = ({ items = SAMPLE }) => {
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-800 dark:text-gray-100">Top 5 Video miễn phí hiệu quả nhất</h4>

      <div className="mt-2 flex flex-col gap-3">
        {items.map((it) => (
          <TopVideoItem key={it.rank} rank={it.rank} title={it.title} views={it.views} conversions={it.conversions} percent={it.percent} />
        ))}
      </div>
    </div>
  );
};

export default TopVideosList;