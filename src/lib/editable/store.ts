import { create } from "zustand";
import { EARTH_STORYBOARD } from "./demo";
import type { Storyboard } from "./schema";

const BOARD_KEY = "editable.board.v1";

function loadBoard(): Storyboard {
  if (typeof window === "undefined") return EARTH_STORYBOARD;
  try {
    const raw = window.localStorage.getItem(BOARD_KEY);
    if (!raw) return EARTH_STORYBOARD;
    return JSON.parse(raw) as Storyboard;
  } catch {
    return EARTH_STORYBOARD;
  }
}

type Status = "idle" | "generating" | "syncing";

type StudioState = {
  board: Storyboard;
  selectedIndex: number;
  playhead: number;
  playing: boolean;
  status: Status;
  error: string | null;
  lastSyncUrl: string | null;
  hydrated: boolean;
  hydrate: () => void;
  setBoard: (board: Storyboard) => void;
  select: (index: number) => void;
  setPlayhead: (seconds: number) => void;
  setPlaying: (playing: boolean) => void;
  setStatus: (status: Status) => void;
  setError: (error: string | null) => void;
  setLastSyncUrl: (url: string | null) => void;
};

export const useStudio = create<StudioState>((set, get) => ({
  board: EARTH_STORYBOARD,
  selectedIndex: 1,
  playhead: 0,
  playing: false,
  status: "idle",
  error: null,
  lastSyncUrl: null,
  hydrated: false,
  hydrate: () => {
    if (get().hydrated) return;
    const board = loadBoard();
    set({ board, hydrated: true, selectedIndex: board.clips[0]?.index ?? 1 });
  },
  setBoard: (board) => {
    set({ board, selectedIndex: board.clips[0]?.index ?? 1, playhead: 0, playing: false, error: null });
    if (typeof window !== "undefined") {
      window.localStorage.setItem(BOARD_KEY, JSON.stringify(board));
    }
  },
  select: (index) => {
    const clip = get().board.clips.find((c) => c.index === index);
    set({ selectedIndex: index, playhead: clip?.start ?? get().playhead, playing: false });
  },
  setPlayhead: (playhead) => {
    const { board } = get();
    const clip =
      board.clips.find((c) => playhead >= c.start && playhead < c.start + c.duration) ??
      board.clips[board.clips.length - 1];
    set({ playhead, selectedIndex: clip?.index ?? get().selectedIndex });
  },
  setPlaying: (playing) => set({ playing }),
  setStatus: (status) => set({ status }),
  setError: (error) => set({ error }),
  setLastSyncUrl: (lastSyncUrl) => set({ lastSyncUrl }),
}));

export function clipAtPlayhead(board: Storyboard, playhead: number) {
  return (
    board.clips.find((c) => playhead >= c.start && playhead < c.start + c.duration) ??
    board.clips[board.clips.length - 1]
  );
}
