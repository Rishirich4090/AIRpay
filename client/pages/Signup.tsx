import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SignupForm } from "@/components/SignupForm";

export default function Signup() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    // Apply dark mode
    document.documentElement.classList.add("dark");
  }, []);

  const handleSignupSuccess = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-muted/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-pink-500/10 to-orange-500/10 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/2 transform translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-full blur-2xl animate-pulse delay-2000" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />

      <div className="relative z-10 w-full max-w-md">
        <SignupForm onSuccess={handleSignupSuccess} />
      </div>
    </div>
  );
}
