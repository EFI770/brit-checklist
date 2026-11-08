const vm=require('vm'),fs=require('fs'),assert=require('assert');
const tick=()=>new Promise(r=>setTimeout(r,20));
const els={};for(const id of ['zbirth','zloc','zsset','ztzet','zout','zresults'])els[id]={value:'',textContent:'',innerHTML:'',hidden:true,querySelectorAll:()=>[],contains:()=>false,addEventListener(){}};
els.zloc.value='תל אביב-יפו';
const urls=[];
const ctx=vm.createContext({Intl,Date,Math,AbortSignal,URL,clearTimeout,setTimeout,document:{getElementById:id=>els[id],createElement:()=>({}),addEventListener(){}},
fetch:async u=>{urls.push(u);if(u.includes('nominatim'))return{ok:true,json:async()=>[{display_name:'מצפה רמון, מועצה אזורית רמת נגב, הדרום, ישראל',lat:'30.61',lon:'34.80'}]};return{ok:true,json:async()=>({times:{sunrise:'2026-11-15T06:10:00+02:00',sunset:'2026-11-08T16:45:00+02:00',tzeit85deg:'2026-11-08T17:25:00+02:00'}})}}});
vm.runInContext(fs.readFileSync('zman-calc.js','utf8'),ctx);
(async()=>{
await tick();
vm.runInContext('zsearch("מצפה")',ctx);await tick();
assert(urls.some(u=>u.includes('nominatim')&&u.includes('countrycodes=il')));
assert(els.zresults.innerHTML.includes('מצפה רמון'));console.log('PASS locality outside built-in list found');
vm.runInContext('zsetPlace(30.61,34.80,"מצפה רמון");calcZman(true)',ctx);await tick();
assert(urls.some(u=>u.includes('hebcal')&&u.includes('latitude=30.61')));console.log('PASS selected locality coords sent to Hebcal');
vm.runInContext('zsel=null;calcZman(true)',ctx);assert(els.zout.textContent.includes('בחר')||els.zout.textContent.includes('הקלד'));console.log('PASS unselected typed text does not compute');
})().catch(e=>{console.error(e);process.exit(1)});
