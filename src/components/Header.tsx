import React from 'react';
import { Bell, User, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onToggleMenu?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onToggleMenu, title = "Quản lý sách" }) => {
  return (
    <header className="flex items-center gap-4 border-b bg-gray-50/40 px-4 lg:px-6 dark:bg-gray-800/40 h-14 lg:h-[60px]">
      {onToggleMenu && (
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onToggleMenu}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      )}
      <h1 className="text-xl font-semibold flex-1">{title}</h1>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="sr-only">View notifications</span>
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative flex items-center space-x-2 rounded-full px-2 py-1 min-w-[120px] max-w-[180px] overflow-hidden"
          >
            <Avatar className="h-8 w-8 flex-shrink-0">
              <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
              <AvatarFallback>PHM</AvatarFallback>
            </Avatar>
            <span className="font-medium truncate text-ellipsis whitespace-nowrap overflow-hidden">
              Phùng Hoàng Minh
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none truncate">Phùng Hoàng Minh</p>
              <p className="text-xs leading-none text-muted-foreground truncate">
                m@example.com
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default Header;