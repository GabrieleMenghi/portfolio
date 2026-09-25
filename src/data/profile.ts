// Tutti i contenuti del sito vivono qui.

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  tags: string[];
  problem: string;
  solution: string;
  ai: string;
  results: string[];
  /** Passi dell'architettura, mostrati come diagramma a flusso */
  flow: string[];
  link?: string;
};

export type Experience = {
  role: string;
  company: string;
  period: string;
  summary: string;
  highlights: string[];
};

export type SkillGroup = {
  name: string;
  items: string[];
};

export type Contact = {
  label: string;
  value: string;
  href: string;
};

export const profile = {
  name: "Gabriele Menghi",
  role: "Software Engineer",
  location: "Rimini · San Marino",
  headline: "Costruisco software completo, dal database al deploy, con l'AI come compagno di lavoro.",
  typedRoles: ["Software Engineer", "Full-stack Developer", ".NET · Angular · Next.js", "AI-assisted development"],
  about: [
    "Sono un Software Engineer con 3 anni di esperienza tra backend (C#/.NET, PHP) e frontend (Angular, Next.js), laureato in Ingegneria e Scienze Informatiche all'Università di Bologna.",
    "Ho lavorato su architetture a microservizi con Docker e Kubernetes. Oggi porto progetti dall'idea alla produzione usando gli agenti AI di coding come acceleratore, tenendo io le decisioni, i test e la qualità.",
  ],
  /** Percorso di un CV pubblicabile in public/ (senza indirizzo e telefono); null nasconde il pulsante */
  cvUrl: null as string | null,
  available: true,
};

export const projects: Project[] = [
  {
    slug: "razor-gestionale",
    title: "Razor Gestionale",
    tagline: "Gestionale e prenotazioni online per una barberia di Riccione.",
    tags: ["Next.js", "TypeScript", "PostgreSQL", "Drizzle", "Docker"],
    problem:
      "La barberia aveva solo un sito vetrina: agenda, prenotazioni e clienti si gestivano al telefono e a mano.",
    solution:
      "Un'unica app installabile per staff e clienti: agenda dei barbieri, prenotazione online in tre passi con approvazione del barbiere, area cliente, email e notifiche push, sito pubblico con SEO. Gira su un VPS con deploy automatico da GitHub Actions.",
    ai: "Sviluppato con Claude Code come pair programmer. Un piano di sviluppo, un registro con oltre 80 decisioni documentate e test automatici (unit, su PostgreSQL ed end-to-end con Playwright) guidano e verificano il lavoro dell'agente.",
    results: [
      "Prenotazione in tre passi con presa in carico atomica",
      "PWA installabile con notifiche push",
      "Verifica in due passaggi per lo staff",
      "Deploy automatico su VPS con monitoraggio",
    ],
    flow: ["Cliente / Staff", "Caddy", "Next.js", "PostgreSQL", "Worker", "Email · Push"],
  },
  {
    slug: "portfolio",
    title: "Questo sito",
    tagline: "Portfolio interattivo con chat e modalità terminale.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Docker"],
    problem:
      "Un curriculum in PDF non mostra come lavoro. Un chatbot su API a pagamento avrebbe costi che crescono con le visite, e un modello sul server ruberebbe memoria agli altri progetti del VPS.",
    solution:
      "Un sito con casi di studio, una modalità terminale e una chat che risponde sulle mie esperienze, pubblicato sul mio VPS con Docker in meno di 256 MB di memoria.",
    ai: "Progettato e sviluppato insieme a Claude Code, dalla scelta dello stile al deploy. La chat usa un motore di ricerca leggero sui dati del profilo: nessun modello, nessuna API, nessuna risposta inventata.",
    results: ["Zero costi per risposta", "Risposte basate solo su dati verificati"],
    flow: ["Domanda", "API Next.js", "Motore locale", "Risposta"],
  },
];

export const experiences: Experience[] = [
  {
    role: "Sviluppatore software",
    company: "2Digit S.r.l.",
    period: "apr 2026 — oggi",
    summary: "San Marino. Sviluppo di gestionali web.",
    highlights: ["Sviluppo di gestionali in PHP", "Uso di assistenti AI di coding a supporto dello sviluppo"],
  },
  {
    role: "Sviluppatore software",
    company: "Fortech S.r.l.",
    period: "giu 2023 — apr 2026",
    summary: "Rimini. Team di sei persone focalizzato sullo sviluppo backend.",
    highlights: [
      "Sviluppo backend in C# / .NET",
      "Sviluppo frontend con Angular",
      "Microservizi con Docker e Kubernetes",
      "Progettazione e documentazione di API con Swagger / OpenAPI",
      "Testing, versionamento con Git e pratiche di CI/CD",
    ],
  },
  {
    role: "Laurea in Ingegneria e Scienze Informatiche",
    company: "Università di Bologna, Cesena",
    period: "2020 — 2023",
    summary: "Laurea triennale, voto 102/110.",
    highlights: [
      "Esame di Stato per Ingegnere dell'Informazione (sez. B) superato",
      "Diploma all'I.T.E.S. R. Valturio di Rimini con 100 e lode",
    ],
  },
];

export const skills: SkillGroup[] = [
  { name: "Linguaggi", items: ["C#", "TypeScript", "JavaScript", "PHP", "SQL", "HTML / CSS"] },
  { name: "Framework", items: [".NET", "Angular", "Next.js", "React", "Tailwind CSS"] },
  { name: "Dati & DevOps", items: ["SQL Server", "MySQL", "PostgreSQL", "Docker", "Kubernetes", "Git", "CI/CD", "Swagger / OpenAPI"] },
  { name: "AI", items: ["Claude Code", "Sviluppo con agenti AI", "Revisione del codice generato"] },
];

export const languages = ["Italiano (madrelingua)", "Inglese (B2)"];

export const contacts: Contact[] = [
  { label: "Email", value: "gabry.menghi01@gmail.com", href: "mailto:gabry.menghi01@gmail.com" },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/gabriele-menghi505787296",
    href: "https://linkedin.com/in/gabriele-menghi505787296",
  },
  { label: "GitHub", value: "github.com/GabrieleMenghi", href: "https://github.com/GabrieleMenghi" },
];
