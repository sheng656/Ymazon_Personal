import { Search, Plus, Bell, Settings, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

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
      <div className="container flex h-16 items-center justify-between px-6">
        {/* Logo and Brand */}
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">NASA</span>
            </div>
            <div>
              <h1 className="font-semibold">Turbofan Engine Maintenance Prediction</h1>
              <p className="text-xs text-muted-foreground">NASA C-MAPSS Predictive Analytics System</p>
            </div>
          </div>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
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
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative w-64 hidden sm:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search engines, sensors..." 
              className="pl-10 h-9"
            />
          </div>

          {/* New Analysis Button */}
          <Button size="sm" className="gap-2 hidden sm:flex">
            <Plus className="w-4 h-4" />
            New Analysis
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start p-3 cursor-pointer">
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-sm font-medium">{notification.title}</span>
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
                  <p className="text-xs text-muted-foreground mb-1">{notification.message}</p>
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
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-8 w-8">
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