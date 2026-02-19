// components/ui/heading.tsx
import { cn } from "@/lib/cn";

type HeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export function Heading({ eyebrow, title, subtitle, className }: HeadingProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {eyebrow && (
        <p className="text-sm font-medium tracking-wide text-zinc-500">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-lg leading-8 text-zinc-600">
          {subtitle}
        </p>
      )}
    </div>
  );
}
