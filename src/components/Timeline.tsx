"use client";

import { useState } from "react";
import { experiences } from "@/data/profile";
import Reveal from "./Reveal";

export default function Timeline() {
  const [open, setOpen] = useState(0);

  return (
    <ol className="relative ml-3 border-l border-line">
      {experiences.map((e, i) => {
        const active = open === i;
        return (
          <li key={`${e.company}-${e.period}`} className="relative pb-10 pl-8 last:pb-0">
            <span
              className={`absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 transition-colors ${
                active ? "border-accent bg-accent shadow-[0_0_14px_var(--accent)]" : "border-line bg-bg"
              }`}
            />
            <Reveal delay={i * 80}>
              <button
                onClick={() => setOpen(active ? -1 : i)}
                aria-expanded={active}
                className="group w-full text-left"
              >
                <p className="font-mono text-xs text-muted">{e.period}</p>
                <h3 className="mt-1 text-lg font-semibold transition-colors group-hover:text-accent">
                  {e.role} <span className="text-muted">· {e.company}</span>
                </h3>
                <p className="mt-1 text-muted">{e.summary}</p>
              </button>
              <div
                className={`grid transition-all duration-500 ${
                  active ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <ul className="overflow-hidden">
                  {e.highlights.map((h) => (
                    <li key={h} className="flex gap-2 py-1 text-sm">
                      <span className="text-accent">▹</span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
