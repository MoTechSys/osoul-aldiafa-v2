"use client";

/**
 * Route-level Error Boundary. Catches runtime errors in this segment's tree
 * and renders a branded recovery UI instead of a white screen.
 */

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface the error to monitoring (no-op placeholder; wire to your tool of choice).
  }, [error]);

  return (
    <main
      dir="rtl"
      className="min-h-[70vh] flex flex-col items-center justify-center bg-onyx text-pearl px-6 text-center"
    >
      <h1 className="gold-text font-amiri text-3xl sm:text-4xl font-bold mb-4">
        حدث خطأ غير متوقّع
      </h1>
      <p className="text-pearl/75 max-w-md leading-relaxed mb-8">
        نعتذر عن الإزعاج. يمكنك المحاولة مرّة أخرى، وإن استمرّت المشكلة تواصل معنا
        عبر واتساب.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={reset}
          className="px-7 py-3 rounded-full bg-gold text-onyx font-bold hover:brightness-110 transition"
        >
          حاول مرّة أخرى
        </button>
        <a
          href="/"
          className="px-7 py-3 rounded-full border border-gold/40 text-pearl hover:bg-gold/10 transition"
        >
          العودة للرئيسية
        </a>
      </div>
    </main>
  );
}
