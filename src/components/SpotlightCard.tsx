"use client";

import type { HTMLAttributes, PointerEvent } from "react";

// Card con bordo che si illumina nel punto in cui si trova il mouse.
export default function SpotlightCard({ className = "", children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div {...rest} onPointerMove={onPointerMove} className={`card spotlight ${className}`}>
      {children}
    </div>
  );
}
