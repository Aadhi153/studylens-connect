"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#demo", label: "Demo" },
  { href: "/login", label: "Login" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3">
        <span className="text-lg font-semibold text-landing-on-gradient">
          StudyLens Connect
        </span>
        <div className="hidden items-center gap-8 text-sm text-landing-on-gradient-secondary md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="#demo"
            className="btn-primary rounded-lg bg-landing-cta px-4 py-2 text-sm font-medium text-white"
          >
            Try Demo
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="hamburger-btn flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 md:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className={`hamburger ${open ? "is-open" : ""}`} aria-hidden="true">
              <span className="hamburger-bar" />
              <span className="hamburger-bar" />
              <span className="hamburger-bar" />
            </span>
          </button>
        </div>
      </nav>
      <div className={`mobile-menu md:hidden ${open ? "is-open" : ""}`}>
        <div className="mobile-menu-inner">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 border-t border-white/10 px-6 py-4 text-sm text-landing-on-gradient-secondary">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
