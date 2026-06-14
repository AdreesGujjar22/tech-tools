import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

interface AuthPageProps {
  mode?: "login" | "signup";
  onModeChange?: (mode: "login" | "signup") => void;
  onSubmit?: (data: any) => void;
}

export default function AuthPage({ mode = "login", onModeChange, onSubmit }: AuthPageProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    onSubmit?.(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12 px-4">
      {/* Animated background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 -left-32 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 -right-32 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/40 bg-card/40 backdrop-blur-sm mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Welcome Back
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {mode === "login" ? "Sign In" : "Get Started"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {mode === "login"
              ? "Access your account to continue"
              : "Create an account to get started"}
          </p>
        </div>

        {/* Auth Card */}
        <Card variant="gradient" className="p-8 animate-fade-in-scale">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name - Signup Only */}
            {mode === "signup" && (
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                required
              />
            )}

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
            />

            {/* Password */}
            <div>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>

            {/* Confirm Password - Signup Only */}
            {mode === "signup" && (
              <Input
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                required
              />
            )}

            {/* Show Password Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-xs text-muted-foreground">Show password</span>
            </label>

            {/* Remember / Forgot Password */}
            {mode === "login" && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-border" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <a href="#" className="text-primary hover:text-primary/80 font-medium">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              size="md"
              className="w-full"
              isLoading={isLoading}
            >
              {isLoading
                ? "Loading..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-card text-muted-foreground">or continue with</span>
            </div>
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="w-full">
              Google
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              GitHub
            </Button>
          </div>
        </Card>

        {/* Toggle Auth Mode */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => onModeChange?.("signup")}
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => onModeChange?.("login")}
                className="text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Sign in
              </button>
            </>
          )}
        </div>

        {/* Features List - Signup Only */}
        {mode === "signup" && (
          <div className="mt-8 space-y-3 p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/40">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              What you get
            </p>
            {[
              "Unlimited access to all tools",
              "Save your work to the cloud",
              "Advanced analytics & insights",
              "Priority support",
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
