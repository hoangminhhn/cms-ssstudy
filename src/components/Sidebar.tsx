// NOTE: This file is based on the existing Sidebar component with a minor addition:
// - import NewsSubMenu and include '/news' checks so the News submenu is shown
import React from 'react';
import { Home, Book, FileText, LayoutDashboard, GraduationCap, File, Users, ShoppingCart, Gift, Newspaper, Bell, Settings, DollarSign, CreditCard, Repeat2, ChevronDown, ChevronUp, FileText as FileTextIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import BookSubMenu from './BookSubMenu';
import ExamSubMenu from './ExamSubMenu';
import WordExamSubMenu from './WordExamSubMenu';
import CourseSubMenu from './CourseSubMenu';
import DocumentsSubMenu from './Documents/DocumentsSubMenu';
import MembersSubMenu from './members/MembersSubMenu';
import OrdersSubMenu from './OrdersSubMenu';
import NewsSubMenu from './news/NewsSubMenu';
import NotificationsSubMenu from './notifications/NotificationsSubMenu';

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
    } else if (location.pathname.startsWith('/word-exam-upload')) {
      setOpenSubMenu('word-exams');
    } else if (location.pathname.startsWith('/courses')) {
      setOpenSubMenu('courses');
    } else if (location.pathname.startsWith('/documents')) {
      setOpenSubMenu('documents');
    } else if (location.pathname.startsWith('/members')) {
      setOpenSubMenu('members');
    } else if (location.pathname.startsWith('/orders')) {
      setOpenSubMenu('orders');
    } else if (location.pathname.startsWith('/news')) {
      setOpenSubMenu('news');
    } else if (location.pathname.startsWith('/notifications')) {
      setOpenSubMenu('notifications');
    } else {
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
            
            {/* Word Exam Upload */}
            <NavItem
              icon={FileTextIcon}
              label="Đề thi file word"
              onClick={() => handleParentClick('word-exams')}
              isActive={location.pathname.startsWith('/word-exam-upload')}
              hasSubMenu
              isSubMenuOpen={openSubMenu === 'word-exams'}
            />
            {openSubMenu === 'word-exams' && <WordExamSubMenu />}

            {/* Courses parent with submenu */}
            <NavItem
              icon={GraduationCap}
              label="Khóa học"
              onClick={() => handleParentClick('courses')}
              isActive={location.pathname.startsWith('/courses')}
              hasSubMenu
              isSubMenuOpen={openSubMenu === 'courses'}
            />
            {openSubMenu === 'courses' && <CourseSubMenu />}

            <NavItem icon={File} label="Bài học" to="/lessons" isActive={location.pathname === '/lessons'} />
            <NavItem icon={File} label="Bài kiểm tra" to="/quizzes" isActive={location.pathname === '/quizzes'} />
            
            {/* Documents parent with submenu */}
            <NavItem
              icon={File}
              label="Tài liệu"
              onClick={() => handleParentClick('documents')}
              isActive={location.pathname.startsWith('/documents')}
              hasSubMenu
              isSubMenuOpen={openSubMenu === 'documents'}
            />
            {openSubMenu === 'documents' && <DocumentsSubMenu />}

            {/* Members parent with submenu */}
            <NavItem
              icon={Users}
              label="Thành viên"
              onClick={() => handleParentClick('members')}
              isActive={location.pathname.startsWith('/members')}
              hasSubMenu
              isSubMenuOpen={openSubMenu === 'members'}
            />
            {openSubMenu === 'members' && <MembersSubMenu />}

            {/* Orders parent with submenu */}
            <NavItem
              icon={ShoppingCart}
              label="Đơn hàng"
              onClick={() => handleParentClick('orders')}
              isActive={location.pathname.startsWith('/orders')}
              hasSubMenu
              isSubMenuOpen={openSubMenu === 'orders'}
            />
            {openSubMenu === 'orders' && <OrdersSubMenu />}

            <NavItem
              icon={Newspaper}
              label="Tin tức"
              onClick={() => handleParentClick('news')}
              isActive={location.pathname.startsWith('/news')}
              hasSubMenu
              isSubMenuOpen={openSubMenu === 'news'}
            />
            {openSubMenu === 'news' && <NewsSubMenu />}

            {/* Notifications parent with submenu */}
            <NavItem
              icon={Bell}
              label="Thông báo"
              onClick={() => handleParentClick('notifications')}
              isActive={location.pathname.startsWith('/notifications')}
              hasSubMenu
              isSubMenuOpen={openSubMenu === 'notifications'}
            />
            {openSubMenu === 'notifications' && <NotificationsSubMenu />}

            <NavItem icon={Gift} label="Khuyến mãi" to="/promotions" isActive={location.pathname === '/promotions'} />
            <NavItem icon={Bell} label="Thông báo (chung)" to="/notifications" isActive={location.pathname === '/notifications'} />
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