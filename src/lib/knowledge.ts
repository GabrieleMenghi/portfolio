import { contacts, experiences, languages, profile, projects, skills } from "@/data/profile";

// Base di conoscenza per la chat "Chiedi a me": le risposte vengono scelte
// per similarità di parole, senza modelli né API esterne.

type Entry = {
  id: string;
  keywords: string[];
  answer: string;
};

const list = (items: string[]) => items.map((i) => `• ${i}`).join("\n");

export const entries: Entry[] = [
  {
    id: "chi-sei",
    keywords: ["chi", "sei", "presentati", "te", "stesso", "about", "descriviti", "who"],
    answer: `Sono ${profile.name}, ${profile.role} (${profile.location}).\n\n${profile.about.join("\n\n")}`,
  },
  {
    id: "esperienza",
    keywords: ["esperienza", "esperienze", "lavoro", "lavorato", "carriera", "aziende", "ruolo", "experience"],
    answer:
      "Il mio percorso in breve:\n" +
      experiences.map((e) => `• ${e.role} — ${e.company} (${e.period})`).join("\n"),
  },
  {
    id: "progetti",
    keywords: ["progetti", "progetto", "realizzato", "portfolio", "fatto", "costruito", "projects", "lavori"],
    answer:
      "Alcuni progetti di cui vado fiero:\n" +
      projects.map((p) => `• ${p.title}: ${p.tagline}`).join("\n") +
      "\n\nChiedimi pure i dettagli di uno di questi.",
  },
  ...projects.map((p) => ({
    id: `progetto-${p.slug}`,
    keywords: [p.title, p.tagline, ...p.tags, p.slug.replace(/-/g, " ")],
    answer: `${p.title} — ${p.tagline}\n\nProblema: ${p.problem}\nSoluzione: ${p.solution}\nRuolo dell'AI: ${p.ai}\nRisultati:\n${list(p.results)}`,
  })),
  {
    id: "competenze",
    keywords: ["competenze", "skills", "tecnologie", "linguaggi", "stack", "sai", "conosci", "usi", "strumenti"],
    answer: skills.map((g) => `${g.name}: ${g.items.join(", ")}`).join("\n"),
  },
  {
    id: "ai",
    keywords: ["ai", "usi", "usa", "intelligenza", "artificiale", "llm", "modelli", "rag", "agenti", "agent", "gpt", "claude", "ml", "machine", "learning"],
    answer:
      "Uso gli agenti AI di coding, come Claude Code, per portare progetti dall'idea alla produzione più in fretta. Le decisioni restano mie: scrivo un piano, documento ogni scelta e faccio verificare il lavoro da test automatici. Razor Gestionale e questo sito sono nati così.",
  },
  {
    id: "formazione",
    keywords: ["formazione", "studi", "studiato", "laurea", "laureato", "università", "diploma", "scuola", "titolo", "esame", "ingegnere"],
    answer:
      "Mi sono laureato in Ingegneria e Scienze Informatiche all'Università di Bologna (campus di Cesena) nel 2023, con 102/110. Ho superato l'Esame di Stato per Ingegnere dell'Informazione (sez. B); prima mi sono diplomato all'I.T.E.S. R. Valturio di Rimini con 100 e lode.",
  },
  {
    id: "lingue",
    keywords: ["lingue", "lingua", "inglese", "english", "parli", "italiano"],
    answer: `Parlo ${languages.map((l) => l[0].toLowerCase() + l.slice(1)).join(" e ")}.`,
  },
  {
    id: "contatti",
    keywords: ["contatti", "contattarti", "email", "mail", "linkedin", "github", "scriverti", "raggiungerti", "contact"],
    answer: "Puoi trovarmi qui:\n" + contacts.map((c) => `• ${c.label}: ${c.value}`).join("\n"),
  },
  {
    id: "disponibilita",
    keywords: ["disponibile", "disponibilità", "assumere", "collaborare", "collaborazione", "freelance", "offerta", "cerchi", "hire"],
    answer: profile.available
      ? "Sì, sono aperto a nuove collaborazioni e progetti interessanti. Scrivimi dai contatti in fondo alla pagina."
      : "Al momento sono impegnato, ma scrivimi comunque: rispondo sempre.",
  },
  {
    id: "sito",
    keywords: ["sito", "fatto", "costruito", "come", "tecnologia", "funziona", "chat", "bot", "risposte"],
    answer:
      "Questo sito è fatto con Next.js e Tailwind CSS e gira sul mio VPS in Docker. La chat non usa modelli né API a pagamento: un piccolo motore di ricerca sceglie la risposta più pertinente tra le informazioni verificate del mio profilo, così non inventa mai nulla.",
  },
];

export const suggestions = [
  "Chi sei?",
  "Che progetti hai realizzato?",
  "Come usi l'AI?",
  "Quali tecnologie conosci?",
  "Sei disponibile per collaborazioni?",
];

const STOPWORDS = new Set(
  "il lo la i gli le un uno una di a da in con su per tra fra e o ma che chi cosa come mi ti ci si tu io me te del della dei delle al alla nel nella è sei hai ha ho sono puoi può mio tuo tua tuoi tue quali quale qual".split(" "),
);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

const normalize = (text: string) => tokenize(text).filter((w) => !STOPWORDS.has(w));

// Stemming minimale: basta a far combaciare "progetto" e "progetti".
const stem = (w: string) => (w.length > 4 ? w.replace(/[aeiou]+$/, "") : w);

export function localAnswer(question: string): string {
  // Domande fatte solo di parole comuni ("chi sei?") usano tutte le parole.
  const meaningful = normalize(question);
  const words = (meaningful.length ? meaningful : tokenize(question)).map(stem);
  if (words.length === 0) return fallback();

  let best: { entry: Entry; score: number } | null = null;
  for (const entry of entries) {
    const keys = new Set(entry.keywords.flatMap(tokenize).map(stem));
    const body = new Set(normalize(entry.answer).map(stem));
    let score = 0;
    for (const w of words) {
      if (keys.has(w)) score += 3;
      else if (body.has(w)) score += 1;
    }
    if (!best || score > best.score) best = { entry, score };
  }

  return best && best.score >= 2 ? best.entry.answer : fallback();
}

function fallback() {
  return (
    "Non ho una risposta precisa a questa domanda. Prova a chiedermi, ad esempio:\n" +
    list(suggestions)
  );
}

