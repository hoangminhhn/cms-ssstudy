"use client";

import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const FileManagement: React.FC = () => {
  return (
    <Layout headerTitle="Quản lý tập tin">
      <div className="flex flex-col gap-6 w-full overflow-x-hidden">
        <Card>
          <CardHeader>
            <CardTitle>Quản lý tập tin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Trang quản lý tập tin đã được tạo. Bạn có thể thêm chức năng tải lên, phân loại, tìm kiếm, và quản lý các tệp tại đây. Hiện tại đây là placeholder — hãy cập nhật chức năng cần thiết sau.
            </div>
          </CardContent>
        </Card>
      </div>

      <MadeWithDyad />
    </Layout>
  );
};

export default FileManagement;