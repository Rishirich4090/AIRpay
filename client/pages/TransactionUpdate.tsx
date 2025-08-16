import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatusIndicator } from "@/components/StatusIndicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Edit,
  RefreshCw,
  CheckSquare,
  XSquare,
  ArrowUpDown,
  CreditCard,
  AlertCircle,
  DollarSign,
  Clock,
  User,
  Building,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Transaction {
  id: string;
  merchantId: string;
  merchantName: string;
  amount: number;
  currency: string;
  status: "pending" | "processing" | "success" | "failed" | "cancelled" | "refunded";
  paymentMethod: string;
  pgProvider: string;
  pgTransactionId: string;
  customerEmail: string;
  customerPhone: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  failureReason?: string;
  refundAmount?: number;
  canRefund: boolean;
  canRetry: boolean;
}

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "TXN001234567",
    merchantId: "M001",
    merchantName: "TechShop Online",
    amount: 2500,
    currency: "INR",
    status: "failed",
    paymentMethod: "UPI",
    pgProvider: "PayTM",
    pgTransactionId: "PAYTM_TXN_001234",
    customerEmail: "customer@example.com",
    customerPhone: "+91 9876543210",
    description: "Online Purchase - Electronics",
    createdAt: "2024-01-20 14:30:00",
    updatedAt: "2024-01-20 14:32:00",
    failureReason: "Insufficient balance",
    canRefund: false,
    canRetry: true,
  },
  {
    id: "TXN001234568",
    merchantId: "M002",
    merchantName: "Food Delivery Co",
    amount: 850,
    currency: "INR",
    status: "success",
    paymentMethod: "Credit Card",
    pgProvider: "HDFC",
    pgTransactionId: "HDFC_TXN_002456",
    customerEmail: "user@foodie.com",
    customerPhone: "+91 9876543211",
    description: "Food Order #FR12345",
    createdAt: "2024-01-20 13:45:00",
    updatedAt: "2024-01-20 13:46:00",
    canRefund: true,
    canRetry: false,
  },
  {
    id: "TXN001234569",
    merchantId: "M001",
    merchantName: "TechShop Online",
    amount: 15000,
    currency: "INR",
    status: "pending",
    paymentMethod: "Net Banking",
    pgProvider: "PhonePe",
    pgTransactionId: "PHONEPE_TXN_003789",
    customerEmail: "premium@customer.com",
    customerPhone: "+91 9876543212",
    description: "Premium Product Purchase",
    createdAt: "2024-01-20 15:00:00",
    updatedAt: "2024-01-20 15:00:00",
    canRefund: false,
    canRetry: true,
  },
  {
    id: "TXN001234570",
    merchantId: "M003",
    merchantName: "Digital Learning Hub",
    amount: 5999,
    currency: "INR",
    status: "processing",
    paymentMethod: "Wallet",
    pgProvider: "GooglePay",
    pgTransactionId: "GPAY_TXN_004123",
    customerEmail: "student@learn.com",
    customerPhone: "+91 9876543213",
    description: "Course Enrollment Fee",
    createdAt: "2024-01-20 16:15:00",
    updatedAt: "2024-01-20 16:16:00",
    canRefund: false,
    canRetry: false,
  },
  {
    id: "TXN001234571",
    merchantId: "M002",
    merchantName: "Food Delivery Co",
    amount: 1200,
    currency: "INR",
    status: "refunded",
    paymentMethod: "UPI",
    pgProvider: "PayTM",
    pgTransactionId: "PAYTM_TXN_005678",
    customerEmail: "refund@customer.com",
    customerPhone: "+91 9876543214",
    description: "Order Cancelled - Refund",
    createdAt: "2024-01-19 12:30:00",
    updatedAt: "2024-01-20 10:00:00",
    refundAmount: 1200,
    canRefund: false,
    canRetry: false,
  },
];

export default function TransactionUpdate() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pgFilter, setPgFilter] = useState<string>("all");
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [updatingTransaction, setUpdatingTransaction] = useState<Transaction | null>(null);
  const [updateReason, setUpdateReason] = useState("");
  const [refundAmount, setRefundAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Filter and search logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesSearch = 
        txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.merchantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.pgTransactionId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
      const matchesPg = pgFilter === "all" || txn.pgProvider === pgFilter;
      
      return matchesSearch && matchesStatus && matchesPg;
    });
  }, [transactions, searchTerm, statusFilter, pgFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = transactions.length;
    const pending = transactions.filter(t => t.status === "pending").length;
    const processing = transactions.filter(t => t.status === "processing").length;
    const failed = transactions.filter(t => t.status === "failed").length;
    const needsAction = transactions.filter(t => 
      t.status === "failed" || t.status === "pending"
    ).length;
    
    return { total, pending, processing, failed, needsAction };
  }, [transactions]);

  const handleUpdateStatus = (transaction: Transaction, newStatus: string) => {
    setUpdatingTransaction(transaction);
    setIsUpdateDialogOpen(true);
  };

  const handleRefund = (transaction: Transaction) => {
    setUpdatingTransaction(transaction);
    setRefundAmount(transaction.amount.toString());
    setIsRefundDialogOpen(true);
  };

  const confirmUpdate = async () => {
    if (!updatingTransaction) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setTransactions(prev => prev.map(txn => 
      txn.id === updatingTransaction.id 
        ? { ...txn, status: "success" as any, updatedAt: new Date().toISOString() }
        : txn
    ));
    
    setIsLoading(false);
    setIsUpdateDialogOpen(false);
    setUpdatingTransaction(null);
    setUpdateReason("");
  };

  const confirmRefund = async () => {
    if (!updatingTransaction) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setTransactions(prev => prev.map(txn => 
      txn.id === updatingTransaction.id 
        ? { 
            ...txn, 
            status: "refunded" as any, 
            refundAmount: Number(refundAmount),
            updatedAt: new Date().toISOString(),
            canRefund: false
          }
        : txn
    ));
    
    setIsLoading(false);
    setIsRefundDialogOpen(false);
    setUpdatingTransaction(null);
    setRefundAmount("");
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk ${action} for transactions:`, selectedTransactions);
    // Implement bulk actions
  };

  const toggleTransactionSelection = (txnId: string) => {
    setSelectedTransactions(prev => 
      prev.includes(txnId) 
        ? prev.filter(id => id !== txnId)
        : [...prev, txnId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedTransactions.length === filteredTransactions.length) {
      setSelectedTransactions([]);
    } else {
      setSelectedTransactions(filteredTransactions.map(txn => txn.id));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const pgProviders = [...new Set(transactions.map(t => t.pgProvider))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "success";
      case "pending": 
      case "processing": return "pending";
      case "failed": 
      case "cancelled": return "failed";
      default: return "pending";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-in fade-in-0 slide-in-from-left-2 duration-500">
            <h2 className="text-2xl font-bold tracking-tight">Transaction Update</h2>
            <p className="text-muted-foreground">
              Monitor and update transaction statuses, process refunds and handle failures
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <CreditCard className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-pending">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-pending" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Processing</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
                </div>
                <RefreshCw className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Failed</p>
                  <p className="text-2xl font-bold text-failed">{stats.failed}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-failed" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Needs Action</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.needsAction}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-orange-600" />
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
                  placeholder="Search by transaction ID, merchant, email, or PG transaction ID..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={pgFilter} onValueChange={setPgFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by PG" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  {pgProviders.map((pg) => (
                    <SelectItem key={pg} value={pg}>
                      {pg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedTransactions.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {selectedTransactions.length} selected
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction("retry")}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retry Selected
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkAction("cancel")}>
                    <XSquare className="w-4 h-4 mr-2" />
                    Cancel Selected
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedTransactions.length === filteredTransactions.length}
                        onCheckedChange={toggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>PG Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow 
                      key={transaction.id} 
                      className="transition-colors duration-200 hover:bg-muted/50"
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedTransactions.includes(transaction.id)}
                          onCheckedChange={() => toggleTransactionSelection(transaction.id)}
                        />
                      </TableCell>
                      <TableCell className="font-mono text-sm">{transaction.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{transaction.merchantName}</p>
                          <p className="text-sm text-muted-foreground">{transaction.merchantId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                          <p className="text-sm text-muted-foreground">{transaction.currency}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{transaction.customerEmail}</p>
                          <p className="text-sm text-muted-foreground">{transaction.customerPhone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{transaction.pgProvider}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {transaction.pgTransactionId}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusIndicator 
                          status={getStatusColor(transaction.status) as "success" | "pending" | "failed"} 
                          size="sm"
                        />
                        {transaction.failureReason && (
                          <p className="text-xs text-failed mt-1">{transaction.failureReason}</p>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(transaction.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {transaction.status === "failed" && transaction.canRetry && (
                              <DropdownMenuItem onClick={() => handleUpdateStatus(transaction, "retry")}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Retry Transaction
                              </DropdownMenuItem>
                            )}
                            {transaction.status === "pending" && (
                              <>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(transaction, "success")}>
                                  <CheckSquare className="mr-2 h-4 w-4" />
                                  Mark as Success
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(transaction, "failed")}>
                                  <XSquare className="mr-2 h-4 w-4" />
                                  Mark as Failed
                                </DropdownMenuItem>
                              </>
                            )}
                            {transaction.canRefund && (
                              <DropdownMenuItem onClick={() => handleRefund(transaction)}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Process Refund
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              View Details
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

      {/* Update Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Transaction Status</DialogTitle>
            <DialogDescription>
              Update the status of transaction {updatingTransaction?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Reason for update</Label>
              <Textarea
                id="reason"
                value={updateReason}
                onChange={(e) => setUpdateReason(e.target.value)}
                placeholder="Enter reason for status update..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUpdate} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Dialog */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>
              Process refund for transaction {updatingTransaction?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="refundAmount">Refund Amount</Label>
              <Input
                id="refundAmount"
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="Enter refund amount"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Original amount: {updatingTransaction && formatCurrency(updatingTransaction.amount)}
              </p>
            </div>
            <div>
              <Label htmlFor="refundReason">Refund Reason</Label>
              <Textarea
                id="refundReason"
                value={updateReason}
                onChange={(e) => setUpdateReason(e.target.value)}
                placeholder="Enter reason for refund..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRefundDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRefund} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing Refund...
                </>
              ) : (
                "Process Refund"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
