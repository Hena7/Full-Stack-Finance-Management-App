"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 selection:bg-emerald-100 selection:text-emerald-900">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-24 w-80 h-80 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-40 h-16 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 mb-4 transition-transform hover:scale-105 duration-300">
            <h1 className="text-2xl font-bold bg-linear-to-br from-emerald-500 to-teal-600 bg-clip-text text-transparent">
              BudgetWise
            </h1>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create Account
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Join BudgetWise to start your journey
          </p>
        </div>

        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200 dark:border-slate-800 p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              placeholder="John Doe"
              className="bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 transition-colors"
            />

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              placeholder="name@company.com"
              className="bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 transition-colors"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                placeholder="••••••••"
                className="bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                }
              />

              <Input
                label="Confirm"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
                placeholder="••••••••"
                className="bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 transition-colors"
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                }
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-3 rounded-lg">
                <p className="text-xs text-red-600 dark:text-red-400 text-center font-medium">
                  {error}
                </p>
              </div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full py-6 text-base font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
                isLoading={loading}
              >
                Get Started
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
              >
                Log In
              </Link>
            </p>
          </div>
        </Card>

        <p className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
          Step into financial freedom.
        </p>
      </div>
    </div>
  );
}
