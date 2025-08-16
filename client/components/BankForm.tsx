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

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountType: "current" | "savings";
  ifscCode: string;
  branchName: string;
  branchAddress: string;
  accountHolderName: string;
  status: "active" | "inactive" | "suspended" | "pending_verification";
  priority: number;
  isDefault: boolean;
  dailyLimit: number;
  monthlyLimit: number;
  currency: string;
  settlementTime: "immediate" | "1_hour" | "24_hours" | "manual";
  charges: {
    transactionFee: number;
    settlementFee: number;
    isPercentage: boolean;
  };
  createdAt: string;
  lastUsed: string;
  totalTransactions: number;
  totalVolume: number;
  availableBalance: number;
}

interface BankFormProps {
  bank?: BankAccount;
  isOpen: boolean;
  onClose: () => void;
  onSave: (bank: Omit<BankAccount, "id" | "createdAt" | "lastUsed" | "totalTransactions" | "totalVolume" | "availableBalance">) => void;
}

export function BankForm({ bank, isOpen, onClose, onSave }: BankFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    bankName: bank?.bankName || "",
    accountNumber: bank?.accountNumber || "",
    accountType: bank?.accountType || "current",
    ifscCode: bank?.ifscCode || "",
    branchName: bank?.branchName || "",
    branchAddress: bank?.branchAddress || "",
    accountHolderName: bank?.accountHolderName || "",
    status: bank?.status || "pending_verification",
    priority: bank?.priority || 1,
    isDefault: bank?.isDefault || false,
    dailyLimit: bank?.dailyLimit || 1000000,
    monthlyLimit: bank?.monthlyLimit || 30000000,
    currency: bank?.currency || "INR",
    settlementTime: bank?.settlementTime || "24_hours",
    charges: {
      transactionFee: bank?.charges?.transactionFee || 2.5,
      settlementFee: bank?.charges?.settlementFee || 5,
      isPercentage: bank?.charges?.isPercentage || true,
    },
  });

  const handleChange = (field: string) => (value: string | number | boolean) => {
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

  const bankOptions = [
    "State Bank of India",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "Kotak Mahindra Bank",
    "IndusInd Bank",
    "Punjab National Bank",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "Other"
  ];

  const statusOptions = [
    { value: "active", label: "Active", color: "bg-success" },
    { value: "inactive", label: "Inactive", color: "bg-muted" },
    { value: "pending_verification", label: "Pending Verification", color: "bg-pending" },
    { value: "suspended", label: "Suspended", color: "bg-failed" },
  ];

  const settlementOptions = [
    { value: "immediate", label: "Immediate" },
    { value: "1_hour", label: "1 Hour" },
    { value: "24_hours", label: "24 Hours" },
    { value: "manual", label: "Manual" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {bank ? "Edit Bank Account" : "Add New Bank Account"}
          </DialogTitle>
          <DialogDescription>
            {bank ? "Update bank account information and settings" : "Add a new bank account for payment settlements"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bank Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bank Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Select value={formData.bankName} onValueChange={handleChange("bankName")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankOptions.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifscCode">IFSC Code *</Label>
                  <Input
                    id="ifscCode"
                    value={formData.ifscCode}
                    onChange={(e) => handleChange("ifscCode")(e.target.value.toUpperCase())}
                    placeholder="Enter IFSC code"
                    required
                    className="uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number *</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => handleChange("accountNumber")(e.target.value)}
                    placeholder="Enter account number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountType">Account Type *</Label>
                  <Select value={formData.accountType} onValueChange={handleChange("accountType")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Account</SelectItem>
                      <SelectItem value="savings">Savings Account</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                <Input
                  id="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={(e) => handleChange("accountHolderName")(e.target.value)}
                  placeholder="Enter account holder name"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Branch Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Branch Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="branchName">Branch Name *</Label>
                <Input
                  id="branchName"
                  value={formData.branchName}
                  onChange={(e) => handleChange("branchName")(e.target.value)}
                  placeholder="Enter branch name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branchAddress">Branch Address *</Label>
                <Textarea
                  id="branchAddress"
                  value={formData.branchAddress}
                  onChange={(e) => handleChange("branchAddress")(e.target.value)}
                  placeholder="Enter complete branch address"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Account Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={handleChange("currency")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="settlementTime">Settlement Time</Label>
                  <Select value={formData.settlementTime} onValueChange={handleChange("settlementTime")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {settlementOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isDefault"
                  checked={formData.isDefault}
                  onCheckedChange={handleChange("isDefault")}
                />
                <Label htmlFor="isDefault">Set as default account</Label>
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
                  <Label htmlFor="dailyLimit">Daily Limit (₹)</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    value={formData.dailyLimit}
                    onChange={(e) => handleChange("dailyLimit")(Number(e.target.value))}
                    placeholder="Enter daily limit"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyLimit">Monthly Limit (₹)</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    value={formData.monthlyLimit}
                    onChange={(e) => handleChange("monthlyLimit")(Number(e.target.value))}
                    placeholder="Enter monthly limit"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Charges Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Charges Configuration</CardTitle>
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
                      value={formData.charges.transactionFee}
                      onChange={(e) => handleChange("charges.transactionFee")(Number(e.target.value))}
                      placeholder="Fee amount"
                    />
                    <Badge variant="outline">
                      {formData.charges.isPercentage ? "%" : "₹"}
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
                      value={formData.charges.settlementFee}
                      onChange={(e) => handleChange("charges.settlementFee")(Number(e.target.value))}
                      placeholder="Fee amount"
                    />
                    <Badge variant="outline">
                      {formData.charges.isPercentage ? "%" : "₹"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isPercentage"
                  checked={formData.charges.isPercentage}
                  onCheckedChange={handleChange("charges.isPercentage")}
                />
                <Label htmlFor="isPercentage">Use percentage-based fees</Label>
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
              {bank ? "Update Account" : "Add Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
