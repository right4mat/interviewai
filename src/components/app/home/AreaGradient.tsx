"use client";
import * as React from "react";

interface AreaGradientProps {
  color: string;
  id: string;
}

export function AreaGradient({ color, id }: AreaGradientProps) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
} 