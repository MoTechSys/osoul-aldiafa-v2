"use client";

import { memo, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { isStandaloneRoute } from "@/lib/standaloneRoutes";

const FloatingWhatsApp = dynamic(() => import("@/components/FloatingWhatsApp"), {
  ssr: false,
});

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

function ClientLayoutInner({ children }: { children: React.ReactNode }) {
  const [, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const pathname = usePathname();
  const standalone = isStandaloneRoute(pathname);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      const promptEvent = e as BeforeInstallPromptEvent;
      promptEvent.preventDefault();
      setDeferredPrompt(promptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  /**
   * الصفحات المستقلة (مثل `/links`) تُعرض بلا شريط علوي ولا فوتر ولا زرّ
   * واتساب عائم — لأنها بذاتها قائمة قنوات التواصل، فتكرارها تشويش.
   * نُبقي عنصر `<main id="main-content">` كما هو حتى يظلّ رابط
   * «تخطي إلى المحتوى الرئيسي» في `layout.tsx` صالحًا (وصول/a11y).
   */
  if (standalone) {
    return (
      <div className="min-h-screen bg-noir text-pearl" dir="rtl">
        <main id="main-content">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-noir text-pearl" dir="rtl">
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default memo(ClientLayoutInner);
