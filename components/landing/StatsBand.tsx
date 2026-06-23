import { stats } from "./landing-data";
import { RevealGroup, RevealItem } from "./Reveal";

export default function StatsBand() {
  return (
    <section className="py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <RevealGroup
          className="grid grid-cols-2 gap-8 lg:grid-cols-4 lg:gap-12"
          stagger={0.1}
        >
          {stats.map((stat, index) => (
            <RevealItem key={index} className="text-center">
              <div className="text-4xl font-semibold tracking-tight lg:text-5xl">
                {stat.value}
              </div>
              <div className="mt-2 font-mono text-xs uppercase tracking-[0.12em] text-muted-foreground">
                {stat.label}
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
