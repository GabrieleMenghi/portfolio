import { describe, expect, it } from "vitest";
import { ageAt, intents } from "./faq";
import { reply } from "./match";

// Domande come le scriverebbe un visitatore, con la voce che deve rispondere.
const cases: [string, string][] = [
  ["Quanti anni hai?", "eta"],
  ["quanti anni hai", "eta"],
  ["che eta hai", "eta"],
  ["Quando sei nato?", "eta"],
  ["quanti anni di esperienza hai?", "esperienza"],
  ["Da quanto lavori come sviluppatore?", "esperienza"],
  ["Dove hai lavorato?", "esperienza"],
  ["Chi sei?", "chi-sei"],
  ["parlami un po' di te", "chi-sei"],
  ["Di cosa ti occupi?", "chi-sei"],
  ["Dove vivi?", "dove"],
  ["di dove sei", "dove"],
  ["Lavori in smart working?", "remoto"],
  ["saresti disposto a trasferirti a Milano?", "remoto"],
  ["Parli inglese?", "lingue"],
  ["che livello di inglese hai", "lingue"],
  ["Cosa hai studiato?", "studi"],
  ["con che voto ti sei laureato?", "studi"],
  ["hai fatto l'università?", "studi"],
  ["Sei ingegnere?", "esame-stato"],
  ["Cosa fai in 2Digit?", "lavoro-attuale"],
  ["dove lavori adesso?", "lavoro-attuale"],
  ["cosa facevi in fortech", "fortech"],
  ["Quali tecnologie conosci?", "competenze"],
  ["che linguaggi di programmazione conosci?", "competenze"],
  ["Conosci C#?", "backend"],
  ["sai usare .NET?", "backend"],
  ["conosci angular", "frontend"],
  ["sai usare react?", "frontend"],
  ["Sai usare Docker?", "devops"],
  ["conosci kubernetes", "devops"],
  ["che database conosci", "database"],
  ["Come usi l'AI?", "ai"],
  ["usi chatgpt?", "ai"],
  ["cosa pensi dell'intelligenza artificiale", "ai"],
  ["il codice lo scrivi tu o lo scrive l'ai?", "ai-codice"],
  ["Che progetti hai realizzato?", "progetti"],
  ["Parlami di Razor", "razor"],
  ["cos'è razor gestionale?", "razor"],
  ["con che tecnologie hai fatto razor?", "razor-stack"],
  ["come hai usato l'ai in razor", "razor-ai"],
  ["come funziona la prenotazione?", "razor-prenotazioni"],
  ["Come è fatto questo sito?", "sito"],
  ["Sei un bot?", "bot"],
  ["sei chatgpt?", "bot"],
  ["Hai un profilo GitHub?", "github"],
  ["Come posso contattarti?", "contatti"],
  ["mi dai il tuo numero di telefono?", "contatti"],
  ["Hai un linkedin?", "contatti"],
  ["mi mandi il tuo cv?", "cv"],
  ["Sei disponibile per collaborazioni?", "disponibilita"],
  ["stai cercando lavoro?", "disponibilita"],
  ["Quanto guadagni?", "stipendio"],
  ["qual è la tua RAL?", "stipendio"],
  ["Che hobby hai?", "privato"],
  ["sei fidanzato?", "privato"],
  ["quali sono i tuoi punti di forza", "soft-skill"],
  ["perché dovremmo assumerti?", "soft-skill"],
  ["ciao!", "saluto"],
  ["grazie mille", "grazie"],
  ["cosa posso chiederti?", "aiuto"],
  // refusi
  ["quanti ani hai", "eta"],
  ["progeti", "progetti"],
  ["esperienze lavorative", "esperienza"],
];

// Domande a cui il bot deve dire che non sa, invece di rispondere a caso.
const unknown = [
  "qual è il tuo piatto preferito?",
  "che tempo fa domani?",
  "chi ha vinto il campionato?",
  "quanto fa 2+2",
  "sai cucinare?",
  "hai mai usato aws?",
  "dove sei andato in vacanza?",
  "qual è il tuo film preferito",
  "hai un cane?",
  "xyz",
];

describe("chat Chiedi a me", () => {
  it.each(cases)("%s → %s", (question, expected) => {
    expect(reply(question).intent).toBe(expected);
  });

  it.each(unknown)("non inventa: %s", (question) => {
    const r = reply(question);
    expect(r.intent).toBeNull();
    expect(r.suggestions.length).toBeGreaterThan(0);
  });

  it("calcola l'età dalla data di nascita", () => {
    expect(ageAt("2001-06-08", new Date(2026, 5, 7))).toBe(24);
    expect(ageAt("2001-06-08", new Date(2026, 5, 8))).toBe(25);
    expect(reply("quanti anni hai", { now: new Date(2026, 8, 28) }).answer).toBe("Ho 25 anni.");
  });

  it("ogni voce suggerita esiste", () => {
    const ids = new Set(intents.map((i) => i.id));
    for (const i of intents) for (const n of i.next ?? []) expect(ids.has(n), `${i.id} → ${n}`).toBe(true);
  });
});
