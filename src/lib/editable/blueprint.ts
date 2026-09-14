import type { Storyboard } from "./schema";
import { HEISTY_DNA } from "./heisty-dna";
import { slugify } from "@/lib/utils";

export function storyboardMarkdown(board: Storyboard): string {
  const dialogue = board.audio.dialogue
    .map((d) => `- \`${d.time.toFixed(1)}s\` ${d.text} — _${d.voice}_`)
    .join("\n");

  const structure = board.audio.structure
    .map(
      (s) =>
        `| ${s.section} | ${s.start.toFixed(1)} | ${s.end.toFixed(1)} | ${s.cue} |`,
    )
    .join("\n");

  const clips = board.clips
    .map((clip) => {
      return `### ${String(clip.index).padStart(2, "0")} · ${clip.beat} · ${clip.duration.toFixed(1)}s — ${clip.juxtapositionRole}

**Subject:** ${clip.subject}

**Kinetic rhyme:** ${clip.kineticRhyme}

**Camera:** \`${clip.camera.move}\` · velocity ${clip.camera.velocity} · ${clip.camera.direction}

**Transition out:** ${clip.transitionOut.type} / ${clip.transitionOut.direction} / match on ${clip.transitionOut.matchOn}

**Post:** ramp ${clip.post.speedRamp} · shake ${clip.post.shake} · ${clip.post.grade} · flash: ${clip.post.flash}

**Prompt (1:1 Luma / Mage):**

\`\`\`
${clip.prompt}
\`\`\`

**Negative:** ${clip.negativePrompt}
`;
    })
    .join("\n");

  return `# ${board.title}

Theme: **${board.theme}** · ${board.durationSeconds.toFixed(1)}s · ${board.clips.length} clips · ${board.audio.bpm} BPM

> ${board.logline}

**Hidden thread:** ${board.hiddenThread}

**Vector spine:** \`${board.vectorSpine}\`

## Audio anchor

- Style: ${board.audio.style}
- Drop: \`${board.audio.dropTimestamp.toFixed(1)}s\`

### Dialogue

${dialogue}

### Structure

| Section | Start | End | Cue |
|---|---:|---:|---|
${structure}

## Sequence

${clips}

---

_Compiled by Editable · Heisty Engine · ${HEISTY_DNA.masterwork}_
`;
}

export function githubPaths(board: Storyboard, at = new Date()) {
  const stamp = at.toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const slug = slugify(board.theme);
  const base = `storyboards/${slug}-${stamp}`;
  return {
    json: `${base}.json`,
    markdown: `${base}.md`,
  };
}

export function lumaPack(board: Storyboard) {
  return board.clips
    .map(
      (c) =>
        `--- CLIP ${String(c.index).padStart(2, "0")} · ${c.duration.toFixed(1)}s · ${c.camera.move} ---\n${c.prompt}`,
    )
    .join("\n\n");
}
