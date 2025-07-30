import Layout from "@/components/Layout";
import DashboardStats from "@/components/DashboardStats";
import RecentOrdersTable from "@/components/RecentOrdersTable";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <Layout headerTitle="Bảng điều khiển"> {/* Đặt tiêu đề cụ thể cho trang chủ */}
      <div className="flex flex-col gap-6">
        <DashboardStats />
        <RecentOrdersTable />
      </div>
      <MadeWithDyad />
    </Layout>
  );
};

export default Index;