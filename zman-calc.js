const TZ="Asia/Jerusalem",zdays=["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];
const rad=Math.PI/180,sin=x=>Math.sin(x*rad),cos=x=>Math.cos(x*rad),tan=x=>Math.tan(x*rad);
function zsolar(y,m,d,lat,lon,zen,rise){
const N=Math.floor(275*m/9)-Math.floor((m+9)/12)*(1+Math.floor((y-4*Math.floor(y/4)+2)/3))+d-30;
const lh=lon/15,t=N+((rise?6:18)-lh)/24,M=0.9856*t-3.289;
let L=(M+1.916*sin(M)+0.02*sin(2*M)+282.634)%360;if(L<0)L+=360;
let RA=Math.atan(0.91764*tan(L))/rad;RA=(RA+360)%360;
RA+=Math.floor(L/90)*90-Math.floor(RA/90)*90;RA/=15;
const sd=0.39782*sin(L),cd=Math.cos(Math.asin(sd));
const ch=(cos(zen)-sd*sin(lat))/(cd*cos(lat));
let H=Math.acos(Math.min(1,Math.max(-1,ch)))/rad;if(rise)H=360-H;H/=15;
let UT=(H+RA-0.06571*t-6.622-lh)%24;if(UT<0)UT+=24;
const off=+new Intl.DateTimeFormat("en-GB",{timeZone:TZ,hour:"2-digit",hour12:false}).format(new Date(Date.UTC(y,m-1,d,12)))-12;
return Math.round(((UT+off)%24)*60);
}
const zhm=m=>String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0");
const ztoMin=s=>{const[a,b]=(s||"0:0").split(":");return +a*60+ +b};
function zheb(dt,opt){return new Intl.DateTimeFormat("he-u-ca-hebrew",{timeZone:"UTC",...opt}).format(dt)}
function zisYT(dt){const p=Object.fromEntries(new Intl.DateTimeFormat("en-u-ca-hebrew",{timeZone:"UTC",day:"numeric",month:"long"}).formatToParts(dt).map(x=>[x.type,x.value]));const d=+p.day,m=p.month;return (m.startsWith("Tishri")&&[1,2,10,15,22].includes(d))||(m==="Nisan"&&[15,21].includes(d))||(m==="Sivan"&&d===6)}
const ZPL={"ירושלים":[31.7683,35.2137],"תל אביב-יפו":[32.0853,34.7818],"חיפה":[32.794,34.9896],"באר שבע":[31.253,34.7915],"ראשון לציון":[31.973,34.7925],"פתח תקווה":[32.0841,34.8878],"אשדוד":[31.8044,34.6553],"נתניה":[32.3215,34.8532],"בני ברק":[32.0807,34.8338],"רחובות":[31.8928,34.8113],"כפר רתמים":[31.03,34.72],"רביבים":[31.0239,34.7217],"אילת":[29.5577,34.9519],"צפת":[32.9646,35.496],"טבריה":[32.7959,35.5312],"מודיעין-מכבים-רעות":[31.8969,35.0095],"בית שמש":[31.7469,34.9881],"אשקלון":[31.6688,34.5743],"נס ציונה":[31.9293,34.7987],"רמת גן":[32.0684,34.8248],"חולון":[32.0158,34.7874],"בת ים":[32.0231,34.7503],"הרצליה":[32.1663,34.8436],"כפר סבא":[32.178,34.9066],"רעננה":[32.1848,34.8713],"חדרה":[32.434,34.9196],"נהריה":[33.0089,35.0981],"עכו":[32.9281,35.0826],"כרמיאל":[32.9144,35.2927],"עפולה":[32.6078,35.2897],"יבנה":[31.8781,34.7394],"גדרה":[31.8144,34.7783],"דימונה":[31.0686,35.0333],"ערד":[31.2589,35.2128],"נתיבות":[31.4173,34.5885],"שדרות":[31.525,34.5964],"אופקים":[31.3141,34.6203]};
(function(){const dl=document.getElementById("zplaces");if(dl)Object.keys(ZPL).forEach(k=>{const o=document.createElement("option");o.value=k;dl.appendChild(o)})})();
function zgetCoords(){const v=(document.getElementById("zloc")||{}).value||"";let m=v.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);let c=ZPL[v]||(m&&[+m[1],+m[2]]);const msg=document.getElementById("zlocmsg");if(msg)msg.textContent=c?"":"מיקום לא נמצא. בחר מהרשימה או הזן קואורדינטות.";return c}
async function fetchHebcalZmanim(lat,lon,dateStr){
try{
const url="https://www.hebcal.com/zmanim?cfg=json&latitude="+lat+"&longitude="+lon+"&tzid=Asia/Jerusalem&date="+dateStr;
const r=await fetch(url);if(!r.ok)throw new Error("hebcal");
const j=await r.json();const times=j.times||{};
const sunset=times.sunset||times.shkiah;
const tzeit=times.tzeit85deg||times.tzeit7083deg||times.tzeit||times.dusk;
const toHM=iso=>{if(!iso)return null;const d=new Date(iso);return String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0")};
return{sunset:toHM(sunset),tzeit:toHM(tzeit)};
}catch(e){return null}
}
function calcZman(auto){
const birthEl=document.getElementById("zbirth");if(!birthEl)return;
const v=birthEl.value;if(!v)return;
const[dp,tp]=v.split("T"),[y,m,d]=dp.split("-").map(Number),c=zgetCoords();if(!c)return;
const[lat,lon]=c;
const doCalc=()=>{
const S=ztoMin(document.getElementById("zsset").value),T=ztoMin(document.getElementById("ztzet").value),B=ztoMin(tp);
let add,status,safek=false;
if(B<S){add=7;status="לפני שקיעה: היום העברי הוא אותו תאריך."}
else if(B<T){add=8;safek=true;status="בין השמשות (ספק): נמנה מהיום המאוחר."}
else{add=8;status="אחרי צאת הכוכבים: היום העברי הוא למחרת."}
const base=Date.UTC(y,m-1,d,12);let br=new Date(base+add*864e5),shifted="";
if(safek)while(br.getUTCDay()===6||zisYT(br)){br=new Date(+br+864e5);shifted="נדחה כי ספק אינו דוחה שבת/יו״ט."}
const by=br.getUTCFullYear(),bm=br.getUTCMonth()+1,bd=br.getUTCDate();
const rise=zsolar(by,bm,bd,lat,lon,90.833,true),set=zsolar(by,bm,bd,lat,lon,90.833,false);
const fmt=dt=>"יום "+zdays[dt.getUTCDay()]+", "+dt.getUTCDate()+"/"+(dt.getUTCMonth()+1)+"/"+dt.getUTCFullYear();
let h='<div class="zman-big">ברית: '+fmt(br)+'</div><div style="font-size:14px;margin-bottom:6px">'+zheb(br,{day:"numeric",month:"long",year:"numeric"})+"</div>";
h+='<table class="zman-table"><tr><td>נץ החמה ביום הברית</td><td>'+zhm(rise)+'</td></tr><tr><td>שקיעה ביום הברית</td><td>'+zhm(set)+"</td></tr></table>";
h+='<div class="zman-note zman-ok">'+status+"<br>תאריך עברי ללידה: "+zheb(new Date(base+(B>=T?864e5:0)),{day:"numeric",month:"long",year:"numeric"})+"</div>";
if(shifted)h+='<div class="zman-note">'+shifted+"</div>";
if(!safek&&br.getUTCDay()===6)h+='<div class="zman-note">הברית חלה בשבת (ודאי) – נעשית בשבת.</div>';
if(!safek&&zisYT(br))h+='<div class="zman-note">הברית חלה ביום טוב (ודאי) – נעשית ביום טוב.</div>';
h+='<div class="zman-note">זמן הברית: ביום, מנץ עד שקיעה (מן המובחר בבוקר). השעה עם המוהל.</div>';
h+='<div class="zman-note" style="font-size:12px">זמני שקיעה/צאת כוכבים מ־Hebcal (עדכני). לאימות: <a href="https://he.chabad.org/calendar/zmanim.htm/locationid/531/locationtype/1" target="_blank" rel="noopener">חב״ד</a></div>';
const out=document.getElementById("zout");out.innerHTML=h;out.hidden=false;
};
if(auto){
const dateStr=y+"-"+String(m).padStart(2,"0")+"-"+String(d).padStart(2,"0");
fetchHebcalZmanim(lat,lon,dateStr).then(res=>{
if(res&&res.sunset)document.getElementById("zsset").value=res.sunset;
else document.getElementById("zsset").value=zhm(zsolar(y,m,d,lat,lon,90.833,false));
if(res&&res.tzeit)document.getElementById("ztzet").value=res.tzeit;
else document.getElementById("ztzet").value=zhm(zsolar(y,m,d,lat,lon,97.083,false));
doCalc();
}).catch(()=>{
document.getElementById("zsset").value=zhm(zsolar(y,m,d,lat,lon,90.833,false));
document.getElementById("ztzet").value=zhm(zsolar(y,m,d,lat,lon,97.083,false));
doCalc();
});
}else{doCalc()}
}
(function(){
const n=new Date(),p=x=>String(x).padStart(2,"0");
const el=document.getElementById("zbirth");
if(!el)return;
el.value=n.getFullYear()+"-"+p(n.getMonth()+1)+"-"+p(n.getDate())+"T12:00";
el.onchange=()=>calcZman(true);
const loc=document.getElementById("zloc");if(loc){loc.onchange=()=>calcZman(true);loc.oninput=()=>{if(ZPL[loc.value])calcZman(true)}};
const ss=document.getElementById("zsset");if(ss)ss.onchange=()=>calcZman(false);
const tz=document.getElementById("ztzet");if(tz)tz.onchange=()=>calcZman(false);
calcZman(true);
})();
