/** Groq free-plan chat models that support JSON completions. */
export const GROQ_MODEL_AUTO = "auto";

export type GroqModelOption = {
  id: string;
  label: string;
  note: string;
};

export const GROQ_MODELS: GroqModelOption[] = [
  { id: GROQ_MODEL_AUTO, label: "Auto — free-tier fallback", note: "Tries several free models until one compiles" },
  { id: "llama-3.1-8b-instant", label: "Llama 3.1 8B Instant", note: "Highest free daily quota" },
  { id: "openai/gpt-oss-20b", label: "GPT-OSS 20B", note: "Strong JSON on the free plan" },
  { id: "openai/gpt-oss-120b", label: "GPT-OSS 120B", note: "Heavier, tighter quota" },
  { id: "llama-3.3-70b-versatile", label: "Llama 3.3 70B", note: "Original Heisty compiler" },
  { id: "qwen/qwen3.6-27b", label: "Qwen 3.6 27B", note: "Preview, JSON mode" },
  { id: "qwen/qwen3.8-27b", label: "Qwen 3.8 27B", note: "Preview, JSON mode" },
  { id: "moonshotai/kimi-k2-instruct", label: "Kimi K2 Instruct", note: "60 RPM on free" },
];

/** Order used when Auto is selected, or when a picked model is retired / 429'd. */
export const GROQ_FALLBACK_CHAIN = [
  "openai/gpt-oss-20b",
  "llama-3.1-8b-instant",
  "qwen/qwen3.6-27b",
  "llama-3.3-70b-versatile",
  "openai/gpt-oss-120b",
  "qwen/qwen3.8-27b",
] as const;

export const DEFAULT_GROQ_MODEL = GROQ_MODEL_AUTO;

export function resolveGroqModels(preferred: string | undefined): string[] {
  const pick = (preferred ?? DEFAULT_GROQ_MODEL).trim();
  if (!pick || pick === GROQ_MODEL_AUTO) return [...GROQ_FALLBACK_CHAIN];
  return [pick, ...GROQ_FALLBACK_CHAIN.filter((id) => id !== pick)];
}

export function isModelUnavailable(status: number, message: string) {
  const msg = message.toLowerCase();
  if (status === 404) return true;
  const mentionsModel = msg.includes("model");
  return (
    msg.includes("decommissioned") ||
    msg.includes("does not exist") ||
    msg.includes("model_not_found") ||
    msg.includes("unknown model") ||
    msg.includes("no longer supported") ||
    (mentionsModel && (msg.includes("not found") || msg.includes("not allowed") || msg.includes("not permitted") || msg.includes("forbidden")))
  );
}

export function isJsonModeUnsupported(message: string) {
  const msg = message.toLowerCase();
  return msg.includes("json_object") || msg.includes("response_format") || msg.includes("json mode");
}
