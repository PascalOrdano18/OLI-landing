import GrainOverlay from "./components/GrainOverlay";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Convergence from "./components/Convergence";
import HorizontalFlow from "./components/HorizontalFlow";
import OrchestratorShowcase from "./components/OrchestratorShowcase";
import FinalCTA from "./components/FinalCTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <Navbar />
      <main>
        <Hero />
        <Convergence />
        <HorizontalFlow />
        <OrchestratorShowcase />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
