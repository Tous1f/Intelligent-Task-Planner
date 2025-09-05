import * as React from "react";
import { cn } from "@/lib/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive";
  className?: string;
  children: React.ReactNode;
}

export default function Alert({
  variant = "default",
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full rounded-lg border p-4",
        "backdrop-blur-sm backdrop-saturate-150",
        {
          "bg-white/90 dark:bg-slate-900/90 border-border/50 dark:border-white/10 text-foreground": variant === "default",
          "bg-destructive/10 dark:bg-destructive/20 border-destructive/50 text-destructive dark:text-destructive-foreground": variant === "destructive",
        },
        "transition-colors duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => {
  return (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    >
      {children}
    </h5>
  );
});
AlertTitle.displayName = "AlertTitle";

export const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    >
      {children}
    </div>
  );
});
AlertDescription.displayName = "AlertDescription";
