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
