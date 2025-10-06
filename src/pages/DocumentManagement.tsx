import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useLocation } from "react-router-dom";
import AllDocuments from "@/components/Documents/AllDocuments";
import AddDocument from "@/components/Documents/AddDocument";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import SharedRoomsManagement from "@/pages/SharedRoomsManagement";

const DocumentManagement: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "all-documents";

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "all-documents":
        return "Tất cả tài liệu";
      case "add-document":
        return "Thêm mới tài liệu";
      case "shared-rooms":
        return "Quản lý xem chung";
      default:
        return "Tài liệu";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "all-documents":
        return <AllDocuments />;
      case "add-document":
        return <AddDocument />;
      case "shared-rooms":
        return <SharedRoomsManagement />;
      default:
        return <AllDocuments />;
    }
  };

  return (
    <Layout headerTitle={getHeaderTitle()}>
      <div className="flex flex-col gap-6 w-full overflow-x-hidden">
        <div className="lg:hidden w-full overflow-x-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50 dark:bg-gray-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => alert('Mobile submenu toggle (implement sheet/drawer)')}
              className="flex items-center gap-1 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="text-sm font-semibold">MỞ RỘNG</span>
            </Button>
            <h2 className="text-lg font-semibold">{getHeaderTitle()}</h2>
            <div className="w-16" />
          </div>
        </div>

        {renderContent()}
      </div>

      <MadeWithDyad />
    </Layout>
  );
};

export default DocumentManagement;