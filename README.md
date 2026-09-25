# Portfolio

Sito personale in Next.js: hero interattiva, casi di studio, timeline, modalità terminale (tasto `` ` ``) e chat "Chiedi a me".

## Contenuti

Tutti i testi sono in [`src/data/profile.ts`](src/data/profile.ts). Per il pulsante "Scarica CV" metti un CV senza indirizzo e telefono in `public/cv.pdf` e imposta `cvUrl: "/cv.pdf"`.

## Sviluppo

```bash
npm install
npm run dev   # http://localhost:3100
```

## Chat "Chiedi a me"

Nessun modello né API: [`src/lib/knowledge.ts`](src/lib/knowledge.ts) genera dai dati del profilo una base di risposte e sceglie la più pertinente per parole chiave. Per coprire una domanda nuova si aggiunge una voce a `entries`.

## Deploy sul VPS

Automatico a ogni push su `main`: GitHub Actions pubblica l'immagine su GHCR e il VPS la scarica, dietro il Caddy condiviso. Come funziona e come si prepara il server: [deploy/README.md](deploy/README.md).
