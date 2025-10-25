import { ClassValue, clsx } from "clsx"
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getContrastColor(hexColor: string) {
  if (!hexColor) return "#000"; // fallback

  // Remove # if present
  const c = hexColor.startsWith("#") ? hexColor.substring(1) : hexColor;

  // Convert 3-digit hex to 6-digit
  const hex = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calculate luminance (0 = dark, 255 = light)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b);

  return luminance > 186 ? "#000000" : "#ffffff"; // dark text for light bg, white text for dark bg
}
