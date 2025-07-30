// قائمة الأطباق
const menuItems = [
  { id: 1, name: "برجر لحم مع البطاطس", price: 45, image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
  { id: 2, name: "بيتزا ببروني", price: 60, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
  { id: 3, name: "سوشي ميكس", price: 80, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
  { id: 4, name: "كباب مشكل", price: 55, image: "https://images.unsplash.com/photo-1544025162-d7689ab5ce26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
  { id: 5, name: "سلطة سيزر بالدجاج", price: 35, image: "https://images.unsplash.com/photo-1546793665-c7879a16c573?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
  { id: 6, name: "كاساديا لحم", price: 50, image: "https://images.unsplash.com/photo-1583311590989-56370993c5dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" }
];

let cart = [];

// عرض القائمة
function displayMenu() {
  const grid = document.getElementById("menu-grid");
  grid.innerHTML = "";
  menuItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="menu-item-content">
        <h3>${item.name}</h3>
        <div class="price">${item.price} درهم</div>
        <button class="add-to-cart" onclick="addToCart(${item.id})">أضف إلى السلة</button>
      </div>
    `;
    grid.appendChild(div);
  });
}

// إضافة إلى السلة
function addToCart(id) {
  const item = menuItems.find(i => i.id === id);
  const cartItem = cart.find(i => i.id === id);
  if (cartItem) cartItem.quantity++;
  else cart.push({ ...item, quantity: 1 });
  updateCart();
}

// حذف من السلة
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// تحديث السلة
function updateCart() {
  const items = document.getElementById("cart-items");
  const count = document.getElementById("cart-count");
  const itemsCount = document.getElementById("cart-items-count");
  const totalEl = document.getElementById("total-price");
  const btn = document.getElementById("checkout-btn");

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  count.textContent = totalItems;
  itemsCount.textContent = totalItems;
  totalEl.textContent = total;
  document.getElementById("final-total").textContent = total;

  if (cart.length === 0) {
    items.innerHTML = '<p class="empty">سلتك فارغة.</p>';
    btn.disabled = true;
  } else {
    items.innerHTML = "";
    cart.forEach(item => {
      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
        <div>${item.name} × ${item.quantity}</div>
        <div>${item.price * item.quantity} درهم</div>
        <button onclick="removeFromCart(${item.id})">حذف</button>
      `;
      items.appendChild(el);
    });
    btn.disabled = false;
  }
}

// نموذج التوصيل
document.getElementById("order-form").onsubmit = function(e) {
  e.preventDefault();
  const name = document.getElementById("customer-name").value;
  const orderData = {
    id: Date.now(),
    name,
    phone: document.getElementById("customer-phone").value,
    address: document.getElementById("customer-address").value,
    notes: document.getElementById("order-notes").value,
    total: document.getElementById("final-total").textContent,
    timestamp: new Date().toLocaleString('ar-SA')
  };

  let orders = JSON.parse(localStorage.getItem("memoOrders") || "[]");
  orders.push(orderData);
  localStorage.setItem("memoOrders", JSON.stringify(orders));

  document.getElementById("order-message").innerHTML = 
    `<p style="color:green">تم تأكيد طلبك، ${name}! شكرًا لك.</p>`;
  
  setTimeout(() => {
    document.getElementById("checkout-modal").style.display = "none";
    document.getElementById("order-message").innerHTML = "";
    cart = [];
    updateCart();
  }, 2000);
};

// إغلاق النموذج
document.getElementById("close-modal").onclick = () => {
  document.getElementById("checkout-modal").style.display = "none";
};

// زر توصيل
document.getElementById("checkout-btn").onclick = () => {
  if (cart.length > 0) {
    document.getElementById("checkout-modal").style.display = "flex";
  }
};

// تحميل عند البدء
window.onload = () => {
  displayMenu();
  updateCart();
};
