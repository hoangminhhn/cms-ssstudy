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
import { FileDown, Settings, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const ViewManagementPage: React.FC = () => {
  const handleExportCsv = () => {
    // minimal export: trigger toast — detailed export implemented elsewhere
    toast.success("Xuất CSV (demo).");
  };

  const handleOpenConfig = () => {
    toast.info("Mở cấu hình (chưa triển khai).");
  };

  return (
    <Layout headerTitle='CMS – Quản lý “Xem chung”'>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">CMS – Quản lý “Xem chung”</h1>
            <p className="text-sm text-muted-foreground mt-1">Giám sát phòng, moderation, báo cáo & KPI. Mock data để tích hợp nhanh với API.</p>
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

        {/* Tabs */}
        <div className="bg-white rounded-md border p-3">
          <Tabs defaultValue="dashboard">
            <TabsList>
              <TabsTrigger value="dashboard" className="min-w-[160px]">
                <span className="inline-flex items-center gap-2"><svg className="h-4 w-4" /><span>Dashboard</span></span>
              </TabsTrigger>
              <TabsTrigger value="rooms" className="min-w-[160px]">
                <span className="inline-flex items-center gap-2"><svg className="h-4 w-4" /><span>Danh sách phòng</span></span>
              </TabsTrigger>
              <TabsTrigger value="moderation" className="min-w-[160px]">
                <span className="inline-flex items-center gap-2"><svg className="h-4 w-4" /><span>Moderation</span></span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="min-w-[160px]">
                <span className="inline-flex items-center gap-2"><svg className="h-4 w-4" /><span>Báo cáo</span></span>
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
  );
};

export default ViewManagementPage;