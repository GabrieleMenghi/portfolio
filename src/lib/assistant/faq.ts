import { contacts, profile } from "@/data/profile";

// Domande e risposte della chat "Chiedi a me".
// Ogni voce ha la domanda da mostrare come suggerimento (label), alcuni modi diversi
// di porla (questions) e le voci da proporre dopo la risposta (next).
// Le risposte sono in prima persona, come se rispondesse Gabriele.

export type Context = { now: Date };

export type Intent = {
  id: string;
  label: string;
  questions: string[];
  answer: string | ((ctx: Context) => string);
  next?: string[];
};

const email = contacts.find((c) => c.label === "Email")?.value ?? "";
const linkedin = contacts.find((c) => c.label === "LinkedIn")?.value ?? "";
const github = contacts.find((c) => c.label === "GitHub")?.value ?? "";

export function ageAt(birthDate: string, now: Date): number {
  const [y, m, d] = birthDate.split("-").map(Number);
  let age = now.getFullYear() - y;
  const beforeBirthday = now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d);
  if (beforeBirthday) age--;
  return age;
}

export const intents: Intent[] = [
  // --- Conversazione ---
  {
    id: "saluto",
    label: "Ciao!",
    questions: ["ciao", "buongiorno", "buonasera", "salve", "ehi", "hey", "hello", "hi"],
    answer: "Ciao! Chiedimi pure del mio lavoro, dei progetti o di come uso l'AI.",
    next: ["chi-sei", "progetti", "ai"],
  },
  {
    id: "grazie",
    label: "Grazie!",
    questions: ["grazie", "grazie mille", "ok grazie", "perfetto grazie", "gentilissimo", "thanks"],
    answer: `Figurati! Se vuoi parlarne di persona, scrivimi a ${email}.`,
    next: ["contatti", "progetti"],
  },
  {
    id: "aiuto",
    label: "Cosa posso chiederti?",
    questions: [
      "cosa posso chiederti",
      "cosa sai fare",
      "cosa sai",
      "aiuto",
      "help",
      "di cosa puoi parlare",
      "quali domande posso fare",
    ],
    answer:
      "Puoi chiedermi del mio percorso (esperienze, studi, lingue), delle competenze tecniche, dei progetti come Razor Gestionale, di come uso l'AI e di come contattarmi.",
    next: ["chi-sei", "esperienza", "progetti"],
  },
  {
    id: "bot",
    label: "Sei un'intelligenza artificiale?",
    questions: [
      "sei un bot",
      "sei un'ai",
      "sei un intelligenza artificiale",
      "sei chatgpt",
      "sei una persona vera",
      "come funziona questa chat",
      "chi mi sta rispondendo",
      "usi un llm",
      "come funziona il bot",
      "come funzionano le risposte",
      "che algoritmo usi",
      "come scegli le risposte",
    ],
    answer:
      "Sono un bot, ma senza AI generativa: tutto gira in locale sul server, senza modelli né API esterne. Ho scritto una raccolta di domande e risposte, e un algoritmo confronta la tua domanda con i vari modi previsti di porre ciascuna: corregge i refusi, pesa parole e frammenti di parole (TF-IDF) e sceglie la risposta più vicina. Se la domanda parla di cose che non conosce, te lo dice invece di inventare.",
    next: ["sito", "ai", "contatti"],
  },

  // --- Chi sono ---
  {
    id: "chi-sei",
    label: "Chi sei?",
    questions: [
      "chi sei",
      "presentati",
      "parlami di te",
      "raccontami di te",
      "chi è gabriele",
      "descriviti",
      "di cosa ti occupi",
      "che lavoro fai",
      "cosa fai nella vita",
    ],
    answer: `Sono ${profile.name}, Software Engineer con 3 anni di esperienza tra backend (C#/.NET, PHP, Node.js) e frontend (Angular, Next.js), laureato in Ingegneria e Scienze Informatiche all'Università di Bologna. Oggi lavoro a San Marino in 2Digit e porto progetti dall'idea alla produzione usando gli agenti AI di coding come acceleratore.`,
    next: ["esperienza", "progetti", "ai"],
  },
  {
    id: "eta",
    label: "Quanti anni hai?",
    questions: [
      "quanti anni hai",
      "che età hai",
      "età",
      "quando sei nato",
      "anno di nascita",
      "in che anno sei nato",
      "sei giovane",
      "compleanno",
    ],
    answer: ({ now }) => `Ho ${ageAt(profile.birthDate, now)} anni.`,
    next: ["chi-sei", "studi", "esperienza"],
  },
  {
    id: "dove",
    label: "Dove lavori?",
    questions: [
      "dove lavori",
      "dove vivi",
      "dove abiti",
      "di dove sei",
      "dove ti trovi",
      "in che città sei",
      "sei di rimini",
      "dove sei basato",
    ],
    answer: "Sono di Rimini e attualmente lavoro a San Marino.",
    next: ["remoto", "lavoro-attuale"],
  },
  {
    id: "remoto",
    label: "Lavori anche da remoto?",
    questions: [
      "lavori da remoto",
      "smart working",
      "full remote",
      "ti trasferiresti",
      "sei disposto a trasferirti",
      "trasferte",
      "lavoro ibrido",
      "puoi lavorare a distanza",
    ],
    answer: `Attualmente lavoro a San Marino. Per altre modalità, da remoto o con un trasferimento, possiamo parlarne: scrivimi a ${email}.`,
    next: ["disponibilita", "contatti"],
  },
  {
    id: "lingue",
    label: "Che lingue parli?",
    questions: ["che lingue parli", "parli inglese", "lingue", "come te la cavi con l'inglese", "livello di inglese", "english"],
    answer: "Italiano, che è la mia lingua madre, e inglese a livello B2.",
    next: ["studi", "chi-sei"],
  },
  {
    id: "soft-skill",
    label: "Quali sono i tuoi punti di forza?",
    questions: [
      "punti di forza",
      "soft skill",
      "pregi",
      "qualità",
      "come sei come persona",
      "come lavori in team",
      "carattere",
      "perché dovrei sceglierti",
      "perché dovremmo assumerti",
    ],
    answer:
      "Resto lucido sotto pressione e nelle situazioni complesse, mi adatto in fretta, ho una forte propensione a imparare e porto a termine gli impegni. Lavoro orientato al risultato e al cliente: con Razor Gestionale ho seguito tutto, dalle decisioni con il titolare fino al deploy.",
    next: ["razor", "esperienza"],
  },

  // --- Percorso ---
  {
    id: "esperienza",
    label: "Qual è la tua esperienza?",
    questions: [
      "esperienza lavorativa",
      "dove hai lavorato",
      "per chi hai lavorato",
      "quanta esperienza hai",
      "quanti anni di esperienza hai",
      "da quanto lavori come sviluppatore",
      "da quanti anni programmi",
      "carriera",
      "percorso professionale",
      "aziende",
    ],
    answer:
      "Ho 3 anni di esperienza come sviluppatore:\n• 2Digit S.r.l., San Marino (da aprile 2026): gestionali in PHP e progetti interamente in JavaScript con Node.js e Next.js, con assistenti AI di coding\n• Fortech S.r.l., Rimini (giugno 2023 – aprile 2026): backend C#/.NET, frontend Angular, microservizi con Docker e Kubernetes",
    next: ["lavoro-attuale", "fortech", "progetti"],
  },
  {
    id: "lavoro-attuale",
    label: "Cosa fai in 2Digit?",
    questions: [
      "cosa fai in 2digit",
      "2digit",
      "lavoro attuale",
      "dove lavori adesso",
      "di cosa ti occupi ora",
      "azienda attuale",
      "attualmente cosa fai",
    ],
    answer:
      "Da aprile 2026 sono sviluppatore software in 2Digit S.r.l. a San Marino: sviluppo gestionali in PHP e progetti interamente in JavaScript, con Node.js per il backend e Next.js per il frontend. Uso gli assistenti AI di coding a supporto dello sviluppo.",
    next: ["ai", "fortech"],
  },
  {
    id: "fortech",
    label: "Cosa facevi in Fortech?",
    questions: [
      "fortech",
      "cosa facevi prima",
      "lavoro precedente",
      "esperienza precedente",
      "primo lavoro",
      "microservizi",
    ],
    answer:
      "In Fortech S.r.l. a Rimini, da giugno 2023 ad aprile 2026, ero sviluppatore in un team di sei persone focalizzato sul backend. Sviluppavo in C#/.NET e in Angular, su un'architettura a microservizi con Docker e Kubernetes. Progettavo e documentavo le API con Swagger/OpenAPI, e mi occupavo di test, versionamento con Git e pratiche di CI/CD.",
    next: ["backend", "devops"],
  },
  {
    id: "studi",
    label: "Cosa hai studiato?",
    questions: [
      "cosa hai studiato",
      "dove hai studiato",
      "università",
      "laurea",
      "sei laureato",
      "titolo di studio",
      "voto di laurea",
      "con che voto ti sei laureato",
      "diploma",
      "formazione",
    ],
    answer:
      "Mi sono laureato nel 2023 in Ingegneria e Scienze Informatiche all'Università di Bologna, campus di Cesena, con 102/110. Prima mi sono diplomato all'I.T.E.S. R. Valturio di Rimini con 100 e lode.",
    next: ["esame-stato", "esperienza"],
  },
  {
    id: "esame-stato",
    label: "Sei ingegnere?",
    questions: ["sei ingegnere", "esame di stato", "abilitazione", "albo degli ingegneri", "certificazioni", "icdl", "patente europea del computer"],
    answer:
      "Ho superato l'Esame di Stato per Ingegnere dell'Informazione (sezione B) e ho la certificazione ICDL Full Standard.",
    next: ["studi", "competenze"],
  },

  // --- Competenze ---
  {
    id: "competenze",
    label: "Quali tecnologie conosci?",
    questions: [
      "quali tecnologie conosci",
      "competenze",
      "competenze tecniche",
      "skills",
      "stack",
      "linguaggi di programmazione",
      "che linguaggi usi",
      "in cosa sei bravo",
    ],
    answer:
      "Linguaggi: C#, TypeScript, JavaScript, PHP, SQL, HTML/CSS.\nFramework: .NET, Node.js, Angular, Next.js, React, Tailwind CSS.\nDati e DevOps: SQL Server, MySQL, PostgreSQL, Docker, Kubernetes, Git, CI/CD, Swagger/OpenAPI.\nAI: sviluppo con agenti come Claude Code.",
    next: ["backend", "frontend", "devops"],
  },
  {
    id: "backend",
    label: "Che esperienza hai nel backend?",
    questions: ["backend", "c#", ".net", "dotnet", "php", "node.js", "nodejs", "node", "javascript", "api", "rest", "swagger", "openapi", "sviluppo lato server"],
    answer:
      "Il backend è dove ho lavorato di più: C#/.NET in Fortech, su microservizi con API documentate in Swagger/OpenAPI, e in 2Digit PHP per i gestionali e Node.js per i progetti interamente in JavaScript. In Razor Gestionale ho scritto il backend in TypeScript con Next.js, PostgreSQL e Drizzle.",
    next: ["database", "fortech"],
  },
  {
    id: "frontend",
    label: "Che esperienza hai nel frontend?",
    questions: ["frontend", "angular", "react", "next.js", "nextjs", "interfacce", "css", "tailwind", "ui"],
    answer:
      "In Fortech ho sviluppato il frontend con Angular, in 2Digit uso Next.js nei progetti interamente in JavaScript. Anche nei miei progetti uso React e Next.js con Tailwind CSS: Razor Gestionale ha un sito pubblico e un'app installabile per staff e clienti, e questo sito è fatto allo stesso modo.",
    next: ["razor", "sito"],
  },
  {
    id: "devops",
    label: "Sai fare deploy e DevOps?",
    questions: ["devops", "docker", "kubernetes", "ci/cd", "deploy", "github actions", "linux", "vps", "server", "git", "hosting"],
    answer:
      "Sì. In Fortech lavoravo su microservizi con Docker e Kubernetes, con Git e pratiche di CI/CD. Razor Gestionale e questo sito li gestisco io su un VPS Linux: a ogni push GitHub Actions verifica il codice, pubblica l'immagine Docker e la mette in produzione, dietro Caddy con HTTPS automatico.",
    next: ["razor-stack", "sito"],
  },
  {
    id: "database",
    label: "Che database usi?",
    questions: ["database", "sql", "sql server", "mysql", "postgresql", "postgres", "drizzle", "orm"],
    answer:
      "Ho lavorato con SQL Server e MySQL. Per Razor Gestionale ho scelto PostgreSQL con Drizzle ORM, anche per i vincoli che impediscono a due appuntamenti di sovrapporsi.",
    next: ["razor-stack", "backend"],
  },

  // --- AI ---
  {
    id: "ai",
    label: "Come usi l'AI?",
    questions: [
      "come usi l'ai",
      "intelligenza artificiale",
      "ai",
      "claude code",
      "agenti ai",
      "chatgpt",
      "copilot",
      "llm",
      "sviluppo con l'ai",
      "che strumenti ai usi",
    ],
    answer:
      "Uso gli agenti AI di coding, come Claude Code, con un metodo preciso: prima pianifichiamo insieme requisiti e architettura, poi l'agente scrive il codice, poi si controlla, con la mia revisione e i test automatici. Razor Gestionale e questo sito sono nati così.",
    next: ["ai-codice", "razor-ai"],
  },
  {
    id: "ai-codice",
    label: "Il codice lo scrivi tu o l'AI?",
    questions: [
      "il codice lo scrivi tu o l'ai",
      "scrivi tu il codice",
      "chi scrive il codice",
      "fa tutto l'ai",
      "vibe coding",
      "ti fidi dell'ai",
      "l'ai sostituirà i programmatori",
      "controlli il codice generato",
    ],
    answer:
      "Il codice lo scrive l'AI, supervisionata e organizzata da me. Prima pianifichiamo insieme: requisiti, architettura, decisioni. Poi, arrivati al punto, l'agente scrive il codice. Infine si controlla: rivedo quello che ha prodotto e lo verifico con test automatici. Cosa fare e come lo decido io.",
    next: ["razor-ai", "ai"],
  },

  // --- Progetti ---
  {
    id: "progetti",
    label: "Che progetti hai realizzato?",
    questions: ["che progetti hai realizzato", "progetti", "portfolio", "cosa hai costruito", "lavori personali", "side project", "esempi di lavori"],
    answer:
      "I due principali:\n• Razor Gestionale: gestionale e prenotazioni online per una barberia di Riccione\n• Questo sito: portfolio con chat e modalità terminale, sul mio VPS",
    next: ["razor", "sito"],
  },
  {
    id: "razor",
    label: "Parlami di Razor Gestionale",
    questions: [
      "parlami di razor",
      "razor gestionale",
      "razor",
      "barberia",
      "gestionale barberia",
      "prenotazioni online",
      "cos'è razor",
    ],
    answer:
      "Razor Gestionale è l'app di una barberia di Riccione. Prima avevano solo un sito vetrina, e agenda e prenotazioni si gestivano al telefono. Ora c'è un'unica app installabile per staff e clienti: agenda dei barbieri, prenotazione online in tre passi con approvazione del barbiere, area cliente, email e notifiche push, sito pubblico con SEO. L'ho seguita io dall'analisi al deploy.",
    next: ["razor-stack", "razor-ai", "razor-prenotazioni"],
  },
  {
    id: "razor-stack",
    label: "Con che tecnologie è fatto Razor?",
    questions: ["stack di razor", "tecnologie di razor", "con cosa hai fatto razor", "architettura di razor", "come è fatto razor"],
    answer:
      "Next.js e TypeScript, PostgreSQL con Drizzle ORM, Better Auth per gli accessi con verifica in due passaggi per lo staff, pg-boss per email, notifiche e scadenze, Tailwind CSS e shadcn/ui. Gira in Docker su un VPS dietro Caddy, con deploy automatico da GitHub Actions, errori su Sentry e uptime su Better Stack.",
    next: ["razor-ai", "devops"],
  },
  {
    id: "razor-prenotazioni",
    label: "Come funziona la prenotazione di Razor?",
    questions: ["come funziona la prenotazione", "prenotazione in tre passi", "approvazione del barbiere", "come prenota un cliente"],
    answer:
      "In tre passi. Il cliente chiede un orario, la richiesta arriva a tutti i barbieri e chi la prende la conferma, propone un altro orario o la rifiuta. Se l'orario cambia, il cliente accetta o rifiuta la proposta. La presa in carico è atomica: se due barbieri accettano nello stesso momento, il secondo vede che è già gestita.",
    next: ["razor-stack", "razor"],
  },
  {
    id: "razor-ai",
    label: "Come hai usato l'AI in Razor?",
    questions: ["come hai usato l'ai in razor", "razor con l'ai", "razor claude code", "hai fatto razor con l'ai"],
    answer:
      "Ho sviluppato Razor con Claude Code come pair programmer. Prima un piano di sviluppo a fasi, poi un registro con oltre 80 decisioni motivate, poi test automatici: unit test, test su PostgreSQL ed end-to-end con Playwright. L'agente lavora dentro quei confini e io rivedo ogni passo.",
    next: ["ai-codice", "razor-stack"],
  },
  {
    id: "sito",
    label: "Come è fatto questo sito?",
    questions: ["come è fatto questo sito", "questo sito", "come hai fatto il sito", "tecnologie del sito", "portfolio tecnologie", "il terminale", "come funziona il terminale"],
    answer:
      "Next.js, TypeScript e Tailwind CSS, in un container Docker sul mio VPS con deploy automatico da GitHub Actions. Il codice è pubblico su GitHub. Premi il tasto ` per aprire la modalità terminale.",
    next: ["bot", "github"],
  },
  {
    id: "github",
    label: "Posso vedere il tuo codice?",
    questions: ["github", "posso vedere il tuo codice", "repository", "codice sorgente", "open source", "dove trovo il codice"],
    answer: `Il mio GitHub è ${github}: lì trovi anche il codice di questo sito. Razor Gestionale invece è privato, perché è il software di un cliente.`,
    next: ["sito", "contatti"],
  },

  // --- Contatti e disponibilità ---
  {
    id: "contatti",
    label: "Come posso contattarti?",
    questions: ["come posso contattarti", "contatti", "email", "mail", "linkedin", "scriverti", "come ti raggiungo", "numero di telefono", "telefono"],
    answer: `Il modo migliore è l'email: ${email}. Mi trovi anche su LinkedIn (${linkedin}) e GitHub (${github}).`,
    next: ["disponibilita", "cv"],
  },
  {
    id: "cv",
    label: "Posso avere il tuo CV?",
    questions: ["posso avere il tuo cv", "curriculum", "cv", "scaricare il curriculum", "cv in pdf", "resume"],
    answer: `Certo: scrivimi a ${email} e ti mando il CV in PDF.`,
    next: ["contatti", "esperienza"],
  },
  {
    id: "disponibilita",
    label: "Sei disponibile per nuove proposte?",
    questions: [
      "sei disponibile",
      "sei disponibile per collaborazioni",
      "cerchi lavoro",
      "stai cercando lavoro",
      "sei aperto a proposte",
      "possiamo collaborare",
      "freelance",
      "posso assumerti",
      "offerta di lavoro",
      "cambieresti lavoro",
    ],
    answer: `Sono sempre disposto ad ascoltare proposte interessanti. Scrivimi a ${email} raccontandomi di cosa si tratta.`,
    next: ["contatti", "remoto"],
  },

  // --- Argomenti di cui non parlo qui ---
  {
    id: "stipendio",
    label: "Quanto guadagni?",
    questions: ["quanto guadagni", "stipendio", "ral", "qual è la tua ral", "retribuzione", "quanto costi", "tariffa oraria", "richiesta economica", "compenso", "quanto vuoi"],
    answer: "Questo preferisco parlarne di persona.",
    next: ["contatti", "disponibilita"],
  },
  {
    id: "privato",
    label: "Hobby e vita privata",
    questions: [
      "hobby",
      "cosa fai nel tempo libero",
      "passioni",
      "sport",
      "sei fidanzato",
      "sei sposato",
      "hai figli",
      "vita privata",
      "politica",
      "religione",
      "dove abiti di preciso",
      "indirizzo di casa",
    ],
    answer: "Qui parlo solo del mio lavoro: per il resto, preferisco di persona.",
    next: ["chi-sei", "progetti"],
  },
];

export const starters = ["chi-sei", "progetti", "ai", "competenze", "disponibilita"];
