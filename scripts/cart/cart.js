// BAKEIT — CART LOGIC
function addToCart(name, price) {
  let cart = getCart();
  const existing = cart.find(i => i.name === name);
  if (existing) { existing.qty += 1; } else { cart.push({ name, price, qty: 1 }); }
  saveCart(cart); updateCartUI();
  const btn = document.querySelector(`[data-product="${name}"]`);
  if (btn) { btn.classList.add('added'); btn.innerHTML='✓ Added'; setTimeout(()=>{btn.classList.remove('added');btn.innerHTML='+ Add to Cart';},1500); }
  openCartDrawer();
  showToast(`${name} added to cart`,'success',2500);
}
function increaseQty(i){let c=getCart();c[i].qty++;saveCart(c);updateCartUI();}
function decreaseQty(i){let c=getCart();if(c[i].qty>1){c[i].qty--;}else{c.splice(i,1);}saveCart(c);updateCartUI();}
function removeItem(i){let c=getCart();c.splice(i,1);saveCart(c);updateCartUI();showToast('Item removed','default',2000);}
function toggleCart(){const d=document.getElementById('cartDrawer'),o=document.getElementById('cartOverlay');if(d){d.classList.toggle('open');o.classList.toggle('active');}}
function openCartDrawer(){const d=document.getElementById('cartDrawer'),o=document.getElementById('cartOverlay');if(d&&!d.classList.contains('open')){d.classList.add('open');o.classList.add('active');}}
function updateCartUI(){
  const cart=getCart();
  const count=cart.reduce((s,i)=>s+i.qty,0);
  const total=cart.reduce((s,i)=>s+(i.price||0)*i.qty,0);
  const badge=document.getElementById('cartBadge');
  if(badge){badge.textContent=count;badge.style.display=count>0?'inline-flex':'none';}
  const itemsEl=document.getElementById('cartItemsEl');
  if(!itemsEl)return;
  if(cart.length===0){itemsEl.innerHTML='<div class="cart-empty"><div>🛒</div><p>Your cart is empty</p></div>';}
  else{itemsEl.innerHTML=cart.map((item,i)=>`
    <div class="cart-item">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <div class="cart-item-price">${item.price>0?formatRs(item.price):'⏳ Price Pending'}</div>
        ${item.details?`<div style="font-size:11px;color:var(--muted);margin-top:3px;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${item.details}">${item.details}</div>`:''}
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="decreaseQty(${i})">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="increaseQty(${i})">+</button>
        <button class="rm-btn" onclick="removeItem(${i})">✕</button>
      </div>
    </div>`).join('');}
  const totalEl=document.getElementById('cartTotal');
  if(totalEl)totalEl.textContent=formatRs(total);
}
document.addEventListener('DOMContentLoaded',updateCartUI);
