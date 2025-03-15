import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
  showLabel?: boolean;
}

const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  className,
  label = "Copy",
  variant = "outline",
  size = "sm",
  showIcon = true,
  showLabel = true,
}) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        description: "Copied to clipboard!",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        variant: "destructive",
        description: "Failed to copy to clipboard",
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn("flex items-center gap-1", className)}
    >
      {showIcon &&
        (copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />)}
      {showLabel && <span>{copied ? "Copied!" : label}</span>}
    </Button>
  );
};

export default CopyButton;
