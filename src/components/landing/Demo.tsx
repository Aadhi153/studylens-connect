import Link from "next/link";

export function Demo() {
  return (
    <section id="demo" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-20 text-center">
      <h2 className="mb-4 text-3xl font-semibold text-landing-on-gradient">
        See it in action
      </h2>
      <p className="mx-auto mb-8 max-w-lg text-landing-on-gradient-secondary">
        Try a live demo group — a simulated study partner will chat with you in
        real time, typing indicator and all, no signup required.
      </p>
      <Link
        href="/demo"
        className="inline-block rounded-lg bg-landing-cta px-6 py-3 text-sm font-medium text-white transition hover:brightness-110"
      >
        Try Demo Now
      </Link>
    </section>
  );
}
