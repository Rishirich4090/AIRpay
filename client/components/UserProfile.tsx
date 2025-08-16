import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  Shield, 
  Edit, 
  Save, 
  X, 
  CreditCard,
  BarChart3,
  Users,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

export function UserProfile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || "");

  if (!user) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSave = () => {
    // In a real app, this would make an API call to update the user
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(user.name);
    setIsEditing(false);
  };

  const adminStats = [
    { icon: Users, label: "Total Users", value: "1,234", color: "text-blue-500" },
    { icon: CreditCard, label: "Total Transactions", value: "45,678", color: "text-green-500" },
    { icon: BarChart3, label: "Revenue", value: "₹12.5M", color: "text-purple-500" },
    { icon: Settings, label: "Active Gateways", value: "8", color: "text-orange-500" },
  ];

  const userStats = [
    { icon: CreditCard, label: "My Transactions", value: "156", color: "text-green-500" },
    { icon: BarChart3, label: "Total Amount", value: "₹45,678", color: "text-blue-500" },
    { icon: Clock, label: "This Month", value: "23", color: "text-purple-500" },
    { icon: Shield, label: "Success Rate", value: "98.5%", color: "text-emerald-500" },
  ];

  const stats = user.role === "admin" ? adminStats : userStats;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <Card className="overflow-hidden animate-in fade-in-0 slide-in-from-top-4 duration-700">
        <div className="h-32 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500" />
        <CardContent className="relative pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 sm:-mt-12">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl animate-in zoom-in-0 duration-500 delay-200">
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/80">
                {user.name.split(" ").map(n => n[0]).join("").toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0 animate-in fade-in-0 slide-in-from-left-4 duration-500 delay-300">
              <div className="flex items-center gap-2 mb-2">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="text-2xl font-bold border-0 bg-transparent p-0 h-auto focus-visible:ring-1"
                    />
                    <Button size="sm" onClick={handleSave} className="h-8 w-8 p-0">
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-foreground truncate">{user.name}</h1>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                      className="h-8 w-8 p-0 hover:scale-110 transition-transform"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                <Badge 
                  variant={user.role === "admin" ? "default" : "secondary"}
                  className={cn(
                    "capitalize transition-all duration-200 hover:scale-105",
                    user.role === "admin" && "bg-gradient-to-r from-orange-500 to-red-500"
                  )}
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {user.role}
                </Badge>
                <span className="flex items-center gap-1 text-sm">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </span>
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={logout}
              className="transition-all duration-200 hover:scale-105 hover:shadow-md"
            >
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card 
            key={stat.label} 
            className="transition-all duration-300 hover:scale-105 hover:shadow-lg animate-in fade-in-0 slide-in-from-bottom-4 duration-500 group"
            style={{ animationDelay: `${400 + index * 100}ms` }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground group-hover:scale-110 transition-transform duration-200">
                    {stat.value}
                  </p>
                </div>
                <stat.icon className={cn("w-8 h-8 transition-all duration-200 group-hover:scale-110", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="animate-in fade-in-0 slide-in-from-left-4 duration-700 delay-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              Your account details and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                <p className="font-medium capitalize">{user.role}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
              <p className="font-medium">{user.email}</p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </Label>
                <p className="font-medium">{formatDate(user.joinDate)}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Last Login
                </Label>
                <p className="font-medium">{formatDateTime(user.lastLogin)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="animate-in fade-in-0 slide-in-from-right-4 duration-700 delay-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Frequently used actions and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
            >
              <Shield className="w-4 h-4 mr-2" />
              Security Settings
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View Reports
            </Button>
            {user.role === "admin" && (
              <Button 
                variant="outline" 
                className="w-full justify-start transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
              >
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
