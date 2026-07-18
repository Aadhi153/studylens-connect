const features = [
  {
    title: "Live Messaging",
    description: "Instant delivery powered by real-time sync — no refreshing, no delay.",
  },
  {
    title: "Typing & Presence",
    description: "See who's online and who's typing, right as it happens.",
  },
  {
    title: "Read Receipts",
    description: "Know when your message has been seen.",
  },
  {
    title: "Pinned Notes",
    description: "Bring your StudyLens notes straight into group discussions.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="features-band fade-in-section w-full scroll-mt-24"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-semibold text-landing-on-gradient">
          Features
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="fade-in-item">
              <div className="feature-card rounded-2xl p-6">
                <h3 className="mb-2 text-lg font-medium text-landing-on-gradient">
                  {feature.title}
                </h3>
                <p className="text-sm text-landing-on-gradient-secondary">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
