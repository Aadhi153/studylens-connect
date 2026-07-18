const steps = [
  {
    title: "Create a Group",
    description: "Start a study group in seconds.",
  },
  {
    title: "Invite with a Code",
    description: "Share a simple code — no complicated setup.",
  },
  {
    title: "Chat in Real Time",
    description: "See typing indicators, presence, and read receipts as they happen.",
  },
  {
    title: "Pin What Matters",
    description: "Pin shared notes or flashcard sets right into the conversation.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="how-it-works-band fade-in-section w-full scroll-mt-24"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-center text-3xl font-semibold text-landing-on-gradient">
          How It Works
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {steps.map((step, i) => (
            <div key={step.title} className="fade-in-item">
              <div className="step-card flex flex-col items-start gap-3 rounded-2xl p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-app-border text-sm font-medium text-landing-on-gradient">
                  {i + 1}
                </span>
                <h3 className="text-lg font-medium text-landing-on-gradient">{step.title}</h3>
                <p className="text-sm text-landing-on-gradient-secondary">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
