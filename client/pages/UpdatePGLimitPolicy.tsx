import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Edit,
  Trash2,
  Save,
  Settings,
  CreditCard,
  TrendingUp,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LimitPolicy {
  id: string;
  policyName: string;
  description: string;
  merchantType: "individual" | "business" | "enterprise" | "all";
  transactionLimits: {
    perTransaction: {
      min: number;
      max: number;
    };
    daily: {
      amount: number;
      count: number;
    };
    weekly: {
      amount: number;
      count: number;
    };
    monthly: {
      amount: number;
      count: number;
    };
  };
  pgSpecificLimits: {
    pgProvider: string;
    dailyLimit: number;
    monthlyLimit: number;
    isActive: boolean;
  }[];
  riskParameters: {
    velocityChecks: boolean;
    amountThreshold: number;
    frequencyThreshold: number;
    cooldownPeriod: number;
  };
  status: "active" | "inactive" | "draft";
  appliesTo: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Mock data
const mockPolicies: LimitPolicy[] = [
  {
    id: "LP001",
    policyName: "Standard Business Policy",
    description: "Default policy for verified business merchants",
    merchantType: "business",
    transactionLimits: {
      perTransaction: { min: 1, max: 200000 },
      daily: { amount: 1000000, count: 500 },
      weekly: { amount: 7000000, count: 2500 },
      monthly: { amount: 30000000, count: 10000 },
    },
    pgSpecificLimits: [
      { pgProvider: "PayTM", dailyLimit: 500000, monthlyLimit: 15000000, isActive: true },
      { pgProvider: "PhonePe", dailyLimit: 300000, monthlyLimit: 9000000, isActive: true },
      { pgProvider: "GooglePay", dailyLimit: 400000, monthlyLimit: 12000000, isActive: false },
    ],
    riskParameters: {
      velocityChecks: true,
      amountThreshold: 50000,
      frequencyThreshold: 10,
      cooldownPeriod: 3600,
    },
    status: "active",
    appliesTo: ["M001", "M002", "M005"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    createdBy: "Admin User",
  },
  {
    id: "LP002",
    policyName: "High Volume Enterprise",
    description: "Policy for enterprise clients with high transaction volumes",
    merchantType: "enterprise",
    transactionLimits: {
      perTransaction: { min: 1, max: 500000 },
      daily: { amount: 5000000, count: 1000 },
      weekly: { amount: 35000000, count: 5000 },
      monthly: { amount: 150000000, count: 20000 },
    },
    pgSpecificLimits: [
      { pgProvider: "PayTM", dailyLimit: 2000000, monthlyLimit: 60000000, isActive: true },
      { pgProvider: "PhonePe", dailyLimit: 1500000, monthlyLimit: 45000000, isActive: true },
      { pgProvider: "HDFC", dailyLimit: 2500000, monthlyLimit: 75000000, isActive: true },
    ],
    riskParameters: {
      velocityChecks: true,
      amountThreshold: 100000,
      frequencyThreshold: 20,
      cooldownPeriod: 1800,
    },
    status: "active",
    appliesTo: ["M003", "M004"],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    createdBy: "Admin User",
  },
  {
    id: "LP003",
    policyName: "Individual User Policy",
    description: "Conservative limits for individual merchants",
    merchantType: "individual",
    transactionLimits: {
      perTransaction: { min: 1, max: 25000 },
      daily: { amount: 100000, count: 50 },
      weekly: { amount: 500000, count: 200 },
      monthly: { amount: 2000000, count: 800 },
    },
    pgSpecificLimits: [
      { pgProvider: "PayTM", dailyLimit: 50000, monthlyLimit: 1000000, isActive: true },
      { pgProvider: "PhonePe", dailyLimit: 40000, monthlyLimit: 800000, isActive: true },
    ],
    riskParameters: {
      velocityChecks: true,
      amountThreshold: 10000,
      frequencyThreshold: 5,
      cooldownPeriod: 7200,
    },
    status: "draft",
    appliesTo: [],
    createdAt: "2024-01-20",
    updatedAt: "2024-01-20",
    createdBy: "Admin User",
  },
];

export default function UpdatePGLimitPolicy() {
  const [policies, setPolicies] = useState<LimitPolicy[]>(mockPolicies);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<LimitPolicy | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<string | null>(null);

  // Filter and search logic
  const filteredPolicies = useMemo(() => {
    return policies.filter((policy) => {
      const matchesSearch = 
        policy.policyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || policy.status === statusFilter;
      const matchesType = typeFilter === "all" || policy.merchantType === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [policies, searchTerm, statusFilter, typeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = policies.length;
    const active = policies.filter(p => p.status === "active").length;
    const draft = policies.filter(p => p.status === "draft").length;
    const inactive = policies.filter(p => p.status === "inactive").length;
    const merchantsCovered = new Set(policies.flatMap(p => p.appliesTo)).size;
    
    return { total, active, draft, inactive, merchantsCovered };
  }, [policies]);

  const handleAddPolicy = () => {
    setEditingPolicy(undefined);
    setIsFormOpen(true);
  };

  const handleEditPolicy = (policy: LimitPolicy) => {
    setEditingPolicy(policy);
    setIsFormOpen(true);
  };

  const handleDeletePolicy = (policyId: string) => {
    setPolicyToDelete(policyId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (policyToDelete) {
      setPolicies(prev => prev.filter(p => p.id !== policyToDelete));
      setPolicyToDelete(null);
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

  const merchantTypes = ["individual", "business", "enterprise", "all"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-in fade-in-0 slide-in-from-left-2 duration-500">
            <h2 className="text-2xl font-bold tracking-tight">PG Limit Policies</h2>
            <p className="text-muted-foreground">
              Manage payment gateway transaction limits and risk policies
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Policies
            </Button>
            <Button onClick={handleAddPolicy}>
              <Plus className="w-4 h-4 mr-2" />
              Create Policy
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Policies</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Settings className="w-8 h-8 text-blue-500" />
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
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Draft</p>
                  <p className="text-2xl font-bold text-pending">{stats.draft}</p>
                </div>
                <Clock className="w-8 h-8 text-pending" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold text-failed">{stats.inactive}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-failed" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Merchants Covered</p>
                  <p className="text-2xl font-bold">{stats.merchantsCovered}</p>
                </div>
                <Shield className="w-8 h-8 text-purple-500" />
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
                  placeholder="Search policies by name, description, or ID..."
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
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {merchantTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Policies Table */}
        <Card>
          <CardHeader>
            <CardTitle>Limit Policies ({filteredPolicies.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Policy ID</TableHead>
                    <TableHead>Policy Details</TableHead>
                    <TableHead>Merchant Type</TableHead>
                    <TableHead>Transaction Limits</TableHead>
                    <TableHead>Daily Limits</TableHead>
                    <TableHead>Risk Parameters</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied To</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPolicies.map((policy) => (
                    <TableRow 
                      key={policy.id} 
                      className="transition-colors duration-200 hover:bg-muted/50"
                    >
                      <TableCell className="font-mono">{policy.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{policy.policyName}</p>
                          <p className="text-sm text-muted-foreground">{policy.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {policy.merchantType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">Min: {formatCurrency(policy.transactionLimits.perTransaction.min)}</p>
                          <p className="text-sm">Max: {formatCurrency(policy.transactionLimits.perTransaction.max)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">Amount: {formatCurrency(policy.transactionLimits.daily.amount)}</p>
                          <p className="text-sm text-muted-foreground">Count: {policy.transactionLimits.daily.count}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Badge variant={policy.riskParameters.velocityChecks ? "default" : "secondary"} className="text-xs">
                              Velocity: {policy.riskParameters.velocityChecks ? "ON" : "OFF"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Threshold: {formatCurrency(policy.riskParameters.amountThreshold)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={policy.status === "active" ? "default" : 
                                 policy.status === "draft" ? "secondary" : "outline"}
                          className={cn(
                            policy.status === "active" && "bg-success text-success-foreground",
                            policy.status === "draft" && "bg-pending text-pending-foreground",
                            policy.status === "inactive" && "bg-failed text-failed-foreground"
                          )}
                        >
                          {policy.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{policy.appliesTo.length} merchants</p>
                          <p className="text-xs text-muted-foreground">
                            {policy.appliesTo.slice(0, 2).join(", ")}
                            {policy.appliesTo.length > 2 && ` +${policy.appliesTo.length - 2} more`}
                          </p>
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
                            <DropdownMenuItem onClick={() => handleEditPolicy(policy)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Policy
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CreditCard className="mr-2 h-4 w-4" />
                              View Merchants
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <TrendingUp className="mr-2 h-4 w-4" />
                              Usage Analytics
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeletePolicy(policy.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Policy
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the policy
              and remove it from all associated merchants.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete Policy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
