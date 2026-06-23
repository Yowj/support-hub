import Eyebrow from "./Eyebrow";
import { teams } from "./landing-data";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

export default function TeamsGrid() {
  return (
    <section className="border-t border-border/50 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <Eyebrow>However you support</Eyebrow>
          <h2 className="mt-4 text-balance text-3xl sm:text-4xl font-semibold tracking-tight">
            Made for every kind of team
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From a two-person startup to a global enterprise, SupportHub bends
            to the way you already work.
          </p>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {teams.map((team, index) => (
            <RevealItem
              key={index}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-8 transition-all hover:border-brand/40"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand">
                <team.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{team.title}</h3>
              <p className="text-muted-foreground">{team.description}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
