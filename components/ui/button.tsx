// components/ui/button.tsx
import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";

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
    "inline-flex h-12 items-center justify-center rounded-full px-5 text-base font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:bg-zinc-800"
      : "border border-black/[.12] text-zinc-950 hover:bg-black/[.04] dark:border-white/[.18] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]";

  if (external) {
    return (
      <a
        className={cn(base, styles, "w-full md:w-auto", className)}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link className={cn(base, styles, "w-full md:w-auto", className)} href={href}>
      {children}
    </Link>
  );
}
