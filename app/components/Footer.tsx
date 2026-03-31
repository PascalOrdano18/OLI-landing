"use client";

export default function Footer() {
  return (
    <footer
      className="py-10 px-6 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <span className="text-base font-bold tracking-[-0.02em]">OLI</span>
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="text-xs transition-colors duration-200"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            GitHub
          </a>
          <a
            href="#"
            className="text-xs transition-colors duration-200"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            Twitter
          </a>
        </div>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          &copy; {new Date().getFullYear()} OLI
        </span>
      </div>
    </footer>
  );
}
