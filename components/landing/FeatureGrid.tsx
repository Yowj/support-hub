import Eyebrow from "./Eyebrow";
import { features } from "./landing-data";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";

export default function FeatureGrid() {
  return (
    <section className="border-t border-border/50 bg-muted/30 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal className="mx-auto mb-16 max-w-2xl text-center">
          <Eyebrow>Everything included</Eyebrow>
          <h2 className="mt-4 text-balance text-3xl sm:text-4xl font-semibold tracking-tight">
            Built for teams that want to{" "}
            <span className="font-serif italic font-normal text-brand-gradient">
              delight
            </span>{" "}
            customers
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features that help your team work smarter, not harder.
          </p>
        </Reveal>

        <RevealGroup className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <RevealItem
              key={index}
              className="group bg-card p-8 transition-colors hover:bg-accent/40"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand/20">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
