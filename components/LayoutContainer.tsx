import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type LayoutContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function LayoutContainer({
  children,
  className,
}: LayoutContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
