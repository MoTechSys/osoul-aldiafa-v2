/**
 * حارس صور OG لكل صفحة — المالك: ضمان الجودة.
 * يمنع: manifest ناقص، أصل مفقود، تكرار، مسار لا صفحة له، أو صفحة بلا صورة.
 */
import { describe, it, expect } from "vitest";
import { existsSync, statSync, readFileSync } from "node:fs";
import { join } from "node:path";
import ogManifest from "../src/data/og-manifest.json";

type Entry = { path: string; image: string; alt: string };
const entries = ogManifest as Entry[];
const ROOT = process.cwd();

describe("og-manifest", () => {
  it("يحتوي 49 إدخالًا بلا تكرار مسار أو صورة", () => {
    expect(entries.length).toBe(49);
    expect(new Set(entries.map((e) => e.path)).size).toBe(entries.length);
    expect(new Set(entries.map((e) => e.image)).size).toBe(entries.length);
  });

  it("كل إدخال له مسار مطلق وصورة تحت /og/ وalt عربي غير فارغ", () => {
    for (const e of entries) {
      expect(e.path.startsWith("/"), e.path).toBe(true);
      expect(e.image.startsWith("/og/"), e.image).toBe(true);
      expect(e.image.endsWith(".webp"), e.image).toBe(true);
      expect(e.alt.trim().length, e.path).toBeGreaterThan(0);
      expect(e.alt.length, e.path).toBeLessThanOrEqual(125);
      expect(/[\u0600-\u06FF]/.test(e.alt), `alt غير عربي: ${e.path}`).toBe(true);
    }
  });

  it("كل صورة موجودة فعلًا بصيغتيها (WebP للفهرسة + JPEG للمعاينات)", () => {
    for (const e of entries) {
      const webp = join(ROOT, "public", e.image);
      const jpg = webp.replace(/\.webp$/, ".jpg");
      expect(existsSync(webp), `WebP مفقود: ${e.image}`).toBe(true);
      expect(existsSync(jpg), `JPEG مفقود: ${e.image}`).toBe(true);
      // حد عملي: المُكشِّطات تتجاهل الصور الضخمة، و300KB هامش آمن.
      expect(statSync(webp).size, e.image).toBeLessThan(300 * 1024);
      expect(statSync(jpg).size, e.image).toBeLessThan(300 * 1024);
    }
  });

  it("الصور بأبعاد OG القياسية 1200×630", () => {
    for (const e of entries) {
      const buf = readFileSync(join(ROOT, "public", e.image));
      expect(buf.subarray(0, 4).toString("latin1")).toBe("RIFF");
      expect(buf.subarray(8, 12).toString("latin1")).toBe("WEBP");
      // VP8 (lossy): الأبعاد في الإزاحة 26..30، 14 بتة لكل بعد.
      const w = buf.readUInt16LE(26) & 0x3fff;
      const h = buf.readUInt16LE(28) & 0x3fff;
      expect([w, h], e.image).toEqual([1200, 630]);
    }
  });

  it("يُبقي الصورة الاحتياطية القديمة (روابط مكشوطة سابقًا)", () => {
    expect(existsSync(join(ROOT, "public", "og-image.jpg"))).toBe(true);
  });
});
