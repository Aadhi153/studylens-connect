const tags = ["Next.js", "React Native", "Supabase Realtime", "TypeScript"];

export function TechStrip() {
  return (
    <section className="cta-band fade-in-section w-full">
      <div className="mx-auto w-full max-w-6xl px-6 py-12 text-center">
        <p className="mb-4 text-sm text-landing-on-gradient-secondary">
          Built with Next.js, React Native, Supabase Realtime, and PostgreSQL.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-app-border px-3 py-1 text-xs text-landing-on-gradient-secondary"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
