// Pull data from Admin Panel
let products = JSON.parse(localStorage.getItem("products")) || [];

// Unified Filter & Sort Function
function filterProducts() {
    const selected = Array.from(document.querySelectorAll("input[type=checkbox]:checked")).map(cb => cb.value.toLowerCase());
    const maxPrice = parseInt(document.getElementById("priceRange").value);
    const sortType = document.getElementById("sortPrice").value;

    document.getElementById("priceValue").innerText = maxPrice;

    // 1. Filter
    let filtered = products.filter(p => {
        const matchesCat = selected.length === 0 || selected.includes(p.category.toLowerCase());
        const matchesPrice = parseInt(p.price) <= maxPrice;
        return matchesCat && matchesPrice;
    });

    // 2. Sort
    if (sortType === "lowHigh") {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortType === "highLow") {
        filtered.sort((a, b) => b.price - a.price);
    }

    renderUI(filtered);
}

// Modern UI Renderer
function renderUI(items) {
    const container = document.getElementById("productList");
    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = "<p style='grid-column: 1/-1; text-align:center;'>No cakes found matching your criteria.</p>";
        return;
    }

    items.forEach(p => {
        container.innerHTML += `
        <div class="product">
            <img src="${p.image}">
            <h3>${p.name}</h3>
            <p>Rs.${p.price}</p>
            <button class="btn" onclick="addToCart('${p.name}', ${p.price})">Add to Cart</button>
        </div>`;
    });
}

// Checkout Logic
function goCheckout() {
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (currentCart.length === 0) {
        alert("Cart is empty!");
        return;
    }
    window.location.href = "order.html";
}

function goOrders() {
    window.location.href = "myorders.html";
}

// Initial load when page opens
window.onload = () => {
    filterProducts();
};
// Character Count Logic
document.getElementById('customCakeDesc').addEventListener('input', function () {
    document.getElementById('charCount').innerText = this.value.length + " / 300";
});

function openCustomModal() {
    document.getElementById("customModal").style.display = "block";
}

function closeCustomModal() {
    document.getElementById("customModal").style.display = "none";
}

function addCustomToCart() {
    let desc = document.getElementById("customCakeDesc").value;
    if (desc.trim() === "") return alert("Please describe your cake!");

    let customItem = {
        id: "CUSTOM-" + Date.now(),
        name: "Custom Cake Request",
        price: 0, // Price to be set by admin
        qty: 1,
        details: desc
    };

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push(customItem);
    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Custom request added to cart. Proceed to checkout!");
    closeCustomModal();
    if (typeof updateCartUI === "function") updateCartUI(); // Refresh cart if function exists
}