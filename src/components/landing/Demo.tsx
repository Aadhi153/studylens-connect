import Link from "next/link";

export function Demo() {
  return (
    <section
      id="demo"
      className="cta-band fade-in-section w-full scroll-mt-24"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20 text-center">
        <h2 className="mb-4 text-3xl font-semibold text-landing-on-gradient">
          See it in action
        </h2>
        <p className="mx-auto mb-8 max-w-lg text-landing-on-gradient-secondary">
          Try a live demo group — a simulated study partner will chat with you in
          real time, typing indicator and all.
        </p>
        <Link
          href="/signup"
          className="btn-primary inline-block rounded-lg bg-landing-cta px-6 py-3 text-sm font-medium text-white"
        >
          Try Demo Now
        </Link>
      </div>
    </section>
  );
}
