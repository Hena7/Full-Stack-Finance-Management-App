import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || React.useId();

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-slate-400"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[80px] w-full rounded-lg border border-slate-700 dark:bg-slate-800 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-none",
            error && "border-red-500 focus:ring-red-500/50",
            className,
          )}
          ref={ref}
          {...props}
        />

        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : hint ? (
          <p className="text-sm text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
