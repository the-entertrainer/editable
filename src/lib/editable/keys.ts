const STORAGE_KEY = "editable.keys.v1";

export type Keychain = {
  groqKey: string;
  githubPat: string;
  githubOwner: string;
  githubRepo: string;
};

export const DEFAULT_KEYCHAIN: Keychain = {
  groqKey: "",
  githubPat: "",
  githubOwner: "the-entertrainer",
  githubRepo: "editable",
};

export function loadKeychain(): Keychain {
  if (typeof window === "undefined") return DEFAULT_KEYCHAIN;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_KEYCHAIN;
    const parsed = JSON.parse(raw) as Partial<Keychain>;
    return { ...DEFAULT_KEYCHAIN, ...parsed };
  } catch {
    return DEFAULT_KEYCHAIN;
  }
}

export function saveKeychain(keys: Keychain) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
}

export function maskSecret(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length <= 8) return "••••";
  return `${trimmed.slice(0, 4)}…${trimmed.slice(-4)}`;
}
