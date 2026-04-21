// GET USER
let user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "login.html";
}

// GET ORDERS
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let list = document.getElementById("orderList");

// MAP WITH ORIGINAL INDEX (VERY IMPORTANT)
let userOrders = orders
  .map((o, i) => ({ ...o, originalIndex: i }))
  .filter(o => o.email === user.email);

// SHOW ORDERS
if (userOrders.length === 0) {
  list.innerHTML = `<div class="empty">No orders yet 🧁</div>`;
} else {

  userOrders.forEach(o => {

    let itemsHTML = "";

    o.items.forEach(item => {
      itemsHTML += `
        <div class="item">
          ${item.name} x ${item.qty} - Rs.${item.price * item.qty}
        </div>
      `;
    });

    let status = o.status || "Pending";

    list.innerHTML += `
      <div class="order">

        <h3>${o.name}</h3>

        ${itemsHTML}

        <p><strong>Total:</strong> Rs.${o.total}</p>

        <div class="status">Status: ${status}</div>

        <div class="delivery">
          🚚 Delivery Date: ${o.delivery || "Not set yet"}
        </div>

        ${(status !== "Delivered" && status !== "Cancelled")
        ? `<button class="btn cancel" onclick="cancelOrder(${o.originalIndex})">
              Cancel Order
            </button>`
        : ""
      }

        ${(status === "Delivered")
        ? `<button class="btn delete" onclick="deleteOrder(${o.originalIndex})">
              Delete Record
            </button>`
        : ""
      }

      </div>
    `;
  });
}

// CANCEL ORDER + NOTIFY ADMIN
function cancelOrder(index) {
  if (!confirm("Cancel this order?")) return;

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let notifications = JSON.parse(localStorage.getItem("notifications")) || [];

  orders[index].status = "Cancelled";

  // 🔔 NOTIFICATION
  notifications.push({
    message: "Order cancelled by " + orders[index].name,
    time: new Date().toLocaleString()
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("notifications", JSON.stringify(notifications));

  alert("Order cancelled successfully!");
  location.reload();
}

// DELETE AFTER DELIVERY
function deleteOrder(index) {
  if (!confirm("Delete this record?")) return;

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders[index].status === "Delivered") {
    orders.splice(index, 1);
  }

  localStorage.setItem("orders", JSON.stringify(orders));

  location.reload();
}
