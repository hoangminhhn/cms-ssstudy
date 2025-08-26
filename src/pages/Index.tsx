"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import FeatureListDisplay from "@/components/feature/FeatureListDisplay";

const demoBlock = {
  title: "Bạn sẽ nhận được",
  subtitle: "Những lợi ích nổi bật khi tham gia khóa học",
  layout: "two",
  items: [
    { id: "d1", content: "Hệ thống bài giảng chuẩn", highlighted: false, visible: true },
    { id: "d2", content: "Giảng viên chuyên môn cao", highlighted: true, visible: true },
    { id: "d3", content: "Tài liệu bài tập phong phú", highlighted: false, visible: true },
    { id: "d4", content: "Hỗ trợ trực tuyến 24/7", highlighted: false, visible: true },
  ],
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome to Your Blank App</h1>
          <p className="text-lg text-gray-600">Start building your amazing project here!</p>
        </div>

        <FeatureListDisplay block={demoBlock} />

        <div className="mt-12">
          <MadeWithDyad />
        </div>
      </div>
    </div>
  );
};

export default Index;