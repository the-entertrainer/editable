import { z } from "zod";

export const juxtapositionRoles = [
  "cosmic",
  "human_ritual",
  "pop_icon",
  "nature_macro",
  "game_synthetic",
  "historical_archive",
  "architectural",
  "intimate_closeup",
] as const;

export const cameraMoves = [
  "whip_pan_left",
  "whip_pan_right",
  "snap_zoom_in",
  "snap_zoom_out",
  "rotational_zoom_cw",
  "rotational_zoom_ccw",
  "orbital_cw",
  "orbital_ccw",
  "slam_in",
  "vertical_whip_up",
  "vertical_whip_down",
  "hold_push",
  "dutch_roll",
] as const;

export const beatSections = [
  "cold_open",
  "hitch",
  "drop",
  "build",
  "climax",
  "hold",
] as const;

export const JuxtapositionRoleSchema = z.enum(juxtapositionRoles);
export const CameraMoveSchema = z.enum(cameraMoves);
export const BeatSectionSchema = z.enum(beatSections);

export const DialogueLineSchema = z.object({
  time: z.number(),
  text: z.string(),
  voice: z.string(),
});

export const AudioSectionSchema = z.object({
  section: BeatSectionSchema,
  start: z.number(),
  end: z.number(),
  cue: z.string(),
});

export const AudioAnchorSchema = z.object({
  style: z.string(),
  bpm: z.number(),
  dropTimestamp: z.number(),
  dialogue: z.array(DialogueLineSchema).min(1),
  structure: z.array(AudioSectionSchema).min(3),
});

export const CameraSchema = z.object({
  move: CameraMoveSchema,
  velocity: z.number().min(0).max(1),
  direction: z.string(),
});

export const TransitionOutSchema = z.object({
  type: z.string(),
  direction: z.string(),
  matchOn: z.string(),
});

export const PostSchema = z.object({
  speedRamp: z.string(),
  shake: z.number().min(0).max(1),
  grade: z.string(),
  flash: z.string(),
});

export const ClipSchema = z.object({
  index: z.number().int().positive(),
  start: z.number(),
  duration: z.number().positive(),
  beat: BeatSectionSchema,
  subject: z.string(),
  juxtapositionRole: JuxtapositionRoleSchema,
  kineticRhyme: z.string(),
  prompt: z.string(),
  negativePrompt: z.string(),
  camera: CameraSchema,
  transitionOut: TransitionOutSchema,
  post: PostSchema,
});

export const StoryboardSchema = z.object({
  theme: z.string(),
  title: z.string(),
  logline: z.string(),
  durationSeconds: z.number().positive(),
  vectorSpine: z.string(),
  hiddenThread: z.string(),
  audio: AudioAnchorSchema,
  clips: z.array(ClipSchema).min(8).max(16),
});

export type JuxtapositionRole = z.infer<typeof JuxtapositionRoleSchema>;
export type CameraMove = z.infer<typeof CameraMoveSchema>;
export type BeatSection = z.infer<typeof BeatSectionSchema>;
export type Clip = z.infer<typeof ClipSchema>;
export type Storyboard = z.infer<typeof StoryboardSchema>;

export function parseStoryboard(raw: unknown): Storyboard {
  return StoryboardSchema.parse(raw);
}

export function safeParseStoryboard(raw: unknown) {
  return StoryboardSchema.safeParse(raw);
}
