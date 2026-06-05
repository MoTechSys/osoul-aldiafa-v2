"use client";

import { memo, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
