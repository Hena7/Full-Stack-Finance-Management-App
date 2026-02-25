import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export function LoadingSpinner({ className, size = 24 }: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn("animate-spin text-inherit", className)}
      size={size}
    />
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 dark:bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="dark:bg-slate-800 p-6 rounded-xl shadow-xl flex flex-col items-center gap-4 border dark:border-slate-700">
        <LoadingSpinner size={40} className="text-teal-500" />
        <p className="dark:text-slate-200 font-medium">Processing...</p>
      </div>
    </div>
  );
}
