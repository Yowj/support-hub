import { trustedBy } from "./landing-data";

const items = [...trustedBy, ...trustedBy, ...trustedBy, ...trustedBy];

export default function TrustStrip() {
  return (
    <section className="border-y border-border/50 py-10 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 lg:px-8 mb-6">
        <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Trusted by support teams at
        </p>
      </div>
      <div className="relative [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-x-16">
          {items.map((name, i) => (
            <span
              key={i}
              className="whitespace-nowrap text-lg font-semibold tracking-tight text-muted-foreground/70 hover:text-foreground transition-colors cursor-default select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
