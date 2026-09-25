import AskMe from "@/components/AskMe";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import Projects from "@/components/Projects";
import Reveal from "@/components/Reveal";
import Section from "@/components/Section";
import Skills from "@/components/Skills";
import SpotlightCard from "@/components/SpotlightCard";
import Terminal from "@/components/Terminal";
import Timeline from "@/components/Timeline";
import { contacts, languages, profile } from "@/data/profile";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <Reveal className="max-w-3xl space-y-5 text-xl leading-relaxed sm:text-2xl">
            {profile.about.map((p, i) => (
              <p key={p} className={i === 0 ? "" : "text-muted"}>
                {p}
              </p>
            ))}
          </Reveal>
        </section>

        <Section
          id="progetti"
          index="01"
          title="Progetti"
          intro="Casi di studio: il problema, come l'ho risolto e che ruolo ha avuto l'AI. Clicca su un progetto per i dettagli."
        >
          <Projects />
        </Section>

        <Section id="percorso" index="02" title="Percorso">
          <Timeline />
        </Section>

        <Section id="competenze" index="03" title="Competenze">
          <Skills />
          <Reveal className="mt-8 font-mono text-sm text-muted">
            <span className="text-accent">lingue:</span> {languages.join(" · ")}
          </Reveal>
        </Section>

        <section id="chiedi" className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-16">
          <Reveal className="space-y-4">
            <p className="font-mono text-sm text-accent">
              04 <span className="text-muted">{"// chiedi"}</span>
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Chiedi a me</h2>
            <p className="max-w-md text-lg leading-relaxed text-muted">
              Un assistente che conosce il mio percorso. Gira sul mio server, senza API a pagamento.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <AskMe />
          </Reveal>
        </section>

        <Section id="contatti" index="05" title="Parliamone">
          <Reveal>
            <SpotlightCard className="p-8 sm:p-12">
              <p className="max-w-xl text-2xl font-medium sm:text-3xl">
                Hai un progetto in mente o vuoi solo fare due chiacchiere su{" "}
                <span className="text-accent">AI e software</span>?
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {contacts.map((c, i) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className={`rounded-xl px-5 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5 ${
                      i === 0 ? "bg-accent text-on-accent" : "border border-line hover:border-accent"
                    }`}
                  >
                    {c.label}
                  </a>
                ))}
                {profile.cvUrl && (
                  <a
                    href={profile.cvUrl}
                    download
                    className="rounded-xl border border-line px-5 py-3 text-sm font-medium transition-transform hover:-translate-y-0.5 hover:border-accent"
                  >
                    Scarica CV ↓
                  </a>
                )}
              </div>
            </SpotlightCard>
          </Reveal>
        </Section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {profile.name}
          </p>
          <p className="font-mono text-xs">
            Premi <kbd className="rounded border border-line px-1.5">`</kbd> per aprire il terminale
          </p>
        </div>
      </footer>

      <Terminal />
    </>
  );
}
