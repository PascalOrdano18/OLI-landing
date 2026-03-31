import GrainOverlay from "./components/GrainOverlay";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <Navbar />
      <main>
        <Hero />
      </main>
    </>
  );
}
