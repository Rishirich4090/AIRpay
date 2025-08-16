import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, CreditCard, Loader2, Lock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { AIRpayLogo } from "@/components/AIRpayLogo";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const success = await login(email, password);
    if (success) {
      onSuccess?.();
    } else {
      setError("Invalid email or password");
    }
  };

  const fillDemoCredentials = (type: "admin" | "user") => {
    if (type === "admin") {
      setEmail("admin@airpay.com");
      setPassword("admin123");
    } else {
      setEmail("user@airpay.com");
      setPassword("user123");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-2xl border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-xl animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto animate-in zoom-in-0 duration-500 delay-200">
          <AIRpayLogo size="lg" className="justify-center" />
        </div>
        <div className="space-y-2 animate-in fade-in-0 slide-in-from-top-2 duration-500 delay-300">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access your AIRpay dashboard
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Demo Credentials */}
        <div className="grid grid-cols-2 gap-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-400">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fillDemoCredentials("admin")}
            className="text-xs transition-all duration-200 hover:scale-105 hover:shadow-md bg-success/10 hover:bg-success/20 border-success/20"
          >
            Admin Demo
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fillDemoCredentials("user")}
            className="text-xs transition-all duration-200 hover:scale-105 hover:shadow-md bg-pending/10 hover:bg-pending/20 border-pending/20"
          >
            User Demo
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 animate-in fade-in-0 slide-in-from-left-2 duration-500 delay-500">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="pl-10 transition-all duration-200 hover:border-primary/50 focus:scale-[1.02]"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2 animate-in fade-in-0 slide-in-from-right-2 duration-500 delay-600">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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
              "bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 hover:from-blue-600 hover:via-purple-600 hover:to-indigo-700",
              "animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-700"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="text-center space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-800">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline transition-all duration-200 hover:scale-105 inline-block"
            >
              Sign up
            </Link>
          </p>
          
          <div className="text-xs text-muted-foreground/70 space-y-1">
            <p>Demo Credentials:</p>
            <p>Admin: admin@airpay.com / admin123</p>
            <p>User: user@airpay.com / user123</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
