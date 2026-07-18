import Link from "next/link";
import { ChatMockup } from "@/components/landing/ChatMockup";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-app-bg">
      <div className="auth-brand-panel fixed inset-y-0 left-0 hidden w-1/2 flex-col justify-between overflow-hidden px-12 py-10 lg:flex xl:px-16">
        <div className="auth-brand-glow" aria-hidden="true" />

        <Link href="/" className="relative z-10 text-lg font-semibold text-landing-on-gradient">
          StudyLens Connect
        </Link>

        <div className="relative z-10 flex flex-col gap-6">
          <h1 className="max-w-md text-4xl font-semibold leading-tight text-landing-on-gradient">
            Study together, in real time.
          </h1>
          <p className="max-w-sm text-landing-on-gradient-secondary">
            Create a group, invite your classmates, and chat live — with typing
            indicators, read receipts, and shared notes pinned right in the
            conversation.
          </p>
          <div className="mt-2 max-w-md">
            <ChatMockup />
          </div>
        </div>

        <p className="relative z-10 text-xs text-landing-on-gradient-secondary">
          © {new Date().getFullYear()} StudyLens Connect
        </p>
      </div>

      <div className="flex min-h-screen w-full flex-col items-center justify-center px-6 py-12 lg:ml-[50%] lg:w-1/2">
        <Link
          href="/"
          className="mb-10 self-start text-sm text-app-text-secondary transition hover:text-app-text-primary lg:hidden"
        >
          ← Back to home
        </Link>

        <div className="w-full max-w-[360px]">{children}</div>
      </div>
    </div>
  );
}
