"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ask, typewriter } from "@/lib/ask";
import { intents, starters } from "@/lib/assistant/faq";
import { track } from "@/lib/track";

const starterQuestions = starters.map((id) => intents.find((i) => i.id === id)?.label ?? "");

type ChatMessage = { role: "user" | "assistant"; content: string };

export default function AskMe() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Ciao! Sono Gabriele, o meglio la mia versione automatica. Chiedimi del mio lavoro, dei progetti o di come uso l'AI.",
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(starterQuestions);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    setInput("");
    setBusy(true);
    setSuggestions([]);
    setMessages((m) => [...m, { role: "user", content: q }, { role: "assistant", content: "" }]);

    try {
      const { answer, suggestions: next, intent } = await ask(q);
      // Le domande non riconosciute dicono quali risposte mancano.
      track("Chat", intent ? { voce: intent } : { voce: "non riconosciuta", domanda: q.slice(0, 200) });
      for await (const chunk of typewriter(answer)) {
        setMessages((m) => {
          const copy = [...m];
          const last = copy[copy.length - 1];
          copy[copy.length - 1] = { ...last, content: last.content + chunk };
          return copy;
        });
      }
      setSuggestions(next);
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

      {!busy && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 px-5 pb-3" aria-label="Domande suggerite">
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
