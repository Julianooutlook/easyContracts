import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "green" | "blue" | "amber" | "zinc";
}

export function Badge({ className, variant = "zinc", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        {
          "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400": variant === "green",
          "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400": variant === "blue",
          "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400": variant === "amber",
          "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400": variant === "zinc",
        },
        className
      )}
      {...props}
    />
  );
}
