/**
 * Normalize hex color string.
 * Returns #235cc9 as fallback if format is invalid.
 */
export function normalizeHexColor(color?: string): string {
  if (!color || typeof color !== "string") return "#235cc9";

  let hex = color.trim();
  if (!hex.startsWith("#")) hex = `#${hex}`;

  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    hex = `#${hex
      .slice(1)
      .split("")
      .map((char) => char + char)
      .join("")}`;
  }

  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return "#235cc9";

  return hex;
}

/**
 * Get contrasting text color (either #222 or #fff) based on the relative luminance of the background color.
 */
export function getContrastColor(hexColor: string): string {
  let hex = hexColor.trim();
  if (hex.startsWith("#")) hex = hex.slice(1);

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (hex.length !== 6) return "#222";

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const linearize = (c: number): number => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };

  const rLin = linearize(r);
  const gLin = linearize(g);
  const bLin = linearize(b);

  // Relative luminance formula (ITU-R BT.709 with sRGB linearization)
  const luminance = 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;

  const lDark = 0.015873; // Relative luminance of #222
  const lLight = 1.0; // Relative luminance of #fff

  const contrastWithDark =
    luminance > lDark
      ? (luminance + 0.05) / (lDark + 0.05)
      : (lDark + 0.05) / (luminance + 0.05);

  const contrastWithLight =
    lLight > luminance
      ? (lLight + 0.05) / (luminance + 0.05)
      : (luminance + 0.05) / (lLight + 0.05);

  return contrastWithDark >= contrastWithLight ? "#222" : "#fff";
}
