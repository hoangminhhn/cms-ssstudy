import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutGrid } from 'lucide-react';

type SubMenuItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
};

const subMenuItems: SubMenuItem[] = [
  { id: 'all-orders', label: 'Tất cả đơn hàng', icon: LayoutGrid, path: '/orders?tab=all-orders' },
  { id: 'pending', label: 'Chờ xử lý', icon: LayoutGrid, path: '/orders?tab=pending' },
  { id: 'processing', label: 'Đang xử lý', icon: LayoutGrid, path: '/orders?tab=processing' },
  { id: 'paid', label: 'Đã thanh toán', icon: LayoutGrid, path: '/orders?tab=paid' },
  { id: 'shipping', label: 'Đang giao hàng', icon: LayoutGrid, path: '/orders?tab=shipping' },
  { id: 'success', label: 'Thành công', icon: LayoutGrid, path: '/orders?tab=success' },
  { id: 'cancelled', label: 'Huỷ đơn', icon: LayoutGrid, path: '/orders?tab=cancelled' },
];

const OrdersSubMenu: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get('tab') || 'all-orders';

  return (
    <div className="ml-4 border-l border-gray-200 dark:border-gray-700 pl-2 py-1">
      <nav className="grid items-start text-sm font-medium gap-1">
        {subMenuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
              activeTab === item.id && "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default OrdersSubMenu;