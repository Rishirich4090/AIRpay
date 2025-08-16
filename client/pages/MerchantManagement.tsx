import { useState, useMemo } from "react";
import { DashboardLayout, ResponsiveGrid, ResponsiveCard, Section, MobileTable } from "@/components/DashboardLayout";
import { downloadMerchantReport, MerchantData } from "@/lib/pdf-utils";
import { MerchantForm, Merchant } from "@/components/MerchantForm";
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
  Key,
  FileText,
  Loader2,
  Users,
  CreditCard,
  TrendingUp,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data
const mockMerchants: Merchant[] = [
  {
    id: "M001",
    businessName: "TechShop Online",
    contactName: "John Doe",
    email: "john@techshop.com",
    phone: "+91 9876543210",
    address: "123 Tech Park, Electronic City",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560100",
    businessType: "E-commerce",
    status: "active",
    dailyLimit: 500000,
    monthlyLimit: 15000000,
    settlementType: "daily",
    apiKey: "API_tech_001",
    secretKey: "SEC_tech_001",
    webhookUrl: "https://techshop.com/webhook",
    createdAt: "2024-01-15",
    lastTransaction: "2024-01-20 14:30:00",
    totalTransactions: 1250,
    totalVolume: 8750000,
  },
  {
    id: "M002",
    businessName: "Food Delivery Co",
    contactName: "Sarah Smith",
    email: "sarah@fooddelivery.com",
    phone: "+91 9876543211",
    address: "456 Food Street, MG Road",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    businessType: "Food & Beverage",
    status: "active",
    dailyLimit: 300000,
    monthlyLimit: 9000000,
    settlementType: "weekly",
    apiKey: "API_food_002",
    secretKey: "SEC_food_002",
    webhookUrl: "https://fooddelivery.com/webhook",
    createdAt: "2024-01-10",
    lastTransaction: "2024-01-20 12:15:00",
    totalTransactions: 856,
    totalVolume: 4280000,
  },
  {
    id: "M003",
    businessName: "Digital Learning Hub",
    contactName: "Mike Johnson",
    email: "mike@digitallearning.com",
    phone: "+91 9876543212",
    address: "789 Education Lane, Sector 5",
    city: "Gurgaon",
    state: "Haryana",
    pincode: "122001",
    businessType: "Education",
    status: "pending",
    dailyLimit: 200000,
    monthlyLimit: 6000000,
    settlementType: "monthly",
    apiKey: "API_edu_003",
    secretKey: "SEC_edu_003",
    webhookUrl: "https://digitallearning.com/webhook",
    createdAt: "2024-01-18",
    lastTransaction: "2024-01-19 09:45:00",
    totalTransactions: 234,
    totalVolume: 1170000,
  },
  {
    id: "M004",
    businessName: "Healthcare Plus",
    contactName: "Dr. Emily Davis",
    email: "emily@healthcareplus.com",
    phone: "+91 9876543213",
    address: "321 Medical Center, Health City",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001",
    businessType: "Healthcare",
    status: "suspended",
    dailyLimit: 400000,
    monthlyLimit: 12000000,
    settlementType: "daily",
    apiKey: "API_health_004",
    secretKey: "SEC_health_004",
    webhookUrl: "https://healthcareplus.com/webhook",
    createdAt: "2024-01-05",
    lastTransaction: "2024-01-15 16:20:00",
    totalTransactions: 567,
    totalVolume: 2835000,
  },
];

export default function MerchantManagement() {
  const [merchants, setMerchants] = useState<Merchant[]>(mockMerchants);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [businessTypeFilter, setBusinessTypeFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [merchantToDelete, setMerchantToDelete] = useState<string | null>(null);

  // Filter and search logic
  const filteredMerchants = useMemo(() => {
    return merchants.filter((merchant) => {
      const matchesSearch = 
        merchant.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        merchant.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || merchant.status === statusFilter;
      const matchesBusinessType = businessTypeFilter === "all" || merchant.businessType === businessTypeFilter;
      
      return matchesSearch && matchesStatus && matchesBusinessType;
    });
  }, [merchants, searchTerm, statusFilter, businessTypeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = merchants.length;
    const active = merchants.filter(m => m.status === "active").length;
    const pending = merchants.filter(m => m.status === "pending").length;
    const suspended = merchants.filter(m => m.status === "suspended").length;
    const totalVolume = merchants.reduce((sum, m) => sum + m.totalVolume, 0);
    
    return { total, active, pending, suspended, totalVolume };
  }, [merchants]);

  const handleAddMerchant = () => {
    setEditingMerchant(undefined);
    setIsFormOpen(true);
  };

  const handleEditMerchant = (merchant: Merchant) => {
    setEditingMerchant(merchant);
    setIsFormOpen(true);
  };

  const handleSaveMerchant = (merchantData: Omit<Merchant, "id" | "createdAt" | "lastTransaction" | "totalTransactions" | "totalVolume">) => {
    if (editingMerchant) {
      // Update existing merchant
      setMerchants(prev => prev.map(m => 
        m.id === editingMerchant.id 
          ? { ...m, ...merchantData }
          : m
      ));
    } else {
      // Add new merchant
      const newMerchant: Merchant = {
        ...merchantData,
        id: `M${String(merchants.length + 1).padStart(3, '0')}`,
        createdAt: new Date().toISOString().split('T')[0],
        lastTransaction: "-",
        totalTransactions: 0,
        totalVolume: 0,
      };
      setMerchants(prev => [...prev, newMerchant]);
    }
  };

  const handleDeleteMerchant = (merchantId: string) => {
    setMerchantToDelete(merchantId);
    setDeleteDialogOpen(true);
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadMerchantPDF = async () => {
    setIsDownloading(true);
    try {
      const merchantData: MerchantData[] = filteredMerchants.map(merchant => ({
        id: merchant.id,
        name: merchant.businessName,
        email: merchant.email,
        phone: merchant.phone,
        status: merchant.status,
        totalTransactions: merchant.totalTransactions,
        totalVolume: merchant.totalVolume,
        successRate: 94.2, // Mock success rate
        joinDate: merchant.createdAt,
        lastTransaction: merchant.lastTransaction
      }));

      await downloadMerchantReport(merchantData, `airpay-merchants-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error downloading merchant PDF:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const confirmDelete = () => {
    if (merchantToDelete) {
      setMerchants(prev => prev.filter(m => m.id !== merchantToDelete));
      setMerchantToDelete(null);
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

  const businessTypes = [...new Set(merchants.map(m => m.businessType))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-in fade-in-0 slide-in-from-left-2 duration-500">
            <h2 className="text-2xl font-bold tracking-tight">Merchant Management</h2>
            <p className="text-muted-foreground">
              Manage merchant accounts, settings, and payment configurations
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isDownloading}>
                  {isDownloading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleDownloadMerchantPDF}>
                  <FileText className="w-4 h-4 mr-2" />
                  Download PDF Report
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="w-4 h-4 mr-2" />
                  Export Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleAddMerchant}>
              <Plus className="w-4 h-4 mr-2" />
              Add Merchant
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <Section title="Merchant Overview">
          <ResponsiveGrid cols={{ default: 1, sm: 2, md: 3, lg: 5 }}>
            <ResponsiveCard hover padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Merchants</p>
                  <p className="text-responsive-xl font-bold">{stats.total}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </ResponsiveCard>

            <ResponsiveCard hover padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-responsive-xs font-medium text-muted-foreground">Active</p>
                  <p className="text-responsive-xl font-bold text-success">{stats.active}</p>
                </div>
                <Building className="w-8 h-8 text-success" />
              </div>
            </ResponsiveCard>

            <ResponsiveCard hover padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-responsive-xs font-medium text-muted-foreground">Pending</p>
                  <p className="text-responsive-xl font-bold text-pending">{stats.pending}</p>
                </div>
                <CreditCard className="w-8 h-8 text-pending" />
              </div>
            </ResponsiveCard>

            <ResponsiveCard hover padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-responsive-xs font-medium text-muted-foreground">Suspended</p>
                  <p className="text-responsive-xl font-bold text-failed">{stats.suspended}</p>
                </div>
                <Users className="w-8 h-8 text-failed" />
              </div>
            </ResponsiveCard>

            <ResponsiveCard hover padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-responsive-xs font-medium text-muted-foreground">Total Volume</p>
                  <p className="text-responsive-lg font-bold">{formatCurrency(stats.totalVolume)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </ResponsiveCard>
          </ResponsiveGrid>
        </Section>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search merchants by name, email, or ID..."
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={businessTypeFilter} onValueChange={setBusinessTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Merchants Table */}
        <Card>
          <CardHeader>
            <CardTitle>Merchants List ({filteredMerchants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Merchant ID</TableHead>
                    <TableHead>Business Details</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Business Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Transaction Limits</TableHead>
                    <TableHead>Last Transaction</TableHead>
                    <TableHead>Total Volume</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMerchants.map((merchant) => (
                    <TableRow 
                      key={merchant.id} 
                      className="transition-colors duration-200 hover:bg-muted/50"
                    >
                      <TableCell className="font-mono">{merchant.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{merchant.businessName}</p>
                          <p className="text-sm text-muted-foreground">{merchant.contactName}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{merchant.email}</p>
                          <p className="text-sm text-muted-foreground">{merchant.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{merchant.businessType}</Badge>
                      </TableCell>
                      <TableCell>
                        <StatusIndicator 
                          status={merchant.status as "success" | "pending" | "failed"} 
                          size="sm"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">Daily: {formatCurrency(merchant.dailyLimit)}</p>
                          <p className="text-sm text-muted-foreground">Monthly: {formatCurrency(merchant.monthlyLimit)}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {merchant.lastTransaction !== "-" 
                          ? new Date(merchant.lastTransaction).toLocaleString()
                          : "-"
                        }
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{formatCurrency(merchant.totalVolume)}</p>
                          <p className="text-sm text-muted-foreground">{merchant.totalTransactions} txns</p>
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
                            <DropdownMenuItem onClick={() => handleEditMerchant(merchant)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Transactions
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Key className="mr-2 h-4 w-4" />
                              Regenerate Keys
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteMerchant(merchant.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Merchant
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

      {/* Merchant Form Dialog */}
      <MerchantForm
        merchant={editingMerchant}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveMerchant}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the merchant
              account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
