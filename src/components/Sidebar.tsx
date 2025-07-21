import React from 'react';
import { Home, Book, FileText, LayoutDashboard, GraduationCap, File, Users, ShoppingCart, Gift, Newspaper, Bell, Settings, DollarSign, CreditCard, Repeat2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom'; // Import Link and useLocation

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string; // Add 'to' prop for navigation path
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, to, isActive }) => (
  <Link
    to={to} // Use Link component for navigation
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800",
      isActive && "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50"
    )}
  >
    <Icon className="h-5 w-5" />
    {label}
  </Link>
);

const Sidebar: React.FC = () => {
  const location = useLocation(); // Get current location

  return (
    <div className="hidden border-r bg-gray-50/40 lg:block dark:bg-gray-800/40 h-full">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold text-orange-600 text-xl">
            <LayoutDashboard className="h-6 w-6" />
            SSStudy
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavItem icon={Home} label="Trang chủ" to="/" isActive={location.pathname === '/'} />
            <NavItem icon={Book} label="Sách" to="/books" isActive={location.pathname === '/books'} />
            <NavItem icon={FileText} label="Mã form" to="/forms" />
            <NavItem icon={LayoutDashboard} label="Đề thi" to="/exams" />
            <NavItem icon={LayoutDashboard} label="Đề thi mới" to="/new-exams" />
            <NavItem icon={File} label="Bài học" to="/lessons" />
            <NavItem icon={File} label="Bài kiểm tra" to="/quizzes" />
            <NavItem icon={GraduationCap} label="Khóa học" to="/courses" />
            <NavItem icon={File} label="Tài liệu" to="/documents" />
            <NavItem icon={Users} label="Thành viên" to="/members" />
            <NavItem icon={ShoppingCart} label="Đơn hàng" to="/orders" />
            <NavItem icon={Gift} label="Khuyến mãi" to="/promotions" />
            <NavItem icon={Newspaper} label="Tin tức" to="/news" />
            <NavItem icon={Bell} label="Thông báo" to="/notifications" />
            <NavItem icon={Settings} label="Quản lý trang" to="/page-management" />
            <NavItem icon={DollarSign} label="Giao dịch" to="/transactions" />
            <NavItem icon={CreditCard} label="Học phí" to="/tuition" />
            <NavItem icon={FileText} label="Thẻ" to="/cards" />
            <NavItem icon={Repeat2} label="Chuyển cần" to="/transfers" />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;