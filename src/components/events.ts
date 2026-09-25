// Eventi globali per aprire il terminale da qualunque punto della pagina.
export const OPEN_TERMINAL = "open-terminal";

export const openTerminal = () => window.dispatchEvent(new Event(OPEN_TERMINAL));
