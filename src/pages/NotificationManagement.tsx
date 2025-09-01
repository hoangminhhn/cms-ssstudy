import React from 'react';
import Layout from '@/components/Layout';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NotificationManagement: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'all-notifications';

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'all-notifications':
        return 'Tất cả thông báo';
      case 'add-notification':
        return 'Thêm thông báo';
      default:
        return 'Thông báo';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'all-notifications':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Tất cả thông báo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">Danh sách thông báo sẽ hiển thị ở đây (placeholder).</div>
            </CardContent>
          </Card>
        );
      case 'add-notification':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Thêm thông báo mới</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">Form thêm thông báo (placeholder).</div>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Layout headerTitle={getHeaderTitle()}>
      <div className="flex flex-col gap-6 w-full overflow-x-hidden">
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

export default NotificationManagement;