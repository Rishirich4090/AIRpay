import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StatsCardProps {
  title: string;
  amount: string;
  count: number;
  percentage: string;
  type: "success" | "pending" | "failed";
  className?: string;
}

export function StatsCard({
  title,
  amount,
  count,
  percentage,
  type,
  className,
}: StatsCardProps) {
  const cardStyles = {
    success: "border-success/20 bg-gradient-to-br from-success/5 to-success/10",
    pending: "border-pending/20 bg-gradient-to-br from-pending/5 to-pending/10",
    failed: "border-failed/20 bg-gradient-to-br from-failed/5 to-failed/10",
  };

  const badgeStyles = {
    success: "bg-success text-success-foreground",
    pending: "bg-pending text-pending-foreground",
    failed: "bg-failed text-failed-foreground",
  };

  const textStyles = {
    success: "text-success",
    pending: "text-pending",
    failed: "text-failed",
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group",
      cardStyles[type],
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Badge className={cn("text-xs font-semibold transition-transform duration-200 group-hover:scale-105", badgeStyles[type])}>
          {type.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className={cn("text-lg sm:text-2xl font-bold transition-colors duration-200", textStyles[type])}>
            {amount}
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground truncate">
              Today Count: {count.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-muted-foreground truncate">
              Percentage: {percentage}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
