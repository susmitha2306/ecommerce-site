
const bcrypt=require("bcryptjs");
const db=require("./db");
const cats=[
 ["electronics","Electronics","⌁"],["fashion","Fashion","◈"],["home","Home & Kitchen","⌂"],
 ["beauty","Beauty","✦"],["grocery","Grocery","◇"],["sports","Sports & Fitness","⚽"],
 ["books","Books","▤"],["toys","Toys & Games","♧"],["automotive","Automotive","⌁"]
];
const images=[
 "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1560243563-062bfc001d68?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80",
 "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=900&q=80"
];
db.prepare("INSERT OR IGNORE INTO categories(slug,name,icon) VALUES(?,?,?)").run(...cats[0]);
const insertCat=db.prepare("INSERT OR IGNORE INTO categories(slug,name,icon) VALUES(?,?,?)");
cats.forEach(c=>insertCat.run(...c));
const templates={
electronics:["Noise Cancelling Headphones","Smart Watch Pro","Portable Bluetooth Speaker","4K Streaming Stick","Wireless Keyboard","Mechanical Gaming Mouse","USB-C Hub","Fast Charger","Tablet Stand","Mini Projector","Webcam Full HD","Power Bank 20000mAh","Smart LED Bulb","Gaming Controller","Earbuds Pro"],
fashion:["Classic Cotton T-Shirt","Everyday Denim Jacket","Comfort Sneakers","Slim Fit Chinos","Casual Hoodie","Canvas Backpack","Running Shoes","Leather Belt","Oversized Shirt","Summer Dress","Linen Trousers","Winter Jacket","Sports Cap","Travel Duffel Bag","Classic Sunglasses"],
home:["Air Fryer","Non-Stick Cookware Set","Coffee Maker","Electric Kettle","Table Lamp","Storage Organizer","Bedsheet Set","Ceramic Dinner Set","Water Bottle","Wall Clock","Vacuum Cleaner","Cushion Set","Kitchen Rack","Floor Mat","Digital Weighing Scale"],
beauty:["Hydrating Face Wash","Vitamin C Serum","Moisturizer","Sunscreen SPF 50","Shampoo","Conditioner","Lip Balm Set","Body Lotion","Perfume Mist","Hair Dryer","Makeup Brush Set","Face Mask Pack","Aloe Vera Gel","Hand Cream","Beard Grooming Kit"],
grocery:["Premium Coffee Beans","Organic Green Tea","Whole Wheat Pasta","Mixed Nuts","Breakfast Oats","Honey","Olive Oil","Dark Chocolate","Basmati Rice","Granola","Peanut Butter","Herbal Tea","Coconut Water Pack","Spice Collection","Dried Fruits"],
sports:["Yoga Mat","Dumbbell Set","Resistance Bands","Football","Cricket Bat","Badminton Racket","Running Cap","Gym Gloves","Skipping Rope","Fitness Tracker","Water Bottle Sport","Cycling Helmet","Tennis Balls","Exercise Bench","Sports Socks"],
books:["Modern JavaScript","Clean Code","The DevOps Handbook","Python Projects","Web Design Basics","Database Systems","AI for Everyone","Atomic Habits","The Psychology of Money","Deep Work","Learning Git","Cloud Computing Guide","System Design Primer","Data Science Essentials","The Art of Programming"],
toys:["Building Blocks","Remote Control Car","Puzzle Game","Board Game Classic","Kids Art Set","Plush Teddy","STEM Robot Kit","Mini Kitchen Set","Toy Train","Memory Cards","Dinosaur Set","Magic Drawing Board","Musical Keyboard","Strategy Game","Outdoor Play Set"],
automotive:["Car Phone Holder","Tyre Inflator","Dashboard Cleaner","Car Vacuum","LED Interior Lights","Seat Organizer","Microfiber Cleaning Kit","Emergency Tool Kit","Sunshade","Car Perfume","Jump Starter","USB Car Charger","Bike Cover","Travel Car Mat","Digital Tyre Gauge"]
};
const ins=db.prepare(`INSERT INTO products(category_slug,title,description,price,old_price,discount,rating,reviews,stock,image,featured) VALUES(?,?,?,?,?,?,?,?,?,?,?)`);
const count=db.prepare("SELECT COUNT(*) c FROM products").get().c;
if(count===0){
 let n=0;
 for(const [slug,names] of Object.entries(templates)){
   names.forEach((name,i)=>{
     const price=499 + ((i*137+n*53)%4500);
     const discount=10+((i*7+n)%41);
     const old=Math.round(price/(1-discount/100));
     ins.run(slug,name,`Premium ${name.toLowerCase()} designed for everyday use with dependable quality, modern style and great value.`,price,old,discount,(4+(i%10)/10).toFixed(1),35+i*17,5+(i*3)%46,images[n%images.length],i<3?1:0);
     n++;
   });
 }
}
const adminHash=bcrypt.hashSync("Admin@123",10);
db.prepare("INSERT OR IGNORE INTO users(id,name,email,password,role) VALUES(1,'Store Admin','admin@store.local',?,'admin')").run(adminHash);
console.log("Seed complete: 9 categories, 135 products. Admin: admin@store.local / Admin@123");
