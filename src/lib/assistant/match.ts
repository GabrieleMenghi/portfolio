import { contacts } from "@/data/profile";
import { intents, starters, type Context, type Intent } from "./faq";

// Sceglie la risposta confrontando la domanda con i modi previsti di porla.
// 1. Le parole sconosciute vengono corrette con la più simile del vocabolario (refusi).
// 2. Se restano sconosciute le parole che contano ("cucinare", "aws"), non risponde a caso.
// 3. Domanda ed esempi diventano vettori TF-IDF di parole (ridotte alla radice) e di
//    trigrammi di lettere; vince la voce con l'esempio più simile, sopra una soglia.

export type Reply = {
  answer: string;
  /** Domande da proporre come suggerimenti */
  suggestions: string[];
  /** Voce scelta, o null se la domanda non è stata riconosciuta */
  intent: string | null;
  score: number;
};

const ANSWER_THRESHOLD = 0.42;
const SUGGEST_THRESHOLD = 0.2;
/** Quota minima della domanda fatta di parole conosciute */
const MIN_COVERAGE = 0.5;
/** Somiglianza minima (trigrammi) per correggere un refuso */
const TYPO_SIMILARITY = 0.55;

// Parole che non dicono nulla sulla domanda.
const STOPWORDS = new Set(
  "il lo la gli le un uno una di da in con su per tra fra ed ma che del dello della dei degli delle dell al allo alla ai agli alle all nel nello nella nei negli nelle nell dal dalla dall sul sulla sull mi ti ci si tu io me te tuo tua tuoi tue mio mia miei mie qual quale quali po".split(
    " ",
  ),
);

// Parole generiche: servono a distinguere le domande, ma da sole non bastano
// a capire di cosa si parla ("sai cucinare?" non è una domanda sul sapere).
const GENERIC = new Set(
  "hai ha sei sai fai fa puoi dai mai usi usato usare conosci come cosa dove quanto quanti quando chi perche cos sono stai hanno".split(
    " ",
  ),
);

type Vector = Map<string, number>;

export function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’`]/g, " ")
    .replace(/[^a-z0-9#.+\s]/g, " ")
    .replace(/(^|\s)\.+|\.+(\s|$)/g, " ")
    .split(/[\s+]+/)
    .filter((w) => w.length > 1 || w === "c" || /\d/.test(w));
}

const tokens = (text: string) => normalize(text).filter((w) => !STOPWORDS.has(w));

// Radice minima: toglie le vocali finali, così "progetto" e "progetti" coincidono.
const stem = (w: string) => (w.length > 4 ? w.replace(/[aeiou]+$/, "") : w);

function trigrams(word: string): string[] {
  const padded = ` ${word} `;
  const out: string[] = [];
  for (let i = 0; i + 3 <= padded.length; i++) out.push(padded.slice(i, i + 3));
  return out;
}

function features(words: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  const add = (f: string, n: number) => counts.set(f, (counts.get(f) ?? 0) + n);
  for (const word of words) {
    add(`w:${stem(word)}`, 2);
    for (const t of trigrams(word)) add(`t:${t}`, 0.5);
  }
  return counts;
}

function build() {
  const docs = intents.flatMap((intent) =>
    [intent.label, ...intent.questions].map((q) => ({ intent, words: tokens(q) })),
  );
  const vocab = new Set(docs.flatMap((d) => d.words));

  const raws = docs.map((d) => features(d.words));
  const df = new Map<string, number>();
  for (const raw of raws) for (const f of raw.keys()) df.set(f, (df.get(f) ?? 0) + 1);
  const idf = (f: string) => Math.log((docs.length + 1) / ((df.get(f) ?? 0) + 1)) + 1;

  const weigh = (raw: Map<string, number>): Vector => {
    const v: Vector = new Map();
    let norm = 0;
    for (const [f, tf] of raw) {
      const w = tf * idf(f);
      v.set(f, w);
      norm += w * w;
    }
    norm = Math.sqrt(norm) || 1;
    for (const [f, w] of v) v.set(f, w / norm);
    return v;
  };

  const examples = docs.map((d, i) => ({ intent: d.intent, vector: weigh(raws[i]) }));
  return { examples, weigh, vocab: [...vocab].map((w) => ({ w, grams: new Set(trigrams(w)) })) };
}

const index = build();
const byId = new Map(intents.map((i) => [i.id, i]));
const known = new Set(index.vocab.map((v) => v.w));

/** La parola del vocabolario più simile, o null se nessuna lo è abbastanza. */
function correct(word: string): string | null {
  // Le parole generiche restano come sono: "mai" non è un refuso di "mail".
  if (known.has(word) || GENERIC.has(word)) return word;
  if (word.length < 3 || /\d/.test(word)) return null;
  const grams = new Set(trigrams(word));
  let best: string | null = null;
  let bestSim = TYPO_SIMILARITY;
  for (const { w, grams: other } of index.vocab) {
    let common = 0;
    for (const g of grams) if (other.has(g)) common++;
    const sim = (2 * common) / (grams.size + other.size);
    if (sim >= bestSim) {
      best = w;
      bestSim = sim;
    }
  }
  return best;
}

function analyze(question: string) {
  const words = tokens(question);
  let knownWeight = 0;
  let totalWeight = 0;
  const corrected = words.map((w) => {
    const c = correct(w);
    const weight = GENERIC.has(c ?? w) ? 0.3 : 1;
    totalWeight += weight;
    if (c) knownWeight += weight;
    return c ?? w;
  });
  return { words: corrected, coverage: totalWeight ? knownWeight / totalWeight : 0 };
}

function cosine(a: Vector, b: Vector): number {
  let dot = 0;
  const [small, large] = a.size < b.size ? [a, b] : [b, a];
  for (const [f, w] of small) dot += w * (large.get(f) ?? 0);
  return dot;
}

/** Le voci ordinate per somiglianza con la domanda (il miglior esempio di ciascuna). */
export function rank(question: string): { intent: Intent; score: number }[] {
  const q = index.weigh(features(analyze(question).words));
  const best = new Map<string, { intent: Intent; score: number }>();
  for (const ex of index.examples) {
    const score = cosine(q, ex.vector);
    const prev = best.get(ex.intent.id);
    if (!prev || score > prev.score) best.set(ex.intent.id, { intent: ex.intent, score });
  }
  return [...best.values()].sort((a, b) => b.score - a.score);
}

const labels = (ids: string[]) => ids.map((id) => byId.get(id)?.label).filter((l): l is string => !!l);

export const starterQuestions = labels(starters);

export function reply(question: string, ctx: Context = { now: new Date() }): Reply {
  const { coverage } = analyze(question);
  const ranked = rank(question);
  const top = ranked[0];

  if (top && top.score >= ANSWER_THRESHOLD && coverage >= MIN_COVERAGE) {
    const { intent } = top;
    const answer = typeof intent.answer === "function" ? intent.answer(ctx) : intent.answer;
    return { answer, suggestions: labels(intent.next ?? starters), intent: intent.id, score: top.score };
  }

  const email = contacts.find((c) => c.label === "Email")?.value;
  const close = coverage >= MIN_COVERAGE ? ranked.filter((r) => r.score >= SUGGEST_THRESHOLD).slice(0, 3) : [];
  return {
    answer: close.length
      ? "Non sono sicuro di aver capito. Intendevi una di queste?"
      : `Su questo non ho informazioni. Prova con una delle domande qui sotto, oppure scrivimi a ${email}.`,
    suggestions: close.length ? close.map((r) => r.intent.label) : starterQuestions,
    intent: null,
    score: top?.score ?? 0,
  };
}
