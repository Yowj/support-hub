"use client";

import { useEffect, useState } from "react";
import { Shuffle, Check } from "lucide-react";
import {
  AVATAR_STYLES,
  DEFAULT_AVATAR_STYLE,
  generateAvatarOptions,
  type AvatarOption,
  type AvatarStyle,
} from "@/lib/avatars";

interface AvatarPickerProps {
  value: string | null;
  onChange: (url: string) => void;
  /** Seeds the first option so the grid opens on something tied to the user. */
  seedHint?: string;
}

/**
 * Lets the user pick a DiceBear avatar: switch styles, browse a grid of faces,
 * or hit Shuffle for a fresh set. Reports the chosen SVG URL up via `onChange`.
 */
export default function AvatarPicker({ value, onChange, seedHint }: AvatarPickerProps) {
  const [style, setStyle] = useState<AvatarStyle>(DEFAULT_AVATAR_STYLE);
  const [options, setOptions] = useState<AvatarOption[]>([]);

  // Rebuild the grid when the style changes (and on mount), auto-selecting the
  // first face so a choice is always in play. seedHint is intentionally left out
  // of the deps so we don't reshuffle on every keystroke in the name field.
  useEffect(() => {
    const next = generateAvatarOptions(style, 6, seedHint);
    setOptions(next);
    onChange(next[0].url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [style]);

  const shuffle = () => {
    const next = generateAvatarOptions(style, 6);
    setOptions(next);
    onChange(next[0].url);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {AVATAR_STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setStyle(s.id)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
                style === s.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/70"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={shuffle}
          className="flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <Shuffle className="h-3 w-3" />
          Shuffle
        </button>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {options.map((opt) => {
          const selected = opt.url === value;
          return (
            <button
              key={opt.url}
              type="button"
              onClick={() => onChange(opt.url)}
              aria-pressed={selected}
              aria-label="Choose this avatar"
              className={`relative aspect-square rounded-full ring-2 transition-all ${
                selected
                  ? "scale-105 ring-foreground"
                  : "ring-transparent hover:ring-border"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- external SVG */}
              <img
                src={opt.url}
                alt=""
                loading="lazy"
                className="h-full w-full rounded-full bg-muted object-cover"
              />
              {selected && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-background">
                  <Check className="h-2.5 w-2.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
