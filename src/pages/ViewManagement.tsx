"use client";

import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileDown, Settings } from "lucide-react";
import { toast } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";

const NavItem: React.FC<{ to: string; label: string }> = ({ to, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-md text-sm font-medium ${isActive ? "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50" : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"}`
      }
    >
      {label}
    </NavLink>
  );
};

const ViewManagementPage: React.FC = () => {
  const location = useLocation();

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

          {/* Submenu */}
          <div className="bg-white rounded-md border p-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <nav className="flex gap-2 overflow-auto">
                <NavItem to="/view-management/dashboard" label="Dashboard" />
                <NavItem to="/view-management/rooms" label="Danh sách phòng" />
                <NavItem to="/view-management/moderation" label="Kiểm duyệt" />
                <NavItem to="/view-management/reports" label="Báo cáo" />
              </nav>

              <div className="hidden md:block">
                <div className="text-sm text-muted-foreground">{location.pathname.replace("/view-management/", "") || "dashboard"}</div>
              </div>
            </div>

            {/* Render child route content here */}
            <div className="mt-4">
              <Outlet />
            </div>
          </div>
        </div>

        <MadeWithDyad />
      </Layout>
    </ErrorBoundary>
  );
};

export default ViewManagementPage;