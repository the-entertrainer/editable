import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "untitled"
  );
}

export function formatTimecode(seconds: number) {
  const clamped = Math.max(0, seconds);
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  const whole = Math.floor(s);
  const tenths = Math.floor((s - whole) * 10);
  return `${String(m).padStart(2, "0")}:${String(whole).padStart(2, "0")}.${tenths}`;
}

export async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}
