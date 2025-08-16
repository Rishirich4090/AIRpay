import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataPoint {
  time: string;
  success: number;
  pending: number;
  failed: number;
}

interface LineChartProps {
  title: string;
  data: DataPoint[];
  className?: string;
}

export function LineChart({ title, data, className }: LineChartProps) {
  const maxValue = Math.max(
    ...data.flatMap((d) => [d.success, d.pending, d.failed])
  );

  const generatePath = (values: number[], color: string) => {
    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 100 - (value / maxValue) * 80;
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  };

  const successValues = data.map((d) => d.success);
  const pendingValues = data.map((d) => d.pending);
  const failedValues = data.map((d) => d.failed);

  return (
    <Card className={cn("transition-all duration-300 hover:shadow-lg hover:scale-[1.02] group", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs transition-all duration-200 hover:scale-105">
          Reset
        </Button>
      </CardHeader>
      <CardContent>
        <div className="h-48 w-full">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                opacity="0.3"
              />
            ))}
            
            {/* Success line */}
            <path
              d={generatePath(successValues, "success")}
              fill="none"
              stroke="hsl(var(--success))"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            
            {/* Pending line */}
            <path
              d={generatePath(pendingValues, "pending")}
              fill="none"
              stroke="hsl(var(--pending))"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            
            {/* Failed line */}
            <path
              d={generatePath(failedValues, "failed")}
              fill="none"
              stroke="hsl(var(--failed))"
              strokeWidth="2"
              className="drop-shadow-sm"
            />
            
            {/* Data points */}
            {successValues.map((value, index) => {
              const x = (index / (successValues.length - 1)) * 100;
              const y = 100 - (value / maxValue) * 80;
              return (
                <circle
                  key={`success-${index}`}
                  cx={x}
                  cy={y}
                  r="1.5"
                  fill="hsl(var(--success))"
                />
              );
            })}
            
            {pendingValues.map((value, index) => {
              const x = (index / (pendingValues.length - 1)) * 100;
              const y = 100 - (value / maxValue) * 80;
              return (
                <circle
                  key={`pending-${index}`}
                  cx={x}
                  cy={y}
                  r="1.5"
                  fill="hsl(var(--pending))"
                />
              );
            })}
            
            {failedValues.map((value, index) => {
              const x = (index / (failedValues.length - 1)) * 100;
              const y = 100 - (value / maxValue) * 80;
              return (
                <circle
                  key={`failed-${index}`}
                  cx={x}
                  cy={y}
                  r="1.5"
                  fill="hsl(var(--failed))"
                />
              );
            })}
          </svg>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <span>Success</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pending rounded-full"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-failed rounded-full"></div>
            <span>Failed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
