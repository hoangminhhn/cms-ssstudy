import React from 'react';
import { Home, Book, FileText, LayoutDashboard, GraduationCap, File, Users, ShoppingCart, Gift, Newspaper, Bell, Settings, DollarSign, CreditCard, Repeat2, ChevronDown, ChevronUp, FileText as FileTextIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import BookSubMenu from './BookSubMenu';
import ExamSubMenu from './ExamSubMenu';
import WordExamSubMenu from './WordExamSubMenu'; // Import the new submenu

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to?: string;
  isActive?: boolean;
  onClick?: () => void;
  hasSubMenu?: boolean;
  isSubMenuOpen?: boolean;
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

  React.useEffect(() => {
    if (location.pathname.startsWith('/books')) {
      setOpenSubMenu('books');
    } else if (location.pathname.startsWith('/exams')) {
      setOpenSubMenu('exams');
    } else if (location.pathname.startsWith('/word-exam-upload')) { // Handle new parent menu
      setOpenSubMenu('word-exams');
    }
    else {
      setOpenSubMenu(null);
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
            
            <NavItem
              icon={Book}
              label="Sách"
              onClick={() => handleParentClick('books')}
              isActive={location.pathname.startsWith('/books')}
              hasSubMenu
              isSubMenuOpen={openSubMenu === 'books'}
            />
            {openSubMenu === 'books' && <BookSubMenu />}

            <NavItem icon={FileTextIcon} label="Mã form" to="/forms" isActive={location.pathname === '/forms'} />
            
            <NavItem
              icon={LayoutDashboard}
              label="Đề thi"
              onClick={() => handleParentClick('exams')}
              isActive={location.pathname.startsWith('/exams')}
              hasSubMenu
              isSubMenuOpen={openSubMenu === 'exams'}
            />
            {openSubMenu === 'exams' && <ExamSubMenu />}

            <NavItem icon={LayoutDashboard} label="Đề thi mới" to="/new-exams" isActive={location.pathname === '/new-exams'} />
            
            {/* New parent item for Word Exam Upload with submenu */}
            <NavItem
              icon={FileTextIcon}
              label="Đề thi file word"
              onClick={() => handleParentClick('word-exams')}
              isActive={location.pathname.startsWith('/word-exam-upload')}
              hasSubMenu
              isSubMenuOpen={openSubMenu === 'word-exams'}
            />
            {openSubMenu === 'word-exams' && <WordExamSubMenu />}

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