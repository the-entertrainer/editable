import { createServerFn } from "@tanstack/react-start";
import { SYSTEM_PROMPT, userPromptForTheme } from "./heisty-dna";
import { isJsonModeUnsupported, isModelUnavailable, resolveGroqModels } from "./groq-models";
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

async function groqComplete(
  apiKey: string,
  model: string,
  messages: { role: string; content: string }[],
  jsonMode = true,
) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.65,
      max_tokens: 6000,
      ...(jsonMode ? { response_format: { type: "json_object" } } : {}),
      messages,
    }),
  });

  const body = (await res.json().catch(() => ({}))) as {
    error?: { message?: string; type?: string };
    choices?: { message?: { content?: string } }[];
  };
  const message = body.error?.message || `Groq returned ${res.status}`;

  if (res.status === 401 || res.status === 403) {
    if (isModelUnavailable(res.status, message)) {
      return { ok: false as const, code: "model" as const, error: message };
    }
    return { ok: false as const, code: "auth" as const, error: "Groq rejected the key. Check it in Keys." };
  }
  if (res.status === 429) {
    return { ok: false as const, code: "rate_limit" as const, error: message };
  }
  if (!res.ok) {
    if (jsonMode && isJsonModeUnsupported(message)) {
      return groqComplete(apiKey, model, messages, false);
    }
    if (isModelUnavailable(res.status, message)) {
      return { ok: false as const, code: "model" as const, error: message };
    }
    return { ok: false as const, code: "upstream" as const, error: message };
  }

  const content = body.choices?.[0]?.message?.content;
  if (!content) {
    return { ok: false as const, code: "upstream" as const, error: "Groq returned an empty completion." };
  }
  return { ok: true as const, content };
}

export const generateStoryboard = createServerFn({ method: "POST" })
  .validator((input: { theme: string; groqKey: string; groqModel?: string }) => input)
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

    const models = resolveGroqModels(data.groqModel);
    let lastError: GenerateErr | null = null;

    for (const model of models) {
      const first = await groqComplete(groqKey, model, messages);
      if (!first.ok) {
        if (first.code === "auth") return first;
        if (first.code === "rate_limit" || first.code === "model" || first.code === "upstream") {
          lastError = {
            ok: false,
            code: first.code === "model" ? "upstream" : first.code,
            error: first.code === "rate_limit"
              ? `${model} is rate-limited. Trying another free model…`
              : `${model}: ${first.error}`,
          };
          continue;
        }
        lastError = first;
        continue;
      }

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
        const retry = await groqComplete(groqKey, model, [
          ...messages,
          { role: "assistant", content: first.content },
          {
            role: "user",
            content: `Your JSON failed validation: ${issues}. Return a corrected JSON object only, same theme, 11–13 clips, contiguous start times.`,
          },
        ]);
        if (!retry.ok) {
          if (retry.code === "auth") return retry;
          lastError = {
            ok: false,
            code: retry.code === "model" ? "upstream" : retry.code,
            error: retry.error,
          };
          continue;
        }
        parsed = tryParse(retry.content);
      }

      if (parsed.success) {
        return { ok: true, board: parsed.data, model };
      }

      lastError = {
        ok: false,
        code: "schema",
        error: `${model} returned invalid storyboard JSON. Trying another free model…`,
      };
    }

    if (lastError?.code === "rate_limit") {
      return {
        ok: false,
        code: "rate_limit",
        error: "All tried Groq free-tier models are rate-limited. Wait a minute and compile again.",
      };
    }

    return lastError ?? {
      ok: false,
      code: "schema",
      error: "No free Groq model returned a valid storyboard. Pick another model in Keys and retry.",
    };
  });
