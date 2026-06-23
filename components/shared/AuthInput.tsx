"use client";

import { useState } from "react";

interface AuthInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  suffix?: React.ReactNode;
  error?: boolean;
}

/**
 * Animated floating-label input for the auth forms.
 * The label lifts and the bottom border sweeps in on focus.
 */
export default function AuthInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  required,
  suffix,
  error,
}: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        placeholder=" "
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        required={required}
        className={`peer w-full px-4 pt-5 pb-2 rounded-xl bg-background text-foreground outline-none text-sm
          border transition-[border-color,box-shadow] duration-200
          ${suffix ? "pr-12" : ""}
          ${error
            ? "border-destructive focus:ring-2 focus:ring-destructive/25"
            : "border-input focus:border-foreground/30 focus:ring-2 focus:ring-ring/20"
          }`}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 pointer-events-none select-none origin-left
          transition-all duration-200 ease-out
          ${lifted ? "top-1.5 text-[11px] font-semibold" : "top-3.5 text-sm"}
          ${error
            ? "text-destructive"
            : lifted ? "text-foreground/70" : "text-muted-foreground"
          }`}
      >
        {label}
        {required && <span className="text-destructive ml-0.5">*</span>}
      </label>

      {/* Sliding focus underline */}
      <span
        className={`pointer-events-none absolute bottom-0 left-1/2 h-0.5 -translate-x-1/2 rounded-full
          transition-all duration-300 ease-out
          ${error ? "bg-destructive" : "bg-gradient-to-r from-[hsl(var(--brand-from))] to-[hsl(var(--brand-to))]"}
          ${focused ? "w-[calc(100%-1.5rem)]" : "w-0"}`}
      />

      {suffix && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</div>
      )}
    </div>
  );
}
