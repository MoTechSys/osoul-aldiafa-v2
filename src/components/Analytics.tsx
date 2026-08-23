// Google Analytics 4 — مُفعَّل.
//
// تاريخ القرار: أكّد المالك في 22 أغسطس 2026: «توكن أو رمز الربط لقوقل
// أناليتكس هو صحيح، لا تبعده، لأننا كنا ربطناه بقوقل أناليتكس».
//
// خلفية ما حدث: أُضيف المعرّف في الالتزام ddcf671 (13 يونيو 2026) ثم أُزيلت
// القيمة الافتراضية في الالتزام 6be5540 (15 يونيو 2026) وتُرك المعرّف يُقرأ
// من البيئة فقط. وبما أن متغيّر البيئة لم يُضبط، صار الشرط `if (!GA_ID)`
// يُرجع null فلا يُحمَّل أي سكربت — أي أن القياس توقّف تمامًا. تأكيد بالقياس:
//   curl -s https://asoulaldiafa.com/ | grep -c googletagmanager  →  0
//
// إثبات أن المعرّف حقيقي ومُسجَّل لدى قوقل (لا مجرد نصّ صحيح الشكل):
//   gtag/js?id=G-TLRS7CGGGY  →  498,152 بايت
//   gtag/js?id=G-ZZZZZZZZZZ  →  418,607 بايت  (معرّف وهمي)
//   gtag/js?id=G-QQQQQQQQQQ  →  418,607 بايت  (معرّف وهمي آخر)
// المعرّفان الوهميان متطابقان بالبايت، والحقيقي يزيد 79,545 بايت — وهذه
// الزيادة هي حِزمة الإعدادات التي تُرسلها قوقل للحسابات المُهيَّأة فعلًا.
//
// المعرّف عامّ لا سرّي: يظهر في مصدر صفحة أي موقع يستخدم GA4، فتضمينه في
// الكود لا يمثّل تسريبًا. ويبقى متغيّر البيئة NEXT_PUBLIC_GA_ID متاحًا
// لتجاوزه (مثلًا لعقار قياس تجريبي) بلا تعديل الكود.
import Script from "next/script";

/** معرّف القياس المعتمد من المالك — GA4 property الخاصة بأصول الضيافة. */
const DEFAULT_GA_ID = "G-TLRS7CGGGY";

export function Analytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID || DEFAULT_GA_ID;
  if (!GA_ID) return null;

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
