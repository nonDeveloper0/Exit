import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative h-screen overflow-hidden bg-zinc-950 flex flex-col">
      {/* Animated blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 420,
            height: 420,
            background: "#f59e0b",
            opacity: 0.1,
            filter: "blur(90px)",
            top: -100,
            right: -80,
            animation: "blob-one 9s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 380,
            height: 380,
            background: "#dc2626",
            opacity: 0.08,
            filter: "blur(80px)",
            bottom: 0,
            left: -80,
            animation: "blob-two 11s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 300,
            height: 300,
            background: "#7c3aed",
            opacity: 0.07,
            filter: "blur(100px)",
            top: "45%",
            left: "20%",
            animation: "blob-three 13s ease-in-out infinite",
          }}
        />
        <div className="absolute inset-0 grid-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 items-center justify-center gap-5 px-6 text-center">
        <p className="text-xs font-mono text-amber-400/60 tracking-[0.45em] uppercase">
          2026 Summer Camp
        </p>

        <h1
          className="text-[108px] font-black text-white leading-none tracking-tighter text-glow-amber"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          EXIT
        </h1>

        <div className="flex items-center gap-4">
          <div className="h-px w-10 bg-zinc-700" />
          <span className="text-xs font-mono text-zinc-500 tracking-[0.35em] uppercase">
            Season 1
          </span>
          <div className="h-px w-10 bg-zinc-700" />
        </div>
      </div>

      {/* Enter button */}
      <div className="relative z-10 px-6 pb-14">
        <Link
          href="/home"
          className="block w-full py-4 text-center bg-amber-400 text-zinc-950 font-bold text-base rounded-lg tracking-widest uppercase"
        >
          입장하기
        </Link>
      </div>
    </div>
  );
}
