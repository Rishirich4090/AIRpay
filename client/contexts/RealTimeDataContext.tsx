import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface TransactionData {
  time: string;
  success: number;
  pending: number;
  failed: number;
  timestamp: number;
}

export interface StatsData {
  success: {
    amount: string;
    count: number;
    percentage: string;
  };
  pending: {
    amount: string;
    count: number;
    percentage: string;
  };
  failed: {
    amount: string;
    count: number;
    percentage: string;
  };
}

export interface RecentTransaction {
  id: string;
  amount: string;
  merchantId: string;
  pgTxnId: string;
  status: "success" | "pending" | "failed";
  timestamp: string;
}

interface RealTimeDataContextType {
  chartData: TransactionData[];
  stats: StatsData;
  recentTransactions: RecentTransaction[];
  isConnected: boolean;
  circularChartValue: number;
}

const RealTimeDataContext = createContext<RealTimeDataContextType | undefined>(undefined);

export function RealTimeDataProvider({ children }: { children: ReactNode }) {
  const [chartData, setChartData] = useState<TransactionData[]>([]);
  const [stats, setStats] = useState<StatsData>({
    success: { amount: "₹34,843,711", count: 2649, percentage: "42.95%" },
    pending: { amount: "₹145,860", count: 91, percentage: "1.48%" },
    failed: { amount: "₹684,337", count: 3427, percentage: "55.57%" },
  });
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [isConnected] = useState(true);
  const [circularChartValue, setCircularChartValue] = useState(75);

  // Generate random transaction data
  const generateRandomTransaction = (): RecentTransaction => {
    const statuses: Array<"success" | "pending" | "failed"> = ["success", "pending", "failed"];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const amounts = ["₹500", "₹1,200", "₹2,500", "₹750", "₹3,000", "₹450", "₹1,800"];
    
    return {
      id: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
      amount: amounts[Math.floor(Math.random() * amounts.length)],
      merchantId: `${Math.floor(Math.random() * 900000) + 100000}`,
      pgTxnId: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      status,
      timestamp: new Date().toISOString(),
    };
  };

  // Generate random chart data point
  const generateChartPoint = (): TransactionData => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { 
      hour12: false, 
      hour: "2-digit", 
      minute: "2-digit" 
    });
    
    return {
      time: timeStr,
      success: Math.floor(Math.random() * 40) + 10,
      pending: Math.floor(Math.random() * 20) + 2,
      failed: Math.floor(Math.random() * 25) + 5,
      timestamp: now.getTime(),
    };
  };

  // Initialize data
  useEffect(() => {
    // Generate initial chart data (last 12 points)
    const initialData: TransactionData[] = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 2 * 60 * 1000); // 2-minute intervals
      const timeStr = time.toLocaleTimeString("en-US", { 
        hour12: false, 
        hour: "2-digit", 
        minute: "2-digit" 
      });
      
      initialData.push({
        time: timeStr,
        success: Math.floor(Math.random() * 40) + 10,
        pending: Math.floor(Math.random() * 20) + 2,
        failed: Math.floor(Math.random() * 25) + 5,
        timestamp: time.getTime(),
      });
    }
    
    setChartData(initialData);

    // Generate initial transactions
    const initialTransactions = Array.from({ length: 6 }, generateRandomTransaction);
    setRecentTransactions(initialTransactions);
  }, []);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update chart data every 30 seconds
      setChartData(prev => {
        const newPoint = generateChartPoint();
        const updated = [...prev.slice(1), newPoint]; // Keep only last 12 points
        return updated;
      });

      // Update stats occasionally
      if (Math.random() > 0.7) {
        setStats(prev => {
          const baseSuccessCount = 2649;
          const basePendingCount = 91;
          const baseFailedCount = 3427;
          
          const successCount = baseSuccessCount + Math.floor(Math.random() * 100);
          const pendingCount = basePendingCount + Math.floor(Math.random() * 20);
          const failedCount = baseFailedCount + Math.floor(Math.random() * 50);
          
          const total = successCount + pendingCount + failedCount;
          
          return {
            success: {
              amount: `₹${(34843711 + Math.floor(Math.random() * 1000000)).toLocaleString()}`,
              count: successCount,
              percentage: `${((successCount / total) * 100).toFixed(2)}%`,
            },
            pending: {
              amount: `₹${(145860 + Math.floor(Math.random() * 50000)).toLocaleString()}`,
              count: pendingCount,
              percentage: `${((pendingCount / total) * 100).toFixed(2)}%`,
            },
            failed: {
              amount: `₹${(684337 + Math.floor(Math.random() * 100000)).toLocaleString()}`,
              count: failedCount,
              percentage: `${((failedCount / total) * 100).toFixed(2)}%`,
            },
          };
        });
      }

      // Add new transaction occasionally
      if (Math.random() > 0.6) {
        setRecentTransactions(prev => {
          const newTxn = generateRandomTransaction();
          return [newTxn, ...prev.slice(0, 5)]; // Keep only last 6 transactions
        });
      }

      // Update circular chart value
      setCircularChartValue(prev => {
        const change = (Math.random() - 0.5) * 10;
        const newValue = Math.max(20, Math.min(95, prev + change));
        return Math.round(newValue);
      });
      
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <RealTimeDataContext.Provider value={{
      chartData,
      stats,
      recentTransactions,
      isConnected,
      circularChartValue,
    }}>
      {children}
    </RealTimeDataContext.Provider>
  );
}

export const useRealTimeData = () => {
  const context = useContext(RealTimeDataContext);
  if (!context) {
    throw new Error("useRealTimeData must be used within a RealTimeDataProvider");
  }
  return context;
};
