interface MockupFrameProps {
  label: string;
  aspectRatio?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function MockupFrame({
  label,
  aspectRatio = "16/10",
  className = "",
  children,
}: MockupFrameProps) {
  return (
    <div className={`relative group ${className}`}>
      {/* Glow behind frame */}
      <div
        className="glow-spot -z-10"
        style={{
          width: "70%",
          height: "70%",
          top: "15%",
          left: "15%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="rounded-2xl border overflow-hidden shadow-2xl shadow-black/50"
        style={{
          aspectRatio,
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        {children ?? (
          <div className="w-full h-full flex flex-col">
            {/* Fake window chrome */}
            <div
              className="flex items-center gap-1.5 px-4 py-2.5 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div
                className="ml-3 h-5 flex-1 max-w-[200px] rounded"
                style={{ background: "rgba(255,255,255,0.04)" }}
              />
            </div>
            {/* Fake app content */}
            <div className="flex flex-1 min-h-0">
              {/* Sidebar */}
              <div
                className="w-[22%] border-r p-3 flex flex-col gap-2"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="h-2 w-3/4 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
                <div className="h-2 w-1/2 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="h-2 w-2/3 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="mt-2 h-2 w-3/4 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
                <div className="h-2 w-1/2 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="h-2 w-3/5 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="h-2 w-2/5 rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
              </div>
              {/* Main content */}
              <div className="flex-1 p-4 flex flex-col gap-3">
                <div className="h-3 w-2/5 rounded" style={{ background: "rgba(255,255,255,0.08)" }} />
                <div className="h-2 w-full rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="h-2 w-4/5 rounded" style={{ background: "rgba(255,255,255,0.04)" }} />
                <div className="h-2 w-3/5 rounded" style={{ background: "rgba(255,255,255,0.03)" }} />
                <div className="mt-2 flex-1 rounded-lg" style={{ background: "rgba(255,255,255,0.02)" }} />
              </div>
            </div>
            {/* Label overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "rgba(5,5,7,0.6)" }}>
              <span className="text-xs font-medium px-3 py-1.5 rounded-full border" style={{ borderColor: "var(--border-hover)", color: "var(--text-muted)" }}>
                {label}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
