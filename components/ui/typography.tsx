import { cn } from "@/lib/cn";

type TextProps = {
  children: React.ReactNode;
  className?: string;
};

export function Eyebrow({ children, className }: TextProps) {
  return (
    <p
      className={cn(
        "text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400",
        className
      )}
    >
      {children}
    </p>
  );
}

export function Lead({ children, className }: TextProps) {
  return (
    <p
      className={cn(
        "max-w-2xl text-[1.02rem] leading-8 text-zinc-600 sm:text-lg dark:text-zinc-300",
        className
      )}
    >
      {children}
    </p>
  );
}

export function BodyText({ children, className }: TextProps) {
  return <p className={cn("text-sm leading-7", className)}>{children}</p>;
}

export function FinePrint({ children, className }: TextProps) {
  return (
    <p
      className={cn(
        "text-xs font-medium uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400",
        className
      )}
    >
      {children}
    </p>
  );
}
