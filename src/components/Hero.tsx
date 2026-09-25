"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import NeuralBackground from "./NeuralBackground";

function useTyped(words: string[]) {
  const [text, setText] = useState("");

  useEffect(() => {
    let word = 0;
    let char = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = words[word];
      char += deleting ? -1 : 1;
      setText(current.slice(0, char));

      let delay = deleting ? 40 : 85;
      if (!deleting && char === current.length) {
        deleting = true;
        delay = 1800;
      } else if (deleting && char === 0) {
        deleting = false;
        word = (word + 1) % words.length;
        delay = 400;
      }
      timer = setTimeout(tick, delay);
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [words]);

  return text;
}

export default function Hero() {
  const typed = useTyped(profile.typedRoles);
  const [first, ...rest] = profile.name.split(" ");

  return (
    <section id="top" className="relative flex min-h-svh items-center overflow-hidden">
      <NeuralBackground />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />

      <div className="relative mx-auto w-full max-w-6xl px-4 pt-16 sm:px-6">
        {profile.available && (
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-bg/60 px-3.5 py-1.5 text-sm text-muted backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Disponibile per nuovi progetti
          </p>
        )}

        <h1 className="mt-7 max-w-4xl text-5xl leading-[0.98] font-semibold tracking-[-0.035em] sm:text-7xl lg:text-8xl">
          Ciao, sono {first} <span className="text-accent">{rest.join(" ")}</span>
        </h1>

        <p className="mt-6 h-8 font-mono text-lg text-muted sm:text-xl">
          <span className="text-accent">$</span> <span className="caret text-fg">{typed}</span>
        </p>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">{profile.headline}</p>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#chiedi"
            className="rounded-xl bg-accent px-6 py-3.5 font-semibold text-on-accent transition-transform hover:-translate-y-0.5"
          >
            Chiedi a me
          </a>
          <a
            href="#progetti"
            className="rounded-xl border border-line bg-bg/60 px-6 py-3.5 font-medium backdrop-blur transition-colors hover:border-accent"
          >
            Guarda i progetti
          </a>
        </div>
      </div>

      <a
        href="#progetti"
        aria-label="Scorri"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-muted"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
