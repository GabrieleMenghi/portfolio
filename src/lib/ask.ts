const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Invia una domanda a /api/ask e restituisce la risposta a pezzi, con un effetto di scrittura. */
export async function* ask(question: string): AsyncGenerator<string> {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  const text = (await res.text()) || "Qualcosa è andato storto, riprova tra poco.";
  if (!res.ok) {
    yield text;
    return;
  }

  for (let i = 0; i < text.length; i += 3) {
    yield text.slice(i, i + 3);
    await sleep(12);
  }
}
