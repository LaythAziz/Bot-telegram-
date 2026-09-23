const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) tg.expand();

const servicesData = {
  free: [
    { id: 101, title: "مشاهدات منشورات تليجرام - مجاني 🎁", price: 0.0000, speed: "فوري" },
    { id: 102, title: "تفاصيل لايكات إنستغرام تجريبية 🎁", price: 0.0000, speed: "1 دقيقة" },
    { id: 103, title: "مشاهدات ريلز إنستغرام تجريبية 🎁", price: 0.0000, speed: "فوري" },
    { id: 104, title: "تصويتات قنوات تليجرام مجانية 🎁", price: 0.0000, speed: "فوري" }
  ],
  instagram: Array.from({length: 22}, (_, i) => ({
    id: 200 + i,
    title: `إنستغرام - ${['متابعين ضمان 30 يوم', 'إعجابات حقيقية', 'مشاهدات ريلز خيالية', 'تفاعلات ستوري VIP', 'تعليقات عربية'][i % 5]} #${i + 1}`,
    price: (0.05 + (i * 0.03)).toFixed(4),
    speed: `${(i % 5) + 1} دقائق`
  })),
  tiktok: Array.from({length: 20}, (_, i) => ({
    id: 300 + i,
    title: `تيك توك - ${['مشاهدات سريعة', 'تكبيسات بث مباشر', 'إعجابات فيديوهات', 'متابعين حقيقيين'][i % 4]} #${i + 1}`,
    price: (0.01 + (i * 0.04)).toFixed(4),
    speed: `${(i % 3) + 1} دقائق`
  })),
  telegram: Array.from({length: 50}, (_, i) => ({
    id: 400 + i,
    title: `تليجرام - ${['أعضاء بريميوم', 'مشاهدات ستوري', 'تفاعلات إيجابية 👍', 'أعضاء قنوات حقيقيين', 'تصويت استطلاع'][i % 5]} #${i + 1}`,
    price: (0.02 + (i * 0.05)).toFixed(4),
    speed: `${(i % 10) + 1} دقائق`
  })),
  facebook: Array.from({length: 14}, (_, i) => ({
    id: 500 + i,
    title: `فيسبوك - ${['متابعين صفحات وحسابات', 'لايكات منشورات', 'مشاهدات فيديو', 'تفاعلات ريلز'][i % 4]} #${i + 1}`,
    price: (0.08 + (i * 0.02)).toFixed(4),
    speed: "فوري"
  })),
  funding: [
    { id: 601, title: "تمويل قنوات تليجرام حقيقي ومضمون", price: 12.0000, speed: "12 ساعة" },
    { id: 602, title: "تمويل صفحات إنستغرام عربية 100%", price: 15.0000, speed: "24 ساعة" }
  ],
  youtube: [
    { id: 701, title: "مشتركين يوتيوب ثبات عالي", price: 4.5000, speed: "1 ساعة" },
    { id: 702, title: "مشاهدات يوتيوب جودة عالية 4k", price: 1.2000, speed: "فوري" }
  ],
  twitter: Array.from({length: 5}, (_, i) => ({
    id: 800 + i,
    title: `تويتر (X) - ${['متابعين حقيقيين', 'إعادة تغريد Retweet', 'إعجابات تغريدات'][i % 3]} #${i + 1}`,
    price: (0.90 + (i * 0.2)).toFixed(4),
    speed: "فوري"
  })),
  snapchat: Array.from({length: 4}, (_, i) => ({
    id: 900 + i,
    title: `سناب شات - ${['متابعين منصة الأضواء', 'مشاهدات ستوري'][i % 2]} #${i + 1}`,
    price: (2.50 + (i * 0.5)).toFixed(4),
    speed: "30 دقيقة"
  })),
  twitch: Array.from({length: 3}, (_, i) => ({
    id: 1000 + i,
    title: `تويتش - ${['متابعين قناة', 'مشاهدات بث مباشر'][i % 2]} #${i + 1}`,
    price: (0.80 + (i * 0.1)).toFixed(4),
    speed: "فوري"
  }))
};

let currentService = null;
let userBalance = 0.0000;
let myOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');

if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
  const userNameEl = document.getElementById('userName');
  if (userNameEl) {
    userNameEl.innerText = tg.initDataUnsafe.user.first_name || "Layth Aziz";
  }
}

// --- لوحة تحكم الأدمن المتكاملة داخل الواجهة (تظهر لك وحدك) ---
const ADMIN_ID = 1414595876;
const currentUser = tg && tg.initDataUnsafe && tg.initDataUnsafe.user ? tg.initDataUnsafe.user : null;

if (currentUser && currentUser.id === ADMIN_ID) {
  // حقن واجهة لوحة التحكم في التطبيق
  const adminPanelContainer = document.createElement('div');
  adminPanelContainer.innerHTML = `
    <div id="adminPanelModal" style="background: linear-gradient(135deg, #1f1c2c, #928dab); border: 2px solid #ff416c; border-radius: 16px; padding: 15px; margin: 15px 0; color: #fff; box-shadow: 0 8px 25px rgba(255,65,108,0.3);">
      <div style="font-weight: bold; font-size: 15px; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
        🛠 لوحة تحكم الأدمن (إدارة رصيد الزبائن)
      </div>
      <div style="margin-bottom: 8px;">
        <label style="font-size: 11px; color: #ddd;">آيدي الزبون:</label>
        <input type="number" id="adminTargetId" placeholder="مثال: 8816331690" style="width: 100%; padding: 10px; border-radius: 8px; border: none; background: rgba(255,255,255,0.1); color: #fff; margin-top: 4px; font-size: 13px;">
      </div>
      <div style="margin-bottom: 12px;">
        <label style="font-size: 11px; color: #ddd;">المبلغ ($):</label>
        <input type="number" id="adminAmount" placeholder="مثال: 10.00" step="0.01" style="width: 100%; padding: 10px; border-radius: 8px; border: none; background: rgba(255,255,255,0.1); color: #fff; margin-top: 4px; font-size: 13px;">
      </div>
      <button onclick="executeAdminBalanceTransfer()" style="width: 100%; background: linear-gradient(135deg, #ff416c, #ff4b2b); color: #fff; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; box-shadow: 0 4px 12px rgba(255,65,108,0.4);">
        ⚡ تحويل ورسملة الرصيد للزبون فوراَ
      </button>
    </div>
  `;
  
  const homeView = document.getElementById('homeView');
  if (homeView) {
    homeView.insertBefore(adminPanelContainer, homeView.firstChild);
  }
}

function executeAdminBalanceTransfer() {
  const targetIdInput = document.getElementById('adminTargetId');
  const amountInput = document.getElementById('adminAmount');
  
  if (!targetIdInput || !amountInput) return;
  const targetId = targetIdInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!targetId || isNaN(amount) || amount <= 0) {
    alert("❌ يرجى إدخال آيدي صحيح ومبلغ صالح للاستخدام!");
    return;
  }

  if (tg) {
    tg.sendData(JSON.stringify({
      action: "admin_real_transfer",
      target_id: targetId,
      amount: amount
    }));
    alert(`✅ تم تنفيذ عملية تحويل $${amount.toFixed(4)} للآيدي ${targetId} وإرسال الإشعارات بنجاح!`);
    targetIdInput.value = '';
    amountInput.value = '';
    tg.close();
  } else {
    alert("يرجى فتح التطبيق من داخل التليجرام!");
  }
}

function updateStatsDisplay() {
  const pending = myOrders.filter(o => o.status.includes('قيد')).length;
  const completed = myOrders.filter(o => o.status.includes('مكتمل')).length;
  
  const pendingEl = document.getElementById('pendingCount');
  const completedEl = document.getElementById('completedCount');
  if (pendingEl) pendingEl.innerText = pending;
  if (completedEl) completedEl.innerText = completed;
}

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  
  const targetTab = document.getElementById(tabId);
  if (targetTab) targetTab.style.display = 'block';

  const navBtn = document.getElementById('nav-' + tabId);
  if (navBtn) navBtn.classList.add('active');
  
  if (tabId === 'ordersTab') {
    renderOrders();
  }
  closeOrderModal();
}

function openPlatform(platformKey) {
  const listContainer = document.getElementById('servicesList');
  const homeView = document.getElementById('homeView');
  const servicesView = document.getElementById('servicesView');

  if (!listContainer || !homeView || !servicesView) return;

  listContainer.innerHTML = '';
  
  const list = servicesData[platformKey] || [];
  list.forEach(srv => {
    const item = document.createElement('div');
    item.className = 'service-card';
    item.onclick = () => openOrderModal(srv);
    item.innerHTML = `
      <div>
        <div class="service-title">${srv.title}</div>
        <div style="display:flex; gap:8px; margin-top:4px;">
          <span class="service-price">$${srv.price} / 1000</span>
          <span style="font-size:10px; color:var(--text-sub);">⚡ ${srv.speed}</span>
        </div>
      </div>
      <div class="btn-order-action">طلب ↗</div>
    `;
    listContainer.appendChild(item);
  });

  homeView.style.display = 'none';
  servicesView.style.display = 'block';
}

function goHomeServices() {
  const homeView = document.getElementById('homeView');
  const servicesView = document.getElementById('servicesView');
  if (homeView) homeView.style.display = 'block';
  if (servicesView) servicesView.style.display = 'none';
}

function openOrderModal(service) {
  currentService = service;
  const titleEl = document.getElementById('modalServiceTitle');
  const qtyEl = document.getElementById('quantityInput');
  const modalEl = document.getElementById('orderModal');

  if (titleEl) titleEl.innerText = service.title;
  if (qtyEl) qtyEl.value = 1000;
  calculatePrice();
  if (modalEl) modalEl.style.display = 'flex';
}

function closeOrderModal() {
  const modalEl = document.getElementById('orderModal');
  if (modalEl) modalEl.style.display = 'none';
}

function calculatePrice() {
  if (!currentService) return;
  const qtyInput = document.getElementById('quantityInput');
  const priceDisplay = document.getElementById('totalPriceDisplay');
  if (!qtyInput || !priceDisplay) return;

  const qty = parseInt(qtyInput.value) || 0;
  const total = (qty / 1000) * parseFloat(currentService.price);
  priceDisplay.innerText = `$${total.toFixed(4)}`;
}

function submitOrder() {
  const targetInput = document.getElementById('targetInput');
  const qtyInput = document.getElementById('quantityInput');
  if (!targetInput || !qtyInput) return;

  const target = targetInput.value.trim();
  const qty = parseInt(qtyInput.value) || 0;
  const total = (qty / 1000) * parseFloat(currentService.price);

  if (!target) {
    alert('يرجى إدخال الرابط أو اسم المستخدم بشكل صحيح!');
    return;
  }

  if (userBalance < total) {
    alert('❌ رصيدك غير كافٍ لتنفيذ هذا الطلب! يرجى شحن حسابك عبر البوت.');
    return;
  }

  userBalance -= total;
  const userBalanceEl = document.getElementById('userBalance');
  if (userBalanceEl) userBalanceEl.innerText = `$${userBalance.toFixed(4)}`;
  
  const newOrderId = Math.floor(Math.random() * 899999 + 119000000).toString();
  myOrders.unshift({
    id: newOrderId,
    title: currentService.title,
    qty: qty,
    price: total,
    status: "قيد التنفيذ ⚡"
  });
  
  localStorage.setItem('myOrders', JSON.stringify(myOrders));
  updateStatsDisplay();
  
  alert(`✅ تم إنشاء الطلب بنجاح!\nرقم الطلب: #${newOrderId}\nالخدمة: ${currentService.title}`);
  closeOrderModal();
}

function renderOrders() {
  const container = document.getElementById('ordersContainer');
  if (!container) return;
  container.innerHTML = '';
  
  if (myOrders.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:var(--text-sub); padding:30px; font-size:13px;">لا توجد لديك طلبات سابقة حتى الآن 📦</div>`;
    return;
  }

  myOrders.forEach(ord => {
    const div = document.createElement('div');
    div.className = 'order-card';
    div.innerHTML = `
      <div class="order-top">
        <span class="order-id">#${ord.id}</span>
        <span class="order-status ${ord.status.includes('مكتمل') ? 'status-completed' : 'status-pending'}">${ord.status}</span>
      </div>
      <div style="font-size:13px; font-weight:700;">${ord.title}</div>
      <div style="font-size:11px; color:var(--text-sub);">الكمية: ${ord.qty} | السعر: $${parseFloat(ord.price).toFixed(4)}</div>
    `;
    container.appendChild(div);
  });
}

/* 📱 شحن آسيا سيل */
function submitAsiaCard() {
  const cardInput = document.getElementById('asiaCardInput');
  if (!cardInput) return;
  const card = cardInput.value.trim();
  
  if (!card) {
    alert("يرجى إدخال رقم كارت آسيا سيل أولاً!");
    return;
  }

  const phone = prompt("يرجى إدخال رقم هاتفك لتأكيد الشحن وتفعيل الرصيد:");
  if (!phone) {
    alert("❌ يلزم إدخال رقم الهاتف لإكمال الطلب!");
    return;
  }

  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    const userId = user.id;
    const username = user.username ? `@${user.username}` : "بدون يوزر";
    const firstName = user.first_name || "مستخدم";

    const textData = `طلب_شحن_آسيا | الاسم: ${firstName} | المعرف: ${username} | الهاتف: ${phone} | الآيدي: ${userId} | الكارت: ${card}`;
    
    cardInput.value = '';
    tg.close();
    window.location.href = `https://t.me/RoyalSocial_bot?start=${encodeURIComponent(textData)}`;
  } else {
    alert("يرجى فتح التطبيق من داخل التليجرام!");
  }
}

/* 🏦 شحن الرافدين */
function submitTransferNotice() {
  const recInput = document.getElementById('transferReceiptInput');
  if (!recInput) return;
  const rec = recInput.value.trim();

  if (!rec) {
    alert("يرجى إدخال رقم الوصل أو اسم المحول!");
    return;
  }

  const phone = prompt("يرجى إدخال رقم هاتفك للتواصل وتأكيد الشحن:");
  if (!phone) {
    alert("❌ يلزم إدخال رقم الهاتف لإكمال الطلب!");
    return;
  }

  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    const userId = user.id;
    const username = user.username ? `@${user.username}` : "بدون يوزر";
    const firstName = user.first_name || "مستخدم";

    const textData = `طلب_شحن_الرافدين | الاسم: ${firstName} | المعرف: ${username} | الهاتف: ${phone} | الآيدي: ${userId} | الوصل: ${rec}`;

    recInput.value = '';
    tg.close();
    window.location.href = `https://t.me/RoyalSocial_bot?start=${encodeURIComponent(textData)}`;
  } else {
    alert("يرجى فتح التطبيق من داخل التليجرام!");
  }
}

updateStatsDisplay();
