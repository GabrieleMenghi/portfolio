import { reply } from "@/lib/assistant/match";

// Risponde con le domande e risposte di src/lib/assistant: niente modelli né API esterne.
const MAX_QUESTION = 300;

// Rate limit in memoria: sufficiente per un singolo server.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  if (limited(ip)) {
    return new Response("Troppe domande in poco tempo: riprova tra un minuto.", { status: 429 });
  }

  let body: { question?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response("Richiesta non valida.", { status: 400 });
  }

  const question = typeof body.question === "string" ? body.question.trim().slice(0, MAX_QUESTION) : "";
  if (!question) return new Response("Domanda vuota.", { status: 400 });

  const { answer, suggestions } = reply(question);
  return Response.json({ answer, suggestions });
}
