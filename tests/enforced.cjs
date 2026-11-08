const vm=require('vm'),fs=require('fs'),assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
const js=fs.readFileSync('donations.js','utf8')+html.slice(html.indexOf("const DEF_DONATE="),html.indexOf('function focusWaNum'));
function mk(search){
 const storage=new Map([['bris-checklist-v4','checks'],['brit-calc','calc'],['brit-wa','phone'],['brit-donate','https://old-arbitrary.example/x']]);
 const els={};for(const id of ['donate-link','donate-dom','donate-import','donate-domain'])els[id]={hidden:true,href:'',textContent:''};
 const ctx=vm.createContext({window:null,URL,URLSearchParams,Object,BRIT_DONATIONS:undefined,localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},location:{search},document:{getElementById:id=>els[id]},navigator:{share:async x=>ctx.shared=x}});
 ctx.window=ctx;vm.runInContext(js,ctx);return{ctx,els,storage,run:s=>vm.runInContext(s,ctx)};
}
// arbitrary URL param is no longer honored
let t=mk('?donate=https%3A%2F%2Fevil.example%2Fpay');t.run('importDonate()');
assert(t.els['donate-link'].href.includes('ultra.kesherhk.info'));assert.equal(t.storage.get('brit-donate'),undefined);assert(!t.els['donate-import'].hidden);
console.log('PASS arbitrary ?donate URL rejected and old stored URL cleared');
// unknown key ignored
t=mk('?c=evil-key');t.run('importDonate()');assert(t.els['donate-link'].href.includes('ultra.kesherhk.info'));assert.equal(t.storage.get('brit-donate-key'),undefined);console.log('PASS unknown key ignored');
// owner-approved key applies (simulate an added community)
const mapSrc=fs.readFileSync('donations.js','utf8').replace('};',',"kfar-ratamim":"https://ultra.kesherhk.info/external/paymentPage/328257"};');
t=mk('?c=kfar-ratamim');vm.runInContext(mapSrc,t.ctx);t.run('importDonate()');
assert.equal(t.storage.get('brit-donate-key'),'kfar-ratamim');assert(!t.els['donate-import'].hidden);assert.equal(t.els['donate-domain'].textContent,'ultra.kesherhk.info');
t.run('shareApp()');assert(t.ctx.shared.url.includes('?c=kfar-ratamim')&&!t.ctx.shared.url.includes('donate='));console.log('PASS owner-approved key applies and shares by key only');
// default key resets
t=mk('?c=default');t.storage.set('brit-donate-key','kfar-ratamim');vm.runInContext(mapSrc,t.ctx);t.run('importDonate()');
assert.equal(t.storage.get('brit-donate-key'),undefined);assert(t.els['donate-link'].href.includes('328257'));console.log('PASS default key resets');
// progress preserved
assert.equal(t.storage.get('bris-checklist-v4'),'checks');assert.equal(t.storage.get('brit-calc'),'calc');assert.equal(t.storage.get('brit-wa'),'phone');console.log('PASS progress keys preserved');
// no client editing controls
assert(!html.includes('donate-url')&&!html.includes('saveDonate')&&!html.includes('resetDonate'));console.log('PASS no end-client donation editing controls');
// generator only selects from allowlist
const gen=fs.readFileSync('donate.html','utf8');assert(!gen.includes('type="url"')&&gen.includes('BRIT_DONATIONS')&&gen.includes('<select'));console.log('PASS operator page offers allowlist selection only');
