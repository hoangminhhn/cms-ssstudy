import React from "react";
import Layout from "@/components/Layout";
import { MadeWithDyad } from "@/components/made-with-dyad";
import PromotionTable from "@/components/promotions/PromotionTable";

const PromotionManagement: React.FC = () => {
  return (
    <Layout headerTitle="Khuyến mãi">
      <div className="flex flex-col gap-6 w-full overflow-x-hidden">
        <PromotionTable />
      </div>
      <MadeWithDyad />
    </Layout>
  );
};

export default PromotionManagement;