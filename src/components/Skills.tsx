import { skills } from "@/data/profile";
import Reveal from "./Reveal";
import SpotlightCard from "./SpotlightCard";

export default function Skills() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {skills.map((group, i) => (
        <Reveal key={group.name} delay={i * 80}>
          <SpotlightCard className="h-full p-6">
            <h3 className="font-mono text-sm text-accent">{group.name}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-line bg-surface-2 px-3 py-1.5 text-sm transition-all hover:-translate-y-0.5 hover:border-accent"
                >
                  {item}
                </span>
              ))}
            </div>
          </SpotlightCard>
        </Reveal>
      ))}
    </div>
  );
}
