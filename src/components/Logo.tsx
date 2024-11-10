import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  className?: string;
};

const Logo = ({ className }: Props) => {
  return (
    <span
      className={cn(
        "text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent",
        className
      )}
    >
      TaskWave
    </span>
  );
};

export default Logo;
