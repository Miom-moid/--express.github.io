// قائمة الأطباق
const menuItems = [
  { 
    id: 1, 
    name: "برجر لحم مع البطاطس", 
    price: 45, 
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
  },
  { 
    id: 2, 
    name: "بيتزا ببروني", 
    price: 60, 
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
  },
  { 
    id: 3, 
    name: "سوشي ميكس", 
    price: 80, 
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
  },
  { 
    id: 4, 
    name: "كباب مشكل", 
    price: 55, 
    image: "https://images.unsplash.com/photo-1544025162-d7689ab5ce26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
  },
  { 
    id: 5, 
    name: "سلطة سيزر بالدجاج", 
    price: 35, 
    image: "https://images.unsplash.com/photo-1546793665-c7879a16c573?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
  },
  { 
    id: 6, 
    name: "كاساديا لحم", 
    price: 50, 
    image: "https://images.unsplash.com/photo-1583311590989-56370993c5dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
  }
];

// السلة
let cart = [];

// عرض القائمة
function displayMenu() {
  const grid = document.getElementById("menu-grid");
  if (!grid) return;

  grid.innerHTML = "";
  menuItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x200?text=صورة+غير+متوفرة';">
      <div class="menu-item-content">
        <h3>${item.name}</h3>
        <div class="price">${item.price} درهم</div>
        <button class="add-to-cart" onclick="addToCart(${item.id})">
          <i class="fas fa-shopping-cart"></i> أضف إلى السلة
        </button>
      </div>
    `;
    grid.appendChild(div);
  });
}

// إضافة إلى السلة
function addToCart(id) {
  const item = menuItems.find(i => i.id === id);
  if (!item) return;

  const cartItem = cart.find(i => i.id === id);
  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ ...item, quantity: 1 });
  }
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

  if (!items) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // تحديث العدادات
  if (count) count.textContent = totalItems;
  if (itemsCount) itemsCount.textContent = totalItems;
  if (totalEl) totalEl.textContent = total;
  if (document.getElementById("final-total")) {
    document.getElementById("final-total").textContent = total;
  }

  // تحديث واجهة السلة
  if (cart.length === 0) {
    items.innerHTML = '<p class="empty">سلتك فارغة.</p>';
    if (btn) btn.disabled = true;
  } else {
    items.innerHTML = "";
    cart.forEach(item => {
      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
        <div class="cart-item-info">
          <strong>${item.name}</strong> × ${item.quantity}
          <br>
          <small>${item.price} × ${item.quantity} = ${item.price * item.quantity} درهم</small>
        </div>
        <button class="btn-remove" onclick="removeFromCart(${item.id})">
          <i class="fas fa-trash"></i>
        </button>
      `;
      items.appendChild(el);
    });
    if (btn) btn.disabled = false;
  }
}

// نموذج التوصيل
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("order-form");
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault();

      const name = document.getElementById("customer-name").value.trim();
      const phone = document.getElementById("customer-phone").value.trim();
      const address = document.getElementById("customer-address").value.trim();
      const notes = document.getElementById("order-notes").value.trim();
      const total = document.getElementById("final-total").textContent;

      const orderData = {
        id: Date.now(),
        name,
        phone,
        address,
        notes,
        total,
        items: cart.map(item => `${item.name} × ${item.quantity}`).join(", "),
        timestamp: new Date().toLocaleString('ar-SA')
      };

      // حفظ في localStorage
      let orders = JSON.parse(localStorage.getItem("memoOrders") || "[]");
      orders.push(orderData);
      localStorage.setItem("memoOrders", JSON.stringify(orders));

      // ✅ إرسال إشعار إلى موقعك الشخصي
      try {
        const channel = new BroadcastChannel('memo-orders');
        channel.postMessage(orderData);
        channel.close(); // إغلاق القناة بعد الإرسال
      } catch (err) {
        console.log("فشل إرسال الإشعار:", err);
      }

      // رسالة نجاح
      const messageDiv = document.getElementById("order-message");
      messageDiv.innerHTML = `
        <p style="color: green; text-align: center; font-weight: bold;">
          ✅ تم تأكيد طلبك، ${name}!<br>
          الإجمالي: ${total} درهم<br>
          شكرًا لاختيارك ميمو إكسبريس!
        </p>
      `;

      // إغلاق النموذج وإعادة السلة
      setTimeout(() => {
        document.getElementById("checkout-modal").style.display = "none";
        messageDiv.innerHTML = "";
        cart = [];
        updateCart();
      }, 2500);
    };
  }

  // زر توصيل
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
      if (cart.length > 0) {
        document.getElementById("checkout-modal").style.display = "flex";
      }
    };
  }

  // إغلاق النموذج
  const closeModal = document.getElementById("close-modal");
  if (closeModal) {
    closeModal.onclick = () => {
      document.getElementById("checkout-modal").style.display = "none";
    };
  }

  // إغلاق بالنقر خارج النموذج
  window.onclick = (e) => {
    const modal = document.getElementById("checkout-modal");
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };
});

// تحميل عند البدء
window.onload = () => {
  displayMenu();
  updateCart();
};
