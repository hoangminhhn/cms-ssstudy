import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Users, UserPlus, ShieldCheck, UserPlus as UserPlusAlt } from "lucide-react";

interface SubMenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path: string;
}

const subMenuItems: SubMenuItem[] = [
  { id: "all-members", label: "Thành viên", icon: Users, path: "/members?tab=all-members" },
  { id: "add-member", label: "Thêm thành viên", icon: UserPlus, path: "/members?tab=add-member" },
  { id: "admins", label: "Quản trị viên", icon: ShieldCheck, path: "/members?tab=admins" },
  { id: "add-admin", label: "Thêm quản trị viên", icon: UserPlusAlt, path: "/members?tab=add-admin" },
];

const MembersSubMenu: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTab = searchParams.get("tab") || "all-members";

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

export default MembersSubMenu;