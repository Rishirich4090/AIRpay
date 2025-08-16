import { DashboardLayout, ResponsiveGrid, ResponsiveCard, Section } from "@/components/DashboardLayout";
import { StatsCard } from "@/components/StatsCard";
import { CircularChart } from "@/components/CircularChart";
import { LineChart } from "@/components/LineChart";
import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRealTimeData } from "@/contexts/RealTimeDataContext";
import { downloadTransactionReport, TransactionData } from "@/lib/pdf-utils";
import { Wifi, WifiOff, Download, FileText } from "lucide-react";
import { useState } from "react";

// Mock data
const statsData = {
  success: {
    amount: "₹34843711500",
    count: 2649,
    percentage: "42.95%",
  },
  pending: {
    amount: "₹145860.0000",
    count: 91,
    percentage: "1.48%",
  },
  failed: {
    amount: "₹684337.2600",
    count: 3427,
    percentage: "55.57%",
  },
};

const chartData = [
  { time: "00:00", success: 12, pending: 5, failed: 8 },
  { time: "02:00", success: 8, pending: 3, failed: 12 },
  { time: "04:00", success: 15, pending: 8, failed: 5 },
  { time: "06:00", success: 20, pending: 12, failed: 10 },
  { time: "08:00", success: 25, pending: 6, failed: 15 },
  { time: "10:00", success: 18, pending: 9, failed: 7 },
  { time: "12:00", success: 30, pending: 15, failed: 12 },
  { time: "14:00", success: 22, pending: 7, failed: 18 },
  { time: "16:00", success: 28, pending: 11, failed: 9 },
  { time: "18:00", success: 35, pending: 20, failed: 25 },
  { time: "20:00", success: 32, pending: 18, failed: 22 },
  { time: "22:00", success: 26, pending: 13, failed: 16 },
];

const merchantTransactions = [
  {
    "PAYMENT_TXN_ID": "748000001287",
    "AMOUNT": "₹500",
    "MERCHANT_TXN_ID": "175439054886587..",
    "PG_TXN_ID": "1932106405",
  },
  {
    "PAYMENT_TXN_ID": "748000001287",
    "AMOUNT": "₹500",
    "MERCHANT_TXN_ID": "175439054286863..",
    "PG_TXN_ID": "1932106575",
  },
  {
    "PAYMENT_TXN_ID": "745598073577",
    "AMOUNT": "₹500",
    "MERCHANT_TXN_ID": "175439044085651..",
    "PG_TXN_ID": "2243522470",
  },
  {
    "PAYMENT_TXN_ID": "748000001287",
    "AMOUNT": "₹400",
    "MERCHANT_TXN_ID": "175439044008883..",
    "PG_TXN_ID": "1932106206",
  },
  {
    "PAYMENT_TXN_ID": "728019403765",
    "AMOUNT": "₹5000",
    "MERCHANT_TXN_ID": "175439044623E19..",
    "PG_TXN_ID": "019870841-E",
  },
  {
    "PAYMENT_TXN_ID": "748000001287",
    "AMOUNT": "₹2000",
    "MERCHANT_TXN_ID": "175439044439CE7..",
    "PG_TXN_ID": "1932106144",
  },
];

const pgWiseMerchants = [
  {
    "PAYMENT_TXN_ID": "748000001287",
    "AMOUNT": "₹500",
    "MERCHANT_TXN_ID": "175439054886587..",
    "PG_TXN_ID": "1932106405",
  },
  {
    "PAYMENT_TXN_ID": "748000001287",
    "AMOUNT": "₹500",
    "MERCHANT_TXN_ID": "175439054286863..",
    "PG_TXN_ID": "1932106575",
  },
  {
    "PAYMENT_TXN_ID": "745598073577",
    "AMOUNT": "₹500",
    "MERCHANT_TXN_ID": "175439044085651..",
    "PG_TXN_ID": "2243522470",
  },
];

const merchantColumns = [
  { key: "PAYMENT_TXN_ID", label: "PAYMENT_TXN_ID", sortable: true },
  { key: "AMOUNT", label: "AMOUNT", sortable: true },
  { key: "MERCHANT_TXN_ID", label: "MERCHANT_TXN_ID", sortable: false },
  { key: "PG_TXN_ID", label: "PG_TXN_ID", sortable: true },
];

export default function Index() {
  const { stats, chartData, recentTransactions, isConnected, circularChartValue } = useRealTimeData();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadDashboardReport = async () => {
    setIsDownloading(true);
    try {
      const reportData = {
        title: 'AIRpay Dashboard Report',
        dateRange: {
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          to: new Date().toISOString()
        },
        summary: {
          totalTransactions: stats.success.count + stats.pending.count + stats.failed.count,
          totalVolume: parseFloat(stats.success.amount.replace(/[₹,]/g, '')) +
                      parseFloat(stats.pending.amount.replace(/[₹,]/g, '')) +
                      parseFloat(stats.failed.amount.replace(/[₹,]/g, '')),
          successRate: parseFloat(stats.success.percentage.replace('%', '')),
          totalFees: 12450.75
        },
        transactions: recentTransactions.slice(0, 20).map(txn => ({
          id: txn.id,
          merchantId: txn.merchantId,
          merchantName: 'Sample Merchant',
          amount: parseFloat(txn.amount.replace(/[₹,]/g, '')),
          currency: 'INR',
          status: txn.status as 'success' | 'pending' | 'failed',
          method: 'UPI',
          timestamp: txn.timestamp,
          fee: parseFloat(txn.amount.replace(/[₹,]/g, '')) * 0.02,
          netAmount: parseFloat(txn.amount.replace(/[₹,]/g, '')) * 0.98,
          gateway: 'AIRpay',
          reference: txn.pgTxnId
        }))
      };

      await downloadTransactionReport(reportData, `airpay-dashboard-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error downloading report:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-in fade-in-0 slide-in-from-left-2 duration-500">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h2>
              <div className="flex items-center gap-1">
                {isConnected ? (
                  <Wifi className="w-4 h-4 text-success animate-pulse" />
                ) : (
                  <WifiOff className="w-4 h-4 text-failed" />
                )}
                <span className="text-xs text-muted-foreground">
                  {isConnected ? "Live" : "Offline"}
                </span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Real-time overview of your payment gateway performance
            </p>
          </div>
          <div className="flex items-center gap-2 animate-in fade-in-0 slide-in-from-right-2 duration-500 delay-200">
            <Button
              onClick={handleDownloadDashboardReport}
              disabled={isDownloading}
              size="sm"
              className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white transition-all duration-300 hover:scale-105"
            >
              {isDownloading ? (
                <FileText className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download Report
            </Button>
            <Badge variant="outline" className="bg-success text-success-foreground text-xs transition-transform duration-200 hover:scale-105">
              Payin Report
            </Badge>
            <Badge variant="outline" className="bg-failed text-failed-foreground text-xs transition-transform duration-200 hover:scale-105">
              Payout Report
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <ResponsiveGrid cols={{ default: 1, sm: 2, lg: 3 }} className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300">
          <StatsCard
            title="SUCCESS"
            amount={stats.success.amount}
            count={stats.success.count}
            percentage={stats.success.percentage}
            type="success"
            className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-500"
          />
          <StatsCard
            title="PENDING"
            amount={stats.pending.amount}
            count={stats.pending.count}
            percentage={stats.pending.percentage}
            type="pending"
            className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-700"
          />
          <StatsCard
            title="FAILED"
            amount={stats.failed.amount}
            count={stats.failed.count}
            percentage={stats.failed.percentage}
            type="failed"
            className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-900"
          />
        </ResponsiveGrid>

        {/* Charts Section */}
        <Section title="Performance Analytics" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-1000">
          <ResponsiveGrid cols={{ default: 1, lg: 2 }}>
            <CircularChart
              title="Today Amount of Transactions"
              value={circularChartValue}
              total={100}
              className="animate-in fade-in-0 slide-in-from-left-4 duration-500 delay-1200"
            />
            <LineChart
              title="Real-time Transaction Report (Live Updates)"
              data={chartData}
              className="animate-in fade-in-0 slide-in-from-right-4 duration-500 delay-1400"
            />
          </ResponsiveGrid>
        </Section>

        {/* Tables Section */}
        <Section title="Transaction Data" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-1500">
          <ResponsiveGrid cols={{ default: 1, xl: 2 }}>
            <DataTable
              title="Recent Live Transactions"
              data={recentTransactions.map(txn => ({
                "PAYMENT_TXN_ID": txn.id,
                "AMOUNT": txn.amount,
                "MERCHANT_TXN_ID": txn.merchantId,
                "PG_TXN_ID": txn.pgTxnId,
                "STATUS": txn.status.toUpperCase(),
                "TIME": new Date(txn.timestamp).toLocaleTimeString(),
              }))}
              columns={[
                ...merchantColumns,
                { key: "STATUS", label: "STATUS", sortable: true },
                { key: "TIME", label: "TIME", sortable: true },
              ]}
              className="animate-in fade-in-0 slide-in-from-left-4 duration-500 delay-1700"
            />
            <DataTable
              title="PG Wise Merchant List"
              data={pgWiseMerchants}
              columns={merchantColumns}
              className="animate-in fade-in-0 slide-in-from-right-4 duration-500 delay-1900"
            />
          </ResponsiveGrid>
        </Section>
      </div>
    </DashboardLayout>
  );
}
