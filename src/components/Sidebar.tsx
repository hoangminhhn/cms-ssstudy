import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BookOpen, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Book,
  Video,
  ClipboardList
} from "lucide-react";

const sidebarItems = [
  {
    title: "Tổng quan",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Quản lý sách",
    url: "/books",
    icon: Book,
  },
  {
    title: "Quản lý đề thi",
    url: "/exams",
    icon: FileText,
  },
  {
    title: "Upload đề thi Word",
    url: "/word-exam-upload",
    icon: FileText,
  },
  {
    title: "Quản lý khóa học",
    url: "/courses",
    icon: Video,
  },
  {
    title: "Quản lý bài học",
    url: "/lessons",
    icon: BookOpen,
  },
  {
    title: "Quản lý bài kiểm tra",
    url: "/tests",
    icon: ClipboardList,
  },
  {
    title: "Quản lý người dùng",
    url: "/users",
    icon: Users,
  },
  {
    title: "Cài đặt",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Trợ giúp",
    url: "/help",
    icon: HelpCircle,
  },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const location = useLocation();

  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            SSStudy
          </h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.url}
                variant={location.pathname === item.url ? "default" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link to={item.url}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;