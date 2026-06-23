"use client";

export interface FilterTab<T extends string> {
  key: T;
  label: string;
  count: number;
}

interface FilterTabsProps<T extends string> {
  tabs: FilterTab<T>[];
  active: T;
  onChange: (key: T) => void;
}

/** Segmented count/label control shared by the customer and agent ticket sidebars. */
export default function FilterTabs<T extends string>({ tabs, active, onChange }: FilterTabsProps<T>) {
  return (
    <div className="flex gap-1">
      {tabs.map(({ key, label, count }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex-1 flex flex-col items-center py-1.5 rounded-lg text-xs font-medium transition-colors ${
            active === key
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <span
            className={`text-base font-bold leading-none mb-0.5 ${
              active === key ? "text-primary-foreground" : "text-foreground"
            }`}
          >
            {count}
          </span>
          {label}
        </button>
      ))}
    </div>
  );
}
