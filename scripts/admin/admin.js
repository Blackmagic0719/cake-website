let products = JSON.parse(localStorage.getItem("products")) || [];
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let user = JSON.parse(localStorage.getItem("user"));
let imageData = "";

/* --- SECURITY & LOGIN --- */
if (!user) {
    alert("Please login first!");
    window.location.href = "login.html";
} else if (user.email !== "admin@gmail.com") {
    alert("Access denied! Admin only ❌");
    window.location.href = "index.html";
}

/* --- FIX: DRAG & DROP LOGIC --- */
let dropArea = document.getElementById("dropArea");
let fileInput = document.getElementById("fileInput");
let preview = document.getElementById("preview");

if (dropArea) {
    // Click to upload
    dropArea.onclick = () => fileInput.click();

    // Handle file selection
    fileInput.onchange = (e) => handleFile(e.target.files[0]);

    // Handle drag events
    dropArea.ondragover = (e) => {
        e.preventDefault();
        dropArea.style.borderColor = "#ff5c7a";
        dropArea.style.background = "#fff0f3";
    };

    dropArea.ondragleave = () => {
        dropArea.style.borderColor = "#ff5c7a";
        dropArea.style.background = "transparent";
    };

    dropArea.ondrop = (e) => {
        e.preventDefault();
        dropArea.style.background = "transparent";
        let file = e.dataTransfer.files[0];
        handleFile(file);
    };
}

function handleFile(file) {
    if (file && file.type.startsWith("image/")) {
        let reader = new FileReader();
        reader.onload = (event) => {
            imageData = event.target.result;
            preview.src = imageData;
            preview.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        alert("Please upload a valid image file!");
    }
}

/* --- PRODUCT ACTIONS --- */
function addProduct() {
    let name = document.getElementById("name").value;
    let price = document.getElementById("price").value;
    let category = document.getElementById("category").value;

    if (!name || !price || !category || !imageData) {
        alert("Fill all fields and upload an image!");
        return;
    }

    products.push({ name, price: parseInt(price), category, image: imageData });
    localStorage.setItem("products", JSON.stringify(products));

    // Reset form
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("category").value = "";
    preview.style.display = "none";
    imageData = "";

    displayProducts();
}

function displayProducts() {
    let list = document.getElementById("productList");
    if (!list) return;
    list.innerHTML = "";
    products.forEach((p, i) => {
        list.innerHTML += `
            <div class="product" style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee; padding:10px;">
                <div style="display:flex; align-items:center;">
                    <img src="${p.image}" style="width:50px; height:50px; object-fit:cover; border-radius:5px; margin-right:10px;">
                    <div><strong>${p.name}</strong><br>Rs.${p.price}</div>
                </div>
                <div style="display:flex; gap:5px;">
                    <button onclick="editProductPrice(${i})" style="background:#ffa500; color:white; border:none; padding:5px 8px; border-radius:5px; cursor:pointer;">Edit Price</button>
                    <button onclick="deleteProduct(${i})" style="background:red; color:white; border:none; padding:5px 8px; border-radius:5px; cursor:pointer;">Delete</button>
                </div>
            </div>`;
    });
}

function editProductPrice(i) {
    let newPrice = prompt("Enter new price for " + products[i].name, products[i].price);
    if (newPrice && !isNaN(newPrice)) {
        products[i].price = parseInt(newPrice);
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();
    }
}

function deleteProduct(i) {
    if (confirm("Delete product?")) {
        products.splice(i, 1);
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();
    }
}

/* --- ORDER ACTIONS --- */
function displayOrders() {
    let list = document.getElementById("orderList");
    if (!list) return;
    list.innerHTML = "";

    orders.forEach((o, i) => {
        let itemsHtml = o.items ? o.items.map(item =>
            `<li>${item.name} x ${item.qty} ${item.price === 0 ? '<b style="color:#ff5c7a;">(Custom)</b>' : ''}</li>`
        ).join('') : "";

        list.innerHTML += `
            <div class="order" style="border:1px solid #ddd; padding:15px; margin-bottom:15px; border-radius:10px; background:white;">
                <p><strong>Order ID:</strong> ${o.id || o.orderNumber}</p>
                <p><strong>Customer:</strong> ${o.name}</p>
                <p><strong>📍 Address:</strong> ${o.address || 'Not Set'}</p>
                <ul>${itemsHtml}</ul>
                <p><strong>💰 Total:</strong> Rs. ${o.total}</p>
                <p><strong>Status:</strong> <span style="color:orange;">${o.status || "Pending"}</span></p>
                
                <div style="margin-top:10px; background:#fff0f3; padding:10px; border-radius:8px;">
                    <input type="number" id="update-price-${i}" placeholder="Custom Price" style="width:100px; padding:5px;">
                    <button onclick="setPriceAndNotify(${i})" style="background:#ff5c7a; color:white; padding:5px 10px; border:none; border-radius:5px; cursor:pointer;">Set Custom Price</button>
                </div>

                <div style="margin-top:10px; display:flex; gap:10px;">
                    <button onclick="markDelivering(${i})" style="background:#ffa500; color:white; padding:8px; border:none; border-radius:5px; cursor:pointer;">🚚 Mark Delivering</button>
                    <button onclick="markDelivered(${i})" style="background:#4CAF50; color:white; padding:8px; border:none; border-radius:5px; cursor:pointer;">✅ Mark Delivered</button>
                    <button onclick="deleteOrder(${i})" style="background:red; color:white; padding:8px; border:none; border-radius:5px; cursor:pointer;">🗑️ Delete</button>
                </div>
            </div>`;
    });
}

function setPriceAndNotify(index) {
    let newPrice = parseInt(document.getElementById(`update-price-${index}`).value);
    if (!newPrice || newPrice < 0) return alert("Enter price!");

    let found = false;
    orders[index].items.forEach(item => {
        if (item.name === "Custom Cake Request" || item.price === 0) {
            item.price = newPrice;
            found = true;
        }
    });

    if (found) {
        orders[index].total = orders[index].items.reduce((sum, item) => sum + (item.price * item.qty), 0);
        orders[index].status = "Price Set";
        localStorage.setItem("orders", JSON.stringify(orders));

        let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
        notifications.push({ orderID: orders[index].id, message: "Custom cake price set!", time: new Date().toLocaleString() });
        localStorage.setItem("notifications", JSON.stringify(notifications));

        alert("Updated!");
        displayOrders();
    }
}

function markDelivering(i) {
    orders[i].status = "Delivering";
    localStorage.setItem("orders", JSON.stringify(orders));
    displayOrders();
}

function markDelivered(i) {
    orders[i].status = "Delivered";
    localStorage.setItem("orders", JSON.stringify(orders));
    displayOrders();
}

function deleteOrder(i) {
    if (confirm("Delete?")) {
        orders.splice(i, 1);
        localStorage.setItem("orders", JSON.stringify(orders));
        displayOrders();
    }
}

/* --- NOTIFICATIONS --- */
function loadNotifications() {
    let notifications = JSON.parse(localStorage.getItem("notifications")) || [];
    let box = document.getElementById("notifyList");
    if (box) {
        box.innerHTML = notifications.length ? "" : "<p>No notifications</p>";
        notifications.reverse().forEach(n => {
            box.innerHTML += `<div style="border-bottom:1px solid #eee; padding:5px;">${n.message} (${n.time})</div>`;
        });
    }
}

function clearNotify() {
    localStorage.removeItem("notifications");
    loadNotifications();
}

/* --- NAVIGATION & INIT --- */
function goHome() {
    window.location.href = "index.html";
}

window.onload = () => {
    displayProducts();
    displayOrders();
    loadNotifications();
};