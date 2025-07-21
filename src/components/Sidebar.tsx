import React from 'react';
import { Home, Book, FileText, LayoutDashboard, GraduationCap, File, Users, ShoppingCart, Gift, Newspaper, Bell, Settings, DollarSign, CreditCard, Repeat2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, isActive }) => (
  <div
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800",
      isActive && "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50"
    )}
  >
    <Icon className="h-5 w-5" />
    {label}
  </div>
);

const Sidebar: React.FC = () => {
  return (
    <div className="hidden border-r bg-gray-50/40 lg:block dark:bg-gray-800/40 h-full">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <a href="/" className="flex items-center gap-2 font-semibold text-orange-600 text-xl">
            <LayoutDashboard className="h-6 w-6" />
            SSStudy
          </a>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavItem icon={Home} label="Trang chủ" isActive />
            <NavItem icon={Book} label="Sách" />
            <NavItem icon={FileText} label="Mã form" />
            <NavItem icon={LayoutDashboard} label="Đề thi" />
            <NavItem icon={LayoutDashboard} label="Đề thi mới" />
            <NavItem icon={File} label="Bài học" />
            <NavItem icon={File} label="Bài kiểm tra" />
            <NavItem icon={GraduationCap} label="Khóa học" />
            <NavItem icon={File} label="Tài liệu" />
            <NavItem icon={Users} label="Thành viên" />
            <NavItem icon={ShoppingCart} label="Đơn hàng" />
            <NavItem icon={Gift} label="Khuyến mãi" />
            <NavItem icon={Newspaper} label="Tin tức" />
            <NavItem icon={Bell} label="Thông báo" />
            <NavItem icon={Settings} label="Quản lý trang" />
            <NavItem icon={DollarSign} label="Giao dịch" />
            <NavItem icon={CreditCard} label="Học phí" />
            <NavItem icon={FileText} label="Thẻ" />
            <NavItem icon={Repeat2} label="Chuyển cần" />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;