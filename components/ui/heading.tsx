import { cn } from "@/lib/cn";
import { Eyebrow, Lead } from "@/components/ui/typography";

type HeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  size?: "section" | "hero";
  className?: string;
};

export function Heading({
  eyebrow,
  title,
  subtitle,
  size = "section",
  className,
}: HeadingProps) {
  const titleClassName =
    size === "hero"
      ? "max-w-[11ch] text-5xl font-semibold leading-[0.92] tracking-[-0.055em] text-zinc-950 sm:text-6xl lg:text-7xl dark:text-zinc-50"
      : "text-3xl font-semibold leading-tight tracking-[-0.045em] text-zinc-950 sm:text-4xl lg:text-[3.15rem] dark:text-zinc-50";

  return (
    <div className={cn("space-y-4", className)}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className={titleClassName}>{title}</h2>
      {subtitle && <Lead>{subtitle}</Lead>}
    </div>
  );
}
