/**
 * فحص الوصولية (a11y) بمعيار WCAG 2.1 AA عبر axe-core.
 * يجب أن يُشغَّل من مجلد المشروع (playwright تبعية محلية).
 * الصفحات المختارة تغطي: الرئيسية، القانونية، التواصل، صفحة مدينة، صفحة فرعية.
 */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const URLS = ['/', '/privacy', '/terms', '/contact', '/about',
              '/diyafa-makkah', '/qahwajiin-jeddah', '/offerings', '/portfolio'];

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
let total = 0;
const byRule = new Map();

for (const u of URLS) {
  const p = await ctx.newPage();
  await p.goto('http://localhost:3000' + u, { waitUntil: 'load', timeout: 60000 });
  await p.waitForTimeout(1200);
  const r = await new AxeBuilder({ page: p })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const v = r.violations;
  total += v.length;
  console.log(`\n=== ${u} — ${v.length} مخالفة`);
  for (const x of v) {
    byRule.set(x.id, (byRule.get(x.id) || 0) + x.nodes.length);
    console.log(`  [${x.impact}] ${x.id}: ${x.help} (${x.nodes.length} عنصر)`);
    console.log(`      ${x.nodes[0]?.target?.join(' ')?.slice(0, 120)}`);
  }
  await p.close();
}
console.log('\n===== ملخص القواعد المخالَفة =====');
for (const [k, n] of [...byRule.entries()].sort((a, b) => b[1] - a[1])) console.log(String(n).padStart(4), k);
console.log('\nإجمالي المخالفات:', total);
await b.close();
