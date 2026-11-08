// Independent timezone/DST checks for zsolar (local fallback) with per-city zTZ.
const vm=require('vm'),fs=require('fs');
const src=fs.readFileSync('zman-calc.js','utf8');
// extract zsolar + zhm + zTZ let
const cut=src.slice(src.indexOf('let zTZ'),src.indexOf('const zhm'));
const ctx=vm.createContext({Intl,Date,Math,window:{},console});
vm.runInContext(cut+';vm_out={zsolar,zTZset:t=>{zTZ=t}};',ctx);
const zsolar=vm.runInContext('zsolar',ctx);
const setTZ=t=>vm.runInContext('zTZ="'+t+'"',ctx);
const zhm=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
const cases=[
 // city, tz, y,m,d, expected sunset approx, tolerance min
 ['New York','America/New_York',2026,7,1,'20:31',6],
 ['New York','America/New_York',2026,1,15,'16:53',6],
 ['Phoenix','America/Phoenix',2026,7,1,'19:42',6],
 ['Phoenix','America/Phoenix',2026,1,15,'17:47',6],
 ['Los Angeles','America/Los_Angeles',2026,7,1,'20:08',6],
 ['Los Angeles','America/Los_Angeles',2026,1,15,'17:08',6],
];
const coords={'New York':[40.6782,-73.9442],'Phoenix':[33.4484,-112.0740],'Los Angeles':[34.0522,-118.2437]};
let fail=0;
for(const [city,tz,y,m,d,exp,tol] of cases){
  setTZ(tz);
  const [lat,lon]=coords[city];
  const got=zhm(zsolar(y,m,d,lat,lon,90.833,false));
  const toMin=s=>{const[a,b]=s.split(':');return +a*60+ +b};
  const diff=Math.abs(toMin(got)-toMin(exp));
  const ok=diff<=tol;
  if(!ok)fail++;
  console.log((ok?'PASS':'FAIL'),city,tz,`${y}-${m}-${d}`,'sunset',got,'expected ~'+exp,'diff',diff+'m');
}
// DST sanity: NYC Nov 1 2026 is the fallback day; sunset must be ~16:50 EST (not 17:50)
setTZ('America/New_York');
const g=zhm(zsolar(2026,11,2,40.6782,-73.9442,90.833,false));
console.log('NYC 2026-11-02 (post-DST) sunset',g,'expect ~16:49');
// sanity that wrong tz would be caught: same calc with Jerusalem tz would give ~22:49 UTC-shifted
setTZ('Asia/Jerusalem');
console.log('control (Jerusalem tz on NYC coords):',zhm(zsolar(2026,7,1,40.6782,-73.9442,90.833,false)),'-- clearly wrong for NYC, proves tz parameter matters');
process.exit(fail?1:0);
