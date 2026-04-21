let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ADD TO CART
function addToCart(name, price) {
    let existing = cart.find(item => item.name === name);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1 });
    }

    saveCart();
    updateCart();
    // Open cart automatically when item is added for better UX
    document.getElementById("cartBox").classList.add("active");
}

// SAVE CART
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// UPDATE UI
function updateCart() {
    let cartItems = document.getElementById("cartItems");
    let totalDisplay = document.getElementById("total");
    let cartCount = document.getElementById("cartCount");
    let total = 0;

    // Check if the elements exist to prevent errors
    if (!cartItems || !totalDisplay) return;

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center; color:#888; margin-top:20px;">Your cart is empty</p>';
    }

    cart.forEach((item, index) => {
        total += item.price * item.qty;

        cartItems.innerHTML += `
          <div class="cart-item">
            <div class="cart-info">
              <h4>${item.name}</h4>
              <p>Rs.${item.price} x ${item.qty}</p>
            </div>
            <div class="cart-controls">
              <button class="qty-btn" onclick="decreaseQty(${index})">-</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="increaseQty(${index})">+</button>
              <button class="remove-btn" onclick="removeItem(${index})">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2" fill="none"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>`;
    });

    totalDisplay.innerText = "Total: Rs." + total;
    if (cartCount) cartCount.innerText = cart.length;
}

// INCREASE
function increaseQty(index) {
    cart[index].qty++;
    saveCart();
    updateCart();
}

// DECREASE
function decreaseQty(index) {
    if (cart[index].qty > 1) {
        cart[index].qty--;
    } else {
        cart.splice(index, 1);
    }
    saveCart();
    updateCart();
}

// REMOVE
function removeItem(index) {
    if (confirm("Remove this item?")) {
        cart.splice(index, 1);
        saveCart();
        updateCart();
    }
}

// CLEAR
function clearCart() {
    cart = [];
    saveCart();
    updateCart();
}

// TOGGLE CART
function toggleCart() {
    document.getElementById("cartBox").classList.toggle("active");
}

// LOAD ON START
updateCart();