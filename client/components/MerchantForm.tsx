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

export interface Merchant {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  businessType: string;
  status: "active" | "inactive" | "pending" | "suspended";
  dailyLimit: number;
  monthlyLimit: number;
  settlementType: "daily" | "weekly" | "monthly";
  apiKey: string;
  secretKey: string;
  webhookUrl: string;
  createdAt: string;
  lastTransaction: string;
  totalTransactions: number;
  totalVolume: number;
}

interface MerchantFormProps {
  merchant?: Merchant;
  isOpen: boolean;
  onClose: () => void;
  onSave: (merchant: Omit<Merchant, "id" | "createdAt" | "lastTransaction" | "totalTransactions" | "totalVolume">) => void;
}

export function MerchantForm({ merchant, isOpen, onClose, onSave }: MerchantFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: merchant?.businessName || "",
    contactName: merchant?.contactName || "",
    email: merchant?.email || "",
    phone: merchant?.phone || "",
    address: merchant?.address || "",
    city: merchant?.city || "",
    state: merchant?.state || "",
    pincode: merchant?.pincode || "",
    businessType: merchant?.businessType || "",
    status: merchant?.status || "pending",
    dailyLimit: merchant?.dailyLimit || 100000,
    monthlyLimit: merchant?.monthlyLimit || 3000000,
    settlementType: merchant?.settlementType || "daily",
    apiKey: merchant?.apiKey || `API_${Date.now()}`,
    secretKey: merchant?.secretKey || `SEC_${Date.now()}`,
    webhookUrl: merchant?.webhookUrl || "",
  });

  const handleChange = (field: string) => (value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const businessTypes = [
    "E-commerce",
    "Digital Services",
    "SaaS",
    "Marketplace",
    "Travel & Tourism",
    "Food & Beverage",
    "Healthcare",
    "Education",
    "Entertainment",
    "Other"
  ];

  const statusOptions = [
    { value: "active", label: "Active", color: "bg-success" },
    { value: "inactive", label: "Inactive", color: "bg-muted" },
    { value: "pending", label: "Pending", color: "bg-pending" },
    { value: "suspended", label: "Suspended", color: "bg-failed" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {merchant ? "Edit Merchant" : "Add New Merchant"}
          </DialogTitle>
          <DialogDescription>
            {merchant ? "Update merchant information and settings" : "Create a new merchant account with payment gateway access"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleChange("businessName")(e.target.value)}
                    placeholder="Enter business name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleChange("contactName")(e.target.value)}
                    placeholder="Enter contact person name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email")(e.target.value)}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone")(e.target.value)}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Select value={formData.businessType} onValueChange={handleChange("businessType")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address")(e.target.value)}
                  placeholder="Enter complete address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city")(e.target.value)}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange("state")(e.target.value)}
                    placeholder="Enter state"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleChange("pincode")(e.target.value)}
                    placeholder="Enter pincode"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyLimit">Daily Transaction Limit (₹)</Label>
                  <Input
                    id="dailyLimit"
                    type="number"
                    value={formData.dailyLimit}
                    onChange={(e) => handleChange("dailyLimit")(Number(e.target.value))}
                    placeholder="Enter daily limit"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyLimit">Monthly Transaction Limit (₹)</Label>
                  <Input
                    id="monthlyLimit"
                    type="number"
                    value={formData.monthlyLimit}
                    onChange={(e) => handleChange("monthlyLimit")(Number(e.target.value))}
                    placeholder="Enter monthly limit"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="settlementType">Settlement Type</Label>
                <Select value={formData.settlementType} onValueChange={handleChange("settlementType")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Settlement</SelectItem>
                    <SelectItem value="weekly">Weekly Settlement</SelectItem>
                    <SelectItem value="monthly">Monthly Settlement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    value={formData.apiKey}
                    onChange={(e) => handleChange("apiKey")(e.target.value)}
                    placeholder="API Key"
                    readOnly
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secretKey">Secret Key</Label>
                  <Input
                    id="secretKey"
                    value={formData.secretKey}
                    onChange={(e) => handleChange("secretKey")(e.target.value)}
                    placeholder="Secret Key"
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  value={formData.webhookUrl}
                  onChange={(e) => handleChange("webhookUrl")(e.target.value)}
                  placeholder="https://your-domain.com/webhook"
                />
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
              {merchant ? "Update Merchant" : "Create Merchant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
