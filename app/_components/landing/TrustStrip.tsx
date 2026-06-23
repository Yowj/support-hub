import { trustedBy } from "./landing-data";

export default function TrustStrip() {
  return (
    <section className="border-y border-border/50 py-10">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <p className="mb-6 text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by support teams at
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-lg font-semibold tracking-tight text-muted-foreground/70">
          {trustedBy.map((name) => (
            <span key={name} className="transition-colors hover:text-foreground">
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
