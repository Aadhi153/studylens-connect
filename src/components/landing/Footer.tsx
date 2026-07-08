import Link from "next/link";

export function Footer() {
  return (
    <footer className="fade-in-section mx-auto w-full max-w-6xl border-t border-white/10 px-6 py-8">
      <div className="flex flex-col items-center justify-between gap-4 text-sm text-landing-on-gradient-secondary md:flex-row">
        <p>Built by Aadhi Piranav</p>
        <div className="flex gap-6">
          <Link href="https://github.com" className="hover:text-landing-on-gradient">
            GitHub
          </Link>
          <Link href="/" className="hover:text-landing-on-gradient">
            Portfolio
          </Link>
          <Link href="/contact" className="hover:text-landing-on-gradient">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
