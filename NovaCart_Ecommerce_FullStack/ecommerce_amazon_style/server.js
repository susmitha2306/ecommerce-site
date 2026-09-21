
const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret-in-production";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));

function auth(req,res,next){
  const token=(req.headers.authorization||"").replace("Bearer ","");
  if(!token) return res.status(401).json({message:"Login required"});
  try { req.user=jwt.verify(token,JWT_SECRET); next(); }
  catch(e){ return res.status(401).json({message:"Invalid or expired token"}); }
}
function admin(req,res,next){ if(req.user?.role!=="admin") return res.status(403).json({message:"Admin access required"}); next(); }

app.get("/api/health",(req,res)=>res.json({ok:true,service:"ecommerce-api"}));

app.get("/api/categories",(req,res)=>{
  res.json(db.prepare("SELECT * FROM categories ORDER BY id").all());
});

app.get("/api/products",(req,res)=>{
  const {category,search,minPrice,maxPrice,sort="featured",page=1,limit=48}=req.query;
  let sql="SELECT * FROM products WHERE 1=1", params=[];
  if(category){sql+=" AND category_slug=?";params.push(category);}
  if(search){sql+=" AND (title LIKE ? OR description LIKE ?)";const q="%"+search+"%";params.push(q,q);}
  if(minPrice){sql+=" AND price>=?";params.push(Number(minPrice));}
  if(maxPrice){sql+=" AND price<=?";params.push(Number(maxPrice));}
  const order={priceAsc:"price ASC",priceDesc:"price DESC",rating:"rating DESC",newest:"id DESC",discount:"discount DESC",featured:"featured DESC, id DESC"}[sort]||"featured DESC, id DESC";
  sql+=" ORDER BY "+order+" LIMIT ? OFFSET ?";
  const lim=Math.min(Math.max(Number(limit)||48,1),200), off=(Math.max(Number(page)||1,1)-1)*lim;
  params.push(lim,off);
  const rows=db.prepare(sql).all(...params);
  let countSql="SELECT COUNT(*) c FROM products WHERE 1=1", cp=[];
  if(category){countSql+=" AND category_slug=?";cp.push(category);}
  if(search){countSql+=" AND (title LIKE ? OR description LIKE ?)";const q="%"+search+"%";cp.push(q,q);}
  if(minPrice){countSql+=" AND price>=?";cp.push(Number(minPrice));}
  if(maxPrice){countSql+=" AND price<=?";cp.push(Number(maxPrice));}
  const total=db.prepare(countSql).get(...cp).c;
  res.json({products:rows,total,page:Number(page),limit:lim});
});

app.get("/api/products/:id",(req,res)=>{
  const p=db.prepare("SELECT * FROM products WHERE id=?").get(req.params.id);
  if(!p) return res.status(404).json({message:"Product not found"});
  res.json(p);
});

app.post("/api/auth/register",(req,res)=>{
  const {name,email,password}=req.body;
  if(!name||!email||!password) return res.status(400).json({message:"Name, email and password are required"});
  if(password.length<6) return res.status(400).json({message:"Password must contain at least 6 characters"});
  try{
    const hash=bcrypt.hashSync(password,10);
    const result=db.prepare("INSERT INTO users(name,email,password,role) VALUES(?,?,?,'user')").run(name,email.toLowerCase(),hash);
    const user={id:result.lastInsertRowid,name,email:email.toLowerCase(),role:"user"};
    const token=jwt.sign(user,JWT_SECRET,{expiresIn:"7d"});
    res.status(201).json({user,token});
  }catch(e){res.status(409).json({message:"Email already registered"});}
});

app.post("/api/auth/login",(req,res)=>{
  const {email,password}=req.body;
  const user=db.prepare("SELECT * FROM users WHERE email=?").get((email||"").toLowerCase());
  if(!user || !bcrypt.compareSync(password||"",user.password)) return res.status(401).json({message:"Invalid email or password"});
  const safe={id:user.id,name:user.name,email:user.email,role:user.role};
  res.json({user:safe,token:jwt.sign(safe,JWT_SECRET,{expiresIn:"7d"})});
});

app.get("/api/me",auth,(req,res)=>res.json(req.user));

app.post("/api/orders",auth,(req,res)=>{
  const {items,address}=req.body;
  if(!Array.isArray(items)||!items.length) return res.status(400).json({message:"Cart is empty"});
  let total=0;
  const parsed=[];
  const get=db.prepare("SELECT * FROM products WHERE id=?");
  for(const item of items){
    const p=get.get(item.productId);
    if(!p) return res.status(400).json({message:"Product not found: "+item.productId});
    const qty=Math.max(1,Number(item.quantity)||1);
    if(p.stock<qty) return res.status(400).json({message:`Only ${p.stock} available for ${p.title}`});
    total+=p.price*qty; parsed.push({p,qty});
  }
  const tx=db.transaction(()=>{
    const o=db.prepare("INSERT INTO orders(user_id,total,status,address) VALUES(?,?,?,?)").run(req.user.id,total,"Placed",JSON.stringify(address||{}));
    const oi=db.prepare("INSERT INTO order_items(order_id,product_id,quantity,price) VALUES(?,?,?,?)");
    const up=db.prepare("UPDATE products SET stock=stock-? WHERE id=?");
    parsed.forEach(x=>{oi.run(o.lastInsertRowid,x.p.id,x.qty,x.p.price);up.run(x.qty,x.p.id);});
    return o.lastInsertRowid;
  });
  const orderId=tx();
  res.status(201).json({message:"Order placed",orderId});
});

app.get("/api/orders",auth,(req,res)=>{
  const orders=db.prepare("SELECT * FROM orders WHERE user_id=? ORDER BY id DESC").all(req.user.id);
  const getItems=db.prepare(`SELECT oi.*,p.title,p.image FROM order_items oi JOIN products p ON p.id=oi.product_id WHERE oi.order_id=?`);
  res.json(orders.map(o=>({...o,address:JSON.parse(o.address||"{}"),items:getItems.all(o.id)})));
});

// Admin
app.get("/api/admin/stats",auth,admin,(req,res)=>{
  res.json({
    products:db.prepare("SELECT COUNT(*) c FROM products").get().c,
    users:db.prepare("SELECT COUNT(*) c FROM users").get().c,
    orders:db.prepare("SELECT COUNT(*) c FROM orders").get().c,
    revenue:db.prepare("SELECT COALESCE(SUM(total),0) s FROM orders WHERE status!='Cancelled'").get().s
  });
});
app.get("/api/admin/users",auth,admin,(req,res)=>res.json(db.prepare("SELECT id,name,email,role,created_at FROM users ORDER BY id DESC").all()));
app.get("/api/admin/orders",auth,admin,(req,res)=>{
  const orders=db.prepare(`SELECT o.*,u.name,u.email FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.id DESC`).all();
  res.json(orders.map(o=>({...o,address:JSON.parse(o.address||"{}")})));
});
app.put("/api/admin/orders/:id",auth,admin,(req,res)=>{
  const {status}=req.body; const allowed=["Placed","Processing","Shipped","Delivered","Cancelled"];
  if(!allowed.includes(status)) return res.status(400).json({message:"Invalid status"});
  db.prepare("UPDATE orders SET status=? WHERE id=?").run(status,req.params.id);
  res.json({message:"Order updated"});
});
app.post("/api/admin/products",auth,admin,(req,res)=>{
  const p=req.body;
  const result=db.prepare(`INSERT INTO products(category_slug,title,description,price,old_price,discount,rating,reviews,stock,image,featured)
  VALUES(?,?,?,?,?,?,?,?,?,?,?)`).run(p.category_slug,p.title,p.description,Number(p.price),Number(p.old_price||p.price),Number(p.discount||0),Number(p.rating||4.5),Number(p.reviews||0),Number(p.stock||10),p.image||"",p.featured?1:0);
  res.status(201).json({id:result.lastInsertRowid});
});
app.put("/api/admin/products/:id",auth,admin,(req,res)=>{
  const p=req.body;
  db.prepare(`UPDATE products SET category_slug=?,title=?,description=?,price=?,old_price=?,discount=?,rating=?,reviews=?,stock=?,image=?,featured=? WHERE id=?`)
  .run(p.category_slug,p.title,p.description,Number(p.price),Number(p.old_price),Number(p.discount),Number(p.rating),Number(p.reviews),Number(p.stock),p.image,p.featured?1:0,req.params.id);
  res.json({message:"Product updated"});
});
app.delete("/api/admin/products/:id",auth,admin,(req,res)=>{
  db.prepare("DELETE FROM products WHERE id=?").run(req.params.id);
  res.json({message:"Product deleted"});
});

app.get("*",(req,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log(`E-commerce app running at http://localhost:${PORT}`));
