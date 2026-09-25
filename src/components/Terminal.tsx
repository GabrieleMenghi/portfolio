"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { contacts, experiences, profile, projects, skills } from "@/data/profile";
import { ask } from "@/lib/ask";
import { OPEN_TERMINAL } from "./events";

type Line = { id: number; content: ReactNode };

const user = profile.name.split(" ")[0].toLowerCase();
const PROMPT = (
  <span>
    <span className="text-emerald-400">{user}@portfolio</span>
    <span className="text-zinc-500">:</span>
    <span className="text-sky-400">~</span>
    <span className="text-zinc-500">$ </span>
  </span>
);

const COMMANDS: Record<string, string> = {
  help: "mostra i comandi disponibili",
  whoami: "chi sono",
  projects: "elenco dei progetti",
  "project <n>": "dettagli di un progetto",
  experience: "il mio percorso",
  skills: "competenze tecniche",
  contact: "come contattarmi",
  "ask <domanda>": "fai una domanda all'assistente",
  theme: "cambia tema chiaro/scuro",
  clear: "pulisce lo schermo",
  exit: "chiude il terminale",
};

const banner = (
  <pre className="text-accent leading-tight">
    {`  ┌─────────────────────────────────────┐
  │  ${profile.name.padEnd(35)}│
  │  ${profile.role.padEnd(35)}│
  └─────────────────────────────────────┘`}
    <span className="text-zinc-400">{"\n"}Digita </span>
    <span className="text-zinc-100">help</span>
    <span className="text-zinc-400"> per iniziare.</span>
  </pre>
);

function run(cmd: string, arg: string): ReactNode {
  switch (cmd) {
    case "help":
      return (
        <div className="grid grid-cols-[auto_1fr] gap-x-6">
          {Object.entries(COMMANDS).map(([c, d]) => (
            <div key={c} className="contents">
              <span className="text-sky-400">{c}</span>
              <span className="text-zinc-400">{d}</span>
            </div>
          ))}
        </div>
      );
    case "whoami":
      return (
        <div className="space-y-2">
          <p className="text-zinc-100">
            {profile.name} — {profile.role}
          </p>
          {profile.about.map((p) => (
            <p key={p} className="text-zinc-400">
              {p}
            </p>
          ))}
        </div>
      );
    case "projects":
      return (
        <div>
          {projects.map((p, i) => (
            <p key={p.slug}>
              <span className="text-amber-300">[{i + 1}]</span> <span className="text-zinc-100">{p.title}</span>{" "}
              <span className="text-zinc-500">— {p.tagline}</span>
            </p>
          ))}
          <p className="mt-2 text-zinc-500">Usa `project 1` per i dettagli.</p>
        </div>
      );
    case "project": {
      const p = projects[Number(arg) - 1];
      if (!p) return <p className="text-rose-400">Progetto non trovato. Prova `projects`.</p>;
      return (
        <div className="space-y-1">
          <p className="text-zinc-100">{p.title}</p>
          <p>
            <span className="text-sky-400">problema:</span> <span className="text-zinc-400">{p.problem}</span>
          </p>
          <p>
            <span className="text-sky-400">soluzione:</span> <span className="text-zinc-400">{p.solution}</span>
          </p>
          <p>
            <span className="text-sky-400">ai:</span> <span className="text-zinc-400">{p.ai}</span>
          </p>
          <p>
            <span className="text-sky-400">flusso:</span> <span className="text-zinc-400">{p.flow.join(" → ")}</span>
          </p>
          <p>
            <span className="text-sky-400">stack:</span> <span className="text-zinc-400">{p.tags.join(", ")}</span>
          </p>
        </div>
      );
    }
    case "experience":
      return (
        <div>
          {experiences.map((e) => (
            <p key={e.company + e.period}>
              <span className="text-amber-300">{e.period.padEnd(14)}</span>
              <span className="text-zinc-100">{e.role}</span> <span className="text-zinc-500">@ {e.company}</span>
            </p>
          ))}
        </div>
      );
    case "skills":
      return (
        <div>
          {skills.map((g) => (
            <p key={g.name}>
              <span className="text-sky-400">{g.name.padEnd(10)}</span>{" "}
              <span className="text-zinc-400">{g.items.join(" · ")}</span>
            </p>
          ))}
        </div>
      );
    case "contact":
      return (
        <div>
          {contacts.map((c) => (
            <p key={c.label}>
              <span className="text-sky-400">{c.label.padEnd(10)}</span>{" "}
              <a href={c.href} target="_blank" rel="noreferrer" className="text-zinc-100 underline">
                {c.value}
              </a>
            </p>
          ))}
        </div>
      );
    case "sudo":
      return <p className="text-rose-400">Bel tentativo 😉 ma qui i permessi di root non li ha nessuno.</p>;
    default:
      return (
        <p className="text-rose-400">
          comando non trovato: {cmd}. Digita <span className="text-zinc-100">help</span>.
        </p>
      );
  }
}

export default function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>([{ id: 0, content: banner }]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);

  const push = useCallback((content: ReactNode) => {
    const id = nextId.current++;
    setLines((l) => [...l, { id, content }]);
    return id;
  }, []);

  useEffect(() => {
    const show = () => setOpen(true);
    const onKey = (e: globalThis.KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (e.key === "`" && !typing) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener(OPEN_TERMINAL, show);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener(OPEN_TERMINAL, show);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const execute = async (raw: string) => {
    const line = raw.trim();
    push(
      <p>
        {PROMPT}
        <span className="text-zinc-100">{line}</span>
      </p>,
    );
    if (!line) return;
    setHistory((h) => [...h, line]);
    setCursor(-1);

    const [cmd, ...args] = line.split(/\s+/);
    const arg = args.join(" ");
    const name = cmd.toLowerCase();

    if (name === "clear") return setLines([]);
    if (name === "exit") return setOpen(false);
    if (name === "theme") {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch {}
      return push(<p className="text-zinc-400">tema: {next}</p>);
    }
    if (name === "ask") {
      if (!arg) return push(<p className="text-rose-400">uso: ask &lt;domanda&gt;</p>);
      setBusy(true);
      const id = push(<p className="text-zinc-500">…</p>);
      let text = "";
      try {
        for await (const chunk of ask(arg)) {
          text += chunk;
          const current = text;
          setLines((l) =>
            l.map((x) =>
              x.id === id ? { id, content: <p className="whitespace-pre-line text-zinc-300">{current}</p> } : x,
            ),
          );
        }
      } finally {
        setBusy(false);
        inputRef.current?.focus();
      }
      return;
    }
    push(run(name, arg));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !busy) {
      execute(input);
      setInput("");
    } else if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const next = cursor === -1 ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setInput(history[next]);
    } else if (e.key === "ArrowDown" && cursor !== -1) {
      e.preventDefault();
      const next = cursor + 1;
      setCursor(next >= history.length ? -1 : next);
      setInput(next >= history.length ? "" : history[next]);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const match = Object.keys(COMMANDS)
        .map((c) => c.split(" ")[0])
        .find((c) => c.startsWith(input.toLowerCase()));
      if (match && input) setInput(match + " ");
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-3 backdrop-blur-sm sm:p-6"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal
      aria-label="Terminale"
    >
      <div
        className="flex h-[80svh] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0b0d12] font-mono text-[13px] text-zinc-300 shadow-2xl"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.focus();
        }}
      >
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/5 px-4 py-2.5">
          <button aria-label="Chiudi" onClick={() => setOpen(false)} className="h-3 w-3 rounded-full bg-rose-500" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="ml-3 text-xs text-zinc-500">
            {user}@portfolio: ~ — premi Esc per uscire
          </span>
        </div>
        <div ref={bodyRef} className="flex-1 space-y-2 overflow-y-auto p-4 leading-relaxed">
          {lines.map((l) => (
            <div key={l.id}>{l.content}</div>
          ))}
          <div className="flex">
            {PROMPT}
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              readOnly={busy}
              spellCheck={false}
              autoComplete="off"
              aria-label="Comando"
              className="flex-1 bg-transparent text-zinc-100 caret-emerald-400 outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
