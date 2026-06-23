import * as React from "react";

/** Small mono eyebrow used to label every landing section. */
export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
      {children}
    </span>
  );
}
