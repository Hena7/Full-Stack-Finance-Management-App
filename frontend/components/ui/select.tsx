import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: { label: string; value: string | number }[] | string[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    { className, label, error, hint, options, placeholder, id, ...props },
    ref,
  ) => {
    const selectId = id || React.useId();

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-slate-400"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            id={selectId}
            className={cn(
              "flex w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 appearance-none cursor-pointer",
              error && "border-red-500 focus:ring-red-500/50",
              className,
            )}
            ref={ref}
            {...props}
          >
            <option value="" disabled selected>
              {placeholder || "Select an option"}
            </option>
            {options.map((option) => {
              const value = typeof option === "object" ? option.value : option;
              const label = typeof option === "object" ? option.label : option;
              return (
                <option key={String(value)} value={value}>
                  {label}
                </option>
              );
            })}
          </select>
          {/* Custom arrow could go here */}
        </div>

        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : hint ? (
          <p className="text-sm text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Select.displayName = "Select";

export { Select };
