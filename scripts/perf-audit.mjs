import { chromium } from 'playwright';
const urls = ['/', '/contact', '/diyafa-makkah', '/qahwajiin-jeddah', '/sababin-qahwa-jeddah', '/offerings', '/privacy', '/terms'];
const b = await chromium.launch();
console.log('URL'.padEnd(26), 'LCP'.padStart(7), 'CLS'.padStart(7), 'REQ'.padStart(5), 'IMG_KB'.padStart(8), 'TOTAL_KB'.padStart(9));
for (const u of urls) {
  const ctx = await b.newContext({ viewport:{width:1440,height:900} });
  const p = await ctx.newPage();
  let bytes=0, imgBytes=0, req=0;
  p.on('response', async r => { req++;
    try { const l=r.headers()['content-length']; const n=l?+l:0; bytes+=n;
      if ((r.headers()['content-type']||'').startsWith('image')) imgBytes+=n; } catch {}
  });
  await p.goto('http://localhost:3000'+u, {waitUntil:'load', timeout:60000});
  await p.waitForTimeout(2500);
  const m = await p.evaluate(() => new Promise(res => {
    let lcp=0, cls=0;
    new PerformanceObserver(l=>{for(const e of l.getEntries()) lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
    new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput) cls+=e.value;}).observe({type:'layout-shift',buffered:true});
    setTimeout(()=>res({lcp,cls}),1200);
  }));
  console.log(u.padEnd(26), m.lcp.toFixed(0).padStart(7), m.cls.toFixed(4).padStart(7),
    String(req).padStart(5), (imgBytes/1024).toFixed(0).padStart(8), (bytes/1024).toFixed(0).padStart(9));
  await ctx.close();
}
await b.close();
