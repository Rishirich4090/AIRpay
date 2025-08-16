import { useState, useMemo } from "react";
import { DashboardLayout, ResponsiveGrid, ResponsiveCard, Section } from "@/components/DashboardLayout";
import { downloadTransactionReport, downloadMerchantReport, downloadElementAsPDF, ReportData, MerchantData } from "@/lib/pdf-utils";
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
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  FileText,
  Calendar,
  Filter,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  FileSpreadsheet,
  FileImage,
  Database,
  Mail,
  Plus,
  Loader2,
  Trash2,
  Edit,
  Play,
  RotateCcw,
  Eye,
  Share,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  type: "transaction" | "merchant" | "settlement" | "reconciliation" | "analytics" | "custom";
  format: "csv" | "excel" | "pdf" | "json";
  frequency: "manual" | "daily" | "weekly" | "monthly";
  status: "active" | "inactive" | "scheduled";
  fields: string[];
  filters: {
    dateRange: boolean;
    merchants: boolean;
    paymentMethods: boolean;
    status: boolean;
    amount: boolean;
  };
  emailRecipients: string[];
  lastGenerated: string;
  fileSize: string;
  downloadCount: number;
  createdAt: string;
  createdBy: string;
}

interface GeneratedReport {
  id: string;
  templateId: string;
  templateName: string;
  status: "generating" | "completed" | "failed" | "expired";
  format: string;
  requestedBy: string;
  requestedAt: string;
  completedAt?: string;
  fileSize?: string;
  downloadUrl?: string;
  expiresAt: string;
  progress: number;
  error?: string;
}

// Mock data
const mockTemplates: ReportTemplate[] = [
  {
    id: "RPT001",
    name: "Daily Transaction Summary",
    description: "Daily summary of all transactions with success/failure breakdown",
    type: "transaction",
    format: "excel",
    frequency: "daily",
    status: "active",
    fields: ["Transaction ID", "Amount", "Status", "Payment Method", "Merchant", "Date"],
    filters: {
      dateRange: true,
      merchants: true,
      paymentMethods: true,
      status: true,
      amount: true,
    },
    emailRecipients: ["admin@glidexpay.com", "finance@glidexpay.com"],
    lastGenerated: "2024-01-20 06:00:00",
    fileSize: "2.4 MB",
    downloadCount: 45,
    createdAt: "2024-01-10",
    createdBy: "Admin User",
  },
  {
    id: "RPT002",
    name: "Merchant Settlement Report",
    description: "Detailed settlement report for merchants with fee calculations",
    type: "settlement",
    format: "pdf",
    frequency: "weekly",
    status: "active",
    fields: ["Merchant ID", "Total Volume", "Fee Amount", "Settlement Amount", "Bank Details"],
    filters: {
      dateRange: true,
      merchants: true,
      paymentMethods: false,
      status: false,
      amount: true,
    },
    emailRecipients: ["settlements@glidexpay.com"],
    lastGenerated: "2024-01-19 18:30:00",
    fileSize: "1.8 MB",
    downloadCount: 23,
    createdAt: "2024-01-08",
    createdBy: "Finance Team",
  },
  {
    id: "RPT003",
    name: "Payment Gateway Analytics",
    description: "Performance analytics for all payment gateways",
    type: "analytics",
    format: "csv",
    frequency: "manual",
    status: "active",
    fields: ["Gateway Name", "Success Rate", "Volume", "Response Time", "Error Count"],
    filters: {
      dateRange: true,
      merchants: false,
      paymentMethods: true,
      status: true,
      amount: false,
    },
    emailRecipients: [],
    lastGenerated: "2024-01-18 14:20:00",
    fileSize: "856 KB",
    downloadCount: 12,
    createdAt: "2024-01-15",
    createdBy: "Tech Team",
  },
  {
    id: "RPT004",
    name: "Failed Transaction Analysis",
    description: "Detailed analysis of failed transactions with failure reasons",
    type: "transaction",
    format: "excel",
    frequency: "monthly",
    status: "inactive",
    fields: ["Transaction ID", "Amount", "Failure Reason", "Gateway", "Merchant", "Retry Count"],
    filters: {
      dateRange: true,
      merchants: true,
      paymentMethods: true,
      status: false,
      amount: true,
    },
    emailRecipients: ["support@glidexpay.com"],
    lastGenerated: "2024-01-01 09:00:00",
    fileSize: "3.2 MB",
    downloadCount: 8,
    createdAt: "2024-01-05",
    createdBy: "Support Team",
  },
];

const mockGeneratedReports: GeneratedReport[] = [
  {
    id: "GEN001",
    templateId: "RPT001",
    templateName: "Daily Transaction Summary",
    status: "completed",
    format: "excel",
    requestedBy: "Admin User",
    requestedAt: "2024-01-20 15:30:00",
    completedAt: "2024-01-20 15:32:00",
    fileSize: "2.4 MB",
    downloadUrl: "/downloads/daily-transaction-20240120.xlsx",
    expiresAt: "2024-01-27 15:32:00",
    progress: 100,
  },
  {
    id: "GEN002",
    templateId: "RPT003",
    templateName: "Payment Gateway Analytics",
    status: "generating",
    format: "csv",
    requestedBy: "Tech Team",
    requestedAt: "2024-01-20 16:15:00",
    expiresAt: "2024-01-27 16:15:00",
    progress: 65,
  },
  {
    id: "GEN003",
    templateId: "RPT002",
    templateName: "Merchant Settlement Report",
    status: "failed",
    format: "pdf",
    requestedBy: "Finance Team",
    requestedAt: "2024-01-20 14:45:00",
    expiresAt: "2024-01-27 14:45:00",
    progress: 0,
    error: "Database connection timeout",
  },
];

export default function DownloadReport() {
  const [templates, setTemplates] = useState<ReportTemplate[]>(mockTemplates);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>(mockGeneratedReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [activeTab, setActiveTab] = useState<"templates" | "generated">("templates");

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch = 
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === "all" || template.type === typeFilter;
      const matchesStatus = statusFilter === "all" || template.status === statusFilter;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [templates, searchTerm, typeFilter, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalTemplates = templates.length;
    const activeTemplates = templates.filter(t => t.status === "active").length;
    const scheduledReports = templates.filter(t => t.frequency !== "manual").length;
    const totalDownloads = templates.reduce((sum, t) => sum + t.downloadCount, 0);
    const recentGenerations = generatedReports.filter(r => 
      new Date(r.requestedAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length;
    
    return { totalTemplates, activeTemplates, scheduledReports, totalDownloads, recentGenerations };
  }, [templates, generatedReports]);

  const handleGenerateReport = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setIsGenerateDialogOpen(true);
  };

  const handleDownloadPDF = async (template: ReportTemplate) => {
    try {
      const reportData: ReportData = {
        title: `AIRpay ${template.name}`,
        dateRange: {
          from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          to: new Date().toISOString()
        },
        summary: {
          totalTransactions: 15420,
          totalVolume: 2847593.75,
          successRate: 94.2,
          totalFees: 8542.78
        },
        transactions: Array.from({ length: 10 }, (_, i) => ({
          id: `TXN${String(i + 1).padStart(6, '0')}`,
          merchantId: `MER${String(i + 1).padStart(3, '0')}`,
          merchantName: `Merchant ${i + 1}`,
          amount: Math.random() * 1000 + 100,
          currency: 'INR',
          status: ['success', 'pending', 'failed'][Math.floor(Math.random() * 3)] as 'success' | 'pending' | 'failed',
          method: ['UPI', 'Card', 'NetBanking'][Math.floor(Math.random() * 3)],
          timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          fee: Math.random() * 50 + 5,
          netAmount: Math.random() * 1000 + 100,
          gateway: 'AIRpay',
          reference: `REF${String(i + 1).padStart(8, '0')}`
        }))
      };

      await downloadTransactionReport(reportData, `airpay-${template.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  const confirmGenerate = () => {
    if (!selectedTemplate) return;

    const newReport: GeneratedReport = {
      id: `GEN${String(generatedReports.length + 1).padStart(3, '0')}`,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      status: "generating",
      format: selectedTemplate.format,
      requestedBy: "Current User",
      requestedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      progress: 0,
    };

    setGeneratedReports(prev => [newReport, ...prev]);
    setIsGenerateDialogOpen(false);
    setSelectedTemplate(null);

    // Simulate report generation
    setTimeout(() => {
      setGeneratedReports(prev => prev.map(r =>
        r.id === newReport.id
          ? {
              ...r,
              status: "completed" as any,
              progress: 100,
              completedAt: new Date().toISOString(),
              fileSize: "1.2 MB",
              downloadUrl: `/downloads/report-${newReport.id}.${selectedTemplate.format}`
            }
          : r
      ));
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-4 h-4 text-success" />;
      case "generating": return <Clock className="w-4 h-4 text-pending animate-pulse" />;
      case "failed": return <AlertCircle className="w-4 h-4 text-failed" />;
      default: return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "excel": return <FileSpreadsheet className="w-4 h-4 text-green-600" />;
      case "csv": return <FileText className="w-4 h-4 text-blue-600" />;
      case "pdf": return <FileImage className="w-4 h-4 text-red-600" />;
      case "json": return <Database className="w-4 h-4 text-purple-600" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const reportTypes = ["transaction", "merchant", "settlement", "reconciliation", "analytics", "custom"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="animate-in fade-in-0 slide-in-from-left-2 duration-500">
            <h2 className="text-2xl font-bold tracking-tight">Download Reports</h2>
            <p className="text-muted-foreground">
              Generate and download customized reports for transactions, settlements, and analytics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Report Settings
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Report Templates</p>
                  <p className="text-2xl font-bold">{stats.totalTemplates}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Templates</p>
                  <p className="text-2xl font-bold text-success">{stats.activeTemplates}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Scheduled Reports</p>
                  <p className="text-2xl font-bold text-pending">{stats.scheduledReports}</p>
                </div>
                <Calendar className="w-8 h-8 text-pending" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Downloads</p>
                  <p className="text-2xl font-bold">{stats.totalDownloads}</p>
                </div>
                <Download className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recent (24h)</p>
                  <p className="text-2xl font-bold">{stats.recentGenerations}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 rounded-lg bg-muted p-1">
          <Button
            variant={activeTab === "templates" ? "default" : "ghost"}
            onClick={() => setActiveTab("templates")}
            className="flex-1"
          >
            <FileText className="w-4 h-4 mr-2" />
            Report Templates
          </Button>
          <Button
            variant={activeTab === "generated" ? "default" : "ghost"}
            onClick={() => setActiveTab("generated")}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Generated Reports
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Search templates or reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {activeTab === "templates" && (
                <>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {reportTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                    </SelectContent>
                  </Select>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Tables */}
        {activeTab === "templates" ? (
          <Card>
            <CardHeader>
              <CardTitle>Report Templates ({filteredTemplates.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Generated</TableHead>
                      <TableHead>Downloads</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTemplates.map((template) => (
                      <TableRow 
                        key={template.id} 
                        className="transition-colors duration-200 hover:bg-muted/50"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{template.name}</p>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {template.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getFormatIcon(template.format)}
                            <span className="uppercase text-sm">{template.format}</span>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{template.frequency}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={template.status === "active" ? "default" : "secondary"}
                            className={cn(
                              template.status === "active" && "bg-success text-success-foreground"
                            )}
                          >
                            {template.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(template.lastGenerated).toLocaleString()}
                        </TableCell>
                        <TableCell>{template.downloadCount}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end flex-wrap">
                            <Button
                              size="sm"
                              onClick={() => handleGenerateReport(template)}
                              disabled={template.status === "inactive"}
                            >
                              <Play className="w-4 h-4 mr-1" />
                              Generate
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadPDF(template)}
                              className="gap-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                            >
                              <FileImage className="w-4 h-4" />
                              PDF
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports ({generatedReports.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested By</TableHead>
                      <TableHead>Requested At</TableHead>
                      <TableHead>File Size</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generatedReports.map((report) => (
                      <TableRow 
                        key={report.id} 
                        className="transition-colors duration-200 hover:bg-muted/50"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{report.templateName}</p>
                            <p className="text-sm text-muted-foreground">ID: {report.id}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getFormatIcon(report.format)}
                            <span className="uppercase text-sm">{report.format}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(report.status)}
                            <span className="capitalize">{report.status}</span>
                            {report.status === "generating" && (
                              <div className="w-20">
                                <Progress value={report.progress} className="h-2" />
                              </div>
                            )}
                          </div>
                          {report.error && (
                            <p className="text-xs text-failed mt-1">{report.error}</p>
                          )}
                        </TableCell>
                        <TableCell>{report.requestedBy}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(report.requestedAt).toLocaleString()}
                        </TableCell>
                        <TableCell>{report.fileSize || "-"}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(report.expiresAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-end flex-wrap">
                            {report.status === "completed" && (
                              <>
                                <Button size="sm">
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownloadPDF({
                                    name: report.templateName,
                                    format: 'pdf'
                                  } as ReportTemplate)}
                                  className="gap-1 bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                                >
                                  <FileImage className="w-4 h-4" />
                                  PDF
                                </Button>
                              </>
                            )}
                            {report.status === "failed" && (
                              <Button variant="outline" size="sm">
                                <RotateCcw className="w-4 h-4 mr-1" />
                                Retry
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Generate Report Dialog */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Report</DialogTitle>
            <DialogDescription>
              Generate "{selectedTemplate?.name}" report with custom parameters
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Date Range</Label>
              <DatePickerWithRange placeholder="Select date range" />
            </div>
            <div>
              <Label>Additional Filters</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="merchants" />
                  <Label htmlFor="merchants" className="text-sm">Filter by merchants</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="payment-methods" />
                  <Label htmlFor="payment-methods" className="text-sm">Filter by payment methods</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="email-notification" />
                  <Label htmlFor="email-notification" className="text-sm">Send email notification when ready</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmGenerate}>
              <Play className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
