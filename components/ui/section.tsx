// components/ui/section.tsx
import { cn } from "@/lib/cn";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
};

export function Section({ children, className }: SectionProps) {
  return (
    <section className={cn("py-14 md:py-20", className)}>
      {children}
    </section>
  );
}
