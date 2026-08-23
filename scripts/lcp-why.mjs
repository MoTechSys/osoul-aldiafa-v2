import { chromium } from 'playwright';
const b = await chromium.launch();
for (const u of (process.argv.slice(2).length ? process.argv.slice(2) : ['/qahwajiin-jeddah','/diyafa-makkah'])) {
  const p = await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
  await p.goto('http://localhost:3000'+u,{waitUntil:'load',timeout:60000});
  await p.waitForTimeout(3000);
  const r = await p.evaluate(()=>new Promise(res=>{
    let el=null,t=0;
    new PerformanceObserver(l=>{const e=l.getEntries().at(-1); t=e.startTime; el=e.element?
      {tag:e.element.tagName, src:(e.element.currentSrc||e.element.src||'').slice(-90),
       loading:e.element.getAttribute('loading'), fetchpriority:e.element.getAttribute('fetchpriority'),
       w:e.element.width,h:e.element.height, size:e.size}:null;
    }).observe({type:'largest-contentful-paint',buffered:true});
    setTimeout(()=>res({t,el}),1500);
  }));
  console.log('\n===',u,'LCP=',r.t.toFixed(0)+'ms'); console.log(JSON.stringify(r.el,null,1));
  const slow = await p.evaluate(()=>performance.getEntriesByType('resource')
    .filter(x=>x.duration>500).sort((a,b)=>b.duration-a.duration).slice(0,6)
    .map(x=>({d:Math.round(x.duration), kb:Math.round((x.transferSize||0)/1024), n:x.name.slice(-70)})));
  console.log('أبطأ الموارد:'); slow.forEach(s=>console.log(`  ${s.d}ms ${s.kb}KB ${s.n}`));
}
await b.close();
