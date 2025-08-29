import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { useLocation } from "react-router-dom";
import AllMembers from "@/components/members/AllMembers";
import AddMember from "@/components/members/AddMember";
import Admins from "@/components/members/Admins";
import AddAdmin from "@/components/members/AddAdmin";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const MemberManagement: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "all-members";

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "all-members":
        return "Thành viên";
      case "add-member":
        return "Thêm thành viên";
      case "admins":
        return "Quản trị viên";
      case "add-admin":
        return "Thêm quản trị viên";
      default:
        return "Thành viên";
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "all-members":
        return <AllMembers />;
      case "add-member":
        return <AddMember />;
      case "admins":
        return <Admins />;
      case "add-admin":
        return <AddAdmin />;
      default:
        return <AllMembers />;
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
              onClick={() => alert("Mobile submenu toggle (implement sheet/drawer)")}
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

export default MemberManagement;