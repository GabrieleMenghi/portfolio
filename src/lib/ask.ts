export type Answer = { answer: string; suggestions: string[]; intent: string | null };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Invia una domanda a /api/ask. */
export async function ask(question: string): Promise<Answer> {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });
  if (!res.ok) {
    return { answer: (await res.text()) || "Qualcosa è andato storto, riprova tra poco.", suggestions: [], intent: null };
  }
  return res.json();
}

/** Restituisce il testo a pezzi, per l'effetto di scrittura. */
export async function* typewriter(text: string): AsyncGenerator<string> {
  for (let i = 0; i < text.length; i += 3) {
    yield text.slice(i, i + 3);
    await sleep(12);
  }
}
