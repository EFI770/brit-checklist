const vm=require('vm'),fs=require('fs'),assert=require('assert');
const tick=()=>new Promise(r=>setImmediate(r));
function setupZ(){
 const els={};for(const id of ['zbirth','zloc','zsset','ztzet','zout','zplaces'])els[id]={value:'',textContent:'',innerHTML:'',hidden:true,appendChild(){}};els.zloc.value='תל אביב-יפו';
 let fetches=[],handler=async()=>({ok:true,json:async()=>({times:{sunrise:'2026-11-15T06:09:00+02:00',sunset:'2026-11-08T16:45:00+02:00',tzeit85deg:'2026-11-08T17:23:00+02:00'}})});
 const ctx=vm.createContext({Intl,Date,Math,AbortSignal,document:{getElementById:id=>els[id],createElement:()=>({})},fetch:(u,o)=>{fetches.push(u);return handler(u,o)}});
 vm.runInContext(fs.readFileSync('zman-calc.js','utf8'),ctx);
 return{els,ctx,fetches,setHandler:h=>handler=h,run:s=>vm.runInContext(s,ctx)};
}
(async()=>{
 const z=setupZ();await tick();await tick();
 assert.equal(z.els.zsset.value,'16:45');assert.equal(z.els.ztzet.value,'17:23');
 console.log('PASS ISO Israel wall time unchanged under device TZ='+process.env.TZ);
 z.els.zbirth.value='2026-11-13T17:00';z.run('calcZman(true)');await tick();await tick();assert(z.els.zout.innerHTML.includes('22/11/2026'));console.log('PASS Friday twilight postponed to Sunday');
 z.els.zsset.value='';z.run('calcZman(false)');assert(z.els.zout.innerHTML.includes('יש למלא'));console.log('PASS empty times rejected');
 z.els.zsset.value='18:00';z.els.ztzet.value='17:00';z.run('calcZman(false)');assert(z.els.zout.textContent.includes('תקינים'));console.log('PASS reversed times rejected');
 z.els.zloc.value='40.71,-74.01';z.run('calcZman(true)');assert(z.els.zout.textContent.includes('מחוץ לישראל'));console.log('PASS unsupported foreign coordinates rejected');z.els.zloc.value='תל אביב-יפו';
 z.setHandler(async()=>{throw Error('offline')});z.run('calcZman(true)');await tick();assert(z.els.zout.textContent.includes('לא חושב מועד'));assert.equal(z.els.zsset.value,'');console.log('PASS outage produces no mixed-method result');
 // A late network response must not replace a later manual edit.
 let resolve;z.setHandler(()=>new Promise(r=>resolve=r));z.run('calcZman(true)');z.els.zsset.value='16:30';z.els.ztzet.value='17:30';z.run('calcZman(false)');resolve({ok:true,json:async()=>({times:{sunset:'2026-11-13T15:00:00+02:00',tzeit85deg:'2026-11-13T15:20:00+02:00'}})});await tick();assert.equal(z.els.zsset.value,'16:30');console.log('PASS stale request cannot overwrite manual fields');
 const html=fs.readFileSync('index.html','utf8');const js=html.slice(html.indexOf("const DEF_DONATE="),html.indexOf('function shareApp()'));
const storage=new Map([['bris-checklist-v4','saved-checkmarks'],['brit-calc','saved-calc'],['brit-wa','saved-phone']]),els={};for(const id of ['donate-link','donate-dom','donate-import','donate-domain'])els[id]={value:'',hidden:true,href:'',textContent:''};
const ctx=vm.createContext({URL,URLSearchParams,localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},location:{search:'?donate=https%3A%2F%2Fexample.com%2Fcommunity'},document:{getElementById:id=>els[id]},navigator:{share:async x=>ctx.shared=x}});
vm.runInContext(js,ctx);const run=s=>vm.runInContext(s,ctx);
for(const bad of ['javascript:alert(1)','http://bad.test','https://user:pass@bad.test','https://'+ 'a'.repeat(501)])assert.equal(run('cleanDonate('+JSON.stringify(bad)+')'),null);
console.log('PASS non-HTTPS, credentials and overlong URLs rejected');
run('importDonate()');assert.equal(storage.get('brit-donate'),'https://example.com/community');assert.equal(els['donate-link'].href,'https://example.com/community');run('shareApp()');assert(ctx.shared.url.includes('?donate=https%3A%2F%2Fexample.com%2Fcommunity'));console.log('PASS selected donation link applies, persists and is included in app sharing');
ctx.location.search='?donate=https%3A%2F%2Fultra.kesherhk.info%2Fexternal%2FpaymentPage%2F328257';run('importDonate()');assert(els['donate-link'].href.includes('ultra.kesherhk.info'));assert.equal(storage.get('bris-checklist-v4'),'saved-checkmarks');assert.equal(storage.get('brit-calc'),'saved-calc');assert.equal(storage.get('brit-wa'),'saved-phone');console.log('PASS default link restores existing default and preserves all progress keys');
})().catch(e=>{console.error(e);process.exit(1)});
