
const state={products:[],page:1,total:0,limit:24,category:"",search:"",sort:"featured",cart:JSON.parse(localStorage.getItem("cart")||"[]")};
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const money=n=>"₹"+Number(n).toLocaleString("en-IN",{maximumFractionDigits:0});
const token=()=>localStorage.getItem("token");
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
async function api(url,opt={}){const h={"Content-Type":"application/json",...(opt.headers||{})};if(token())h.Authorization="Bearer "+token();const r=await fetch(url,{...opt,headers:h});const d=await r.json();if(!r.ok)throw Error(d.message||"Request failed");return d}
async function init(){
 const cats=await api("/api/categories");renderCategories(cats);
 const u=localStorage.getItem("user");if(u){const user=JSON.parse(u);$("#accountLink").innerHTML=`Hello, ${user.name.split(" ")[0]}<br><b>${user.role==="admin"?"Admin":"Account & Lists"}</b>`;if(user.role==="admin")$("#accountLink").href="admin.html";}
 $("#searchBtn").onclick=doSearch;$("#searchInput").addEventListener("keydown",e=>{if(e.key==="Enter")doSearch()});
 $("#sort").onchange=e=>{state.sort=e.target.value;state.page=1;loadProducts()};
 $("#applyFilters").onclick=()=>{state.page=1;state.minPrice=$("#minPrice").value;state.maxPrice=$("#maxPrice").value;loadProducts()};
 $("#clearFilters").onclick=()=>{state.minPrice=state.maxPrice="";$("#minPrice").value=$("#maxPrice").value="";setCategory("")};
 $("#filterMobile").onclick=()=>$(".filters").classList.toggle("show");
 $("#cartBtn").onclick=openCart;$("#checkoutBtn").onclick=openCheckout;
 renderCart();loadProducts();loadOrders();
}
function renderCategories(cats){
 $("#searchCategory").innerHTML='<option value="">All</option>'+cats.map(c=>`<option value="${c.slug}">${c.name}</option>`).join("");
 $("#categoryNav").innerHTML=cats.slice(0,6).map(c=>`<a href="#" onclick="setCategory('${c.slug}');return false">${c.name}</a>`).join("");
 $("#categoryCards").innerHTML=cats.map(c=>`<button class="category-card" onclick="setCategory('${c.slug}')"><div class="cat-icon">${c.icon}</div><span>${c.name}</span></button>`).join("");
 $("#sideCats").innerHTML=`<button class="side-cat active" data-cat="">All categories</button>`+cats.map(c=>`<button class="side-cat" data-cat="${c.slug}">${c.name}</button>`).join("");
 $$(".side-cat").forEach(b=>b.onclick=()=>setCategory(b.dataset.cat));
}
function setCategory(c){state.category=c;state.page=1;$("#searchCategory").value=c;$$(".side-cat").forEach(b=>b.classList.toggle("active",b.dataset.cat===c));loadProducts();scrollToProducts()}
function doSearch(){state.search=$("#searchInput").value.trim();state.category=$("#searchCategory").value;state.page=1;loadProducts();scrollToProducts()}
function applySort(s){state.sort=s;$("#sort").value=s;state.page=1;loadProducts();scrollToProducts()}
async function loadProducts(){
 const p=new URLSearchParams({page:state.page,limit:state.limit,sort:state.sort});if(state.category)p.set("category",state.category);if(state.search)p.set("search",state.search);if(state.minPrice)p.set("minPrice",state.minPrice);if(state.maxPrice)p.set("maxPrice",state.maxPrice);
 const d=await api("/api/products?"+p);state.products=d.products;state.total=d.total;
 $("#resultCount").textContent=`Showing ${d.products.length} of ${d.total} products`;
 $("#products").innerHTML=d.products.map(productCard).join("");
 renderPager();
}
function productCard(p){return `<article class="product"><div class="product-img"><img loading="lazy" src="${p.image}" alt="${escapeHtml(p.title)}"><span class="badge">${p.discount}% OFF</span></div><h3>${escapeHtml(p.title)}</h3><p class="desc">${escapeHtml(p.description)}</p><div class="rating">★ ${p.rating} <span>(${p.reviews})</span></div><div class="price"><strong>${money(p.price)}</strong><span class="old">${money(p.old_price)}</span><span class="off">${p.discount}%</span></div><div class="stock">${p.stock>0?`In stock · ${p.stock} left`:"Out of stock"}</div><button class="add" ${p.stock<1?"disabled":""} onclick="addToCart(${p.id})">${p.stock<1?"Out of stock":"Add to cart"}</button></article>`}
function renderPager(){const pages=Math.ceil(state.total/state.limit);$("#pager").innerHTML=pages<=1?"":Array.from({length:Math.min(pages,8)},(_,i)=>`<button onclick="goPage(${i+1})" ${state.page===i+1?"disabled":""}>${i+1}</button>`).join("")+(pages>8?` <span>… ${pages}</span>`:"")}
function goPage(n){state.page=n;loadProducts();scrollToProducts()}
function scrollToProducts(){$(".products-section").scrollIntoView({behavior:"smooth",block:"start"})}
function addToCart(id){const item=state.cart.find(x=>x.productId===id);if(item)item.quantity++;else state.cart.push({productId:id,quantity:1});saveCart();toast("Added to cart");openCart()}
function saveCart(){localStorage.setItem("cart",JSON.stringify(state.cart));renderCart()}
async function renderCart(){
 $("#cartCount").textContent=state.cart.reduce((s,x)=>s+x.quantity,0);
 if(!state.cart.length){$("#cartItems").innerHTML='<div class="empty">Your cart is empty.<br><small>Add something you love.</small></div>';$("#cartTotal").textContent="₹0";return}
 const ps=await Promise.all(state.cart.map(x=>api("/api/products/"+x.productId)));
 $("#cartItems").innerHTML=ps.map((p,i)=>{const q=state.cart[i].quantity;return `<div class="cart-row"><img src="${p.image}"><div><h4>${escapeHtml(p.title)}</h4><div class="price"><strong>${money(p.price)}</strong></div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button> ${q} <button onclick="changeQty(${p.id},1)">+</button></div></div><button onclick="removeCart(${p.id})">×</button></div>`}).join("");
 $("#cartTotal").textContent=money(ps.reduce((s,p,i)=>s+p.price*state.cart[i].quantity,0));
}
function changeQty(id,d){const x=state.cart.find(i=>i.productId===id);if(!x)return;x.quantity+=d;if(x.quantity<=0)state.cart=state.cart.filter(i=>i.productId!==id);saveCart()}
function removeCart(id){state.cart=state.cart.filter(i=>i.productId!==id);saveCart()}
function openCart(){renderCart();$("#cartDrawer").classList.add("open");$("#drawerShade").classList.add("show")}
function closeCart(){$("#cartDrawer").classList.remove("open");$("#drawerShade").classList.remove("show")}
function openCheckout(){if(!token()){toast("Please sign in before checkout");location.href="auth.html";return}if(!state.cart.length){toast("Your cart is empty");return}closeCart();$("#checkoutModal").classList.add("show")}
function closeCheckout(){$("#checkoutModal").classList.remove("show")}
$("#checkoutForm").onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const address=Object.fromEntries(f.entries());try{const d=await api("/api/orders",{method:"POST",body:JSON.stringify({items:state.cart,address})});state.cart=[];saveCart();closeCheckout();toast("Order #"+d.orderId+" placed successfully");loadOrders()}catch(err){toast(err.message)}}
async function loadOrders(){if(!token())return;try{const orders=await api("/api/orders");$("#ordersList").innerHTML=orders.length?orders.slice(0,5).map(o=>`<div class="order-card"><div><b>Order #${o.id}</b><div class="muted">${new Date(o.created_at).toLocaleDateString()} · ${o.items.length} item(s)</div></div><strong>${money(o.total)}</strong><span class="status">${o.status}</span></div>`).join(""):'<div class="empty">No orders yet.</div>'}catch(e){}}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
init();
