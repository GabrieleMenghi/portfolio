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

Stessa impostazione di Razor: il sito si aggancia alla rete `proxy` del Caddy condiviso in `/srv/proxy` e non pubblica porte.

```bash
cd /srv/portfolio
docker compose up -d --build
```

Poi aggiungi il blocco di `Caddyfile.example` al Caddyfile condiviso e riavvia Caddy. Il dominio `gabrielemenghi.is-a.dev` punta al VPS con un record `A` in [is-a-dev/register](https://github.com/is-a-dev/register).
