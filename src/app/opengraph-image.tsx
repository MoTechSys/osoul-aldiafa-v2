/**
 * Dynamic Open Graph image for the homepage (1200×630), branded, with a real
 * Arabic font (Tajawal) embedded so Arabic glyphs render correctly in ImageResponse.
 * Note: Tajawal (simple sans) is used instead of Amiri — @vercel/og's Satori does
 * not support some advanced Amiri OpenType ligature lookups (lookupType 5 / substFormat 3).
 */

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "أصول الضيافة — خدمات الضيافة الفاخرة في السعودية";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const fontsDir = join(process.cwd(), "src/app/_fonts");
  const [fontRegular, fontBold] = await Promise.all([
    readFile(join(fontsDir, "Tajawal-Regular.ttf")),
    readFile(join(fontsDir, "Tajawal-Bold.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #141210 0%, #0a0a0a 100%)",
          color: "#F5EFE0",
          textAlign: "center",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700, color: "#C5A059", marginBottom: 28, fontFamily: "Amiri" }}>
          أصول الضيافة
        </div>
        <div style={{ fontSize: 40, opacity: 0.92, maxWidth: 920, lineHeight: 1.5, fontFamily: "Amiri" }}>
          خدمات الضيافة العربية الفاخرة في المملكة العربية السعودية
        </div>
        <div style={{ fontSize: 30, opacity: 0.6, marginTop: 44, fontFamily: "Amiri" }}>
          صبّابون · قهوة عربية · تمور · أركان ضيافة
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Amiri", data: fontRegular, weight: 400, style: "normal" },
        { name: "Amiri", data: fontBold, weight: 700, style: "normal" },
      ],
    }
  );
}
