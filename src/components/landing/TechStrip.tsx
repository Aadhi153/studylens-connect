const tags = ["Next.js", "React Native", "Supabase Realtime", "TypeScript"];

export function TechStrip() {
  return (
    <section className="fade-in-section mx-auto w-full max-w-6xl px-6 py-12 text-center">
      <p className="mb-4 text-sm text-landing-on-gradient-secondary">
        Built with Next.js, React Native, Supabase Realtime, and PostgreSQL.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/20 px-3 py-1 text-xs text-landing-on-gradient-secondary"
          >
            {tag}
          </span>
        ))}
      </div>
    </section>
  );
}
