import GrainOverlay from "./components/GrainOverlay";

export default function Home() {
  return (
    <>
      <GrainOverlay />
      <main>
        <div className="h-screen flex items-center justify-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            Your team talks. OLI codes.
          </h1>
        </div>
      </main>
    </>
  );
}
