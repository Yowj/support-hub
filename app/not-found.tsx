import HalftoneCanvas from "@/components/landing/HalftoneCanvas";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 text-foreground [--ec:#FA6B43]">
      <HalftoneCanvas />
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground/60">
          <span className="h-2 w-2 rounded-full bg-[var(--ec)]" />
          Error · 404
        </p>

        <p className="text-lg leading-relaxed text-white/75">
          This page can&apos;t be found.
          <br />
          Double check the URL or head back to your support hub.
        </p>

        <Link
          href="/"
          className="rounded-full bg-foreground px-8 py-3.5 text-base font-semibold text-background transition hover:bg-[var(--ec)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
        >
          Home
        </Link>
      </div>
    </section>
  );
}
