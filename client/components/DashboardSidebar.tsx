import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  Wallet,
  Settings,
  FileText,
  CreditCard,
  BarChart3,
  Download,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIRpayLogo } from "@/components/AIRpayLogo";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Merchant Management",
    icon: Users,
    href: "/merchant-management",
  },
  {
    title: "Bank List",
    icon: Building2,
    href: "/bank-list",
  },
  {
    title: "Wallet List",
    icon: Wallet,
    href: "/wallet-list",
  },
  {
    title: "Update PG Limit Policy",
    icon: Settings,
    href: "/update-pg-limit-policy",
  },
  {
    title: "Transaction Update",
    icon: FileText,
    href: "/transaction-update",
  },
  {
    title: "PG Management",
    icon: CreditCard,
    href: "/pg-management",
  },
  {
    title: "Transaction Report",
    icon: BarChart3,
    href: "/transaction-report",
  },
  {
    title: "Download Report",
    icon: Download,
    href: "/download-report",
  },
];

interface DashboardSidebarProps {
  className?: string;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  isCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

// Global state to persist sidebar collapse state across navigation
let globalSidebarCollapsed = false;

export function DashboardSidebar({ className, isMobileOpen = false, onMobileClose, isCollapsed: collapsedProp, onCollapse }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(collapsedProp ?? globalSidebarCollapsed);
  const location = useLocation();

  // Memoize the navigation items to prevent unnecessary re-renders
  const navigationItems = useMemo(() => {
    return menuItems.map((item, index) => {
      const isActive = location.pathname === item.href;
      const Icon = item.icon;

      return (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-sidebar-accent group relative",
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border shadow-sm before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-500 before:rounded-r"
              : "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:scale-[1.02] hover:shadow-sm",
            isCollapsed && "justify-center"
          )}
          onClick={() => {
            if (isMobileOpen && onMobileClose) {
              onMobileClose();
            }
          }}
          title={isCollapsed ? item.title : undefined}
        >
          <Icon className={cn(
            "flex-shrink-0 transition-transform duration-200 group-hover:scale-110",
            isCollapsed ? "w-5 h-5" : "w-4 h-4"
          )} />
          {!isCollapsed && (
            <span className="truncate text-xs sm:text-sm">
              {item.title}
            </span>
          )}
        </Link>
      );
    });
  }, [location.pathname, isCollapsed, isMobileOpen, onMobileClose]);

  // Accept isCollapsed and onCollapse from props
  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    globalSidebarCollapsed = newState;
    if (typeof onCollapse === 'function') {
      onCollapse(newState);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}
      <div
        className={cn(
          // Always fixed and full height on desktop
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-sidebar border-r border-sidebar-border h-screen transition-all duration-300 ease-in-out",
          isMobileOpen
            ? "w-64 sm:w-72 translate-x-0"
            : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "lg:w-16" : "lg:w-64 xl:w-72",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-sidebar-border flex-shrink-0">
          <div className={cn(
            "transition-all duration-300",
            isCollapsed && "lg:hidden xl:block"
          )}>
            <AIRpayLogo
              size={isCollapsed ? "sm" : "md"}
              variant={isCollapsed ? "icon" : "full"}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleCollapse}
            className="hidden lg:flex text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileClose}
            className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-200"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        {/* Navigation - scrollable only if needed, sidebar stays fixed */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent min-h-0">
          {navigationItems}
        </nav>
      </div>
    </>
  );
}
