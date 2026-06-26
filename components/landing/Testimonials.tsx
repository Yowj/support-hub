import { Star } from "lucide-react";
import Avatar from "boring-avatars";
import Eyebrow from "./Eyebrow";
import { testimonials } from "./landing-data";
import { Reveal } from "./Reveal";

export default function Testimonials() {
  return (
    <section id="testimonials" className="overflow-hidden border-t border-border/50 py-24 lg:py-32">
      <Reveal className="mx-auto mb-16 max-w-2xl px-6 text-center lg:px-8">
        <Eyebrow>Loved by support teams</Eyebrow>
        <h2 className="mt-4 text-balance text-3xl sm:text-4xl font-semibold tracking-tight">
          Don&apos;t just take our{" "}
          <span className="font-serif italic font-normal text-brand-gradient">
            word for it
          </span>
        </h2>
      </Reveal>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24 bg-gradient-to-l from-background to-transparent" />

        <div className="flex w-max gap-6 animate-marquee">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={index}
              className="w-[350px] flex-shrink-0 rounded-2xl border border-border/60 bg-card p-6"
            >
              <div className="mb-4 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 fill-warning text-warning"
                  />
                ))}
              </div>
              <p className="mb-6 text-foreground">
                &quot;{testimonial.quote}&quot;
              </p>
              <div className="flex items-center gap-3">
                <Avatar name={testimonial.author} size={40} />
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
