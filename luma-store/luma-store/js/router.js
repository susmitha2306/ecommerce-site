/* Router */
function go(h){location.hash='/'+h;if(!h.startsWith('admin'))scrollTo(0,0)}
function route(soft){const h=location.hash.replace('#/','').split('/'),a=$('#app');closeM();let html;try{html=h[0]==='admin'?Admin(h[1]||'overview'):h[0]==='product'?Product(+h[1]):h[0]==='checkout'?Checkout():Store()}catch(e){html=`<div class="emp"><b>⚠️</b>Something went wrong.<br><br>${Btn('Reload',"location.reload()")}</div>`}
const y=scrollY;const paint=()=>{a.innerHTML=html;if(soft){scrollTo(0,y);a.querySelector('.view')?.classList.remove('view')}cartUI();io();};
if(h[0]===''&&!soft&&!window._l){window._l=1;a.innerHTML=Nav()+'<div class="wrap" style="margin-top:24px"><div class="sk" style="min-height:300px"></div><div class="grid" style="margin-top:20px">'+'<div class="sk"></div>'.repeat(4)+'</div></div>';setTimeout(paint,700)}else paint()}
function io(){const o=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');o.unobserve(x.target)}}),{threshold:.1});document.querySelectorAll('.reveal').forEach(el=>o.observe(el))}
addEventListener('hashchange',()=>route());document.addEventListener('click',e=>{if(!e.target.closest('.srch'))$('#sg')?.classList.remove('o')});route();
