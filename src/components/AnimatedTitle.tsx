import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedTitleProps {
  children: React.ReactNode;
  className?: string;
  subtitle?: string;
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  children,
  className,
  subtitle,
}) => {
  return (
    <div className="relative mb-12 text-center">
      {subtitle && (
        <div className="inline-block px-3 py-1 mb-4 text-xs rounded-full bg-primary/10 text-primary">
          {subtitle}
        </div>
      )}
      <h1
        className={cn(
          "text-4xl md:text-5xl lg:text-6xl font-bold text-gradient animate-pulse-slow",
          className
        )}
      >
        {children}
      </h1>
      <div className="h-1 w-20 bg-primary/30 mx-auto mt-6 rounded-full overflow-hidden">
        <div className="h-full w-1/2 bg-primary animate-flow rounded-full"></div>
      </div>
    </div>
  );
};

export default AnimatedTitle;
