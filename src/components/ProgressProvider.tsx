"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  emptyProgress,
  mergeProgress,
  readProgress,
  type Progress,
} from "@/lib/progress";
type User = { id: string; name: string; username: string; optIn: boolean };
type Store = {
  progress: Progress;
  ready: boolean;
  user: User | null;
  sync: string;
  authEnabled: boolean;
  update: (fn: (p: Progress) => Progress) => boolean;
  refresh: () => Promise<void>;
  importGuest: () => void;
  hasGuest: boolean;
};
const Context = createContext<Store | null>(null);
const guestKey = "geekspeak:guest:v1";
function read(key: string) {
  try {
    return readProgress(JSON.parse(localStorage.getItem(key) || "null"));
  } catch {
    return emptyProgress();
  }
}
export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(emptyProgress);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [sync, setSync] = useState("Saved on this device");
  const [authEnabled, setAuthEnabled] = useState(false);
  const [hasGuest, setHasGuest] = useState(false);
  const key = useRef(guestKey);
  const current = useRef(progress);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generation = useRef(0);
  const pending = useRef(false);
  const userRef = useRef<User | null>(null);
  const save = useCallback((next: Progress) => {
    current.current = next;
    setProgress(next);
    try {
      localStorage.setItem(key.current, JSON.stringify(next));
      return true;
    } catch {
      setSync("Device storage is unavailable. Keep this page open.");
      return false;
    }
  }, []);
  const send = useCallback(async () => {
    if (!userRef.current) return;
    const epoch = generation.current;
    const snapshot = current.current;
    setSync("Saving…");
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snapshot),
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (epoch !== generation.current) return;
      save(mergeProgress(data.progress, current.current));
      pending.current = false;
      setSync("Saved across your devices");
    } catch {
      if (epoch === generation.current) {
        pending.current = true;
        setSync("Saved here. Cloud sync will retry.");
      }
    }
  }, [save]);
  const refresh = useCallback(async () => {
    const epoch = ++generation.current;
    if (process.env.NEXT_PUBLIC_GUEST_ONLY === "true") {
      key.current = guestKey;
      userRef.current = null;
      setUser(null);
      setAuthEnabled(false);
      const stored = save(read(guestKey));
      setReady(true);
      if (stored) setSync("Saved on this device");
      return;
    }
    try {
      const response = await fetch("/api/profile", { cache: "no-store" });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (epoch !== generation.current) return;
      userRef.current = data.user;
      setUser(data.user);
      setAuthEnabled(data.authEnabled);
      key.current = data.user ? `geekspeak:user:${data.user.id}:v1` : guestKey;
      const local = read(key.current);
      const next = data.progress ? mergeProgress(data.progress, local) : local;
      const stored = save(next);
      const guest = read(guestKey);
      setHasGuest(
        Boolean(
          data.user &&
          (guest.learned.length ||
            guest.completed.length ||
            Object.values(guest.bookmarks).some((m) => m.value)),
        ),
      );
      if (stored)
        setSync(
          data.user ? "Saved across your devices" : "Saved on this device",
        );
      setReady(true);
      if (data.user) {
        pending.current = true;
        void send();
      }
    } catch {
      if (epoch !== generation.current) return;
      const stored = save(read(key.current));
      setReady(true);
      if (stored) setSync("Saved on this device");
    }
  }, [save, send]);
  useEffect(() => {
    void refresh();
    const onOnline = () => {
      if (pending.current) void send();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === key.current && e.newValue) {
        try {
          save(
            mergeProgress(
              current.current,
              readProgress(JSON.parse(e.newValue)),
            ),
          );
        } catch {}
      }
    };
    window.addEventListener("online", onOnline);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("storage", onStorage);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [refresh, send, save]);
  const update = useCallback(
    (fn: (p: Progress) => Progress) => {
      const stored = save(fn(current.current));
      if (userRef.current) {
        pending.current = true;
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => void send(), 500);
      } else if (stored) setSync("Saved on this device");
      return stored;
    },
    [save, send],
  );
  const importGuest = () => {
    const stored = update((p) => mergeProgress(p, read(guestKey)));
    if (!stored) return;
    try {
      localStorage.removeItem(guestKey);
    } catch {}
    setHasGuest(false);
  };
  return (
    <Context.Provider
      value={{
        progress,
        ready,
        user,
        sync,
        authEnabled,
        update,
        refresh,
        importGuest,
        hasGuest,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useProgress() {
  const value = useContext(Context);
  if (!value) throw new Error("Progress provider is missing");
  return value;
}
