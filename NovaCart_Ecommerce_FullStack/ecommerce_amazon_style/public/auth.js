
const $=s=>document.querySelector(s);
$("#loginTab").onclick=()=>switchTab("login");$("#registerTab").onclick=()=>switchTab("register");
function switchTab(t){$("#loginTab").classList.toggle("active",t==="login");$("#registerTab").classList.toggle("active",t==="register");$("#loginForm").classList.toggle("hidden",t!=="login");$("#registerForm").classList.toggle("hidden",t!=="register")}
async function api(url,opt={}){const r=await fetch(url,{...opt,headers:{"Content-Type":"application/json"}});const d=await r.json();if(!r.ok)throw Error(d.message||"Request failed");return d}
$("#loginForm").onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);try{const d=await api("/api/auth/login",{method:"POST",body:JSON.stringify(Object.fromEntries(f.entries()))});localStorage.setItem("token",d.token);localStorage.setItem("user",JSON.stringify(d.user));location.href=d.user.role==="admin"?"admin.html":"index.html"}catch(err){$("#loginMsg").textContent=err.message}}
$("#registerForm").onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);try{const d=await api("/api/auth/register",{method:"POST",body:JSON.stringify(Object.fromEntries(f.entries()))});localStorage.setItem("token",d.token);localStorage.setItem("user",JSON.stringify(d.user));location.href="index.html"}catch(err){$("#registerMsg").textContent=err.message}}
