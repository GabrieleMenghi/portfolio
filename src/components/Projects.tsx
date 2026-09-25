"use client";

import { useEffect, useState } from "react";
import { projects, type Project } from "@/data/profile";
import Reveal from "./Reveal";
import SpotlightCard from "./SpotlightCard";

function Flow({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-y-3">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <span
            className="rounded-lg border border-line bg-surface-2 px-3 py-1.5 font-mono text-xs"
            style={{ animation: `fadeIn .4s ease ${i * 120}ms both` }}
          >
            {step}
          </span>
          {i < steps.length - 1 && (
            <svg width="36" height="12" viewBox="0 0 36 12" className="mx-1 shrink-0 text-accent" aria-hidden>
              <line
                x1="0"
                y1="6"
                x2="30"
                y2="6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeDasharray="4 6"
                style={{ animation: "flow 0.8s linear infinite" }}
              />
              <path d="M29 2l5 4-5 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          )}
        </div>
      ))}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal
      aria-labelledby="project-title"
    >
      <div
        className="card max-h-[90svh] w-full max-w-2xl overflow-y-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 id="project-title" className="text-2xl font-semibold">
              {project.title}
            </h3>
            <p className="mt-1 text-muted">{project.tagline}</p>
          </div>
          <button onClick={onClose} aria-label="Chiudi" className="text-muted hover:text-fg">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="mt-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-wider text-muted">Architettura</p>
          <Flow steps={project.flow} />
        </div>

        <dl className="mt-8 grid gap-5">
          {[
            ["Il problema", project.problem],
            ["La soluzione", project.solution],
            ["Il ruolo dell'AI", project.ai],
          ].map(([term, desc]) => (
            <div key={term}>
              <dt className="font-mono text-xs uppercase tracking-wider text-accent">{term}</dt>
              <dd className="mt-1">{desc}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {project.results.map((r) => (
            <div key={r} className="rounded-xl border border-line bg-surface-2 p-4 text-sm font-medium">
              <span className="text-accent">▲</span> {r}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
              {t}
            </span>
          ))}
        </div>

        {project.link && (
          <a href={project.link} target="_blank" rel="noreferrer" className="mt-6 inline-block text-accent hover:underline">
            Visita il progetto →
          </a>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 100} className="h-full">
            <SpotlightCard className="h-full transition-transform duration-300 hover:-translate-y-1">
              <button onClick={() => setSelected(p)} className="flex h-full w-full flex-col p-8 text-left">
                <span className="font-mono text-xs text-muted">0{i + 1}</span>
                <h3 className="mt-3 text-2xl font-semibold">{p.title}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-muted">{p.tagline}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[11px] text-muted">
                      {t}
                    </span>
                  ))}
                </div>
                <span className="mt-5 text-sm text-accent">Leggi il caso di studio →</span>
              </button>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
