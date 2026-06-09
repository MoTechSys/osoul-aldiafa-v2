// Google Analytics 4 — جاهز، يُفعّل فقط عند توفّر معرّف القياس.
// لتفعيله: ضع NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX في متغيّرات بيئة Vercel ثم أعد النشر.
import Script from "next/script";

export function Analytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  if (!GA_ID) return null; // لا تتبّع حتى يُضاف المعرّف

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}

export default Analytics;
