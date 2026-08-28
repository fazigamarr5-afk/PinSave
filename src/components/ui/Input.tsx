import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-3 text-base rounded-lg border transition-colors",
            "bg-white text-surface-900 placeholder:text-surface-400",
            "border-surface-300 hover:border-surface-400",
            "focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none",
            "dark:bg-surface-900 dark:text-surface-100 dark:placeholder:text-surface-500",
            "dark:border-surface-700 dark:hover:border-surface-600",
            "dark:focus:border-brand-500 dark:focus:ring-brand-500/20",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
