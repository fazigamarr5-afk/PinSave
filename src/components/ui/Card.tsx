import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border bg-white shadow-sm",
        "border-surface-200 dark:bg-surface-900 dark:border-surface-800",
        className
      )}
      {...props}
    />
  )
);

Card.displayName = "Card";

export { Card };
