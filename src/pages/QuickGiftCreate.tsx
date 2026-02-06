"use client";

import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";

const QuickGiftCreate: React.FC = () => {
  return (
    <Layout headerTitle="Tạo quà tặng mới">
      <div className="max-w-3xl mx-auto w-full p-6">
        <div className="min-h-[320px] border-dashed border rounded-md flex items-center justify-center bg-white dark:bg-gray-800">
          <div className="text-center p-6">
            <h2 className="text-lg font-semibold mb-2">Trang trống</h2>
            <p className="text-sm text-muted-foreground">
              Trang "Tạo quà tặng mới" đã được xoá sạch. Vui lòng mô tả chi tiết giao diện và trường dữ liệu bạn muốn thêm, tôi sẽ tạo lại trang theo yêu cầu của bạn.
            </p>
          </div>
        </div>
      </div>

      <MadeWithDyad />
    </Layout>
  );
};

export default QuickGiftCreate;