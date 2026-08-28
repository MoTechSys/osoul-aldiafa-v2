import { describe, it, expect } from "vitest";
import {
  jsonLd,
  generateServiceSchema,
  generateProfessionalServiceSchema,
} from "@/lib/schema";

describe("jsonLd", () => {
  it("escapes <script>-breaking and JS-string-breaking characters", () => {
    const out = jsonLd({ a: "<b>&</b>", b: "x\u2028y\u2029z" });
    expect(out).not.toContain("<");
    expect(out).not.toContain(">");
    expect(out).toContain("\\u003c");
    expect(out).toContain("\\u003e");
    expect(out).toContain("\\u0026");
    expect(out).toContain("\\u2028");
    expect(out).toContain("\\u2029");
  });

  it("produces valid JSON after escaping", () => {
    const obj = { name: "أصول الضيافة", t: "<a>" };
    const parsed = JSON.parse(
      jsonLd(obj)
        .replace(/\\u003c/g, "<")
        .replace(/\\u003e/g, ">")
        .replace(/\\u0026/g, "&")
    );
    expect(parsed.name).toBe("أصول الضيافة");
  });
});

describe("generateServiceSchema", () => {
  it("references the single business entity via provider @id", () => {
    const s = generateServiceSchema({
      name: "صبابين قهوة في جدة",
      description: "وصف",
      url: "https://asoulaldiafa.com/sababin-qahwa-jeddah",
      cityAr: "جدة",
      serviceType: "صبابين قهوة",
    });
    expect(s["@type"]).toBe("Service");
    expect(s.provider).toMatchObject({ "@id": expect.stringContaining("#business") });
    expect(s.areaServed).toMatchObject({ "@type": "City", name: "جدة" });
    expect(s.serviceType).toBe("صبابين قهوة");
  });

  it("falls back to Country areaServed when no city given", () => {
    const s = generateServiceSchema({
      name: "خدمة",
      description: "وصف",
      url: "https://asoulaldiafa.com/services",
    });
    expect(s.areaServed).toMatchObject({ "@type": "Country" });
  });
});

describe("generateProfessionalServiceSchema (SAB — ترقية areaServed)", () => {
  const s = generateProfessionalServiceSchema();

  it("النموذج SAB: ProfessionalService بلا address/geo", () => {
    expect(s["@type"]).toBe("ProfessionalService");
    // نموذج مزوّد خدمة متنقّل: لا عنوان فيزيائي على الكيان.
    expect(s).not.toHaveProperty("address");
    expect(s).not.toHaveProperty("geo");
  });

  it("يستخدم areaServed الحديثة ولا يستخدم serviceArea المهجورة", () => {
    // الترقية المعتمدة (P0): serviceArea → areaServed.
    expect(s).toHaveProperty("areaServed");
    expect(s).not.toHaveProperty("serviceArea");
    // مناطق الخدمة دوائر GeoCircle (مدن مخدومة، بلا مقر نقطي للنشاط).
    expect(Array.isArray(s.areaServed)).toBe(true);
    expect(s.areaServed[0]).toMatchObject({ "@type": "GeoCircle" });
  });
});

describe("generateProfessionalServiceSchema — عدد مناطق الخدمة", () => {
  const s = generateProfessionalServiceSchema();

  it("areaServed يطابق مدن الخدمة المعلنة (لا تلفيق للرقم 13)", () => {
    // الرقم «13 منطقة» المعروض في الواجهة غير مشتق من بيانات المستودع
    // (CITIES = 5، مجموع الأحياء 42، جدة+ينبع = 21) — دَين معلَن في baseline
    // لا يُسدّ بتغيير areaServed. هذا الاختبار يثبّت areaServed على مصدرها.
    // تأكيدات priceRange والوصف في src/lib/schema-scope.test.ts.
    expect(s.areaServed.length).toBe(5);
  });
});
