import GrainOverlay from "./components/GrainOverlay";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ToolGraveyard from "./components/ToolGraveyard";
import BeforeAfter from "./components/BeforeAfter";
import FlowPipeline from "./components/FlowPipeline";
import Features from "./components/Features";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <Navbar />
      <main>
        <Hero />
        <ToolGraveyard />
        <BeforeAfter />
        <FlowPipeline />
        <Features />
      </main>
    </>
  );
}
