import React from 'react';
import Layout from '@/components/Layout';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useLocation } from 'react-router-dom';
import AllOrdersTable from '@/components/Orders/AllOrdersTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OrderManagement: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'all-orders';

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'all-orders':
        return 'Tất cả đơn hàng';
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'paid':
        return 'Đã thanh toán';
      case 'shipping':
        return 'Đang giao hàng';
      case 'success':
        return 'Thành công';
      case 'cancelled':
        return 'Huỷ đơn';
      default:
        return 'Đơn hàng';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'all-orders':
        return <AllOrdersTable />;
      case 'pending':
        return <AllOrdersTable presetStatus="Chờ xử lý" />;
      case 'processing':
        return <AllOrdersTable presetStatus="Đang xử lý" />;
      case 'paid':
        return <AllOrdersTable presetStatus="Đã thanh toán" />;
      case 'shipping':
        return <AllOrdersTable presetStatus="Đang giao" />;
      case 'success':
        return <AllOrdersTable presetStatus="Hoàn thành" />;
      case 'cancelled':
        return <AllOrdersTable presetStatus="Huỷ" />;
      default:
        return <AllOrdersTable />;
    }
  };

  return (
    <Layout headerTitle={getHeaderTitle()}>
      <div className="flex flex-col gap-6 w-full overflow-x-hidden">
        {/* Mobile header placeholder for submenu */}
        <div className="lg:hidden w-full overflow-x-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50 dark:bg-gray-800">
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

export default OrderManagement;