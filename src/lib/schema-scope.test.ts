import { describe, it, expect } from "vitest";
import { generateProfessionalServiceSchema } from "@/lib/schema";

/**
 * حارس انحدار لقرار المالك بشأن النطاق والأسعار (msg 3216928):
 *   - النطاق: جدة وينبع أساسًا (مع خدمة بقية المناطق) — لا «مكة/المدينة فقط».
 *   - priceRange: "$$-$$$$" (فاخر ومتوسط، ليظهر لكل الشرائح).
 * يمنع أي تراجع صامت في وصف/سعر الكيان الأساسي (G3 من مراجعة مراجع الكود).
 */
describe("ProfessionalService — نطاق وسعر (قرار المالك)", () => {
  const pro = generateProfessionalServiceSchema();

  it("priceRange = $$-$$$$", () => {
    expect(pro.priceRange).toBe("$$-$$$$");
  });

  it("الوصف يعلن جدة وينبع", () => {
    expect(pro.description).toMatch(/جدة/);
    expect(pro.description).toMatch(/ينبع/);
  });

  it("الوصف لا يحتوي الصياغة القديمة «في منطقتي مكة»", () => {
    expect(pro.description).not.toMatch(/في منطقتي مكة/);
  });

  it("areaServed = المملكة (Country) + 5 دوائر تركيز (قرار المالك 2026-08-29)", () => {
    const areas = pro.areaServed as { "@type": string }[];
    expect(Array.isArray(areas)).toBe(true);
    expect(areas.filter((a) => a["@type"] === "Country")).toHaveLength(1);
    expect(areas.filter((a) => a["@type"] === "GeoCircle")).toHaveLength(5);
  });
});
