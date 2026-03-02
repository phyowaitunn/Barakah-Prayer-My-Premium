setTimeout(()=>document.getElementById("splash").style.display="none",2000);

function toggleMenu(){
let s=document.getElementById("sidebar");
s.style.left=s.style.left==="0px"?"-250px":"0px";
}

function showPage(id){
document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
document.getElementById(id).classList.add("active");
toggleMenu();
}

function toggleTheme(){
document.body.classList.toggle("dark");
}

function clean(t){return t.split(" ")[0];}

async function loadPrayer(){
const res=await fetch("https://api.aladhan.com/v1/timingsByCity?city=Kuala Lumpur&country=Malaysia&method=3");
const data=await res.json();
const t=data.data.timings;

fajr.innerText=clean(t.Fajr);
dhuhr.innerText=clean(t.Dhuhr);
asr.innerText=clean(t.Asr);
maghrib.innerText=clean(t.Maghrib);
isha.innerText=clean(t.Isha);

gregorianDate.innerText=data.data.date.gregorian.date;
hijriDate.innerText=data.data.date.hijri.date+" AH";

highlight(t);
countdownFunc(t);
loadCalendar();
getQibla();
}

function highlight(t){
document.querySelectorAll(".card").forEach(c=>c.classList.remove("activePrayer"));
let now=new Date();
let cur=now.getHours()*60+now.getMinutes();
Object.entries(t).forEach(([n,time])=>{
let [h,m]=clean(time).split(":");
if(cur>=h*60+ +m){
let c=document.getElementById(n+"Card");
if(c)c.classList.add("activePrayer");
}
});
}

function countdownFunc(t){
setInterval(()=>{
let now=new Date();
let cur=now.getHours()*60+now.getMinutes();
for(let [n,time] of Object.entries(t)){
let [h,m]=clean(time).split(":");
let mins=h*60+ +m;
if(mins>cur){
let d=mins-cur;
countdown.innerText=`Next: ${n} in ${Math.floor(d/60)}h ${d%60}m`;
break;
}
}
},1000);
}


let currentMonth=new Date().getMonth()+1;
let currentYear=new Date().getFullYear();

async function loadCalendar(){

const res=await fetch(
`https://api.aladhan.com/v1/calendarByCity?city=Kuala Lumpur&country=Malaysia&method=3&month=${currentMonth}&year=${currentYear}`
);

const data=await res.json();

calendarGrid.innerHTML="";

monthTitle.innerText=
new Date(currentYear,currentMonth-1)
.toLocaleString("default",{month:"long",year:"numeric"});

const today=new Date().getDate();

data.data.forEach(day=>{

let div=document.createElement("div");
div.className="calendar-day";

if(parseInt(day.date.gregorian.day)===today){
div.classList.add("today");
}

if(day.date.hijri.month.en==="Ramadan"){
div.classList.add("ramadan");
}

div.innerHTML=`
<b>${day.date.gregorian.day}</b>
<span>${day.date.hijri.day}</span>
`;

div.onclick=()=>{
showPrayerPopup(day);
};

calendarGrid.appendChild(div);

});
}

function changeMonth(step){

currentMonth+=step;

if(currentMonth>12){
currentMonth=1;
currentYear++;
}

if(currentMonth<1){
currentMonth=12;
currentYear--;
}

loadCalendar();
}

function showPrayerPopup(day){

let popup=document.getElementById("popup");

if(!popup){
popup=document.createElement("div");
popup.id="popup";
popup.className="popup";
document.body.appendChild(popup);
}

popup.innerHTML=`
<b>${day.date.gregorian.date}</b><br>
Fajr: ${day.timings.Fajr}<br>
Dhuhr: ${day.timings.Dhuhr}<br>
Asr: ${day.timings.Asr}<br>
Maghrib: ${day.timings.Maghrib}<br>
Isha: ${day.timings.Isha}
`;

popup.style.display="block";

setTimeout(()=>{
popup.style.display="none";
},4000);
}


function getQibla(){

navigator.geolocation.getCurrentPosition(pos=>{

let lat=pos.coords.latitude*Math.PI/180;
let lon=pos.coords.longitude*Math.PI/180;

let kaabaLat=21.4225*Math.PI/180;
let kaabaLon=39.8262*Math.PI/180;

let angle=Math.atan2(
Math.sin(kaabaLon-lon),
Math.cos(lat)*Math.tan(kaabaLat)
-Math.sin(lat)*Math.cos(kaabaLon-lon)
);

angle=angle*180/Math.PI;

needle.style.transform=
`rotate(${angle}deg)`;

qiblaAngle.innerText=
"Direction "+angle.toFixed(1)+"°";

});
}


function showScreen(id){
document.querySelectorAll(".screen")
.forEach(s=>s.classList.remove("active"));

document.getElementById(id)
.classList.add("active");
}
