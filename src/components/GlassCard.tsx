import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "neo";
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = "default",
  hover = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        variant === "default" ? "glass-panel" : "neo-panel",
        hover && "card-hover",
        "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
