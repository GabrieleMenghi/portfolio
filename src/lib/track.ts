// Eventi per le statistiche di Umami. Se lo script non c'è (in locale, o bloccato
// da un ad blocker) non succede nulla.
declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string | number>) => void };
  }
}

export function track(event: string, data?: Record<string, string | number>) {
  try {
    window.umami?.track(event, data);
  } catch {}
}
