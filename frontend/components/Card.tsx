import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  noPadding = false,
}) => {
  return (
    <div
      className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-none ${noPadding ? "" : "p-6"} ${className}`}
    >
      {children}
    </div>
  );
};
