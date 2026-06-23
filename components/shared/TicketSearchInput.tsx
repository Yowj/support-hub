"use client";

import { Search } from "lucide-react";

interface TicketSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/** Search field shared by the ticket sidebars. */
export default function TicketSearchInput({
  value,
  onChange,
  placeholder = "Search tickets...",
}: TicketSearchInputProps) {
  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-8 pr-3 py-1.5 rounded-md border border-border bg-background text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-transparent transition"
      />
    </div>
  );
}
