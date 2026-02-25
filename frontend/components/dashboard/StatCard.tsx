import React from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFinance } from "@/lib/context/FinanceContext";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  variant?: "primary" | "success" | "danger" | "warning";
}

export function StatCard({
  label,
  value,
  icon: Icon,
  variant = "primary",
}: StatCardProps) {
  const { formatCurrency } = useFinance();

  const getVariantStyles = () => {
    switch (variant) {
      case "success":
        return {
          icon: "bg-emerald-500/10 text-emerald-500",
          text: "text-emerald-500",
        };
      case "danger":
        return {
          icon: "bg-red-500/10 text-red-500",
          text: "text-red-500",
        };
      case "warning":
        return {
          icon: "bg-amber-500/10 text-amber-500",
          text: "text-amber-500",
        };
      default:
        return {
          icon: "bg-blue-500/10 text-blue-500",
          text: "text-blue-500",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={cn("p-3 rounded-xl", styles.icon)}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {label}
          </p>
          <h3 className={cn("text-2xl font-bold mt-1", styles.text)}>
            {formatCurrency(value)}
          </h3>
        </div>
      </div>
    </Card>
  );
}
