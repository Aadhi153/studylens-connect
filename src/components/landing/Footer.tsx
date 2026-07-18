import Link from "next/link";

export function Footer() {
  return (
    <footer className="cta-band fade-in-section w-full">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 border-t border-app-border px-6 py-8 text-sm text-landing-on-gradient-secondary md:flex-row">
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
