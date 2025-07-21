import React from 'react';
import { Home, Book, FileText, LayoutDashboard, GraduationCap, File, Users, ShoppingCart, Gift, Newspaper, Bell, Settings, DollarSign, CreditCard, Repeat2, PlusCircle, List, Tag, Star, FilePlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive?: boolean;
  isExpanded: boolean;
  isSubItem?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, to, isActive, isExpanded, isSubItem = false }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800",
      isActive && "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50",
      !isExpanded && "justify-center px-0", // Center icon when collapsed
      isSubItem && isExpanded && "pl-6", // Indent sub-items when expanded
      isSubItem && !isExpanded && "pl-0" // No indent when collapsed
    )}
  >
    <Icon className="h-5 w-5" />
    {isExpanded && label}
  </Link>
);

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(true); // State to control sidebar expansion
  const [activeAccordionItem, setActiveAccordionItem] = React.useState<string | undefined>(
    location.pathname.startsWith('/books') ? 'books-menu' : undefined // Open 'books-menu' if current path is under /books
  );

  React.useEffect(() => {
    if (location.pathname.startsWith('/books')) {
      setActiveAccordionItem('books-menu');
    } else {
      setActiveAccordionItem(undefined);
    }
  }, [location.pathname]);

  return (
    <div className={cn(
      "hidden border-r bg-gray-50/40 lg:block dark:bg-gray-800/40 h-full transition-all duration-300 ease-in-out",
      isSidebarExpanded ? "w-[280px]" : "w-[60px] overflow-x-hidden" // Adjust width based on expansion
    )}>
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 justify-between">
          {isSidebarExpanded && (
            <Link to="/" className="flex items-center gap-2 font-semibold text-orange-600 text-xl">
              <LayoutDashboard className="h-6 w-6" />
              SSStudy
            </Link>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className={cn(
              "flex items-center gap-1 text-orange-600 hover:text-orange-700 dark:text-orange-50 dark:hover:text-orange-100",
              isSidebarExpanded ? "ml-auto" : "mx-auto" // Center button when collapsed
            )}
          >
            {isSidebarExpanded ? (
              <>
                <ChevronLeft className="h-4 w-4" />
                THU GỌN
              </>
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavItem icon={Home} label="Trang chủ" to="/" isActive={location.pathname === '/'} isExpanded={isSidebarExpanded} />

            <Accordion type="single" collapsible value={activeAccordionItem} onValueChange={setActiveAccordionItem}>
              <AccordionItem value="books-menu" className="border-b-0">
                <AccordionTrigger className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-900 transition-all hover:bg-gray-100 dark:text-gray-50 dark:hover:bg-gray-800",
                  location.pathname.startsWith('/books') && "bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-50",
                  !isSidebarExpanded && "justify-center px-0 [&>svg]:hidden", // Hide arrow when collapsed
                  "data-[state=open]:bg-orange-100 data-[state=open]:text-orange-600 dark:data-[state=open]:bg-orange-800 dark:data-[state=open]:text-orange-50"
                )}>
                  <Book className="h-5 w-5" />
                  {isSidebarExpanded && "Sách"}
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="flex flex-col gap-1">
                    <NavItem icon={Book} label="Tất cả sách" to="/books" isActive={location.pathname === '/books'} isExpanded={isSidebarExpanded} isSubItem />
                    <NavItem icon={PlusCircle} label="Thêm sách" to="/books/add" isActive={location.pathname === '/books/add'} isExpanded={isSidebarExpanded} isSubItem />
                    <NavItem icon={List} label="Danh mục sách" to="/books/categories" isActive={location.pathname === '/books/categories'} isExpanded={isSidebarExpanded} isSubItem />
                    <NavItem icon={Tag} label="Thêm danh mục" to="/books/categories/add" isActive={location.pathname === '/books/categories/add'} isExpanded={isSidebarExpanded} isSubItem />
                    <NavItem icon={Star} label="Đánh giá sách" to="/books/reviews" isActive={location.pathname === '/books/reviews'} isExpanded={isSidebarExpanded} isSubItem />
                    <NavItem icon={FilePlus} label="Thêm đánh giá sách" to="/books/reviews/add" isActive={location.pathname === '/books/reviews/add'} isExpanded={isSidebarExpanded} isSubItem />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <NavItem icon={FileText} label="Mã form" to="/forms" isActive={location.pathname === '/forms'} isExpanded={isSidebarExpanded} />
            <NavItem icon={LayoutDashboard} label="Đề thi" to="/exams" isActive={location.pathname === '/exams'} isExpanded={isSidebarExpanded} />
            <NavItem icon={LayoutDashboard} label="Đề thi mới" to="/new-exams" isActive={location.pathname === '/new-exams'} isExpanded={isSidebarExpanded} />
            <NavItem icon={File} label="Bài học" to="/lessons" isActive={location.pathname === '/lessons'} isExpanded={isSidebarExpanded} />
            <NavItem icon={File} label="Bài kiểm tra" to="/quizzes" isActive={location.pathname === '/quizzes'} isExpanded={isSidebarExpanded} />
            <NavItem icon={GraduationCap} label="Khóa học" to="/courses" isActive={location.pathname === '/courses'} isExpanded={isSidebarExpanded} />
            <NavItem icon={File} label="Tài liệu" to="/documents" isActive={location.pathname === '/documents'} isExpanded={isSidebarExpanded} />
            <NavItem icon={Users} label="Thành viên" to="/members" isActive={location.pathname === '/members'} isExpanded={isSidebarExpanded} />
            <NavItem icon={ShoppingCart} label="Đơn hàng" to="/orders" isActive={location.pathname === '/orders'} isExpanded={isSidebarExpanded} />
            <NavItem icon={Gift} label="Khuyến mãi" to="/promotions" isActive={location.pathname === '/promotions'} isExpanded={isSidebarExpanded} />
            <NavItem icon={Newspaper} label="Tin tức" to="/news" isActive={location.pathname === '/news'} isExpanded={isSidebarExpanded} />
            <NavItem icon={Bell} label="Thông báo" to="/notifications" isActive={location.pathname === '/notifications'} isExpanded={isSidebarExpanded} />
            <NavItem icon={Settings} label="Quản lý trang" to="/page-management" isActive={location.pathname === '/page-management'} isExpanded={isSidebarExpanded} />
            <NavItem icon={DollarSign} label="Giao dịch" to="/transactions" isActive={location.pathname === '/transactions'} isExpanded={isSidebarExpanded} />
            <NavItem icon={CreditCard} label="Học phí" to="/tuition" isActive={location.pathname === '/tuition'} isExpanded={isSidebarExpanded} />
            <NavItem icon={FileText} label="Thẻ" to="/cards" isActive={location.pathname === '/cards'} isExpanded={isSidebarExpanded} />
            <NavItem icon={Repeat2} label="Chuyển cần" to="/transfers" isActive={location.pathname === '/transfers'} isExpanded={isSidebarExpanded} />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;