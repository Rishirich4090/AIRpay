import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import {
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Users,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for charts
const dailyTransactionData = [
  { date: "2024-01-14", success: 1250, failed: 89, pending: 45, amount: 2850000 },
  { date: "2024-01-15", success: 1456, failed: 102, pending: 38, amount: 3200000 },
  { date: "2024-01-16", success: 1689, failed: 76, pending: 52, amount: 3750000 },
  { date: "2024-01-17", success: 1534, failed: 94, pending: 41, amount: 3450000 },
  { date: "2024-01-18", success: 1823, failed: 67, pending: 29, amount: 4100000 },
  { date: "2024-01-19", success: 1945, failed: 85, pending: 47, amount: 4350000 },
  { date: "2024-01-20", success: 2156, failed: 91, pending: 34, amount: 4850000 },
];

const paymentMethodData = [
  { name: "UPI", value: 45, color: "#10b981" },
  { name: "Credit Card", value: 25, color: "#3b82f6" },
  { name: "Debit Card", value: 15, color: "#f59e0b" },
  { name: "Net Banking", value: 10, color: "#ef4444" },
  { name: "Wallet", value: 5, color: "#8b5cf6" },
];

const pgProviderData = [
  { name: "PayTM", success: 94.5, volume: 35, amount: 12500000 },
  { name: "HDFC", success: 96.2, volume: 28, amount: 9800000 },
  { name: "PhonePe", success: 97.1, volume: 22, amount: 7650000 },
  { name: "ICICI", success: 91.8, volume: 15, amount: 5200000 },
];

const hourlyTransactionData = [
  { hour: "00:00", transactions: 45, amount: 125000 },
  { hour: "01:00", transactions: 32, amount: 89000 },
  { hour: "02:00", transactions: 28, amount: 76000 },
  { hour: "03:00", transactions: 25, amount: 67000 },
  { hour: "04:00", transactions: 31, amount: 85000 },
  { hour: "05:00", transactions: 42, amount: 115000 },
  { hour: "06:00", transactions: 68, amount: 185000 },
  { hour: "07:00", transactions: 95, amount: 265000 },
  { hour: "08:00", transactions: 134, amount: 375000 },
  { hour: "09:00", transactions: 189, amount: 525000 },
  { hour: "10:00", transactions: 245, amount: 685000 },
  { hour: "11:00", transactions: 298, amount: 835000 },
  { hour: "12:00", transactions: 356, amount: 995000 },
  { hour: "13:00", transactions: 312, amount: 875000 },
  { hour: "14:00", transactions: 289, amount: 805000 },
  { hour: "15:00", transactions: 267, amount: 745000 },
  { hour: "16:00", transactions: 234, amount: 655000 },
  { hour: "17:00", transactions: 198, amount: 555000 },
  { hour: "18:00", transactions: 165, amount: 465000 },
  { hour: "19:00", transactions: 142, amount: 395000 },
  { hour: "20:00", transactions: 118, amount: 325000 },
  { hour: "21:00", transactions: 89, amount: 245000 },
  { hour: "22:00", transactions: 67, amount: 185000 },
  { hour: "23:00", transactions: 52, amount: 145000 },
];

interface TransactionSummary {
  totalTransactions: number;
  totalAmount: number;
  successRate: number;
  avgTransactionValue: number;
  growthRate: number;
  topMerchant: string;
  topPaymentMethod: string;
}

export default function TransactionReport() {
  const [dateRange, setDateRange] = useState<any>({ 
    from: new Date(2024, 0, 14), 
    to: new Date(2024, 0, 20) 
  });
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [reportType, setReportType] = useState("overview");

  // Calculate summary statistics
  const summary: TransactionSummary = useMemo(() => {
    const totalTransactions = dailyTransactionData.reduce((sum, day) => 
      sum + day.success + day.failed + day.pending, 0
    );
    const totalAmount = dailyTransactionData.reduce((sum, day) => sum + day.amount, 0);
    const successfulTransactions = dailyTransactionData.reduce((sum, day) => sum + day.success, 0);
    const successRate = (successfulTransactions / totalTransactions) * 100;
    const avgTransactionValue = totalAmount / totalTransactions;
    
    return {
      totalTransactions,
      totalAmount,
      successRate,
      avgTransactionValue,
      growthRate: 12.5, // Mock growth rate
      topMerchant: "TechShop Online",
      topPaymentMethod: "UPI",
    };
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-in fade-in-0 slide-in-from-left-2 duration-500">
            <h2 className="text-2xl font-bold tracking-tight">Transaction Reports</h2>
            <p className="text-muted-foreground">
              Comprehensive analytics and insights on payment transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DatePickerWithRange
              date={dateRange}
              onDateChange={setDateRange}
              placeholder="Select date range"
              className="w-auto"
            />
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Quick Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="merchant">Merchant Wise</SelectItem>
                  <SelectItem value="payment-method">Payment Method</SelectItem>
                  <SelectItem value="gateway">Gateway Wise</SelectItem>
                  <SelectItem value="hourly">Hourly Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">{formatNumber(summary.totalTransactions)}</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +{summary.growthRate}% from last period
                  </p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold">{formatCurrency(summary.totalAmount)}</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +15.2% from last period
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">{summary.successRate.toFixed(1)}%</p>
                  <p className="text-xs text-failed flex items-center gap-1 mt-1">
                    <TrendingDown className="w-3 h-3" />
                    -0.8% from last period
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Transaction</p>
                  <p className="text-2xl font-bold">{formatCurrency(summary.avgTransactionValue)}</p>
                  <p className="text-xs text-success flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +3.4% from last period
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Transaction Volume */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Daily Transaction Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyTransactionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any, name: string) => [
                          name === 'amount' ? formatCurrency(value) : formatNumber(value),
                          name
                        ]}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Bar dataKey="success" fill="#10b981" name="Success" />
                      <Bar dataKey="failed" fill="#ef4444" name="Failed" />
                      <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Payment Method Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5" />
                    Payment Method Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Transaction Amount Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Transaction Amount Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={dailyTransactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                    <YAxis tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(value), "Amount"]}
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <Area type="monotone" dataKey="amount" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            {/* Hourly Transaction Pattern */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Hourly Transaction Pattern
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={hourlyTransactionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => formatCurrency(value)} />
                    <Tooltip 
                      formatter={(value: any, name: string) => [
                        name === 'amount' ? formatCurrency(value) : formatNumber(value),
                        name === 'amount' ? 'Amount' : 'Transactions'
                      ]}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="transactions" stroke="#3b82f6" strokeWidth={2} />
                    <Line yAxisId="right" type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-6">
            {/* Payment Gateway Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Gateway Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pgProviderData.map((pg) => (
                    <div key={pg.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{pg.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Volume: {pg.volume}% | Success: {pg.success}%
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(pg.amount)}</p>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-success rounded-full" />
                          <span className="text-sm">{pg.success}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Response Time</p>
                      <p className="text-2xl font-bold">1.2s</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Error Rate</p>
                      <p className="text-2xl font-bold">0.8%</p>
                    </div>
                    <XCircle className="w-8 h-8 text-failed" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Peak TPS</p>
                      <p className="text-2xl font-bold">145</p>
                    </div>
                    <Activity className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Uptime</p>
                      <p className="text-2xl font-bold">99.9%</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-success" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
