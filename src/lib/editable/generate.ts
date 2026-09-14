import { createServerFn } from "@tanstack/react-start";
import { GROQ_MODEL, SYSTEM_PROMPT, userPromptForTheme } from "./heisty-dna";
import { safeParseStoryboard, type Storyboard } from "./schema";

type GenerateOk = { ok: true; board: Storyboard; model: string };
type GenerateErr = { ok: false; error: string; code: "missing_key" | "rate_limit" | "auth" | "schema" | "upstream" };
export type GenerateResult = GenerateOk | GenerateErr;

function extractJson(text: string): unknown {
  const trimmed = text.trim();
  const fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const raw = fence ? fence[1].trim() : trimmed;
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("No JSON object in model output");
  return JSON.parse(raw.slice(start, end + 1));
}

async function groqComplete(apiKey: string, messages: { role: string; content: string }[]) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.65,
      max_tokens: 8192,
      response_format: { type: "json_object" },
      messages,
    }),
  });

  const body = (await res.json().catch(() => ({}))) as {
    error?: { message?: string; type?: string };
    choices?: { message?: { content?: string } }[];
  };

  if (res.status === 429) {
    return { ok: false as const, code: "rate_limit" as const, error: "Groq rate limit hit. Wait a few seconds and generate again." };
  }
  if (res.status === 401 || res.status === 403) {
    return { ok: false as const, code: "auth" as const, error: "Groq rejected the key. Check it in Keys." };
  }
  if (!res.ok) {
    const msg = body.error?.message || `Groq returned ${res.status}`;
    return { ok: false as const, code: "upstream" as const, error: msg };
  }

  const content = body.choices?.[0]?.message?.content;
  if (!content) {
    return { ok: false as const, code: "upstream" as const, error: "Groq returned an empty completion." };
  }
  return { ok: true as const, content };
}

export const generateStoryboard = createServerFn({ method: "POST" })
  .validator((input: { theme: string; groqKey: string }) => input)
  .handler(async ({ data }): Promise<GenerateResult> => {
    const theme = data.theme.trim();
    const groqKey = data.groqKey.trim();
    if (!theme) return { ok: false, code: "schema", error: "Name a theme first." };
    if (!groqKey) {
      return {
        ok: false,
        code: "missing_key",
        error: "Add a Groq API key in Keys to compile a new theme.",
      };
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPromptForTheme(theme) },
    ];

    const first = await groqComplete(groqKey, messages);
    if (!first.ok) return first;

    const tryParse = (content: string) => {
      try {
        return safeParseStoryboard(extractJson(content));
      } catch (err) {
        return {
          success: false as const,
          error: { issues: [{ message: err instanceof Error ? err.message : "JSON parse failed" }] },
        };
      }
    };

    let parsed = tryParse(first.content);
    if (!parsed.success) {
      const issues = parsed.error.issues
        .slice(0, 8)
        .map((i) => ("path" in i && Array.isArray((i as { path?: unknown }).path) ? `${(i as { path: unknown[] }).path.join(".")}: ${i.message}` : i.message))
        .join("; ");
      const retry = await groqComplete(groqKey, [
        ...messages,
        { role: "assistant", content: first.content },
        {
          role: "user",
          content: `Your JSON failed validation: ${issues}. Return a corrected JSON object only, same theme, 11–13 clips, contiguous start times.`,
        },
      ]);
      if (!retry.ok) return retry;
      parsed = tryParse(retry.content);
    }

    if (!parsed.success) {
      return {
        ok: false,
        code: "schema",
        error: "The model returned an invalid storyboard. Try again — Groq is fast enough to reroll.",
      };
    }

    return { ok: true, board: parsed.data, model: GROQ_MODEL };
  });
