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
import { Slider } from "@/components/ui/slider";
import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Edit,
  Trash2,
  Settings,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Shield,
  Target,
  BarChart3,
  Users,
  CreditCard,
  DollarSign,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentGateway {
  id: string;
  name: string;
  type: "wallet" | "upi" | "netbanking" | "cards" | "bnpl";
  status: "active" | "inactive" | "maintenance" | "testing";
  priority: number;
  routingWeight: number;
  successRate: number;
  avgResponseTime: number;
  dailyVolume: number;
  monthlyVolume: number;
  configuration: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
    failureThreshold: number;
  };
  fees: {
    transactionFee: number;
    isPercentage: boolean;
    minimumFee: number;
    maximumFee: number;
  };
  limits: {
    minAmount: number;
    maxAmount: number;
    dailyLimit: number;
    monthlyLimit: number;
  };
  features: {
    refunds: boolean;
    webhooks: boolean;
    recurring: boolean;
    emi: boolean;
  };
  health: {
    uptime: number;
    errorRate: number;
    lastHealthCheck: string;
    issues: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// Mock data
const mockPaymentGateways: PaymentGateway[] = [
  {
    id: "PG001",
    name: "PayTM Gateway",
    type: "wallet",
    status: "active",
    priority: 1,
    routingWeight: 40,
    successRate: 94.5,
    avgResponseTime: 1200,
    dailyVolume: 2500000,
    monthlyVolume: 75000000,
    configuration: {
      baseUrl: "https://securegw.paytm.in/v3",
      timeout: 30000,
      retryAttempts: 3,
      failureThreshold: 5,
    },
    fees: {
      transactionFee: 2.5,
      isPercentage: true,
      minimumFee: 2,
      maximumFee: 100,
    },
    limits: {
      minAmount: 1,
      maxAmount: 200000,
      dailyLimit: 5000000,
      monthlyLimit: 150000000,
    },
    features: {
      refunds: true,
      webhooks: true,
      recurring: true,
      emi: false,
    },
    health: {
      uptime: 99.8,
      errorRate: 0.5,
      lastHealthCheck: "2024-01-20 16:30:00",
      issues: [],
    },
    createdAt: "2024-01-10",
    updatedAt: "2024-01-20",
  },
  {
    id: "PG002",
    name: "HDFC Payment Gateway",
    type: "cards",
    status: "active",
    priority: 2,
    routingWeight: 30,
    successRate: 96.2,
    avgResponseTime: 800,
    dailyVolume: 1800000,
    monthlyVolume: 54000000,
    configuration: {
      baseUrl: "https://api.hdfc.com/gateway/v2",
      timeout: 25000,
      retryAttempts: 2,
      failureThreshold: 3,
    },
    fees: {
      transactionFee: 1.8,
      isPercentage: true,
      minimumFee: 5,
      maximumFee: 150,
    },
    limits: {
      minAmount: 10,
      maxAmount: 500000,
      dailyLimit: 10000000,
      monthlyLimit: 300000000,
    },
    features: {
      refunds: true,
      webhooks: true,
      recurring: true,
      emi: true,
    },
    health: {
      uptime: 99.95,
      errorRate: 0.2,
      lastHealthCheck: "2024-01-20 16:29:00",
      issues: [],
    },
    createdAt: "2024-01-08",
    updatedAt: "2024-01-19",
  },
  {
    id: "PG003",
    name: "PhonePe UPI",
    type: "upi",
    status: "maintenance",
    priority: 3,
    routingWeight: 20,
    successRate: 97.1,
    avgResponseTime: 600,
    dailyVolume: 1200000,
    monthlyVolume: 36000000,
    configuration: {
      baseUrl: "https://api.phonepe.com/apis/hermes",
      timeout: 20000,
      retryAttempts: 4,
      failureThreshold: 4,
    },
    fees: {
      transactionFee: 15,
      isPercentage: false,
      minimumFee: 10,
      maximumFee: 15,
    },
    limits: {
      minAmount: 1,
      maxAmount: 100000,
      dailyLimit: 2000000,
      monthlyLimit: 60000000,
    },
    features: {
      refunds: true,
      webhooks: true,
      recurring: false,
      emi: false,
    },
    health: {
      uptime: 98.5,
      errorRate: 1.2,
      lastHealthCheck: "2024-01-20 15:45:00",
      issues: ["High latency detected", "Scheduled maintenance"],
    },
    createdAt: "2024-01-12",
    updatedAt: "2024-01-20",
  },
  {
    id: "PG004",
    name: "ICICI Net Banking",
    type: "netbanking",
    status: "testing",
    priority: 4,
    routingWeight: 10,
    successRate: 91.8,
    avgResponseTime: 2000,
    dailyVolume: 500000,
    monthlyVolume: 15000000,
    configuration: {
      baseUrl: "https://gateway.icici.com/api/v1",
      timeout: 45000,
      retryAttempts: 2,
      failureThreshold: 6,
    },
    fees: {
      transactionFee: 3.0,
      isPercentage: true,
      minimumFee: 3,
      maximumFee: 200,
    },
    limits: {
      minAmount: 100,
      maxAmount: 1000000,
      dailyLimit: 5000000,
      monthlyLimit: 150000000,
    },
    features: {
      refunds: true,
      webhooks: false,
      recurring: false,
      emi: false,
    },
    health: {
      uptime: 95.2,
      errorRate: 3.1,
      lastHealthCheck: "2024-01-20 16:25:00",
      issues: ["Timeout issues", "Testing environment"],
    },
    createdAt: "2024-01-18",
    updatedAt: "2024-01-20",
  },
];

export default function PGManagement() {
  const [paymentGateways, setPaymentGateways] = useState<PaymentGateway[]>(mockPaymentGateways);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPG, setEditingPG] = useState<PaymentGateway | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pgToDelete, setPgToDelete] = useState<string | null>(null);
  const [isRoutingOpen, setIsRoutingOpen] = useState(false);

  // Filter and search logic
  const filteredPGs = useMemo(() => {
    return paymentGateways.filter((pg) => {
      const matchesSearch = 
        pg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pg.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || pg.status === statusFilter;
      const matchesType = typeFilter === "all" || pg.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [paymentGateways, searchTerm, statusFilter, typeFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = paymentGateways.length;
    const active = paymentGateways.filter(pg => pg.status === "active").length;
    const maintenance = paymentGateways.filter(pg => pg.status === "maintenance").length;
    const testing = paymentGateways.filter(pg => pg.status === "testing").length;
    const totalVolume = paymentGateways.reduce((sum, pg) => sum + pg.dailyVolume, 0);
    const avgSuccessRate = paymentGateways.reduce((sum, pg) => sum + pg.successRate, 0) / total;
    const avgUptime = paymentGateways.reduce((sum, pg) => sum + pg.health.uptime, 0) / total;
    
    return { total, active, maintenance, testing, totalVolume, avgSuccessRate, avgUptime };
  }, [paymentGateways]);

  const handleAddPG = () => {
    setEditingPG(undefined);
    setIsFormOpen(true);
  };

  const handleEditPG = (pg: PaymentGateway) => {
    setEditingPG(pg);
    setIsFormOpen(true);
  };

  const handleDeletePG = (pgId: string) => {
    setPgToDelete(pgId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (pgToDelete) {
      setPaymentGateways(prev => prev.filter(pg => pg.id !== pgToDelete));
      setPgToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleToggleStatus = (pgId: string) => {
    setPaymentGateways(prev => prev.map(pg => 
      pg.id === pgId 
        ? { ...pg, status: pg.status === "active" ? "inactive" : "active" as any }
        : pg
    ));
  };

  const updateRoutingWeight = (pgId: string, newWeight: number) => {
    setPaymentGateways(prev => prev.map(pg => 
      pg.id === pgId 
        ? { ...pg, routingWeight: newWeight }
        : pg
    ));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "success";
      case "maintenance":
      case "testing": return "pending";
      case "inactive": return "failed";
      default: return "pending";
    }
  };

  const pgTypes = ["wallet", "upi", "netbanking", "cards", "bnpl"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-in fade-in-0 slide-in-from-left-2 duration-500">
            <h2 className="text-2xl font-bold tracking-tight">Payment Gateway Management</h2>
            <p className="text-muted-foreground">
              Manage payment gateway configurations, routing, and monitoring
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsRoutingOpen(true)}>
              <Target className="w-4 h-4 mr-2" />
              Routing Rules
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Config
            </Button>
            <Button onClick={handleAddPG}>
              <Plus className="w-4 h-4 mr-2" />
              Add Gateway
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Gateways</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Maintenance</p>
                  <p className="text-2xl font-bold text-pending">{stats.maintenance}</p>
                </div>
                <Settings className="w-8 h-8 text-pending" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Testing</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.testing}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Daily Volume</p>
                  <p className="text-lg font-bold">{formatCurrency(stats.totalVolume)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500" />
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
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Uptime</p>
                  <p className="text-lg font-bold">{stats.avgUptime.toFixed(1)}%</p>
                </div>
                <Activity className="w-8 h-8 text-emerald-500" />
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
                  placeholder="Search payment gateways by name or ID..."
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
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="testing">Testing</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {pgTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Payment Gateways Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Gateways ({filteredPGs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Gateway ID</TableHead>
                    <TableHead>Name & Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Routing Weight</TableHead>
                    <TableHead>Health</TableHead>
                    <TableHead>Fees</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPGs.map((pg) => (
                    <TableRow 
                      key={pg.id} 
                      className="transition-colors duration-200 hover:bg-muted/50"
                    >
                      <TableCell className="font-mono">{pg.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{pg.name}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {pg.type.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusIndicator 
                          status={getStatusColor(pg.status) as "success" | "pending" | "failed"} 
                          size="sm"
                        />
                        <p className="text-xs mt-1">Priority: {pg.priority}</p>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">Success: {pg.successRate}%</p>
                          <p className="text-sm text-muted-foreground">
                            Response: {pg.avgResponseTime}ms
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{formatCurrency(pg.dailyVolume)}</p>
                          <p className="text-xs text-muted-foreground">Daily</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{pg.routingWeight}%</span>
                          </div>
                          <Slider
                            value={[pg.routingWeight]}
                            onValueChange={([value]) => updateRoutingWeight(pg.id, value)}
                            max={100}
                            step={5}
                            className="w-20"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-1">
                            <div className={cn(
                              "w-2 h-2 rounded-full",
                              pg.health.uptime > 99 ? "bg-success" : 
                              pg.health.uptime > 95 ? "bg-pending" : "bg-failed"
                            )} />
                            <span className="text-sm">{pg.health.uptime}%</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Error: {pg.health.errorRate}%
                          </p>
                          {pg.health.issues.length > 0 && (
                            <Badge variant="destructive" className="text-xs mt-1">
                              {pg.health.issues.length} issues
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">
                            {pg.fees.transactionFee}{pg.fees.isPercentage ? "%" : "₹"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Min: ₹{pg.fees.minimumFee}
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
                            <DropdownMenuItem onClick={() => handleEditPG(pg)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Configuration
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleStatus(pg.id)}>
                              <Zap className="mr-2 h-4 w-4" />
                              {pg.status === "active" ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              View Analytics
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Activity className="mr-2 h-4 w-4" />
                              Health Check
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeletePG(pg.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove Gateway
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

      {/* Routing Configuration Dialog */}
      <Dialog open={isRoutingOpen} onOpenChange={setIsRoutingOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Payment Gateway Routing Configuration</DialogTitle>
            <DialogDescription>
              Configure routing weights and priority for payment gateways
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid gap-4">
              {paymentGateways.filter(pg => pg.status === "active").map((pg) => (
                <Card key={pg.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{pg.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Success Rate: {pg.successRate}% | Response: {pg.avgResponseTime}ms
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{pg.routingWeight}%</p>
                          <p className="text-xs text-muted-foreground">Weight</p>
                        </div>
                        <Slider
                          value={[pg.routingWeight]}
                          onValueChange={([value]) => updateRoutingWeight(pg.id, value)}
                          max={100}
                          step={5}
                          className="w-32"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRoutingOpen(false)}>
              Close
            </Button>
            <Button>Save Routing Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the payment
              gateway and all associated configurations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Remove Gateway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
