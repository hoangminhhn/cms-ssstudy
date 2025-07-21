import React from 'react';
import { Bell, User, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface HeaderProps {
  onToggleMenu?: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onToggleMenu, title }) => {
  return (
    <header className="flex items-center gap-4 border-b bg-gray-50/40 px-4 lg:px-6 dark:bg-gray-800/40 h-14 lg:h-[60px]">
      {onToggleMenu && (
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onToggleMenu}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      )}
      <div className="flex-1 flex items-center">
        <h1 className="text-xl font-semibold">{title || ''}</h1>
      </div>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        <span className="sr-only">View notifications</span>
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
              <AvatarFallback>PHM</AvatarFallback>
            </Avatar>
            <span className="ml-2 font-medium hidden sm:inline">Phùng Hoàng Minh</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">Phùng Hoàng Minh</p>
              <p className="text-xs leading-none text-muted-foreground">
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