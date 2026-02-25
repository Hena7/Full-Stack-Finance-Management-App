import * as React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = "md", hover = false, ...props }, ref) => {
    const paddingClass = {
      none: "",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    }[padding];

    return (
      <div
        ref={ref}
        className={cn(
          "bg-white border border-slate-200 dark:bg-slate-800 dark:border-slate-700 rounded-xl transition-all duration-200",
          "shadow-sm",
          paddingClass,
          hover && "hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
          className,
        )}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

export { Card };
