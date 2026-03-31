export default function Footer() {
  return (
    <footer
      className="py-8 px-6 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-sm font-semibold tracking-tight">OLI</span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          &copy; {new Date().getFullYear()} OLI. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
