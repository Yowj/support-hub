"use client";

/** Loading skeleton for the ticket sidebars. */
export function TicketListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-px pt-1">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-2.5 px-3 py-3">
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
            <div className="h-2.5 bg-muted/50 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Empty state for the ticket sidebars, with an optional "clear filters" action. */
export function TicketListEmpty({
  message,
  showClear,
  onClear,
}: {
  message: string;
  showClear?: boolean;
  onClear?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-center px-4">
      <p className="text-xs text-muted-foreground">{message}</p>
      {showClear && (
        <button onClick={onClear} className="mt-2 text-xs text-primary hover:text-primary/80">
          Clear filters
        </button>
      )}
    </div>
  );
}
