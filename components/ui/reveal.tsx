"use client";

import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const revealEase = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  x?: number;
  y?: number;
  scale?: number;
  amount?: number;
};

type StaggerGroupProps = {
  children: React.ReactNode;
  className?: string;
  delayChildren?: number;
  stagger?: number;
  amount?: number;
};

type StaggerItemProps = {
  children: React.ReactNode;
  className?: string;
};

export function Reveal({
  children,
  className,
  delay = 0,
  x = 0,
  y = 28,
  scale = 1,
  amount = 0.25,
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={className}
        initial={{ opacity: 0, x, y, scale }}
        whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        viewport={{ once: true, amount }}
        transition={{ duration: 0.7, delay, ease: revealEase }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

export function StaggerGroup({
  children,
  className,
  delayChildren = 0,
  stagger = 0.08,
  amount = 0.2,
}: StaggerGroupProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              delayChildren,
              staggerChildren: stagger,
            },
          },
        }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <m.div
      className={cn(className)}
      variants={{
        hidden: { opacity: 0, y: 24, scale: 0.985 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.6,
            ease: revealEase,
          },
        },
      }}
    >
      {children}
    </m.div>
  );
}
