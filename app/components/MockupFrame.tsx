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
    <div className={`relative ${className}`}>
      {/* Glow behind frame */}
      <div
        className="glow-spot -z-10"
        style={{
          width: "60%",
          height: "60%",
          top: "20%",
          left: "20%",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          aspectRatio,
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        {children ?? (
          <div className="w-full h-full flex items-center justify-center">
            <span
              className="text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              {label}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
