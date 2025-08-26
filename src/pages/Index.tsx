import Layout from "@/components/Layout";
import DashboardStats from "@/components/DashboardStats";
import RecentOrdersTable from "@/components/RecentOrdersTable";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <Layout headerTitle="Bảng điều khiển">
      <div className="flex flex-col gap-6">
        <DashboardStats />
        <RecentOrdersTable />

        {/* Quick access to Courses module */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-md border">
            <h3 className="text-lg font-semibold mb-2">Quản lý Khóa học</h3>
            <p className="text-sm text-muted-foreground mb-4">Truy cập nhanh các trang quản lý Khóa học.</p>
            <div className="flex flex-wrap gap-2">
              <Link to="/courses?tab=online-classes">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">Lớp Online</Button>
              </Link>
              <Link to="/courses?tab=offline-classes">
                <Button variant="outline">Lớp Offline</Button>
              </Link>
              <Link to="/courses?tab=subjects">
                <Button variant="ghost">Môn học</Button>
              </Link>
              <Link to="/courses?tab=categories">
                <Button variant="ghost">Danh mục</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <MadeWithDyad />
    </Layout>
  );
};

export default Index;