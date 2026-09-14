import { createServerFn } from "@tanstack/react-start";
import { githubPaths, storyboardMarkdown } from "./blueprint";
import { parseStoryboard, type Storyboard } from "./schema";

type SyncOk = { ok: true; url: string; files: string[] };
type SyncErr = { ok: false; error: string; code: "missing_token" | "auth" | "forbidden" | "upstream" };
export type SyncResult = SyncOk | SyncErr;

const GH = "https://api.github.com";

function encodeRepoPath(path: string) {
  return path
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");
}

async function gh(token: string, path: string, init: RequestInit = {}) {
  const res = await fetch(`${GH}${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      "User-Agent": "Editable-Heisty-Engine",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { message: text };
  }
  return { res, json };
}

function messageOf(json: unknown) {
  if (json && typeof json === "object" && "message" in json && typeof json.message === "string") {
    return json.message;
  }
  return "GitHub request failed";
}

async function ensureRepo(token: string, owner: string, repo: string): Promise<SyncErr | null> {
  const existing = await gh(token, `/repos/${owner}/${repo}`);
  if (existing.res.ok) return null;
  if (existing.res.status === 401) {
    return { ok: false, code: "auth", error: "GitHub rejected the token. Check the PAT in Keys." };
  }
  if (existing.res.status !== 404) {
    if (existing.res.status === 403) {
      return { ok: false, code: "forbidden", error: "The token cannot read this repository." };
    }
    return { ok: false, code: "upstream", error: messageOf(existing.json) };
  }

  const created = await gh(token, "/user/repos", {
    method: "POST",
    body: JSON.stringify({
      name: repo,
      description: "Editable — Heisty-engine storyboards and blueprints",
      private: false,
      auto_init: true,
    }),
  });
  if (created.res.ok || created.res.status === 422) return null;
  if (created.res.status === 401) {
    return { ok: false, code: "auth", error: "GitHub rejected the token. Check the PAT in Keys." };
  }
  if (created.res.status === 403) {
    return {
      ok: false,
      code: "forbidden",
      error: `Cannot create ${owner}/${repo}. The token must belong to that account (repo scope).`,
    };
  }
  return { ok: false, code: "upstream", error: messageOf(created.json) };
}

async function putFile(
  token: string,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
) {
  const encoded = Buffer.from(content, "utf8").toString("base64");
  const encodedPath = encodeRepoPath(path);
  const current = await gh(token, `/repos/${owner}/${repo}/contents/${encodedPath}`);
  const sha =
    current.res.ok && current.json && typeof current.json === "object" && "sha" in current.json
      ? String((current.json as { sha: string }).sha)
      : undefined;

  return gh(token, `/repos/${owner}/${repo}/contents/${encodedPath}`, {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: encoded,
      sha,
      branch: "main",
    }),
  });
}

export const syncStoryboard = createServerFn({ method: "POST" })
  .validator(
    (input: {
      githubPat: string;
      githubOwner: string;
      githubRepo: string;
      board: Storyboard;
    }) => input,
  )
  .handler(async ({ data }): Promise<SyncResult> => {
    const token = data.githubPat.trim();
    const owner = data.githubOwner.trim().replace(/^@/, "");
    const repo = data.githubRepo.trim().replace(/\.git$/, "");
    if (!token) {
      return { ok: false, code: "missing_token", error: "Add a GitHub PAT in Keys to sync blueprints." };
    }
    if (!owner || !repo) {
      return { ok: false, code: "upstream", error: "Set GitHub owner and repository in Keys." };
    }

    let board: Storyboard;
    try {
      board = parseStoryboard(data.board);
    } catch {
      return { ok: false, code: "upstream", error: "Storyboard failed schema before sync." };
    }

    const missing = await ensureRepo(token, owner, repo);
    if (missing) return missing;

    const paths = githubPaths(board);
    const md = storyboardMarkdown(board);
    const json = JSON.stringify(board, null, 2);
    const message = `storyboard: ${board.theme} (${board.clips.length} clips, ${board.durationSeconds.toFixed(0)}s)`;

    const jsonPut = await putFile(token, owner, repo, paths.json, json, message);
    if (!jsonPut.res.ok) {
      if (jsonPut.res.status === 401) return { ok: false, code: "auth", error: "GitHub rejected the token." };
      if (jsonPut.res.status === 403) {
        return { ok: false, code: "forbidden", error: "The token cannot write to this repository." };
      }
      return { ok: false, code: "upstream", error: messageOf(jsonPut.json) };
    }

    const mdPut = await putFile(token, owner, repo, paths.markdown, md, message);
    if (!mdPut.res.ok) {
      return { ok: false, code: "upstream", error: `JSON synced, markdown failed: ${messageOf(mdPut.json)}` };
    }

    return {
      ok: true,
      url: `https://github.com/${owner}/${repo}/blob/main/${paths.markdown}`,
      files: [paths.json, paths.markdown],
    };
  });
