import BoringAvatar from "boring-avatars";

interface UserAvatarProps {
  /** Display name / email — used for the boring-avatars fallback and alt text. */
  name: string;
  /** A chosen avatar URL (e.g. DiceBear). Falls back to a generated avatar when absent. */
  src?: string | null;
  size?: number;
  className?: string;
}

/**
 * One avatar to rule them all: renders the user's chosen `src` when present,
 * otherwise a deterministic `boring-avatars` placeholder derived from `name`.
 * Use this everywhere a person is shown so picked avatars surface consistently.
 */
export default function UserAvatar({ name, src, size = 40, className }: UserAvatarProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- external SVG; next/image adds no value here
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        className={`rounded-full bg-muted object-cover ${className ?? ""}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span className={className} style={{ display: "inline-flex" }}>
      <BoringAvatar name={name} size={size} />
    </span>
  );
}
