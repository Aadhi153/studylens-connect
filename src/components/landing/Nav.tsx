import Link from "next/link";

export function Nav() {
  return (
    <header className="navbar">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold text-landing-on-gradient">
          StudyLens Connect
        </span>
        <div className="hidden items-center gap-8 text-sm text-landing-on-gradient-secondary md:flex">
          <Link href="#features" className="hover:text-landing-on-gradient">
            Features
          </Link>
          <Link href="#how-it-works" className="hover:text-landing-on-gradient">
            How It Works
          </Link>
          <Link href="#demo" className="hover:text-landing-on-gradient">
            Demo
          </Link>
          <Link href="/login" className="hover:text-landing-on-gradient">
            Login
          </Link>
        </div>
        <Link
          href="#demo"
          className="rounded-lg bg-landing-cta px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
        >
          Try Demo
        </Link>
      </nav>
    </header>
  );
}
