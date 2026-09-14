import type { Clip, JuxtapositionRole } from "@/lib/editable/schema";
import { cn } from "@/lib/utils";

function FrameArt({ role, active }: { role: JuxtapositionRole; active?: boolean }) {
  const ink = active ? "var(--color-fg)" : "var(--color-muted)";
  const dim = "var(--color-border)";
  switch (role) {
    case "cosmic":
      return (
        <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
          <circle cx="50" cy="50" r="38" fill="none" stroke={dim} strokeWidth="0.6" />
          <circle cx="50" cy="50" r="24" fill="none" stroke={ink} strokeWidth="0.8" />
          <circle cx="50" cy="50" r="8" fill={ink} />
          <circle cx="72" cy="28" r="1.2" fill={ink} />
          <circle cx="22" cy="64" r="0.9" fill={ink} />
          <circle cx="80" cy="70" r="0.7" fill={ink} />
          <ellipse cx="50" cy="50" rx="46" ry="14" fill="none" stroke={ink} strokeWidth="0.5" transform="rotate(-18 50 50)" />
        </svg>
      );
    case "pop_icon":
      return (
        <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
          <rect x="28" y="18" width="44" height="64" rx="22" fill="none" stroke={ink} strokeWidth="1.2" />
          <circle cx="50" cy="32" r="10" fill={ink} />
          <path d="M38 78 V52 H62 V78" fill="none" stroke={ink} strokeWidth="1.2" />
          <path d="M18 42 H32 M68 42 H82" stroke={ink} strokeWidth="1" />
        </svg>
      );
    case "nature_macro":
      return (
        <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
          <ellipse cx="50" cy="52" rx="28" ry="34" fill="none" stroke={ink} strokeWidth="1" />
          <ellipse cx="50" cy="52" rx="16" ry="20" fill="none" stroke={dim} strokeWidth="0.8" />
          <ellipse cx="50" cy="52" rx="6" ry="8" fill={ink} />
          <path d="M50 18 C62 36 62 68 50 86 C38 68 38 36 50 18" fill="none" stroke={ink} strokeWidth="0.6" />
        </svg>
      );
    case "game_synthetic":
      return (
        <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
          <g fill="none" stroke={ink} strokeWidth="1">
            <path d="M50 22 L78 38 L78 62 L50 78 L22 62 L22 38 Z" />
            <path d="M50 22 V50 L78 62 M50 50 L22 62" />
          </g>
          <rect x="44" y="44" width="12" height="12" fill={ink} />
        </svg>
      );
    case "historical_archive":
      return (
        <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
          <rect x="18" y="22" width="64" height="56" fill="none" stroke={ink} strokeWidth="1.1" />
          <rect x="24" y="28" width="52" height="36" fill="none" stroke={dim} strokeWidth="0.7" />
          {Array.from({ length: 6 }, (_, i) => (
            <line key={i} x1="24" y1={32 + i * 5} x2="76" y2={32 + i * 5} stroke={ink} strokeWidth="0.35" opacity="0.5" />
          ))}
        </svg>
      );
    case "architectural":
      return (
        <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
          <path d="M18 78 L50 18 L82 78" fill="none" stroke={ink} strokeWidth="1" />
          <path d="M30 78 V48 H70 V78" fill="none" stroke={dim} strokeWidth="0.8" />
          <line x1="18" y1="78" x2="82" y2="78" stroke={ink} strokeWidth="1" />
          <line x1="40" y1="48" x2="40" y2="78" stroke={ink} strokeWidth="0.5" />
          <line x1="60" y1="48" x2="60" y2="78" stroke={ink} strokeWidth="0.5" />
        </svg>
      );
    case "intimate_closeup":
      return (
        <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
          <ellipse cx="50" cy="50" rx="40" ry="22" fill="none" stroke={ink} strokeWidth="1" />
          <circle cx="50" cy="50" r="16" fill="none" stroke={ink} strokeWidth="1.1" />
          <circle cx="50" cy="50" r="6" fill={ink} />
          <circle cx="54" cy="46" r="1.6" fill="var(--color-bg)" />
        </svg>
      );
    case "human_ritual":
      return (
        <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
          <line x1="50" y1="50" x2="84" y2="50" stroke={ink} strokeWidth="0.7" />
          <line x1="50" y1="50" x2="79.4" y2="67" stroke={ink} strokeWidth="0.7" />
          <line x1="50" y1="50" x2="67" y2="79.4" stroke={ink} strokeWidth="0.7" />
          <line x1="50" y1="50" x2="50" y2="84" stroke={ink} strokeWidth="0.7" />
          <line x1="50" y1="50" x2="33" y2="79.4" stroke={ink} strokeWidth="0.7" />
          <line x1="50" y1="50" x2="20.6" y2="67" stroke={ink} strokeWidth="0.7" />
          <line x1="50" y1="50" x2="16" y2="50" stroke={ink} strokeWidth="0.7" />
          <line x1="50" y1="50" x2="20.6" y2="33" stroke={ink} strokeWidth="0.7" />
          <line x1="50" y1="50" x2="33" y2="20.6" stroke={ink} strokeWidth="0.7" />
          <line x1="50" y1="50" x2="50" y2="16" stroke={ink} strokeWidth="0.7" />
          <line x1="50" y1="50" x2="67" y2="20.6" stroke={ink} strokeWidth="0.7" />
          <line x1="50" y1="50" x2="79.4" y2="33" stroke={ink} strokeWidth="0.7" />
          <circle cx="50" cy="50" r="6" fill={ink} />
        </svg>
      );
    default:
      return null;
  }
}

export function ClipFrame({
  clip,
  active,
  compact,
  className,
}: {
  clip: Clip;
  active?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-square overflow-hidden rounded-md border bg-elevated",
        active ? "border-accent" : "border-border",
        className,
      )}
    >
      <div className={cn("absolute inset-0", compact ? "p-2" : "p-3")}>
        <FrameArt role={clip.juxtapositionRole} active={active} />
      </div>
      <span className="pointer-events-none absolute left-1.5 top-1.5 size-2 border-l border-t border-fg/35" />
      <span className="pointer-events-none absolute right-1.5 top-1.5 size-2 border-r border-t border-fg/35" />
      <span className="pointer-events-none absolute bottom-1.5 left-1.5 size-2 border-b border-l border-fg/35" />
      <span className="pointer-events-none absolute bottom-1.5 right-1.5 size-2 border-b border-r border-fg/35" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg to-transparent px-2 pb-1.5 pt-6">
        <p className="font-mono text-xs tabular-nums tracking-wider text-muted">
          {String(clip.index).padStart(2, "0")} · {clip.duration.toFixed(1)}s
        </p>
        {!compact && (
          <p className="truncate font-display text-sm leading-tight text-fg">
            {clip.juxtapositionRole.replaceAll("_", " ")}
          </p>
        )}
      </div>
    </div>
  );
}
