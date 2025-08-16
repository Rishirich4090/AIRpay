import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ChevronDown, Globe, User, LogOut, Menu, Shield, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface DashboardTopbarProps {
  onMobileSidebarToggle?: () => void;
}

export function DashboardTopbar({ onMobileSidebarToggle }: DashboardTopbarProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const { user, logout } = useAuth();

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
  ];

  // Memoize user initials to prevent recalculation
  const userInitials = useMemo(() => {
    return user?.name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U";
  }, [user?.name]);

  // Memoize language options to prevent re-renders
  const languageOptions = useMemo(() => {
    return languages.map((lang) => (
      <DropdownMenuItem
        key={lang.code}
        onClick={() => setSelectedLanguage(lang.name)}
        className="cursor-pointer"
      >
        {lang.name}
      </DropdownMenuItem>
    ));
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-3 sm:px-4 lg:px-6 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center space-x-2 sm:space-x-4 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileSidebarToggle}
          className="lg:hidden hover:bg-accent transition-colors duration-200 flex-shrink-0"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
        <h1 className="text-sm sm:text-lg font-semibold text-foreground truncate">
          AIRpay Dashboard
        </h1>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-1 sm:gap-2 bg-background/50 border-border hover:bg-accent backdrop-blur-sm transition-all duration-200 hidden sm:flex"
            >
              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden md:inline text-xs sm:text-sm">{selectedLanguage}</span>
              <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {languageOptions}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 rounded-full hover:bg-accent transition-all duration-200 p-1"
            >
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ring-2 ring-background shadow-md hover:ring-blue-500/50 transition-all duration-200">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 text-white text-xs sm:text-sm font-semibold">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-xs sm:text-sm font-medium truncate max-w-24">{user?.name || "User"}</span>
                  <Badge variant={user?.role === "admin" ? "default" : "secondary"} className="text-xs py-0 px-1">
                    {user?.role || "user"}
                  </Badge>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64" align="end" forceMount>
            <div className="flex items-center justify-start gap-3 p-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 text-white font-semibold">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user?.name || "User"}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {user?.email || "user@airpay.com"}
                </p>
                <Badge
                  variant={user?.role === "admin" ? "default" : "secondary"}
                  className="text-xs w-fit"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {user?.role || "user"}
                </Badge>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link to="/profile" className="flex w-full">
                <User className="mr-2 h-4 w-4" />
                <span>View Profile</span>
              </Link>
            </DropdownMenuItem>
            {user?.role === "admin" && (
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Admin Settings</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
