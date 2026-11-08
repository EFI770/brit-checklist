let zTZ="Asia/Jerusalem";
const TZ="Asia/Jerusalem",zdays=["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"];
const zdaysEN=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Shabbat"];
const zL=()=>{try{return window.BRIT_LANG&&window.BRIT_LANG()==='en'}catch(e){return false}};
const Z=(he,en)=>zL()?en:he;
const zd=i=>(zL()?zdaysEN:zdays)[i];
const zhebL=(dt,opt)=>new Intl.DateTimeFormat((zL()?"en":"he")+"-u-ca-hebrew",{timeZone:"UTC",...opt}).format(dt);
const ZCHABAD=()=>zL()?"https://www.chabad.org/tools/calendar/zmanim.asp":"https://he.chabad.org/calendar/zmanim.htm/locationid/531/locationtype/1";
const ZUS={"New York (Brooklyn)":[40.6782,-73.9442,"America/New_York"],"Monsey, NY":[41.1112,-74.0685,"America/New_York"],"Lakewood, NJ":[40.0979,-74.2220,"America/New_York"],"Teaneck, NJ":[40.8976,-74.0160,"America/New_York"],"Passaic, NJ":[40.8568,-74.1285,"America/New_York"],"Baltimore, MD":[39.2904,-76.6122,"America/New_York"],"Boston, MA":[42.3601,-71.0589,"America/New_York"],"Philadelphia, PA":[39.9526,-75.1652,"America/New_York"],"Waterbury, CT":[41.5582,-73.0515,"America/New_York"],"Pittsburgh, PA":[40.4406,-79.9959,"America/New_York"],"Cleveland, OH":[41.4993,-81.6944,"America/New_York"],"Cincinnati, OH":[39.1031,-84.5120,"America/New_York"],"Columbus, OH":[39.9612,-82.9988,"America/New_York"],"Detroit, MI":[42.3314,-83.0458,"America/Detroit"],"Chicago, IL":[41.8781,-87.6298,"America/Chicago"],"Minneapolis, MN":[44.9778,-93.2650,"America/Chicago"],"St. Louis, MO":[38.6270,-90.1994,"America/Chicago"],"Houston, TX":[29.7604,-95.3698,"America/Chicago"],"Dallas, TX":[32.7767,-96.7970,"America/Chicago"],"Atlanta, GA":[33.7490,-84.3880,"America/New_York"],"Miami, FL":[25.7617,-80.1918,"America/New_York"],"Denver, CO":[39.7392,-104.9903,"America/Denver"],"Phoenix, AZ":[33.4484,-112.0740,"America/Phoenix"],"Las Vegas, NV":[36.1699,-115.1398,"America/Los_Angeles"],"Los Angeles, CA":[34.0522,-118.2437,"America/Los_Angeles"],"San Diego, CA":[32.7157,-117.1611,"America/Los_Angeles"],"San Francisco, CA":[37.7749,-122.4194,"America/Los_Angeles"],"Seattle, WA":[47.6062,-122.3321,"America/Los_Angeles"]};
const ZEN={"Jerusalem":[31.7683,35.2137],"Tel Aviv-Yafo":[32.0853,34.7818],"Haifa":[32.794,34.9896],"Beersheba":[31.253,34.7915],"Bnei Brak":[32.0807,34.8338],"Safed":[32.9646,35.496],"Tiberias":[32.7959,35.5312],"Eilat":[29.5577,34.9519],"Netanya":[32.3215,34.8532],"Ashdod":[31.8044,34.6553],"Kfar Ratamim":[31.03,34.72]};
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
const off=+new Intl.DateTimeFormat("en-GB",{timeZone:zTZ,hour:"2-digit",hour12:false}).format(new Date(Date.UTC(y,m-1,d,12)))-12;
return Math.round(((UT+off)%24)*60);
}
const zhm=m=>String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0");
const ztoMin=s=>{const[a,b]=(s||"0:0").split(":");return +a*60+ +b};
function zheb(dt,opt){return new Intl.DateTimeFormat("he-u-ca-hebrew",{timeZone:"UTC",...opt}).format(dt)}
function zisYT(dt){const p=Object.fromEntries(new Intl.DateTimeFormat("en-u-ca-hebrew",{timeZone:"UTC",day:"numeric",month:"long"}).formatToParts(dt).map(x=>[x.type,x.value]));const d=+p.day,m=p.month;return (m.startsWith("Tishri")&&[1,2,10,15,22].includes(d))||(m==="Nisan"&&[15,21].includes(d))||(m==="Sivan"&&d===6)}
const ZPL={"ירושלים":[31.7683,35.2137],"תל אביב-יפו":[32.0853,34.7818],"חיפה":[32.794,34.9896],"באר שבע":[31.253,34.7915],"ראשון לציון":[31.973,34.7925],"פתח תקווה":[32.0841,34.8878],"אשדוד":[31.8044,34.6553],"נתניה":[32.3215,34.8532],"בני ברק":[32.0807,34.8338],"רחובות":[31.8928,34.8113],"כפר רתמים":[31.03,34.72],"רביבים":[31.0239,34.7217],"אילת":[29.5577,34.9519],"צפת":[32.9646,35.496],"טבריה":[32.7959,35.5312],"מודיעין-מכבים-רעות":[31.8969,35.0095],"בית שמש":[31.7469,34.9881],"אשקלון":[31.6688,34.5743],"נס ציונה":[31.9293,34.7987],"רמת גן":[32.0684,34.8248],"חולון":[32.0158,34.7874],"בת ים":[32.0231,34.7503],"הרצליה":[32.1663,34.8436],"כפר סבא":[32.178,34.9066],"רעננה":[32.1848,34.8713],"חדרה":[32.434,34.9196],"נהריה":[33.0089,35.0981],"עכו":[32.9281,35.0826],"כרמיאל":[32.9144,35.2927],"עפולה":[32.6078,35.2897],"יבנה":[31.8781,34.7394],"גדרה":[31.8144,34.7783],"דימונה":[31.0686,35.0333],"ערד":[31.2589,35.2128],"נתיבות":[31.4173,34.5885],"שדרות":[31.525,34.5964],"אופקים":[31.3141,34.6203]};
(function(){const dl=document.getElementById("zplaces");if(dl)Object.keys(ZPL).forEach(k=>{const o=document.createElement("option");o.value=k;dl.appendChild(o)})})();
let zsel={lat:32.0853,lon:34.7818,label:zL()?"Tel Aviv-Yafo":"תל אביב-יפו",tz:"Asia/Jerusalem"},zseq=0,ztimer=0;
function zsetPlace(lat,lon,label,tz){zsel=lat==null?{lat:null,lon:null,label,nocoords:true}:{lat:+lat,lon:+lon,label,tz:tz||"Asia/Jerusalem"};if(zsel.lat!=null)zTZ=zsel.tz;const el=document.getElementById("zloc");if(el)el.value=label;const r=document.getElementById("zresults");if(r)r.innerHTML=""}
const znorm=t=>String(t).replace(/[\u0591-\u05c7]/g,"").replace(/[׳'"״]/g,"").replace(/קריית/g,"קרית").replace(/\s+/g," ").trim().toLowerCase();
function zplaces(){const m=new Map();(window.BRIT_LOCALITIES||[]).forEach(r=>m.set(znorm(r[0]),{label:r[0],lat:r[1],lon:r[2]}));Object.keys(ZPL).forEach(k=>m.set(znorm(k),{label:k,lat:ZPL[k][0],lon:ZPL[k][1]}));if(zL()){Object.keys(ZEN).forEach(k=>m.set(znorm(k),{label:k,lat:ZEN[k][0],lon:ZEN[k][1]}));Object.keys(ZUS).forEach(k=>m.set(znorm(k),{label:k,lat:ZUS[k][0],lon:ZUS[k][1],tz:ZUS[k][2]}))}return [...m.entries()].map(([n,v])=>({n,...v}))}
function zlocalMatches(q){const n=znorm(q);if(!n)return[];const all=zplaces();const st=all.filter(x=>x.n.startsWith(n)),inc=all.filter(x=>!x.n.startsWith(n)&&x.n.includes(n));return st.concat(inc).slice(0,8)}
function zrender(items,q){const r=document.getElementById("zresults");if(!r)return;
if(!items.length){r.innerHTML='<div style="padding:8px;font-size:13px;color:var(--mu)">'+(q.length<1?Z('הקלד שם יישוב','Type a city name'):Z('לא נמצא יישוב ברשימה','No matching city in the list'))+"</div>";return}
r.innerHTML=items.map((it,i)=>'<button type="button" data-i="'+i+'" style="display:block;width:100%;text-align:start;padding:9px;border:0;border-bottom:1px solid var(--bd);background:var(--cs);color:var(--tx);font:inherit;font-size:14px;cursor:pointer">'+it.label.replace(/</g,"&lt;")+(it.lat==null?' <span style="font-size:11px;color:var(--mu)">'+Z('(אין חישוב אוטומטי)','(no automatic calculation)')+'</span>':"")+"</button>").join("");
r.querySelectorAll("button").forEach(b=>b.onclick=()=>{const it=items[+b.dataset.i];zsetPlace(it.lat,it.lon,it.label,it.tz);calcZman(true)})}
function zsearch(q){const m=zlocalMatches(q);zrender(m,q.length<1?"":q)}
function zgetCoords(){return zsel&&zsel.lat!=null?zsel:null}
let zmanRequest=0;
function zerror(text){const out=document.getElementById("zout");out.textContent=text;out.hidden=false}
async function fetchHebcalZmanim(lat,lon,dateStr){
try{
const url="https://www.hebcal.com/zmanim?cfg=json&latitude="+lat+"&longitude="+lon+"&tzid="+encodeURIComponent(zTZ)+"&date="+dateStr;
const r=await fetch(url,{signal:AbortSignal.timeout(10000)});if(!r.ok)throw new Error("hebcal");
const j=await r.json();const times=j.times||{};
const toHM=iso=>{if(!iso)return null;const m=String(iso).match(/T(\d{2}:\d{2})/);return m?m[1]:null};
return{sunrise:toHM(times.sunrise),sunset:toHM(times.sunset||times.shkiah),tzeit:toHM(times.tzeit85deg)};
}catch(e){return null}
}
const zdateStr=(y,m,d)=>y+"-"+String(m).padStart(2,"0")+"-"+String(d).padStart(2,"0");
function calcZman(auto,init){
const request=++zmanRequest;
const birthEl=document.getElementById("zbirth");if(!birthEl)return;
const v=birthEl.value;if(!v){zerror(Z('יש למלא תאריך ושעת לידה.','Please fill in the birth date and time.'));return}
const[dp,tp]=v.split("T"),[y,m,d]=dp.split("-").map(Number),c=zgetCoords();if(!c){zerror(zsel&&zsel.nocoords?Z('היישוב "'+zsel.label+'" נמצא ברשימת היישובים הרשמית, אבל אין לנו עדיין קואורדינטות מאומתות אליו, ולכן לא ניתן לחשב אוטומטית. בדוק זמנים ליישוב בקישור חב״ד למטה או עם המוהל. לא בחרנו יישוב קרוב במקומו.','The locality "'+zsel.label+'" is in the official registry, but we do not have verified coordinates for it yet, so it cannot be calculated automatically. Check times for the locality via the Chabad link below or with the mohel. We did not substitute a nearby locality.'):Z('הקלד שם יישוב בישראל ובחר אותו מהרשימה.','Type a city name and pick it from the list.'));return}
const lat=c.lat,lon=c.lon;
const finish=(S,T,srcLabel)=>{
if(request!==zmanRequest)return;
if(!S||!T||ztoMin(T)<=ztoMin(S)){zerror(Z('יש למלא זמני שקיעה וצאת הכוכבים תקינים, כאשר צאת הכוכבים מאוחר מהשקיעה.','Please fill in valid sunset and nightfall times, with nightfall later than sunset.'));return}
const sEl=document.getElementById("zsset"),tEl=document.getElementById("ztzet");
if(sEl)sEl.value=S;if(tEl)tEl.value=T;
const Sm=ztoMin(S),Tm=ztoMin(T),B=ztoMin(tp);
let add,status,safek=false;
if(B<Sm){add=7;status=Z("לפני שקיעה: היום העברי הוא אותו תאריך.","Before sunset: the Hebrew date is the same day.")}
else if(B<Tm){add=8;safek=true;status=Z("בין השמשות (ספק): נמנה מהיום המאוחר.","Twilight (doubt): counted from the later day.")}
else{add=8;status=Z("אחרי צאת הכוכבים: היום העברי הוא למחרת.","After nightfall: the Hebrew date is the next day.")}
const base=Date.UTC(y,m-1,d,12);let br=new Date(base+add*864e5),shifted="";
if(safek)while(br.getUTCDay()===6||zisYT(br)){br=new Date(+br+864e5);shifted=Z("נדחה כי ספק אינו דוחה שבת/יו״ט.","Postponed because a doubtful brit does not override Shabbat/festival.")}
const by=br.getUTCFullYear(),bm=br.getUTCMonth()+1,bd=br.getUTCDate();
const show=(rise,set,daySource)=>{
if(request!==zmanRequest)return;
try{if(!init)localStorage.setItem('brit-date',JSON.stringify({user:true,iso:br.getUTCFullYear()+'-'+(br.getUTCMonth()+1)+'-'+br.getUTCDate(),label:(zL()?zd(br.getUTCDay()):'יום '+zdays[br.getUTCDay()])+' '+br.getUTCDate()+'/'+(br.getUTCMonth()+1)+'/'+br.getUTCFullYear()}));if(window.renderHome)renderHome()}catch(e){}
const fmt=dt=>(zL()?zd(dt.getUTCDay()):"יום "+zdays[dt.getUTCDay()])+", "+dt.getUTCDate()+"/"+(dt.getUTCMonth()+1)+"/"+dt.getUTCFullYear();
let h='<div class="zman-big">'+Z('ברית: ','Brit: ')+fmt(br)+'</div><div style="font-size:14px;margin-bottom:6px">'+zhebL(br,{day:"numeric",month:"long",year:"numeric"})+"</div>";
h+='<table class="zman-table"><tr><td>'+Z('נץ החמה ביום הברית','Sunrise on the brit day')+'</td><td>'+rise+'</td></tr><tr><td>'+Z('שקיעה ביום הברית','Sunset on the brit day')+'</td><td>'+set+"</td></tr></table>";
h+='<div class="zman-note zman-ok">'+status+"<br>"+Z('תאריך עברי ללידה: ','Hebrew birth date: ')+zhebL(new Date(base+(B>=Tm?864e5:0)),{day:"numeric",month:"long",year:"numeric"})+"</div>";
if(shifted)h+='<div class="zman-note">'+shifted+"</div>";
if(!safek&&br.getUTCDay()===6)h+='<div class="zman-note">'+Z('הברית חלה בשבת (ודאי) – נעשית בשבת.','The brit falls on Shabbat (certain) - it is performed on Shabbat.')+'</div>';
if(!safek&&zisYT(br))h+='<div class="zman-note">'+Z('הברית חלה ביום טוב (ודאי) – נעשית ביום טוב.','The brit falls on a festival (certain) - it is performed on the festival.')+'</div>';
h+='<div class="zman-note">'+Z('זמן הברית: ביום, מנץ עד שקיעה (מן המובחר בבוקר). השעה עם המוהל.','Brit time: during the day, from sunrise to sunset (ideally in the morning). The hour is set with the mohel.')+'</div>';
h+='<div class="zman-note" style="font-size:12px">'+srcLabel+' '+daySource+Z(' לאימות: <a href="'+ZCHABAD()+'" target="_blank" rel="noopener">חב״ד</a>',' Verify: <a href="'+ZCHABAD()+'" target="_blank" rel="noopener">Chabad</a>')+'</div>';
const out=document.getElementById("zout");out.innerHTML=h;out.hidden=false;
};
fetchHebcalZmanim(lat,lon,zdateStr(by,bm,bd)).then(res2=>{
if(res2&&res2.sunrise&&res2.sunset)show(res2.sunrise,res2.sunset,Z('נץ ושקיעה ליום הברית: Hebcal.','Brit-day sunrise and sunset: Hebcal.'));
else show(zhm(zsolar(by,bm,bd,lat,lon,90.833,true)),zhm(zsolar(by,bm,bd,lat,lon,90.833,false)),Z('נץ ושקיעה ליום הברית: אומדן מקומי בלבד.','Brit-day sunrise and sunset: local estimate only.'));
});
};
if(auto){
document.getElementById('zsset').value='';document.getElementById('ztzet').value='';zerror(Z('טוען זמנים...','Loading times...'));
fetchHebcalZmanim(lat,lon,zdateStr(y,m,d)).then(res=>{
if(request!==zmanRequest)return;
if(res&&res.sunset&&res.tzeit)finish(res.sunset,res.tzeit,Z('שקיעה וצאת הכוכבים ליום הלידה: Hebcal, צאת בשיטת 8.5 מעלות (ללא שינוי מהשיטה הקיימת).','Birth-day sunset and nightfall: Hebcal, nightfall by the 8.5-degree method (unchanged from the existing method).'));
else zerror(Z('לא התקבלו זמנים מ-Hebcal. לא חושב מועד על סמך אומדן בשיטה אחרת. יש להזין שקיעה וצאת כוכבים מאומתים למיקום ולתאריך הלידה.','No times received from Hebcal. The date was not computed from an estimate in another method. Enter verified sunset and nightfall for the birth location and date.'));
});
}else{
const S=document.getElementById("zsset").value,T=document.getElementById("ztzet").value;
const out=document.getElementById("zout");
if(!S||!T){out.innerHTML='<div class="zman-note">'+Z('יש למלא שקיעה וצאת כוכבים (או לשנות מיקום/תאריך למילוי אוטומטי).','Fill in sunset and nightfall (or change the location/date for automatic fill).')+'</div>';out.hidden=false;return}
finish(S,T,Z("זמנים לפי השדות למעלה (ניתן לערוך מול זמני חב״ד).","Times from the fields above (editable against Chabad zmanim)."));
}
}
(function(){
const n=new Date(),p=x=>String(x).padStart(2,"0");
const el=document.getElementById("zbirth");
if(!el)return;
el.value=n.getFullYear()+"-"+p(n.getMonth()+1)+"-"+p(n.getDate())+"T12:00";
el.onchange=()=>calcZman(true);
const loc=document.getElementById("zloc");
if(loc){
if(zL()&&loc.value==='תל אביב-יפו')loc.value='Tel Aviv-Yafo';
loc.addEventListener("input",()=>{zsel=null;clearTimeout(ztimer);const q=loc.value.trim();
const ex=zplaces().find(x=>x.n===znorm(q));if(ex){zsetPlace(ex.lat,ex.lon,ex.label,ex.tz);calcZman(true);return}
ztimer=setTimeout(()=>zsearch(q),120)});
loc.addEventListener("focus",()=>{if(loc.value.trim())zsearch(loc.value.trim())});
document.addEventListener("click",e=>{const r=document.getElementById("zresults");if(r&&e.target!==loc&&!r.contains(e.target))r.innerHTML=""});
};
const ss=document.getElementById("zsset");if(ss)ss.onchange=()=>calcZman(false);
const tz=document.getElementById("ztzet");if(tz)tz.onchange=()=>calcZman(false);
calcZman(true,true);
})();
