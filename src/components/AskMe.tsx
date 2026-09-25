"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ask } from "@/lib/ask";
import { suggestions } from "@/lib/knowledge";
import { profile } from "@/data/profile";

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function AskMe() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Ciao! Sono l'assistente di ${profile.name.split(" ")[0]}. Chiedimi pure del suo lavoro, dei progetti o di come usa l'AI.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    setInput("");
    setBusy(true);
    setMessages((m) => [...m, { role: "user", content: q }, { role: "assistant", content: "" }]);

    try {
      for await (const chunk of ask(q)) {
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, content: last.content + chunk };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: "Non riesco a rispondere ora, riprova tra poco." };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <div className="card flex h-[520px] flex-col overflow-hidden">
      <div className="flex items-center gap-3 border-b border-line px-5 py-3">
        <div className="grid h-8 w-8 place-items-center rounded-full bg-accent text-sm text-on-accent">
          ✦
        </div>
        <div>
          <p className="text-sm font-medium">Assistente</p>
          <p className="text-xs text-muted">Risponde solo con informazioni verificate</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5" aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                m.role === "user" ? "rounded-br-sm bg-accent text-on-accent" : "rounded-bl-sm bg-surface-2"
              }`}
            >
              {m.content ||
                (busy && i === messages.length - 1 && (
                  <span className="inline-flex gap-1">
                    {[0, 150, 300].map((d) => (
                      <span
                        key={d}
                        className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted"
                        style={{ animationDelay: `${d}ms` }}
                      />
                    ))}
                  </span>
                ))}
            </div>
          </div>
        ))}
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 px-5 pb-3">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-fg"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={onSubmit} className="flex gap-2 border-t border-line p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Scrivi una domanda…"
          maxLength={300}
          aria-label="La tua domanda"
          className="flex-1 rounded-xl bg-surface-2 px-4 py-2.5 text-sm outline-none ring-accent focus:ring-2"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="rounded-xl bg-accent px-4 text-sm font-medium text-on-accent transition-opacity disabled:opacity-40"
        >
          Invia
        </button>
      </form>
    </div>
  );
}
