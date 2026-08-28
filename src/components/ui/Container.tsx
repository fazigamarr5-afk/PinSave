import { cn } from "@/lib/utils";
import { type HTMLAttributes, forwardRef } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  narrow?: boolean;
}

const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, narrow = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        narrow ? "max-w-3xl" : "max-w-6xl",
        className
      )}
      {...props}
    />
  )
);

Container.displayName = "Container";

export { Container };
