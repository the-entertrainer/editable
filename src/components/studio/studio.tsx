import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clapperboard,
  Copy,
  Github,
  Loader2,
  Pause,
  Play,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ClipFrame } from "@/components/studio/clip-frame";
import { DnaSheet } from "@/components/studio/dna-sheet";
import { KeysDialog } from "@/components/studio/keys-dialog";
import { lumaPack } from "@/lib/editable/blueprint";
import { EARTH_STORYBOARD } from "@/lib/editable/demo";
import { generateStoryboard } from "@/lib/editable/generate";
import { syncStoryboard } from "@/lib/editable/github";
import { loadKeychain } from "@/lib/editable/keys";
import { clipAtPlayhead, useStudio } from "@/lib/editable/store";
import { copyText, cn, formatTimecode } from "@/lib/utils";

const THEMES = ["Earth", "Humanity", "Chaos", "Time", "Silence"] as const;

export function Studio() {
  const {
    board,
    selectedIndex,
    playhead,
    playing,
    status,
    error,
    lastSyncUrl,
    hydrate,
    setBoard,
    select,
    setPlayhead,
    setPlaying,
    setStatus,
    setError,
    setLastSyncUrl,
  } = useStudio();

  const [theme, setTheme] = useState("Earth");
  const [copied, setCopied] = useState<"prompt" | "pack" | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const selected = board.clips.find((c) => c.index === selectedIndex) ?? board.clips[0];
  const drop = board.audio.dropTimestamp;
  const progress = board.durationSeconds > 0 ? playhead / board.durationSeconds : 0;

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const next = useStudio.getState().playhead + dt;
      if (next >= board.durationSeconds) {
        setPlayhead(board.durationSeconds);
        setPlaying(false);
        return;
      }
      setPlayhead(next);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, board.durationSeconds, setPlayhead, setPlaying]);

  useEffect(() => {
    const node = railRef.current?.querySelector(`[data-clip="${selectedIndex}"]`);
    node?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [selectedIndex]);

  const liveClip = useMemo(() => clipAtPlayhead(board, playhead), [board, playhead]);

  async function onGenerate() {
    const keys = loadKeychain();
    const nextTheme = theme.trim() || "Earth";
    if (!keys.groqKey) {
      if (nextTheme.toLowerCase() === "earth") {
        setBoard(EARTH_STORYBOARD);
        toast.message("Earth masterwork loaded. Add a Groq key to compile other themes.");
        return;
      }
      setError("Add a Groq API key in Keys to compile a new theme.");
      toast.error("Groq key required");
      return;
    }
    setStatus("generating");
    setError(null);
    try {
      const result = await generateStoryboard({ data: { theme: nextTheme, groqKey: keys.groqKey } });
      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      setBoard(result.board);
      setTheme(result.board.theme);
      toast.success(`${result.board.title} · ${result.board.clips.length} clips`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Generation failed";
      setError(message);
      toast.error(message);
    } finally {
      setStatus("idle");
    }
  }

  async function onSync() {
    const keys = loadKeychain();
    setStatus("syncing");
    setError(null);
    try {
      const result = await syncStoryboard({
        data: {
          githubPat: keys.githubPat,
          githubOwner: keys.githubOwner,
          githubRepo: keys.githubRepo,
          board,
        },
      });
      if (!result.ok) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      setLastSyncUrl(result.url);
      toast.success("Blueprint committed");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sync failed";
      setError(message);
      toast.error(message);
    } finally {
      setStatus("idle");
    }
  }

  async function copyPrompt() {
    if (!selected) return;
    await copyText(selected.prompt);
    setCopied("prompt");
    toast.success("Prompt copied");
    setTimeout(() => setCopied(null), 1600);
  }

  async function copyPack() {
    await copyText(lumaPack(board));
    setCopied("pack");
    toast.success("Luma pack copied");
    setTimeout(() => setCopied(null), 1600);
  }

  const busy = status !== "idle";

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 md:px-6">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">Heisty engine</p>
          <h1 className="font-display text-2xl italic leading-none text-fg md:text-3xl">Editable</h1>
        </div>
        <div className="flex items-center gap-1">
          <DnaSheet />
          <KeysDialog />
        </div>
      </header>

      <section className="border-b border-border px-4 py-5 md:px-6 md:py-7">
        <p className="font-display text-3xl leading-[1.1] tracking-tight text-fg md:text-5xl">
          Name the cut.
        </p>
        <p className="mt-2 max-w-xl text-sm text-muted">
          A theme becomes a 32-second storyboard: cold-open VO, unhinged juxtapositions, 1:1 Luma prompts, vector-continuous
          transitions.
        </p>
        <form
          className="mt-5 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            void onGenerate();
          }}
        >
          <Input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="Earth, Humanity, Chaos…"
            aria-label="Theme"
            className="h-12 font-display text-lg"
          />
          <Button type="submit" className="h-12 shrink-0 px-6" disabled={busy}>
            {status === "generating" ? <Loader2 className="animate-spin" /> : <Clapperboard />}
            Compile
          </Button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={cn(
                "h-9 rounded-full border px-3 text-xs tracking-wide",
                theme === t ? "border-accent bg-accent text-accent-fg" : "border-border text-muted hover:text-fg",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </section>

      <section className="border-b border-border px-4 py-4 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">{board.theme}</p>
            <h2 className="font-display text-2xl leading-tight md:text-3xl">{board.title}</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted">{board.logline}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{board.clips.length} clips</Badge>
            <Badge variant="outline">{board.durationSeconds.toFixed(1)}s</Badge>
            <Badge variant="accent">{board.audio.bpm} BPM</Badge>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm text-fg/80">
          <span className="text-muted">Hidden thread · </span>
          {board.hiddenThread}
        </p>
        <p className="mt-1 font-mono text-[11px] leading-relaxed text-subtle">{board.vectorSpine}</p>
      </section>

      <section className="border-b border-border px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="subtle"
            size="icon"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => {
              if (playhead >= board.durationSeconds - 0.05) setPlayhead(0);
              setPlaying(!playing);
            }}
          >
            {playing ? <Pause /> : <Play />}
          </Button>
          <div className="min-w-0 flex-1">
            <div className="relative h-8 overflow-hidden rounded-sm bg-elevated">
              <div className="film-sprocket absolute inset-x-0 top-0 h-2 opacity-70" />
              <div className="film-sprocket absolute inset-x-0 bottom-0 h-2 opacity-70" />
              <div className="absolute inset-y-2 left-0 bg-accent/25" style={{ width: `${progress * 100}%` }} />
              <div
                className="absolute top-1.5 bottom-1.5 w-px bg-impact"
                style={{ left: `${(drop / board.durationSeconds) * 100}%` }}
              />
              <button
                type="button"
                className="absolute inset-0"
                aria-label="Scrub timeline"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width;
                  setPlayhead(x * board.durationSeconds);
                  setPlaying(false);
                }}
              />
            </div>
            <div className="mt-1 flex justify-between font-mono text-[10px] tabular-nums text-muted">
              <span>{formatTimecode(playhead)}</span>
              <span>drop {formatTimecode(drop)}</span>
              <span>{formatTimecode(board.durationSeconds)}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {board.audio.dialogue.map((line) => (
            <button
              key={`${line.time}-${line.text}`}
              type="button"
              onClick={() => {
                setPlayhead(line.time);
                setPlaying(false);
              }}
              className="min-w-[12rem] shrink-0 rounded-md border border-border bg-surface px-3 py-2 text-left"
            >
              <p className="font-mono text-[10px] tabular-nums text-muted">{formatTimecode(line.time)}</p>
              <p className="text-sm leading-snug text-fg">{line.text}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 py-4 md:px-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Sequence</h3>
          <p className="font-mono text-[10px] text-subtle">
            live {String(liveClip?.index ?? 0).padStart(2, "0")} / {String(board.clips.length).padStart(2, "0")}
          </p>
        </div>
        <div ref={railRef} className="flex gap-3 overflow-x-auto pb-2">
          {board.clips.map((clip) => {
            const active = clip.index === selectedIndex;
            return (
              <button
                key={clip.index}
                type="button"
                data-clip={clip.index}
                onClick={() => select(clip.index)}
                className="w-40 shrink-0 text-left"
              >
                <ClipFrame clip={clip} active={active} compact />
              </button>
            );
          })}
        </div>
      </section>

      {selected && (
        <section className="grid flex-1 gap-6 border-t border-border px-4 py-5 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:px-6 md:py-6">
          <div className="mx-auto w-full max-w-xs">
            <ClipFrame clip={selected} active />
            <div className="mt-3 flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Previous clip"
                onClick={() => select(Math.max(1, selected.index - 1))}
              >
                <ChevronLeft />
              </Button>
              <Badge variant={selected.beat === "drop" || selected.beat === "climax" ? "impact" : "accent"}>
                {selected.beat.replaceAll("_", " ")}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Next clip"
                onClick={() => select(Math.min(board.clips.length, selected.index + 1))}
              >
                <ChevronRight />
              </Button>
            </div>
          </div>

          <div className="min-w-0">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
              {selected.juxtapositionRole.replaceAll("_", " ")} · {selected.camera.move.replaceAll("_", " ")} · v
              {selected.camera.velocity.toFixed(2)}
            </p>
            <h3 className="mt-1 font-display text-2xl leading-tight">{selected.subject}</h3>
            <p className="mt-2 text-sm text-muted">{selected.kineticRhyme}</p>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
              <Spec label="Transition" value={`${selected.transitionOut.type} ${selected.transitionOut.direction}`} />
              <Spec label="Match" value={selected.transitionOut.matchOn} />
              <Spec label="Ramp" value={selected.post.speedRamp} />
              <Spec label="Shake" value={selected.post.shake.toFixed(2)} />
            </dl>
            <p className="mt-3 text-xs text-subtle">{selected.post.grade}</p>
            <p className="text-xs text-subtle">Flash · {selected.post.flash}</p>

            <Separator className="my-4" />

            <div className="flex flex-wrap gap-2">
              <Button variant="default" size="sm" onClick={() => void copyPrompt()}>
                {copied === "prompt" ? <Check /> : <Copy />}
                Copy prompt
              </Button>
              <Button variant="outline" size="sm" onClick={() => void copyPack()}>
                {copied === "pack" ? <Check /> : <Copy />}
                Copy luma pack
              </Button>
              <Button variant="outline" size="sm" onClick={() => void onSync()} disabled={busy}>
                {status === "syncing" ? <Loader2 className="animate-spin" /> : <Github />}
                Sync to GitHub
              </Button>
            </div>

            <pre className="mt-4 max-h-64 overflow-auto rounded-lg border border-border bg-elevated p-3 font-mono text-[11px] leading-relaxed text-fg/90 whitespace-pre-wrap">
              {selected.prompt}
            </pre>
            <p className="mt-2 font-mono text-[10px] text-subtle">Negative · {selected.negativePrompt}</p>
          </div>
        </section>
      )}

      {(error || lastSyncUrl) && (
        <footer className="border-t border-border px-4 py-3 text-xs md:px-6">
          {error && <p className="text-impact">{error}</p>}
          {lastSyncUrl && (
            <a href={lastSyncUrl} target="_blank" rel="noreferrer" className="text-accent underline-offset-2 hover:underline">
              Open last commit on GitHub
            </a>
          )}
        </footer>
      )}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-border bg-surface px-3 py-2">
      <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted">{label}</dt>
      <dd className="mt-0.5 truncate text-fg">{value}</dd>
    </div>
  );
}
