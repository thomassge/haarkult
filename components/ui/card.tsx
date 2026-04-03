import { cn } from "@/lib/cn";

type CardElement = "article" | "details" | "div" | "section";

type CardProps = {
  as?: CardElement;
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padded?: boolean;
};

export function Card({
  as = "div",
  children,
  className,
  hover = false,
  padded = false,
}: CardProps) {
  const Component = as;

  return (
    <Component
      className={cn(
        "surface-card rounded-[2rem]",
        hover && "surface-card-hover",
        padded && "p-6 sm:p-8",
        className
      )}
    >
      {children}
    </Component>
  );
}
