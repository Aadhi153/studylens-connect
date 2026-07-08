import Link from "next/link";
import { ChatMockup } from "@/components/landing/ChatMockup";

export function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 pb-24 pt-12 md:flex-row md:pt-20">
      <div className="flex flex-1 flex-col items-start gap-6">
        <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-landing-on-gradient-secondary">
          Real-Time Study Group Chat
        </span>
        <h1 className="text-4xl font-semibold leading-tight text-landing-on-gradient md:text-5xl">
          Study together, in real time.
        </h1>
        <p className="max-w-md text-lg text-landing-on-gradient-secondary">
          Create a group, invite your classmates, and chat live — with typing
          indicators, read receipts, and shared notes pinned right in the
          conversation.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="#demo"
            className="btn-primary rounded-lg bg-landing-cta px-5 py-3 text-sm font-medium text-white"
          >
            Try Demo
          </Link>
          <Link
            href="/signup"
            className="btn-secondary rounded-lg border border-white/30 px-5 py-3 text-sm font-medium text-landing-on-gradient"
          >
            Sign Up Free
          </Link>
        </div>
      </div>
      <div className="flex flex-1 justify-center">
        <ChatMockup />
      </div>
    </section>
  );
}
