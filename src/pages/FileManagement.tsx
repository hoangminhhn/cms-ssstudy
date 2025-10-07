"use client";

import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import FolderSidebar from "@/components/file-management/FolderSidebar";
import HeaderBar from "@/components/file-management/HeaderBar";
import FiltersBar from "@/components/file-management/FiltersBar";
import FileGridEmpty from "@/components/file-management/FileGridEmpty";

const FileManagement: React.FC = () => {
  return (
    <Layout headerTitle="Quản lý tập tin">
      <div className="flex gap-6 w-full">
        {/* Left sidebar */}
        <div className="shrink-0">
          <FolderSidebar />
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="mb-6">
            <HeaderBar />
          </div>

          <div className="mb-6">
            <FiltersBar />
          </div>

          <div className="bg-white dark:bg-gray-900 border rounded-md min-h-[420px] p-8">
            <FileGridEmpty />
          </div>
        </div>
      </div>

      <MadeWithDyad />
    </Layout>
  );
};

export default FileManagement;