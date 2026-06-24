import HalftoneCanvas from "@/components/landing/HalftoneCanvas";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 text-foreground">
      <HalftoneCanvas />
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        <p className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-brand" />
          Error · 404
        </p>

        <p className="text-lg leading-relaxed text-muted-foreground">
          This page can&apos;t be found.
          <br />
          Double check the URL or head back to your support hub.
        </p>

        <Link
          href="/"
          className="rounded-full bg-brand-gradient px-8 py-3.5 text-base font-semibold text-on-brand shadow-lg shadow-brand/25 transition hover:opacity-95 hover:shadow-brand/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Home
        </Link>
      </div>
    </section>
  );
}
