const $=s=>document.querySelector(s),money=n=>'$'+n.toFixed(2),ini=(s)=>s.split(' ').map(x=>x[0]).join('');
const CATS=['All','Audio','Wearables','Home','Bags','Fitness'];
let P=[['Aria Wireless Headphones','Audio',199,249,4.8,412,'🎧',260,42,980],['Lumen Smart Watch','Wearables',249,299,4.6,318,'⌚',200,18,860],['Terra Ceramic Mug Set','Home',39,49,4.7,210,'☕',25,120,740],['Nomad Leather Backpack','Bags',159,199,4.9,530,'🎒',30,9,720],['Pulse Earbuds Pro','Audio',129,159,4.5,290,'🎵',310,64,690],['Halo Desk Lamp','Home',79,79,4.4,140,'💡',50,33,410],['Flux Yoga Mat','Fitness',59,74,4.6,185,'🧘',150,5,380],['Orbit Smart Speaker','Audio',149,179,4.3,220,'🔊',280,27,350],['Drift Running Shoes','Fitness',119,139,4.7,402,'👟',10,71,620],['Weave Throw Blanket','Home',69,89,4.8,167,'🧣',340,48,300],['Vista Sunglasses','Wearables',99,99,4.2,98,'🕶️',45,80,270],['Atlas Weekender Bag','Bags',189,229,4.8,244,'👜',350,14,510]].map((a,i)=>({id:i,name:a[0],cat:a[1],price:a[2],old:a[3],rate:a[4],rev:a[5],e:a[6],h:a[7],stock:a[8],sales:a[9],status:'Active'}));
const REV=[['Priya S.',5,'Best headphones I have owned — battery lasts all week.'],['Marcus T.',5,'Packaging, delivery and quality were all flawless.'],['Elena R.',4,'Beautiful design. Runs slightly small, size up.']];
const NAMES=['Olivia Chen','Liam Patel','Sofia Rossi','Noah Kim','Ava Müller','Ethan Brooks','Mia Tanaka','Lucas Silva'];
const ORD=NAMES.map((n,i)=>({id:'#'+(4820+i),c:n,t:P[i].price+P[(i+3)%12].price,s:['Delivered','Shipped','Pending','Delivered','Refunded','Shipped','Pending','Delivered'][i],d:'Sep '+(20-i)}));
let COUP=[{c:'SAVE10',d:'10% off',u:142,on:1},{c:'FREESHIP',d:'Free shipping',u:88,on:1},{c:'WELCOME20',d:'20% off first order',u:31,on:0}];
let RVW=[...REV.map(r=>({...r,p:P[0].name,ok:1})),{0:'Jo B.',1:2,2:'Arrived late.',p:P[1].name,ok:0}];
let S={cart:[],wish:new Set(),recent:[],cat:'All',sort:'pop',q:'',pg:1,coupon:null,co:{step:0,d:{}},sel:{},order:null,notif:1};
const stars=r=>'★'.repeat(Math.round(r))+'☆'.repeat(5-Math.round(r));
const disc=p=>p.old>p.price?Math.round((1-p.price/p.old)*100):0;
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;$('#tw').append(t);setTimeout(()=>t.remove(),3000)}
function openM(h){$('#modal').innerHTML=h;$('#ov').classList.add('o')}function closeM(){$('#ov').classList.remove('o')}
function confirmD(msg,fn){window._c=fn;openM(`<h3>Are you sure?</h3><p style="margin:10px 0 20px;color:var(--mut)">${msg}</p><div class="tb"><button class="btn d" onclick="closeM();_c()">Confirm</button><button class="btn g" onclick="closeM()">Cancel</button></div>`)}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeM();drawer(0)}});
function theme(){const r=document.documentElement,d=r.dataset.t?r.dataset.t==='dark':matchMedia('(prefers-color-scheme:dark)').matches;r.dataset.t=d?'light':'dark'}
