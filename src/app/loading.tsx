export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-noir">
      <div className="flex flex-col items-center gap-5">
        <div className="relative">
          <div
            className="w-14 h-14 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: "#C5A059",
              borderRightColor: "#E2C68E",
              borderBottomColor: "rgba(197,160,89,0.18)",
              borderLeftColor: "rgba(197,160,89,0.18)",
              animationDuration: "1.1s",
            }}
          />
          <div
            className="absolute inset-2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(197,160,89,0.18) 0%, transparent 70%)",
            }}
          />
        </div>
        <p
          className="gold-text font-amiri"
          style={{ letterSpacing: "0.3em", fontSize: "0.95rem", fontWeight: 700 }}
        >
          أصول الضيافة
        </p>
        <p
          className="text-pearl/45 text-xs"
          style={{ letterSpacing: "0.25em" }}
        >
          جاري التحميل...
        </p>
      </div>
    </div>
  );
}
