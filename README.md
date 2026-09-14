# Editable

Heisty-engine storyboard compiler. Name a theme — get a 32-second kinetic-rhyme sequence with 1:1 Luma / Mage prompts, camera vectors, and GitHub blueprint sync.

## Keys

Open **Keys** in the app:

- **Groq API key** — compiles new themes. Default is **Auto**: it walks free-tier models (`gpt-oss-20b` → `llama-3.1-8b-instant` → Qwen → Llama 3.3 70B → …) when one is rate-limited or retired. Pick any model in Keys, or paste a custom Groq id.
- **GitHub PAT** (`repo` scope) — commits storyboard JSON + markdown into this account

Keys stay in the browser. They are never committed.

## Stack

TanStack Start, React 19, Tailwind v4, Zustand, Zod, Groq, GitHub REST.

The Earth masterwork loads without a Groq key so the timeline is playable immediately.
