import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { BankForm, BankAccount } from "@/components/BankForm";
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
  Star,
  Building2,
  CreditCard,
  TrendingUp,
  IndianRupee,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockBankAccounts: BankAccount[] = [
  {
    id: "B001",
    bankName: "HDFC Bank",
    accountNumber: "50100123456789",
    accountType: "current",
    ifscCode: "HDFC0001234",
    branchName: "Commercial Street Branch",
    branchAddress: "123 Commercial Street, Bangalore, Karnataka 560001",
    accountHolderName: "Glidexpay Technologies Pvt Ltd",
    status: "active",
    priority: 1,
    isDefault: true,
    dailyLimit: 2000000,
    monthlyLimit: 60000000,
    currency: "INR",
    settlementTime: "24_hours",
    charges: {
      transactionFee: 2.5,
      settlementFee: 5,
      isPercentage: true,
    },
    createdAt: "2024-01-10",
    lastUsed: "2024-01-20 14:30:00",
    totalTransactions: 1250,
    totalVolume: 45000000,
    availableBalance: 2500000,
  },
  {
    id: "B002",
    bankName: "ICICI Bank",
    accountNumber: "159801234567890",
    accountType: "current",
    ifscCode: "ICIC0001598",
    branchName: "MG Road Branch",
    branchAddress: "456 MG Road, Mumbai, Maharashtra 400001",
    accountHolderName: "Glidexpay Technologies Pvt Ltd",
    status: "active",
    priority: 2,
    isDefault: false,
    dailyLimit: 1500000,
    monthlyLimit: 45000000,
    currency: "INR",
    settlementTime: "1_hour",
    charges: {
      transactionFee: 2.8,
      settlementFee: 8,
      isPercentage: true,
    },
    createdAt: "2024-01-15",
    lastUsed: "2024-01-19 11:45:00",
    totalTransactions: 856,
    totalVolume: 28000000,
    availableBalance: 1800000,
  },
  {
    id: "B003",
    bankName: "State Bank of India",
    accountNumber: "30123456789012",
    accountType: "savings",
    ifscCode: "SBIN0001234",
    branchName: "Corporate Branch",
    branchAddress: "789 Corporate Plaza, Delhi 110001",
    accountHolderName: "Glidexpay Technologies Pvt Ltd",
    status: "pending_verification",
    priority: 3,
    isDefault: false,
    dailyLimit: 1000000,
    monthlyLimit: 30000000,
    currency: "INR",
    settlementTime: "manual",
    charges: {
      transactionFee: 15,
      settlementFee: 25,
      isPercentage: false,
    },
    createdAt: "2024-01-18",
    lastUsed: "-",
    totalTransactions: 0,
    totalVolume: 0,
    availableBalance: 500000,
  },
  {
    id: "B004",
    bankName: "Axis Bank",
    accountNumber: "911010123456789",
    accountType: "current",
    ifscCode: "UTIB0001234",
    branchName: "Business Banking Branch",
    branchAddress: "321 Business District, Chennai 600001",
    accountHolderName: "Glidexpay Technologies Pvt Ltd",
    status: "suspended",
    priority: 4,
    isDefault: false,
    dailyLimit: 1200000,
    monthlyLimit: 36000000,
    currency: "INR",
    settlementTime: "24_hours",
    charges: {
      transactionFee: 2.2,
      settlementFee: 6,
      isPercentage: true,
    },
    createdAt: "2024-01-05",
    lastUsed: "2024-01-12 09:20:00",
    totalTransactions: 234,
    totalVolume: 8500000,
    availableBalance: 750000,
  },
];

export default function BankList() {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [bankFilter, setBankFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<BankAccount | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bankToDelete, setBankToDelete] = useState<string | null>(null);

  // Filter and search logic
  const filteredBanks = useMemo(() => {
    return bankAccounts.filter((bank) => {
      const matchesSearch = 
        bank.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.ifscCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bank.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || bank.status === statusFilter;
      const matchesBank = bankFilter === "all" || bank.bankName === bankFilter;
      
      return matchesSearch && matchesStatus && matchesBank;
    });
  }, [bankAccounts, searchTerm, statusFilter, bankFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = bankAccounts.length;
    const active = bankAccounts.filter(b => b.status === "active").length;
    const pending = bankAccounts.filter(b => b.status === "pending_verification").length;
    const suspended = bankAccounts.filter(b => b.status === "suspended").length;
    const totalBalance = bankAccounts.reduce((sum, b) => sum + b.availableBalance, 0);
    const totalVolume = bankAccounts.reduce((sum, b) => sum + b.totalVolume, 0);
    
    return { total, active, pending, suspended, totalBalance, totalVolume };
  }, [bankAccounts]);

  const handleAddBank = () => {
    setEditingBank(undefined);
    setIsFormOpen(true);
  };

  const handleEditBank = (bank: BankAccount) => {
    setEditingBank(bank);
    setIsFormOpen(true);
  };

  const handleSaveBank = (bankData: Omit<BankAccount, "id" | "createdAt" | "lastUsed" | "totalTransactions" | "totalVolume" | "availableBalance">) => {
    if (editingBank) {
      // Update existing bank
      setBankAccounts(prev => prev.map(b => 
        b.id === editingBank.id 
          ? { ...b, ...bankData }
          : b
      ));
    } else {
      // Add new bank
      const newBank: BankAccount = {
        ...bankData,
        id: `B${String(bankAccounts.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString().split('T')[0],
        lastUsed: "-",
        totalTransactions: 0,
        totalVolume: 0,
        availableBalance: Math.floor(Math.random() * 1000000) + 100000,
      };
      setBankAccounts(prev => [...prev, newBank]);
    }
  };

  const handleDeleteBank = (bankId: string) => {
    setBankToDelete(bankId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (bankToDelete) {
      setBankAccounts(prev => prev.filter(b => b.id !== bankToDelete));
      setBankToDelete(null);
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

  const bankNames = [...new Set(bankAccounts.map(b => b.bankName))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-in fade-in-0 slide-in-from-left-2 duration-500">
            <h2 className="text-2xl font-bold tracking-tight">Bank Accounts</h2>
            <p className="text-muted-foreground">
              Manage bank accounts for payment settlements and transactions
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button onClick={handleAddBank}>
              <Plus className="w-4 h-4 mr-2" />
              Add Bank Account
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Accounts</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Building2 className="w-8 h-8 text-blue-500" />
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
                <CreditCard className="w-8 h-8 text-success" />
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
                  <p className="text-sm font-medium text-muted-foreground">Suspended</p>
                  <p className="text-2xl font-bold text-failed">{stats.suspended}</p>
                </div>
                <Building2 className="w-8 h-8 text-failed" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                  <p className="text-lg font-bold">{formatCurrency(stats.totalBalance)}</p>
                </div>
                <IndianRupee className="w-8 h-8 text-green-500" />
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
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by bank name, account number, or IFSC..."
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
                  <SelectItem value="pending_verification">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={bankFilter} onValueChange={setBankFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Banks</SelectItem>
                  {bankNames.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bank Accounts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Bank Accounts ({filteredBanks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account ID</TableHead>
                    <TableHead>Bank Details</TableHead>
                    <TableHead>Account Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Limits</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Settlement</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBanks.map((bank) => (
                    <TableRow 
                      key={bank.id} 
                      className="transition-colors duration-200 hover:bg-muted/50"
                    >
                      <TableCell className="font-mono">{bank.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-medium">{bank.bankName}</p>
                            <p className="text-sm text-muted-foreground">{bank.branchName}</p>
                          </div>
                          {bank.isDefault && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-mono text-sm">****{bank.accountNumber.slice(-4)}</p>
                          <p className="text-sm text-muted-foreground">{bank.ifscCode}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {bank.accountType.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusIndicator 
                          status={bank.status === "active" ? "success" : 
                                 bank.status === "pending_verification" ? "pending" : "failed"} 
                          size="sm"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">Daily: {formatCurrency(bank.dailyLimit)}</p>
                          <p className="text-sm text-muted-foreground">Monthly: {formatCurrency(bank.monthlyLimit)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{formatCurrency(bank.availableBalance)}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm capitalize">{bank.settlementTime.replace('_', ' ')}</p>
                          <p className="text-sm text-muted-foreground">
                            Fee: {bank.charges.transactionFee}{bank.charges.isPercentage ? '%' : '₹'}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatCurrency(bank.totalVolume)}</p>
                          <p className="text-sm text-muted-foreground">{bank.totalTransactions} txns</p>
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
                            <DropdownMenuItem onClick={() => handleEditBank(bank)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Transactions
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Star className="mr-2 h-4 w-4" />
                              Set as Default
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteBank(bank.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove Account
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

      {/* Bank Form Dialog */}
      <BankForm
        bank={editingBank}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveBank}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the bank
              account and all associated settlement configurations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Remove Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
