import { Plane, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIRpayLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
}

export function AIRpayLogo({ 
  className, 
  size = "md", 
  variant = "full" 
}: AIRpayLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl"
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div className={cn(
        "bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden group",
        sizeClasses[size]
      )}>
        {/* Background animation effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Icon stack */}
        <div className="relative z-10 flex items-center justify-center">
          <Plane className={cn(
            "text-white transform transition-transform duration-300 group-hover:scale-110",
            size === "sm" ? "w-3 h-3" : size === "md" ? "w-4 h-4" : "w-6 h-6"
          )} />
          <CreditCard className={cn(
            "text-white/80 transform -ml-1 transition-transform duration-300 group-hover:scale-105",
            size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"
          )} />
        </div>
      </div>
      
      {variant === "full" && (
        <span className={cn(
          "font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-300",
          textSizes[size]
        )}>
          AIRpay
        </span>
      )}
    </div>
  );
}
