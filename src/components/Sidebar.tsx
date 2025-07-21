import React from 'react';
import { Home, Book, FileText, LayoutDashboard, GraduationCap, File, Users, ShoppingCart, Gift, Newspaper, Bell, Settings, DollarSign, CreditCard, Repeat2, ChevronDown, ChevronUp, FileText as FileTextIcon } from 'lucide-react'; // Renamed FileText to FileTextIcon to avoid conflict
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import BookSubMenu from './BookSubMenu';
import ExamSubMenu from './ExamSubMenu';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to?: string; // Make 'to' optional for parent items
  isActive?: boolean;
  onClick?: () => void; // Add onClick for parent items
  hasSubMenu?: boolean; // Indicate if it's a parent with a submenu
  isSubMenuOpen?: boolean; // Indicate if its submenu is open
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, to, isActive, onClick, hasSubMenu, isSubMenuOpen }) => {
  const content = (
    <>
      <Icon className="h-5 w-5" />
      {label}
      {hasSubMenu && (isSubMenuOpen ? <ChevronUp className="ml-auto h-4 w-4" /> : <ChevronDown className="ml-auto h-4 w-4" />)}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800",
          isActive && "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50"
        )}
      >
        {content}
      </Link>
    );
  } else {
    return (
      <div
        onClick={onClick}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 cursor-pointer transition-all",
          "text-gray-900 hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800",
          isActive && "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50"
        )}
      >
        {content}
      </div>
    );
  }
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [openSubMenu, setOpenSubMenu] = React.useState<string | null>(null);

  // Automatically open submenu if current path starts with its base path
  React.useEffect(() => {
    if (location.pathname.startsWith('/books')) {
      setOpenSubMenu('books');
    } else if (location.pathname.startsWith('/exams')) {
      setOpenSubMenu('exams');
    }
    else {
      setOpenSubMenu(null); // Close submenu if navigating away from known sub-menu paths
    }
  }, [location.pathname]);

  const handleParentClick = (menuId: string) => {
    setOpenSubMenu(openSubMenu === menuId ? null : menuId);
  };

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
            
            {/* Parent item for Books with submenu */}
            <NavItem
              icon={Book}
              label="Sách"
              onClick={() => handleParentClick('books')}
              isActive={location.pathname.startsWith('/books')}
              hasSubMenu
              isSubMenuOpen={openSubMenu === 'books'}
            />
            {openSubMenu === 'books' && <BookSubMenu />} {/* Render submenu if open */}

            <NavItem icon={FileTextIcon} label="Mã form" to="/forms" isActive={location.pathname === '/forms'} />
            
            {/* Parent item for Exams with submenu */}
            <NavItem
              icon={LayoutDashboard} // Using LayoutDashboard for Exams as per image
              label="Đề thi"
              onClick={() => handleParentClick('exams')}
              isActive={location.pathname.startsWith('/exams')}
              hasSubMenu
              isSubMenuOpen={openSubMenu === 'exams'}
            />
            {openSubMenu === 'exams' && <ExamSubMenu />} {/* Render submenu if open */}

            <NavItem icon={LayoutDashboard} label="Đề thi mới" to="/new-exams" isActive={location.pathname === '/new-exams'} />
            <NavItem icon={FileTextIcon} label="Đề thi file word" to="/word-exam-upload" isActive={location.pathname === '/word-exam-upload'} /> {/* New top-level item */}
            <NavItem icon={File} label="Bài học" to="/lessons" isActive={location.pathname === '/lessons'} />
            <NavItem icon={File} label="Bài kiểm tra" to="/quizzes" isActive={location.pathname === '/quizzes'} />
            <NavItem icon={GraduationCap} label="Khóa học" to="/courses" isActive={location.pathname === '/courses'} />
            <NavItem icon={File} label="Tài liệu" to="/documents" isActive={location.pathname === '/documents'} />
            <NavItem icon={Users} label="Thành viên" to="/members" isActive={location.pathname === '/members'} />
            <NavItem icon={ShoppingCart} label="Đơn hàng" to="/orders" isActive={location.pathname === '/orders'} />
            <NavItem icon={Gift} label="Khuyến mãi" to="/promotions" isActive={location.pathname === '/promotions'} />
            <NavItem icon={Newspaper} label="Tin tức" to="/news" isActive={location.pathname === '/news'} />
            <NavItem icon={Bell} label="Thông báo" to="/notifications" isActive={location.pathname === '/notifications'} />
            <NavItem icon={Settings} label="Quản lý trang" to="/page-management" isActive={location.pathname === '/page-management'} />
            <NavItem icon={DollarSign} label="Giao dịch" to="/transactions" isActive={location.pathname === '/transactions'} />
            <NavItem icon={CreditCard} label="Học phí" to="/tuition" isActive={location.pathname === '/tuition'} />
            <NavItem icon={FileTextIcon} label="Thẻ" to="/cards" isActive={location.pathname === '/cards'} />
            <NavItem icon={Repeat2} label="Chuyển cần" to="/transfers" isActive={location.pathname === '/transfers'} />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;