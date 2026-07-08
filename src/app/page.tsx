import { Nav } from "@/components/landing/Nav";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Demo } from "@/components/landing/Demo";
import { TechStrip } from "@/components/landing/TechStrip";
import { Footer } from "@/components/landing/Footer";
import { ScrollAnimations } from "@/components/landing/ScrollAnimations";

export default function Home() {
  return (
    <main className="landing-page-wrapper">
      <ScrollAnimations />
      <Nav />
      <Hero />
      <div className="section-divider" />
      <HowItWorks />
      <div className="section-divider" />
      <Features />
      <div className="section-divider" />
      <Demo />
      <TechStrip />
      <Footer />
    </main>
  );
}
