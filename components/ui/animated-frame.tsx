"use client";

import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Radio del borde (default: 12px) */
  radius?: number;
  /** Color del borde (default: teal-600) */
  color?: string;
};

export function AnimatedFrame({ children, className, radius = 12, color = "#0d9488" }: Props) {
  return (
    <div
      className={cn("animated-frame-wrapper relative w-full", className)}
      style={{ borderRadius: radius }}
    >
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
        style={{ borderRadius: radius }}
      >
        <rect
          className="af-rect-glow"
          x="0" y="0" width="100%" height="100%"
          rx={radius} ry={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          pathLength={100}
          opacity="0.25"
          vectorEffect="non-scaling-stroke"
        />
        <rect
          className="af-rect"
          x="0" y="0" width="100%" height="100%"
          rx={radius} ry={radius}
          fill="none"
          stroke={color}
          strokeWidth="2"
          pathLength={100}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {children}
    </div>
  );
}
