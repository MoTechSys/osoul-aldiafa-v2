import { describe, it, expect } from "vitest";
import { jsonLd, generateServiceSchema } from "@/lib/schema";

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
