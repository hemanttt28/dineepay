import Hero from "./components/Hero";
import ProblemSection from "./components/ProblemSection";
import SolutionSection from "./components/SolutionSection";
import FeatureSection from "./components/FeatureSection";
import HowItWorks from "./components/HowItWorks";
import PremiumFoodShowcase from "./components/PremiumFoodShowcase";
import ThreeDMenuCarousel from "./components/ThreeDMenuCarousel";



export default function Home() {
  return (
    <main className="min-h-screen bg-[#1a0f0a] text-white overflow-x-hidden selection:bg-[#ff6b00] selection:text-white">
      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeatureSection />
      <HowItWorks />

      {/* Premium 3D Showcase */}
      <PremiumFoodShowcase />

      {/* Horizontal Scroll Menu */}
      <ThreeDMenuCarousel />

      <div className="py-20 bg-gray-50 dark:bg-zinc-900/50">
        {/* This div seems to be an empty placeholder based on the instruction. */}
      </div>

      {/* Footer (Quick implementation inline) */}
      <footer className="py-8 border-t border-white/10 text-center text-gray-500 text-sm">
        <p>© 2026 Dine ePay. All rights reserved.</p>
      </footer>
    </main>
  );
}
