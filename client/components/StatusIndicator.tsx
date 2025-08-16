import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface StatusIndicatorProps {
  status: "success" | "pending" | "failed";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

export function StatusIndicator({ 
  status, 
  size = "sm", 
  animated = true, 
  className 
}: StatusIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const colorClasses = {
    success: "bg-success",
    pending: "bg-pending",
    failed: "bg-failed",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div 
        className={cn(
          "rounded-full",
          sizeClasses[size],
          colorClasses[status],
          animated && "animate-pulse"
        )}
      />
      <Badge 
        variant="outline" 
        className={cn(
          "text-xs transition-all duration-200 hover:scale-105",
          status === "success" && "border-success/30 text-success bg-success/10",
          status === "pending" && "border-pending/30 text-pending bg-pending/10",
          status === "failed" && "border-failed/30 text-failed bg-failed/10"
        )}
      >
        {status.toUpperCase()}
      </Badge>
    </div>
  );
}
