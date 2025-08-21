import { Search, Plus, Bell, Settings, User, LogOut, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

const notifications = [
  {
    id: 1,
    title: "Engine E-123 Critical Alert",
    message: "RUL dropped to 12 cycles - immediate maintenance required",
    time: "2 mins ago",
    priority: "critical"
  },
  {
    id: 2,
    title: "High Failure Probability Detected",
    message: "Engine E-045 shows 87% failure probability within 15 cycles",
    time: "15 mins ago",
    priority: "high"
  },
  {
    id: 3,
    title: "Maintenance Schedule Optimization",
    message: "AI suggests batching maintenance for engines E-001, E-007, E-012",
    time: "1 hour ago",
    priority: "medium"
  }
];

export function Navigation({ currentPage, onPageChange }: { currentPage: string, onPageChange: (page: string) => void }) {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4 lg:gap-8">
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs lg:text-sm font-bold">NASA</span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-sm lg:text-base truncate">
                <span className="hidden sm:inline">Turbofan Engine Maintenance Prediction</span>
                <span className="sm:hidden">Engine Prediction</span>
              </h1>
              <p className="text-xs text-muted-foreground truncate hidden md:block">NASA C-MAPSS Predictive Analytics System</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'prediction', label: 'RUL Prediction' },
              { id: 'maintenance', label: 'Maintenance' }
            ].map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "secondary" : "ghost"}
                onClick={() => onPageChange(item.id)}
                className="h-9 px-4"
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Mobile Search Button */}
          <Button variant="ghost" size="sm" className="sm:hidden">
            <Search className="w-4 h-4" />
          </Button>

          {/* Mobile Navigation Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-white">
              <div className="flex flex-col gap-6 p-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h2>
                  <div className="space-y-2">
                    {[
                      { id: 'dashboard', label: 'Dashboard' },
                      { id: 'prediction', label: 'RUL Prediction' },
                      { id: 'maintenance', label: 'Maintenance' }
                    ].map((item) => (
                      <Button
                        key={item.id}
                        variant={currentPage === item.id ? "secondary" : "ghost"}
                        onClick={() => onPageChange(item.id)}
                        className="w-full justify-start h-10 text-sm font-medium"
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>

                  {/* Mobile Search */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search engines..."
                        className="pl-10 h-10 text-sm border-gray-300 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* New Analysis */}
                  <div>
                    <Button className="w-full justify-start h-10 text-sm font-medium">
                      <Plus className="w-4 h-4 mr-2" />
                      New Analysis
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Search */}
          <div className="relative w-32 sm:w-48 lg:w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search engines..."
              className="pl-10 h-9"
            />
          </div>

          {/* Desktop New Analysis Button */}
          <Button size="sm" className="gap-2 hidden md:flex">
            <Plus className="w-4 h-4" />
            <span className="hidden lg:inline">New Analysis</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 w-4 h-4 lg:w-5 lg:h-5 p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72 lg:w-80" align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-pointer">
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-sm font-medium truncate pr-2">{notification.title}</span>
                    <Badge
                      variant={
                        notification.priority === 'critical' ? 'destructive' :
                          notification.priority === 'high' ? 'outline' :
                            'secondary'
                      }
                      className={
                        notification.priority === 'high' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''
                      }
                    >
                      {notification.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1 line-clamp-2">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.time}</p>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center">
                <span className="text-xs text-muted-foreground">View all notifications</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 lg:h-9 lg:w-9 rounded-full">
                <Avatar className="h-7 w-7 lg:h-8 lg:w-8">
                  <AvatarImage src="/avatars/01.png" alt="User" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Dr. Sarah Chen</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    sarah.chen@nasa.gov
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}