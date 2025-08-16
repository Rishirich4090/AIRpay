import { useState, useEffect, useMemo } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardTopbar } from "@/components/DashboardTopbar";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

// Move sidebar state to prevent recreation on navigation
let globalSidebarState = {
  isMobileSidebarOpen: false,
  isCollapsed: false
};

export function DashboardLayout({ children, className, title }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(globalSidebarState.isMobileSidebarOpen);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(globalSidebarState.isCollapsed);

  // Memoize mobile check to prevent unnecessary re-renders
  const checkIsMobile = useMemo(() => {
    return () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      return mobile;
    };
  }, []);

  useEffect(() => {
    // Initial check
    checkIsMobile();
    
    // Debounced resize handler to prevent excessive re-renders
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkIsMobile, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, [checkIsMobile]);

  useEffect(() => {
    // Close mobile sidebar when switching to desktop
    if (!isMobile && isMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
      globalSidebarState.isMobileSidebarOpen = false;
    }
  }, [isMobile, isMobileSidebarOpen]);

  // Listen for sidebar collapse state changes from Sidebar
  const handleSidebarCollapse = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
    globalSidebarState.isCollapsed = collapsed;
  };

  const toggleMobileSidebar = () => {
    const newState = !isMobileSidebarOpen;
    setIsMobileSidebarOpen(newState);
    globalSidebarState.isMobileSidebarOpen = newState;
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
    globalSidebarState.isMobileSidebarOpen = false;
  };

  return (
    <div className="min-h-screen bg-background flex relative">
      {/* Sidebar - Fixed and scrollable */}
      <DashboardSidebar 
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={closeMobileSidebar}
        className="z-50"
        isCollapsed={isSidebarCollapsed}
        onCollapse={handleSidebarCollapse}
      />
      {/* Main content area - Responsive left padding */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 transition-all duration-300",
          isMobileSidebarOpen && isMobile ? "pl-0" :
            isSidebarCollapsed ? "lg:pl-16" : "lg:pl-64 xl:pl-72"
        )}
      >
        {/* Topbar - Fixed height to prevent layout jumps */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <DashboardTopbar onMobileSidebarToggle={toggleMobileSidebar} />
        </div>
        {/* Page content - Remove extra margin-top, add responsive padding */}
        <main className={cn(
          "p-4 sm:p-6 lg:p-8 space-y-6 min-h-[calc(100vh-4rem)]",
          className
        )}>
          {title && (
            <div className="space-y-2 mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
              <div className="h-px bg-gradient-to-r from-border via-border/50 to-transparent" />
            </div>
          )}
          <div className="space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// Enhanced responsive wrapper for different content types
interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export function ResponsiveContainer({ 
  children, 
  className, 
  maxWidth = "full" 
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full"
  };

  return (
    <div className={cn(
      "w-full mx-auto px-4 sm:px-6 lg:px-8",
      maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  );
}

// Enhanced grid system for responsive layouts
interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: number;
}

export function ResponsiveGrid({ 
  children, 
  className,
  cols = { default: 1, sm: 2, lg: 3 },
  gap = 6 
}: ResponsiveGridProps) {
  const gridClasses = [
    `grid gap-${gap}`,
    `grid-cols-${cols.default || 1}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean).join(" ");

  return (
    <div className={cn(gridClasses, className)}>
      {children}
    </div>
  );
}

// Card component optimized for different screen sizes
interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  hover?: boolean;
}

export function ResponsiveCard({ 
  children, 
  className,
  padding = "md",
  hover = true
}: ResponsiveCardProps) {
  const paddingClasses = {
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6", 
    lg: "p-6 sm:p-8"
  };

  return (
    <div className={cn(
      "bg-card text-card-foreground border border-border rounded-lg shadow-sm",
      paddingClasses[padding],
      hover && "transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
      "break-inside-avoid", // For better mobile layout
      className
    )}>
      {children}
    </div>
  );
}

// Flexible section wrapper
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export function Section({ 
  children, 
  className, 
  title, 
  description, 
  action 
}: SectionProps) {
  return (
    <section className={cn("space-y-4 sm:space-y-6", className)}>
      {(title || description || action) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            {title && (
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

// Mobile-optimized table wrapper
interface MobileTableProps {
  children: React.ReactNode;
  className?: string;
}

export function MobileTable({ children, className }: MobileTableProps) {
  return (
    <div className={cn(
      "overflow-x-auto -mx-4 sm:mx-0",
      "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
      className
    )}>
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
