"use client";

import { cn } from "@/lib/utils";
import React from "react";
import styles from "./sparkle-animation.module.css";

const Sparkle = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={cn(styles.sparkle, className)}
  >
    <path
      d="M8 0L9.06218 5.83955L11.9282 2.97351L10.2361 7.23607L14.5 5.5L10.2361 8.76393L11.9282 13.0265L9.06218 10.1604L8 16L6.93782 10.1604L4.07181 13.0265L5.76393 8.76393L1.5 5.5L5.76393 7.23607L4.07181 2.97351L6.93782 5.83955L8 0Z"
      fill="url(#sparkle-gradient)"
    />
    <defs>
      <radialGradient id="sparkle-gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(8 8) rotate(90) scale(8)">
        <stop stopColor="#FFC0CB"/>
        <stop offset="1" stopColor="#E6E6FA" stopOpacity="0"/>
      </radialGradient>
    </defs>
  </svg>
);

export const SparkleAnimation = ({ visible }: { visible: boolean }) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {[...Array(6)].map((_, i) => (
        <Sparkle
          key={i}
          className={cn(styles[`sparkle-${i + 1}`])}
        />
      ))}
    </div>
  );
};
