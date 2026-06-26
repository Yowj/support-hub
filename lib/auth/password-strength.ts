const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLOR = ["", "bg-danger", "bg-warning", "bg-info", "bg-success"];
const STRENGTH_TEXT = ["", "text-danger", "text-warning", "text-info", "text-success"];

/** Score a password 0–4 by length and character-class variety. */
export function getPasswordStrength(pw: string): number {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

/** Presentation metadata (label + tailwind classes) for a given strength score. */
export function getStrengthMeta(score: number) {
  return {
    label: STRENGTH_LABEL[score],
    color: STRENGTH_COLOR[score],
    text: STRENGTH_TEXT[score],
  };
}
