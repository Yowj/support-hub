/**
 * Avatar generation via DiceBear's HTTP API.
 *
 * DiceBear (https://www.dicebear.com) is the most widely-used avatar library
 * for JavaScript. We use its hosted HTTP API rather than the npm package so
 * there's nothing to bundle — each (style, seed) pair maps to a stable SVG URL,
 * so the same choice always renders the same face.
 *
 * `boring-avatars` remains the fallback for users who never pick one
 * (see {@link "@/components/shared/UserAvatar"}).
 */

const DICEBEAR_VERSION = "9.x";

/** The DiceBear hostname — keep in sync with next.config image patterns. */
export const DICEBEAR_HOST = "api.dicebear.com";

/** Curated, friendly styles offered in the picker. */
export const AVATAR_STYLES = [
  { id: "adventurer", label: "People" },
  { id: "fun-emoji", label: "Emoji" },
  { id: "bottts", label: "Robots" },
  { id: "notionists", label: "Sketch" },
] as const;

export type AvatarStyle = (typeof AVATAR_STYLES)[number]["id"];

export const DEFAULT_AVATAR_STYLE: AvatarStyle = AVATAR_STYLES[0].id;

/** Build the SVG URL for a given style + seed. */
export function dicebearUrl(style: AvatarStyle, seed: string): string {
  return `https://${DICEBEAR_HOST}/${DICEBEAR_VERSION}/${style}/svg?seed=${encodeURIComponent(
    seed
  )}`;
}

/** True when a stored avatar_url points at a DiceBear avatar we generated. */
export function isDicebearUrl(url: string | null | undefined): boolean {
  return typeof url === "string" && url.includes(DICEBEAR_HOST);
}

export interface AvatarOption {
  style: AvatarStyle;
  seed: string;
  url: string;
}

function randomSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}

/**
 * Build a grid of avatar choices for a style. Pass a stable `baseSeed`
 * (e.g. the user's name) as the first option so the picker always opens on
 * something tied to them, then fill the rest with random seeds.
 */
export function generateAvatarOptions(
  style: AvatarStyle,
  count = 6,
  baseSeed?: string
): AvatarOption[] {
  const seeds: string[] = [];
  if (baseSeed && baseSeed.trim().length > 0) {
    seeds.push(baseSeed.trim().toLowerCase());
  }
  while (seeds.length < count) {
    seeds.push(randomSeed());
  }
  return seeds.slice(0, count).map((seed) => ({
    style,
    seed,
    url: dicebearUrl(style, seed),
  }));
}
