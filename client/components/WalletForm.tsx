import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, X } from "lucide-react";

export interface WalletProvider {
  id: string;
  providerName: string;
  walletType: "digital_wallet" | "upi" | "crypto" | "prepaid_card";
  apiEndpoint: string;
  merchantId: string;
  apiKey: string;
  secretKey: string;
  status: "active" | "inactive" | "testing" | "suspended";
  isLive: boolean;
  priority: number;
  supportedCurrencies: string[];
  transactionLimits: {
    minAmount: number;
    maxAmount: number;
    dailyLimit: number;
    monthlyLimit: number;
  };
  fees: {
    transactionFee: number;
    settlementFee: number;
    isPercentage: boolean;
  };
  settlementConfig: {
    settlementTime: string;
    settlementCycle: string;
    autoSettlement: boolean;
  };
  features: {
    refundSupport: boolean;
    partialRefund: boolean;
    instantRefund: boolean;
    recurringPayments: boolean;
    webhookSupport: boolean;
  };
  testCredentials: {
    testMerchantId: string;
    testApiKey: string;
    testSecretKey: string;
  };
  createdAt: string;
  lastUsed: string;
  totalTransactions: number;
  totalVolume: number;
  successRate: number;
}

interface WalletFormProps {
  wallet?: WalletProvider;
  isOpen: boolean;
  onClose: () => void;
  onSave: (wallet: Omit<WalletProvider, "id" | "createdAt" | "lastUsed" | "totalTransactions" | "totalVolume" | "successRate">) => void;
}

export function WalletForm({ wallet, isOpen, onClose, onSave }: WalletFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    providerName: wallet?.providerName || "",
    walletType: wallet?.walletType || "digital_wallet",
    apiEndpoint: wallet?.apiEndpoint || "",
    merchantId: wallet?.merchantId || "",
    apiKey: wallet?.apiKey || "",
    secretKey: wallet?.secretKey || "",
    status: wallet?.status || "testing",
    isLive: wallet?.isLive || false,
    priority: wallet?.priority || 1,
    supportedCurrencies: wallet?.supportedCurrencies || ["INR"],
    transactionLimits: {
      minAmount: wallet?.transactionLimits?.minAmount || 1,
      maxAmount: wallet?.transactionLimits?.maxAmount || 200000,
      dailyLimit: wallet?.transactionLimits?.dailyLimit || 500000,
      monthlyLimit: wallet?.transactionLimits?.monthlyLimit || 15000000,
    },
    fees: {
      transactionFee: wallet?.fees?.transactionFee || 2.0,
      settlementFee: wallet?.fees?.settlementFee || 5,
      isPercentage: wallet?.fees?.isPercentage || true,
    },
    settlementConfig: {
      settlementTime: wallet?.settlementConfig?.settlementTime || "24_hours",
      settlementCycle: wallet?.settlementConfig?.settlementCycle || "daily",
      autoSettlement: wallet?.settlementConfig?.autoSettlement || true,
    },
    features: {
      refundSupport: wallet?.features?.refundSupport || true,
      partialRefund: wallet?.features?.partialRefund || true,
      instantRefund: wallet?.features?.instantRefund || false,
      recurringPayments: wallet?.features?.recurringPayments || false,
      webhookSupport: wallet?.features?.webhookSupport || true,
    },
    testCredentials: {
      testMerchantId: wallet?.testCredentials?.testMerchantId || "",
      testApiKey: wallet?.testCredentials?.testApiKey || "",
      testSecretKey: wallet?.testCredentials?.testSecretKey || "",
    },
  });

  const handleChange = (field: string) => (value: string | number | boolean | string[]) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value,
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSave(formData as any);
    setIsLoading(false);
    onClose();
  };

  const walletTypes = [
    { value: "digital_wallet", label: "Digital Wallet" },
    { value: "upi", label: "UPI Provider" },
    { value: "crypto", label: "Cryptocurrency" },
    { value: "prepaid_card", label: "Prepaid Card" },
  ];

  const statusOptions = [
    { value: "active", label: "Active", color: "bg-success" },
    { value: "inactive", label: "Inactive", color: "bg-muted" },
    { value: "testing", label: "Testing", color: "bg-pending" },
    { value: "suspended", label: "Suspended", color: "bg-failed" },
  ];

  const currencies = ["INR", "USD", "EUR", "BTC", "ETH"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {wallet ? "Edit Wallet Provider" : "Add New Wallet Provider"}
          </DialogTitle>
          <DialogDescription>
            {wallet ? "Update wallet provider configuration and settings" : "Configure a new digital wallet or payment provider"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Provider Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="providerName">Provider Name *</Label>
                  <Input
                    id="providerName"
                    value={formData.providerName}
                    onChange={(e) => handleChange("providerName")(e.target.value)}
                    placeholder="e.g., PayTM, PhonePe, GooglePay"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="walletType">Wallet Type *</Label>
                  <Select value={formData.walletType} onValueChange={handleChange("walletType")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select wallet type" />
                    </SelectTrigger>
                    <SelectContent>
                      {walletTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={handleChange("status")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${option.color}`} />
                            {option.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Input
                    id="priority"
                    type="number"
                    value={formData.priority}
                    onChange={(e) => handleChange("priority")(Number(e.target.value))}
                    placeholder="Priority order"
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isLive"
                  checked={formData.isLive}
                  onCheckedChange={handleChange("isLive")}
                />
                <Label htmlFor="isLive">Live environment (production)</Label>
              </div>
            </CardContent>
          </Card>

          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiEndpoint">API Endpoint *</Label>
                <Input
                  id="apiEndpoint"
                  value={formData.apiEndpoint}
                  onChange={(e) => handleChange("apiEndpoint")(e.target.value)}
                  placeholder="https://api.provider.com/v1"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="merchantId">Merchant ID *</Label>
                  <Input
                    id="merchantId"
                    value={formData.merchantId}
                    onChange={(e) => handleChange("merchantId")(e.target.value)}
                    placeholder="Enter merchant ID"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key *</Label>
                  <Input
                    id="apiKey"
                    value={formData.apiKey}
                    onChange={(e) => handleChange("apiKey")(e.target.value)}
                    placeholder="Enter API key"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secretKey">Secret Key *</Label>
                  <Input
                    id="secretKey"
                    type="password"
                    value={formData.secretKey}
                    onChange={(e) => handleChange("secretKey")(e.target.value)}
                    placeholder="Enter secret key"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transaction Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minAmount">Minimum Amount (₹)</Label>
                  <Input
                    id="minAmount"
                    type="number"
                    value={formData.transactionLimits.minAmount}
                    onChange={(e) => handleChange("transactionLimits.minAmount")(Number(e.target.value))}
                    placeholder="Minimum transaction amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAmount">Maximum Amount (₹)</Label>
                  <Input
                    id="maxAmount"
                    type="number"
                    value={formData.transactionLimits.maxAmount}
                    onChange={(e) => handleChange("transactionLimits.maxAmount")(Number(e.target.value))}
                    placeholder="Maximum transaction amount"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyLimit">Daily Limit (₹)</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    value={formData.transactionLimits.dailyLimit}
                    onChange={(e) => handleChange("transactionLimits.dailyLimit")(Number(e.target.value))}
                    placeholder="Daily transaction limit"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyLimit">Monthly Limit (₹)</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    value={formData.transactionLimits.monthlyLimit}
                    onChange={(e) => handleChange("transactionLimits.monthlyLimit")(Number(e.target.value))}
                    placeholder="Monthly transaction limit"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fees Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fees Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="transactionFee">Transaction Fee</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="transactionFee"
                      type="number"
                      step="0.01"
                      value={formData.fees.transactionFee}
                      onChange={(e) => handleChange("fees.transactionFee")(Number(e.target.value))}
                      placeholder="Fee amount"
                    />
                    <Badge variant="outline">
                      {formData.fees.isPercentage ? "%" : "₹"}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settlementFee">Settlement Fee</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="settlementFee"
                      type="number"
                      step="0.01"
                      value={formData.fees.settlementFee}
                      onChange={(e) => handleChange("fees.settlementFee")(Number(e.target.value))}
                      placeholder="Fee amount"
                    />
                    <Badge variant="outline">
                      {formData.fees.isPercentage ? "%" : "₹"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPercentage"
                  checked={formData.fees.isPercentage}
                  onCheckedChange={handleChange("fees.isPercentage")}
                />
                <Label htmlFor="isPercentage">Use percentage-based fees</Label>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supported Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="refundSupport"
                      checked={formData.features.refundSupport}
                      onCheckedChange={handleChange("features.refundSupport")}
                    />
                    <Label htmlFor="refundSupport">Refund Support</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="partialRefund"
                      checked={formData.features.partialRefund}
                      onCheckedChange={handleChange("features.partialRefund")}
                    />
                    <Label htmlFor="partialRefund">Partial Refunds</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="instantRefund"
                      checked={formData.features.instantRefund}
                      onCheckedChange={handleChange("features.instantRefund")}
                    />
                    <Label htmlFor="instantRefund">Instant Refunds</Label>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="recurringPayments"
                      checked={formData.features.recurringPayments}
                      onCheckedChange={handleChange("features.recurringPayments")}
                    />
                    <Label htmlFor="recurringPayments">Recurring Payments</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="webhookSupport"
                      checked={formData.features.webhookSupport}
                      onCheckedChange={handleChange("features.webhookSupport")}
                    />
                    <Label htmlFor="webhookSupport">Webhook Support</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Test Environment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="testMerchantId">Test Merchant ID</Label>
                  <Input
                    id="testMerchantId"
                    value={formData.testCredentials.testMerchantId}
                    onChange={(e) => handleChange("testCredentials.testMerchantId")(e.target.value)}
                    placeholder="Test merchant ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testApiKey">Test API Key</Label>
                  <Input
                    id="testApiKey"
                    value={formData.testCredentials.testApiKey}
                    onChange={(e) => handleChange("testCredentials.testApiKey")(e.target.value)}
                    placeholder="Test API key"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testSecretKey">Test Secret Key</Label>
                  <Input
                    id="testSecretKey"
                    type="password"
                    value={formData.testCredentials.testSecretKey}
                    onChange={(e) => handleChange("testCredentials.testSecretKey")(e.target.value)}
                    placeholder="Test secret key"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {wallet ? "Update Provider" : "Add Provider"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
