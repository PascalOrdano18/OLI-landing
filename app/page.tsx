import GrainOverlay from "./components/GrainOverlay";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ToolGraveyard from "./components/ToolGraveyard";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <Navbar />
      <main>
        <Hero />
        <ToolGraveyard />
      </main>
    </>
  );
}
