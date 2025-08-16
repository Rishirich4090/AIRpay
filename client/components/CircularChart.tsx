import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CircularChartProps {
  title: string;
  value: number;
  total: number;
  className?: string;
}

export function CircularChart({ title, value, total, className }: CircularChartProps) {
  const percentage = Math.round((value / total) * 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColorByPercentage = (pct: number) => {
    if (pct >= 80) return "hsl(var(--success))";
    if (pct >= 50) return "hsl(var(--pending))";
    return "hsl(var(--failed))";
  };

  return (
    <Card className={cn("transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs transition-all duration-200 hover:scale-105">
          Reset
        </Button>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div className="relative w-32 h-32 group-hover:scale-105 transition-transform duration-300">
          <svg
            className="w-32 h-32 transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="none"
              className="opacity-20"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={getColorByPercentage(percentage)}
              strokeWidth="8"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out drop-shadow-lg"
              style={{
                filter: `drop-shadow(0 0 8px ${getColorByPercentage(percentage)}40)`,
              }}
            />
            {/* Animated pulse ring */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke={getColorByPercentage(percentage)}
              strokeWidth="2"
              fill="none"
              className="opacity-30 animate-pulse"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-lg font-bold text-foreground transition-all duration-300 group-hover:scale-110">
              {percentage}%
            </div>
            <div className="text-xs text-muted-foreground">Efficiency</div>
            <div className="text-xs text-muted-foreground font-mono">
              {value}/{total}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
