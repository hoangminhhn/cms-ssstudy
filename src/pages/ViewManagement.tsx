"use client";

import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import DashboardTab from "@/components/view-management/DashboardTab";
import RoomsTab from "@/components/view-management/RoomsTab";
import ModerationTab from "@/components/view-management/ModerationTab";
import ReportsTab from "@/components/view-management/ReportsTab";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileDown, Settings } from "lucide-react";
import { toast } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";

const ViewManagementPage: React.FC = () => {
  const handleExportCsv = () => {
    toast.success("Xuất CSV (demo).");
  };

  const handleOpenConfig = () => {
    toast.info("Mở cấu hình (chưa triển khai).");
  };

  return (
    <ErrorBoundary>
      <Layout headerTitle="CMS – Quản lý “Xem chung”">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">CMS – Quản lý “Xem chung”</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Giám sát phòng, moderation, báo cáo & KPI. Các mục demo tách riêng để tiện mở rộng.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleExportCsv} className="flex items-center gap-2">
                <FileDown className="h-4 w-4" /> Xuất CSV
              </Button>
              <Button onClick={handleOpenConfig} className="flex items-center gap-2 bg-white border">
                <Settings className="h-4 w-4" /> Cấu hình
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-md border p-3">
            <Tabs defaultValue="dashboard">
              <TabsList>
                <TabsTrigger value="dashboard" className="min-w-[160px]">
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="rooms" className="min-w-[160px]">
                  Danh sách phòng
                </TabsTrigger>
                <TabsTrigger value="moderation" className="min-w-[160px]">
                  Kiểm duyệt
                </TabsTrigger>
                <TabsTrigger value="reports" className="min-w-[160px]">
                  Báo cáo
                </TabsTrigger>
              </TabsList>

              <div className="mt-4">
                <TabsContent value="dashboard">
                  <DashboardTab />
                </TabsContent>

                <TabsContent value="rooms">
                  <RoomsTab />
                </TabsContent>

                <TabsContent value="moderation">
                  <ModerationTab />
                </TabsContent>

                <TabsContent value="reports">
                  <ReportsTab />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>

        <MadeWithDyad />
      </Layout>
    </ErrorBoundary>
  );
};

export default ViewManagementPage;