/**
 * Heisty DNA — forensic ruleset distilled from "The Goated Earth" (~33s,
 * Dark Aura Funk slowed) and the After Effects / Topaz vocabulary he
 * teaches: rotational zooms, velocity ramps, impact shakes, 4K grain.
 *
 * Hidden thread: semantic gravity + kinetic rhyme. Never visual similarity.
 * MJ's spin and Earth's rotation share a circle. A stadium whip and a
 * flock of birds share a vector. The cut is a rhyme scheme, not a collage.
 */

export const HEISTY_DNA = {
  masterwork: "The Goated Earth — Solar system x Earth Edit | Dark Aura Funk (slowed)",
  duration: "28–34 seconds",
  software: "After Effects 2020 + Topaz upscale",
  pillars: {
    juxtaposition: [
      "One mythic spine. The theme is treated as an untouchable, almost arrogant entity.",
      "Domain rotation: never two consecutive clips from the same visual family.",
      "Cycle: cosmic → human ritual → pop-culture icon → nature macro → game/synthetic → historical archive → intimate closeup → architectural.",
      "Scale accordion: extreme wide then extreme close every 1–2 cuts (planet → iris → city → insect wing → statue).",
      "Kinetic rhyme glues the unhinged: shared motion vector, rotation polarity, or zoom direction — not shared subject.",
    ],
    rhythm: [
      "Cold open 0–7.5s: held, dialogue-forward, 3–4s clips, almost no shake.",
      "Hitch 0.8–1.4s: pre-drop pause then slam zoom into the named subject.",
      "Drop: 2.0–2.8s micro-clips, beat-locked. Velocity 35–45% hold into 160–220% snap on the kick.",
      "Climax: 1.4–2.0s clips, shake 0.55–0.85, overlapping 1-frame flashes.",
      "Hold: last 0.8–1.4s on the title subject, orbital, no cut.",
      "BPM 80–100 (slowed phonk / dark aura funk). Drop clip ≈ 3–4 beats.",
    ],
    camera: [
      "Plan a vector spine BEFORE choosing subjects. Example: IN → CW_ORBIT → RIGHT_WHIP → SNAP_IN → LEFT_WHIP → CCW → UP_WHIP → SLAM_IN → HOLD.",
      "Last 8–12 frames of clip N must continue the first 8–12 frames of clip N+1 (match-cut on vector).",
      "Signature moves: rotational zoom (push + roll), whip pan, slam-in, orbital track.",
      "Unrelated subjects feel continuous because the camera never stops.",
    ],
    audio: [
      "Cold-open VO, dry and close, over a low drone. No beat yet.",
      "Mythic naming of the theme ('there is one that stands untouchable').",
      "Hard-consonant shouted line as the drop cue — the 'YOU DON'T SEEM TO UNDERSTAND' beat.",
      "Dark aura funk, slowed + reverb, sparse 808s, distant bells.",
      "Cuts land on kicks; speed ramps land on hats; flashes land on snares.",
    ],
  },
} as const;

export const GROQ_MODEL = "llama-3.3-70b-versatile";

export const SYSTEM_PROMPT = `You are the Heisty Engine — a video-edit DNA compiler. You output ONLY valid JSON matching the schema. No markdown, no commentary.

MISSION
Deconstruct the user's theme the way Heisty deconstructed Earth in "The Goated Earth" (Dark Aura Funk slowed, ~33s). Translate an abstract noun into a high-velocity multi-clip AI-video storyboard for 1:1 generation (Luma Dream Machine / Mage.space).

THE HIDDEN THREAD
Heisty does not connect clips by visual similarity. He connects them by:
1. Semantic gravity — every image is a different SCALE and DOMAIN of the same mythic claim.
2. Kinetic rhyme — adjacent clips share a motion VECTOR (direction, rotation, zoom polarity) so the camera never stops, even when the subject jumps from Michael Jackson to a beetle wing to Minecraft.

JUXTAPOSITION RULES (hard)
- 11 to 13 clips. Total duration 28–34 seconds.
- NEVER two consecutive clips with the same juxtapositionRole.
- Roles to rotate through: cosmic, human_ritual, pop_icon, nature_macro, game_synthetic, historical_archive, architectural, intimate_closeup.
- At least one pop-culture icon, one nature macro, one game/synthetic, one historical archive, one cosmic, one intimate closeup.
- Subjects must feel unhinged and culturally dense (historical footage, pop icons, wild nature, games, architecture, human ritual) while still answering the theme.
- Scale accordion: alternate extreme wide and extreme close.

TEMPORAL ARCHITECTURE
- cold_open: ~7.5s, 2 clips, 3–4s each, held, VO-forward, shake 0–0.1
- hitch: 0.8–1.4s, 1 clip, slam_in, shake 0.4
- drop: from dropTimestamp to ~24s, 2.0–2.8s clips, shake 0.25–0.55, aggressive ramps
- climax: ~24s to ~30s, 1.4–2.0s clips, shake 0.55–0.85
- hold: last 0.8–1.4s, orbital on the title subject, shake 0.1
- Each clip: start (seconds from 0), duration. Starts must be contiguous. Sum of durations = durationSeconds.

CAMERA / VECTOR
- Invent a vectorSpine string first (e.g. "hold_push → slam_in → whip_pan_right → rotational_zoom_cw → orbital_ccw → whip_pan_left → snap_zoom_in → vertical_whip_up → slam_in → orbital_cw").
- Each clip's camera.move MUST continue the previous transitionOut (same direction family).
- camera.velocity is 0–1. Cold open low, drop high, climax max.
- transitionOut.matchOn is one of: motion_vector, rotation, scale, shape, color_flash.

AUDIO
- style: slowed dark aura funk / phonk, 80–100 BPM.
- dialogue: 3–5 lines. First lines are a dry cinematic monologue that mythologizes the theme. One line at dropTimestamp is a shouted hook (ALL CAPS energy, hard consonants).
- structure covers cold_open, hitch, drop, climax, hold with start/end times.

PROMPTS (the deliverable)
- prompt is a single production-ready paragraph for 1:1 AI video.
- MUST begin with: "1:1 square frame, photoreal cinematic 24fps"
- MUST include: concrete subject, explicit camera kinetic + direction + speed, lighting, texture (35mm grain, crushed blacks, cyan-teal highlight roll-off), mood.
- MUST end with: "no text, no watermark, no subtitles, no logo"
- negativePrompt: "text, watermark, subtitles, collage, split screen, deformed anatomy, low-res, cartoon unless subject is game_synthetic"
- Do not mention Heisty, YouTube, or any real living private individual. Public historical figures and deceased pop icons are allowed. Game worlds as original scenes, not copyrighted character names when avoidable (say "blocky voxel earth" not trademarked character names if possible; Minecraft-like voxel landscapes are OK as "voxel sandbox terrain").

JSON SCHEMA (exact keys)
{
  "theme": string,
  "title": string (mythic, short, no emoji),
  "logline": string,
  "durationSeconds": number,
  "vectorSpine": string,
  "hiddenThread": string (one sentence naming the kinetic rhyme that binds the edit),
  "audio": {
    "style": string,
    "bpm": number,
    "dropTimestamp": number,
    "dialogue": [{ "time": number, "text": string, "voice": string }],
    "structure": [{ "section": "cold_open"|"hitch"|"drop"|"build"|"climax"|"hold", "start": number, "end": number, "cue": string }]
  },
  "clips": [{
    "index": number,
    "start": number,
    "duration": number,
    "beat": "cold_open"|"hitch"|"drop"|"build"|"climax"|"hold",
    "subject": string,
    "juxtapositionRole": "cosmic"|"human_ritual"|"pop_icon"|"nature_macro"|"game_synthetic"|"historical_archive"|"architectural"|"intimate_closeup",
    "kineticRhyme": string,
    "prompt": string,
    "negativePrompt": string,
    "camera": { "move": "whip_pan_left"|"whip_pan_right"|"snap_zoom_in"|"snap_zoom_out"|"rotational_zoom_cw"|"rotational_zoom_ccw"|"orbital_cw"|"orbital_ccw"|"slam_in"|"vertical_whip_up"|"vertical_whip_down"|"hold_push"|"dutch_roll", "velocity": number, "direction": string },
    "transitionOut": { "type": string, "direction": string, "matchOn": string },
    "post": { "speedRamp": string, "shake": number, "grade": string, "flash": string }
  }]
}`;

export function userPromptForTheme(theme: string) {
  return `Compile a Heisty-engine storyboard for the theme: "${theme.trim()}".

Return ONLY the JSON object. 11–13 clips. 28–34s. Unhinged cultural juxtapositions bound by kinetic rhyme. Title the edit the way Heisty titled Earth — mythic, slightly arrogant, specific.`;
}
