"use client";

/**
 * Global Error Boundary — catches errors thrown in the ROOT layout itself.
 * Must render its own <html> and <body> because it replaces the root layout.
 */

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#141210",
          color: "#F5EFE0",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1.5rem",
          margin: 0,
        }}
      >
        <h1
          style={{
            color: "#C5A059",
            fontSize: "2rem",
            fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          حدث خطأ في تحميل الصفحة
        </h1>
        <p style={{ opacity: 0.75, maxWidth: "28rem", lineHeight: 1.8, marginBottom: "2rem" }}>
          نعتذر عن الإزعاج. حاول إعادة تحميل الصفحة.
        </p>
        <button
          onClick={reset}
          style={{
            padding: "0.75rem 1.75rem",
            borderRadius: "9999px",
            background: "#C5A059",
            color: "#141210",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
          }}
        >
          إعادة المحاولة
        </button>
      </body>
    </html>
  );
}
