import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, CreditCard, Loader2, Lock, Mail, User, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const { signup, isLoading } = useAuth();

  const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    const success = await signup(formData);
    if (success) {
      onSuccess?.();
    } else {
      setError("An account with this email already exists");
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6) return { strength: 1, label: "Weak", color: "text-failed" };
    if (password.length < 10) return { strength: 2, label: "Medium", color: "text-pending" };
    return { strength: 3, label: "Strong", color: "text-success" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg animate-in zoom-in-0 duration-500 delay-200">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-2 animate-in fade-in-0 slide-in-from-top-2 duration-500 delay-300">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Join Glidexpay and start managing payments
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 animate-in fade-in-0 slide-in-from-left-2 duration-500 delay-400">
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange("name")}
                placeholder="Enter your full name"
                className="pl-10 transition-all duration-200 hover:border-primary/50 focus:scale-[1.02]"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2 animate-in fade-in-0 slide-in-from-right-2 duration-500 delay-500">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange("email")}
                placeholder="Enter your email"
                className="pl-10 transition-all duration-200 hover:border-primary/50 focus:scale-[1.02]"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2 animate-in fade-in-0 slide-in-from-left-2 duration-500 delay-600">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange("password")}
                placeholder="Create a password"
                className="pl-10 pr-10 transition-all duration-200 hover:border-primary/50 focus:scale-[1.02]"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent transition-all duration-200 hover:scale-110"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {formData.password && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Password strength:</span>
                  <span className={cn("font-medium", passwordStrength.color)}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      passwordStrength.strength === 1 && "w-1/3 bg-failed",
                      passwordStrength.strength === 2 && "w-2/3 bg-pending",
                      passwordStrength.strength === 3 && "w-full bg-success"
                    )}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 animate-in fade-in-0 slide-in-from-right-2 duration-500 delay-700">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange("confirmPassword")}
                placeholder="Confirm your password"
                className="pl-10 pr-10 transition-all duration-200 hover:border-primary/50 focus:scale-[1.02]"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent transition-all duration-200 hover:scale-110"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <CheckCircle className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 text-success animate-in zoom-in-0 duration-200" />
              )}
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="animate-in fade-in-0 shake duration-300">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className={cn(
              "w-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
              "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
              "animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-800"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="text-center animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-900">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline transition-all duration-200 hover:scale-105 inline-block"
            >
              Sign in
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
