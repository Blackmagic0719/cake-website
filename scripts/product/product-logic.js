// BAKEIT — PRODUCT LOGIC
let allProducts = JSON.parse(localStorage.getItem('products')) || [];
function filterProducts(){
  const selected=Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(c=>c.value.toLowerCase());
  const max=parseInt(document.getElementById('priceRange').value);
  const sort=document.getElementById('sortSelect').value;
  document.getElementById('priceVal').textContent='Rs.'+max.toLocaleString('en-LK');
  let filtered=allProducts.filter(p=>{
    const catOk=selected.length===0||selected.includes((p.category||'').toLowerCase());
    const priceOk=parseInt(p.price)<=max;
    return catOk&&priceOk;
  });
  if(sort==='lowHigh')filtered.sort((a,b)=>a.price-b.price);
  else if(sort==='highLow')filtered.sort((a,b)=>b.price-a.price);
  else if(sort==='name')filtered.sort((a,b)=>a.name.localeCompare(b.name));
  renderProducts(filtered);
}
function renderProducts(items){
  const grid=document.getElementById('productGrid');
  const count=document.getElementById('prodCount');
  if(count)count.textContent=`${items.length} cake${items.length!==1?'s':''} available`;
  if(!grid)return;
  if(items.length===0){
    grid.innerHTML='<div class="empty-state"><div>🔍</div><p>No cakes match your filters. Try adjusting the filters.</p></div>';
    return;
  }
  grid.innerHTML=items.map((p,i)=>`
    <div class="product-card fade-up" data-delay="${i*60}">
      <div class="prod-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <span class="prod-cat-tag">${p.category||'Cake'}</span>
      </div>
      <div class="prod-body">
        <h3>${p.name}</h3>
        <div class="prod-price">Rs.${parseInt(p.price).toLocaleString('en-LK')}</div>
        <button class="add-btn" data-product="${p.name}" onclick="addToCart('${p.name.replace(/'/g,"\\'")}',${p.price})">
          + Add to Cart
        </button>
      </div>
    </div>`).join('');
  initScrollAnimations();
}
window.addEventListener('storage',()=>{allProducts=JSON.parse(localStorage.getItem('products'))||[];filterProducts();});
window.onload=()=>{allProducts=JSON.parse(localStorage.getItem('products'))||[];filterProducts();};
