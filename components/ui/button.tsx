import Link from "next/link";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "highlight";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  external?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  external,
}: ButtonProps) {
  const base =
    "inline-flex min-h-12 w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold tracking-[-0.01em] transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:w-auto";
  const styles =
    variant === "primary"
      ? "bg-[var(--accent)] text-[var(--accent-foreground)] shadow-[0_20px_40px_-24px_rgba(23,19,15,0.65)] hover:-translate-y-0.5 hover:brightness-105"
      : variant === "highlight"
        ? "border border-[var(--line-strong)] bg-[linear-gradient(180deg,var(--surface-strong)_0%,var(--surface)_100%)] text-[var(--foreground)] shadow-[var(--shadow-strong)] ring-1 ring-white/35 backdrop-blur-md hover:-translate-y-0.5 hover:border-[var(--line-strong)] hover:brightness-[1.03] dark:ring-white/10"
        : "border border-[var(--line-strong)] bg-white/55 text-[var(--foreground)] backdrop-blur-sm hover:-translate-y-0.5 hover:bg-white/75 dark:bg-white/5 dark:hover:bg-white/8";

  if (external) {
    return (
      <a
        className={cn(base, styles, className)}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={cn(base, styles, className)} href={href}>
      {children}
    </Link>
  );
}
