import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { WalletForm, WalletProvider } from "@/components/WalletForm";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Play,
  Pause,
  Wallet,
  CreditCard,
  TrendingUp,
  Percent,
  TestTube,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockWalletProviders: WalletProvider[] = [
  {
    id: "W001",
    providerName: "PayTM",
    walletType: "digital_wallet",
    apiEndpoint: "https://securegw.paytm.in/v3/order/pay",
    merchantId: "PAYTM_MERCHANT_001",
    apiKey: "PAYTM_API_KEY_001",
    secretKey: "PAYTM_SECRET_001",
    status: "active",
    isLive: true,
    priority: 1,
    supportedCurrencies: ["INR"],
    transactionLimits: {
      minAmount: 1,
      maxAmount: 200000,
      dailyLimit: 1000000,
      monthlyLimit: 30000000,
    },
    fees: {
      transactionFee: 2.5,
      settlementFee: 5,
      isPercentage: true,
    },
    settlementConfig: {
      settlementTime: "24_hours",
      settlementCycle: "daily",
      autoSettlement: true,
    },
    features: {
      refundSupport: true,
      partialRefund: true,
      instantRefund: false,
      recurringPayments: true,
      webhookSupport: true,
    },
    testCredentials: {
      testMerchantId: "PAYTM_TEST_001",
      testApiKey: "PAYTM_TEST_API",
      testSecretKey: "PAYTM_TEST_SECRET",
    },
    createdAt: "2024-01-10",
    lastUsed: "2024-01-20 14:30:00",
    totalTransactions: 2845,
    totalVolume: 12500000,
    successRate: 94.5,
  },
  {
    id: "W002",
    providerName: "PhonePe",
    walletType: "upi",
    apiEndpoint: "https://api.phonepe.com/apis/hermes",
    merchantId: "PHONEPE_MERCHANT_002",
    apiKey: "PHONEPE_API_KEY_002",
    secretKey: "PHONEPE_SECRET_002",
    status: "active",
    isLive: true,
    priority: 2,
    supportedCurrencies: ["INR"],
    transactionLimits: {
      minAmount: 1,
      maxAmount: 100000,
      dailyLimit: 800000,
      monthlyLimit: 25000000,
    },
    fees: {
      transactionFee: 1.8,
      settlementFee: 3,
      isPercentage: true,
    },
    settlementConfig: {
      settlementTime: "1_hour",
      settlementCycle: "daily",
      autoSettlement: true,
    },
    features: {
      refundSupport: true,
      partialRefund: false,
      instantRefund: true,
      recurringPayments: false,
      webhookSupport: true,
    },
    testCredentials: {
      testMerchantId: "PHONEPE_TEST_002",
      testApiKey: "PHONEPE_TEST_API",
      testSecretKey: "PHONEPE_TEST_SECRET",
    },
    createdAt: "2024-01-12",
    lastUsed: "2024-01-20 11:15:00",
    totalTransactions: 1856,
    totalVolume: 8200000,
    successRate: 97.2,
  },
  {
    id: "W003",
    providerName: "Google Pay",
    walletType: "upi",
    apiEndpoint: "https://pay.google.com/gp/v/merchant/api",
    merchantId: "GPAY_MERCHANT_003",
    apiKey: "GPAY_API_KEY_003",
    secretKey: "GPAY_SECRET_003",
    status: "testing",
    isLive: false,
    priority: 3,
    supportedCurrencies: ["INR", "USD"],
    transactionLimits: {
      minAmount: 1,
      maxAmount: 150000,
      dailyLimit: 600000,
      monthlyLimit: 18000000,
    },
    fees: {
      transactionFee: 2.0,
      settlementFee: 4,
      isPercentage: true,
    },
    settlementConfig: {
      settlementTime: "24_hours",
      settlementCycle: "weekly",
      autoSettlement: false,
    },
    features: {
      refundSupport: true,
      partialRefund: true,
      instantRefund: false,
      recurringPayments: true,
      webhookSupport: true,
    },
    testCredentials: {
      testMerchantId: "GPAY_TEST_003",
      testApiKey: "GPAY_TEST_API",
      testSecretKey: "GPAY_TEST_SECRET",
    },
    createdAt: "2024-01-18",
    lastUsed: "-",
    totalTransactions: 0,
    totalVolume: 0,
    successRate: 0,
  },
  {
    id: "W004",
    providerName: "Crypto Wallet",
    walletType: "crypto",
    apiEndpoint: "https://api.cryptowallet.com/v1",
    merchantId: "CRYPTO_MERCHANT_004",
    apiKey: "CRYPTO_API_KEY_004",
    secretKey: "CRYPTO_SECRET_004",
    status: "suspended",
    isLive: false,
    priority: 4,
    supportedCurrencies: ["BTC", "ETH", "USDT"],
    transactionLimits: {
      minAmount: 10,
      maxAmount: 500000,
      dailyLimit: 2000000,
      monthlyLimit: 60000000,
    },
    fees: {
      transactionFee: 0.5,
      settlementFee: 10,
      isPercentage: true,
    },
    settlementConfig: {
      settlementTime: "immediate",
      settlementCycle: "manual",
      autoSettlement: false,
    },
    features: {
      refundSupport: false,
      partialRefund: false,
      instantRefund: false,
      recurringPayments: false,
      webhookSupport: true,
    },
    testCredentials: {
      testMerchantId: "CRYPTO_TEST_004",
      testApiKey: "CRYPTO_TEST_API",
      testSecretKey: "CRYPTO_TEST_SECRET",
    },
    createdAt: "2024-01-05",
    lastUsed: "2024-01-10 16:45:00",
    totalTransactions: 134,
    totalVolume: 2800000,
    successRate: 89.5,
  },
];

export default function WalletList() {
  const [walletProviders, setWalletProviders] = useState<WalletProvider[]>(mockWalletProviders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState<WalletProvider | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState<string | null>(null);

  // Filter and search logic
  const filteredWallets = useMemo(() => {
    return walletProviders.filter((wallet) => {
      const matchesSearch = 
        wallet.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wallet.merchantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wallet.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || wallet.status === statusFilter;
      const matchesType = typeFilter === "all" || wallet.walletType === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [walletProviders, searchTerm, statusFilter, typeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = walletProviders.length;
    const active = walletProviders.filter(w => w.status === "active").length;
    const testing = walletProviders.filter(w => w.status === "testing").length;
    const suspended = walletProviders.filter(w => w.status === "suspended").length;
    const totalVolume = walletProviders.reduce((sum, w) => sum + w.totalVolume, 0);
    const avgSuccessRate = walletProviders.length > 0 
      ? walletProviders.reduce((sum, w) => sum + w.successRate, 0) / walletProviders.length 
      : 0;
    
    return { total, active, testing, suspended, totalVolume, avgSuccessRate };
  }, [walletProviders]);

  const handleAddWallet = () => {
    setEditingWallet(undefined);
    setIsFormOpen(true);
  };

  const handleEditWallet = (wallet: WalletProvider) => {
    setEditingWallet(wallet);
    setIsFormOpen(true);
  };

  const handleSaveWallet = (walletData: Omit<WalletProvider, "id" | "createdAt" | "lastUsed" | "totalTransactions" | "totalVolume" | "successRate">) => {
    if (editingWallet) {
      // Update existing wallet
      setWalletProviders(prev => prev.map(w => 
        w.id === editingWallet.id 
          ? { ...w, ...walletData }
          : w
      ));
    } else {
      // Add new wallet
      const newWallet: WalletProvider = {
        ...walletData,
        id: `W${String(walletProviders.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString().split('T')[0],
        lastUsed: "-",
        totalTransactions: 0,
        totalVolume: 0,
        successRate: 0,
      };
      setWalletProviders(prev => [...prev, newWallet]);
    }
  };

  const handleDeleteWallet = (walletId: string) => {
    setWalletToDelete(walletId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (walletToDelete) {
      setWalletProviders(prev => prev.filter(w => w.id !== walletToDelete));
      setWalletToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const walletTypes = [...new Set(walletProviders.map(w => w.walletType))];

  const getWalletTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      digital_wallet: "Digital Wallet",
      upi: "UPI Provider",
      crypto: "Cryptocurrency",
      prepaid_card: "Prepaid Card",
    };
    return labels[type] || type;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-in fade-in-0 slide-in-from-left-2 duration-500">
            <h2 className="text-2xl font-bold tracking-tight">Wallet Providers</h2>
            <p className="text-muted-foreground">
              Manage digital wallet integrations and payment providers
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleAddWallet}>
              <Plus className="w-4 h-4 mr-2" />
              Add Provider
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Providers</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Wallet className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-success">{stats.active}</p>
                </div>
                <Activity className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Testing</p>
                  <p className="text-2xl font-bold text-pending">{stats.testing}</p>
                </div>
                <TestTube className="w-8 h-8 text-pending" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Suspended</p>
                  <p className="text-2xl font-bold text-failed">{stats.suspended}</p>
                </div>
                <Pause className="w-8 h-8 text-failed" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                  <p className="text-lg font-bold">{formatCurrency(stats.totalVolume)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Success Rate</p>
                  <p className="text-lg font-bold">{stats.avgSuccessRate.toFixed(1)}%</p>
                </div>
                <Percent className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search providers by name, merchant ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {walletTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getWalletTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Providers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet Providers ({filteredWallets.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider ID</TableHead>
                    <TableHead>Provider Details</TableHead>
                    <TableHead>Type & Environment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Transaction Limits</TableHead>
                    <TableHead>Fees</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWallets.map((wallet) => (
                    <TableRow 
                      key={wallet.id} 
                      className="transition-colors duration-200 hover:bg-muted/50"
                    >
                      <TableCell className="font-mono">{wallet.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{wallet.providerName}</p>
                          <p className="text-sm text-muted-foreground font-mono">
                            {wallet.merchantId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant="outline">
                            {getWalletTypeLabel(wallet.walletType)}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Badge 
                              variant={wallet.isLive ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {wallet.isLive ? "Live" : "Test"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">P{wallet.priority}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusIndicator 
                          status={wallet.status === "active" ? "success" : 
                                 wallet.status === "testing" ? "pending" : "failed"} 
                          size="sm"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">Min: {formatCurrency(wallet.transactionLimits.minAmount)}</p>
                          <p className="text-sm">Max: {formatCurrency(wallet.transactionLimits.maxAmount)}</p>
                          <p className="text-sm text-muted-foreground">
                            Daily: {formatCurrency(wallet.transactionLimits.dailyLimit)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            Txn: {wallet.fees.transactionFee}{wallet.fees.isPercentage ? '%' : '₹'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Settlement: {wallet.fees.settlementFee}{wallet.fees.isPercentage ? '%' : '₹'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatCurrency(wallet.totalVolume)}</p>
                          <p className="text-sm text-muted-foreground">{wallet.totalTransactions} txns</p>
                          <div className="flex items-center gap-1 mt-1">
                            <div className="w-2 h-2 rounded-full bg-success" />
                            <span className="text-xs">{wallet.successRate}%</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {wallet.features.refundSupport && (
                            <Badge variant="secondary" className="text-xs">Refund</Badge>
                          )}
                          {wallet.features.instantRefund && (
                            <Badge variant="secondary" className="text-xs">Instant</Badge>
                          )}
                          {wallet.features.recurringPayments && (
                            <Badge variant="secondary" className="text-xs">Recurring</Badge>
                          )}
                          {wallet.features.webhookSupport && (
                            <Badge variant="secondary" className="text-xs">Webhook</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditWallet(wallet)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Configuration
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Transactions
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <TestTube className="mr-2 h-4 w-4" />
                              Test Connection
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {wallet.status === "active" ? (
                                <>
                                  <Pause className="mr-2 h-4 w-4" />
                                  Suspend Provider
                                </>
                              ) : (
                                <>
                                  <Play className="mr-2 h-4 w-4" />
                                  Activate Provider
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteWallet(wallet.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove Provider
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Form Dialog */}
      <WalletForm
        wallet={editingWallet}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveWallet}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the wallet
              provider and all associated configurations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Remove Provider
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
