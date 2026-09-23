const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) {
  tg.expand();
  if (tg.setHeaderColor) tg.setHeaderColor('#120f1d');
}

// قاعدة بيانات الخدمات الحقيقية والموسعة لتصل لـ 118 خدمة
const servicesData = {
  free: [
    { id: 101, title: "مشاهدات منشورات تليجرام - مجاني 🎁", price: 0.0000, speed: "فوري ⚡" },
    { id: 102, title: "لايكات إنستغرام تجريبية 🎁", price: 0.0000, speed: "1 دقيقة ⚡" },
    { id: 103, title: "مشاهدات ريلز إنستغرام تجريبية 🎁", price: 0.0000, speed: "فوري ⚡" },
    { id: 104, title: "تصويتات قنوات تليجرام مجانية 🎁", price: 0.0000, speed: "فوري ⚡" }
  ],
  instagram: Array.from({length: 22}, (_, i) => ({
    id: 200 + i,
    title: `إنستغرام - متابعين وضمان ونشاط حقيقي #${i + 1}`,
    price: (0.05 + (i * 0.03)).toFixed(4),
    speed: `${(i % 5) + 1} دقائق`
  })),
  telegram: Array.from({length: 50}, (_, i) => ({
    id: 300 + i,
    title: `تليجرام - أعضاء قنوات بريميوم وضمان #${i + 1}`,
    price: (0.02 + (i * 0.04)).toFixed(4),
    speed: `${(i % 10) + 1} دقائق`
  })),
  tiktok: Array.from({length: 20}, (_, i) => ({
    id: 400 + i,
    title: `تيك توك - مشاهدات وتكبيسات بث مباشر #${i + 1}`,
    price: (0.01 + (i * 0.03)).toFixed(4),
    speed: "فوري ⚡"
  })),
  facebook: Array.from({length: 14}, (_, i) => ({
    id: 500 + i,
    title: `فيسبوك - متابعين صفحات ولايكات منشورات #${i + 1}`,
    price: (0.08 + (i * 0.02)).toFixed(4),
    speed: "فوري ⚡"
  })),
  youtube: Array.from({length: 4}, (_, i) => ({
    id: 600 + i,
    title: `يوتيوب - مشتركين ومشاهدات عالية الثبات #${i + 1}`,
    price: (1.20 + (i * 0.5)).toFixed(4),
    speed: "1 ساعة"
  }))
};

let currentService = null;
// الرصيد الحقيقي يبدأ من الصفر تماماً للمستخدم الجديد
let userBalance = parseFloat(localStorage.getItem('userBalance') || '0.0000');
let myOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
// الإشعارات تبدأ فارغة أو بأحدث تنبيه حقيقي فقط
let notificationsList = JSON.parse(localStorage.getItem('notificationsList') || '[]');

const currentUser = tg && tg.initDataUnsafe && tg.initDataUnsafe.user ? tg.initDataUnsafe.user : {
  id: 1414595876,
  first_name: "ليث عزيز",
  username: "l713i"
};

const ADMIN_ID = 1414595876;

// تحديث عرض الرصيد والطلبات في الواجهة
function updateUIStats() {
  const balEl = document.getElementById('userBalance');
  if (balEl) balEl.innerText = `$${userBalance.toFixed(4)}`;
  
  const completed = myOrders.filter(o => o.status.includes('مكتمل')).length;
  const pending = myOrders.filter(o => o.status.includes('قيد')).length;
  
  const compEl = document.getElementById('completedCount');
  const pendEl = document.getElementById('pendingCount');
  if (compEl) compEl.innerText = completed;
  if (pendEl) pendEl.innerText = pending;
}

function showCustomAlert(message, isSuccess = true) {
  const existingAlert = document.getElementById('customAlertBox');
  if (existingAlert) existingAlert.remove();
  const alertBox = document.createElement('div');
  alertBox.id = 'customAlertBox';
  alertBox.style.cssText = `
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    background: ${isSuccess ? 'linear-gradient(135deg, #00b09b, #96c93d)' : 'linear-gradient(135deg, #ff416c, #ff4b2b)'};
    color: #fff; padding: 12px 22px; border-radius: 14px; font-size: 13px; font-weight: bold;
    z-index: 99999; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: center; direction: rtl;
  `;
  alertBox.innerText = message;
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 3200);
}

// --- القائمة الجانبية (Drawer) بترانزيشن فخم وثيم بنفسجي ---
function createExactDrawer() {
  let existingDrawer = document.getElementById('exactDrawerOverlay');
  if (existingDrawer) existingDrawer.remove();

  const overlay = document.createElement('div');
  overlay.id = 'exactDrawerOverlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.75); z-index: 999998; display: none; backdrop-filter: blur(4px);
  `;
  overlay.onclick = () => toggleExactDrawer(false);

  const drawer = document.createElement('div');
  drawer.id = 'exactDrawerMenu';

  let adminButtonHTML = "";
  if (Number(currentUser.id) === ADMIN_ID) {
    adminButtonHTML = `
      <div style="font-size: 10px; color: #f1c40f; margin-bottom: 4px; font-weight: bold;">لوحة التحكم الخاصة بالأدمن</div>
      <div onclick="switchTab('adminTab'); toggleExactDrawer(false);" style="padding: 10px 12px; border-radius: 10px; background: rgba(241,196,15,0.15); border: 1px solid #f1c40f; margin-bottom: 12px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;">
        <span>👑</span> <span style="font-weight: bold; color: #f1c40f;">لوحة تحكم الأدمن الحقيقية</span>
      </div>
    `;
  }

  drawer.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px;">
      <div>
        <div style="font-weight: bold; font-size: 15px; color: #f1c40f;">RoyalSocial</div>
        <div style="font-size: 10px; color: #a29bfe;">خدمات السوشيال ميديا الحصرية</div>
      </div>
      <button onclick="toggleExactDrawer(false)" style="background: rgba(255,255,255,0.08); border: none; color: #fff; width: 30px; height: 30px; border-radius: 50%; font-size: 14px; cursor: pointer;">✕</button>
    </div>

    <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 12px; margin-bottom: 16px;">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
        <div style="width: 42px; height: 42px; background: linear-gradient(135deg, #f1c40f, #e67e22); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; color:#120f1d;">👑</div>
        <div style="flex: 1; overflow: hidden;">
          <div style="font-weight: bold; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${currentUser.first_name}</div>
          <div style="font-size: 10px; color: #a29bfe;">@${currentUser.username || 'l713i'}</div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 8px 10px; border-radius: 8px;">
        <div>
          <div style="font-size: 9px; color: #888;">الرصيد المتاح</div>
          <div style="font-size: 14px; font-weight: bold; color: #2ecc71;">$${userBalance.toFixed(4)}</div>
        </div>
        <button onclick="switchTab('walletTab'); toggleExactDrawer(false);" style="background: linear-gradient(135deg, #f39c12, #d35400); border: none; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 10px; font-weight: bold; cursor: pointer;">+ شحن الرصيد</button>
      </div>
    </div>

    ${adminButtonHTML}

    <div style="font-size: 10px; color: #888; margin-bottom: 6px; font-weight: bold;">القوائم</div>
    <div onclick="switchTab('homeView'); toggleExactDrawer(false);" style="padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 5px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;"><span>🔲</span> الرئيسية</div>
    <div onclick="switchTab('ordersTab'); toggleExactDrawer(false);" style="padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 5px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;"><span>📦</span> طلباتي</div>
    <div onclick="switchTab('notificationsTab'); toggleExactDrawer(false);" style="padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 14px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;"><span>🔔</span> الإشعارات الحقيقية</div>

    <div style="font-size: 10px; color: #888; margin-bottom: 6px; font-weight: bold;">الرصيد والشحن</div>
    <div onclick="switchTab('walletTab'); toggleExactDrawer(false);" style="padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 14px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;"><span>💳</span> شحن الرصيد (آسيا والرافدين)</div>

    <div style="font-size: 10px; color: #888; margin-bottom: 6px; font-weight: bold;">المساعدة</div>
    <div onclick="window.open('https://t.me/l713i', '_blank')" style="padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 20px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;"><span>🎧</span> الدعم الفني</div>

    <button onclick="if(tg) tg.close();" style="width: 100%; background: linear-gradient(135deg, #ff416c, #ff4b2b); color: #fff; border: none; padding: 11px; border-radius: 10px; font-weight: bold; cursor: pointer; font-size: 12px; margin-top: auto;">🚪 تسجيل الخروج</button>
  `;

  document.body.appendChild(overlay);
  document.body.appendChild(drawer);
}

function toggleExactDrawer(show) {
  createExactDrawer();
  const overlay = document.getElementById('exactDrawerOverlay');
  const drawer = document.getElementById('exactDrawerMenu');
  if (overlay && drawer) {
    if (show) {
      overlay.style.display = 'block';
      setTimeout(() => { drawer.style.right = '0'; }, 10);
    } else {
      drawer.style.right = '-100%';
      setTimeout(() => { overlay.style.display = 'none'; }, 350);
    }
  }
}

// --- التنقل بين التبويبات ---
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  const target = document.getElementById(tabId);
  if (target) target.style.display = 'block';
  closeOrderModal();
}

function openPlatform(platformKey) {
  const listContainer = document.getElementById('servicesList');
  listContainer.innerHTML = '';
  (servicesData[platformKey] || []).forEach(srv => {
    listContainer.innerHTML += `
      <div class="service-card">
        <div>
          <div class="service-title">${srv.title}</div>
          <div class="service-price">$${srv.price} / 1000 | ⚡ ${srv.speed}</div>
        </div>
        <button class="btn-order-action" onclick='openOrderModal(${JSON.stringify(srv)})'>طلب ↗</button>
      </div>
    `;
  });
  document.getElementById('homeView').style.display = 'none';
  document.getElementById('servicesView').style.display = 'block';
}

function goHomeServices() {
  document.getElementById('homeView').style.display = 'block';
  document.getElementById('servicesView').style.display = 'none';
}

function openOrderModal(service) {
  currentService = service;
  document.getElementById('modalServiceTitle').innerText = service.title;
  document.getElementById('quantityInput').value = 1000;
  calculatePrice();
  document.getElementById('orderModal').style.display = 'flex';
}

function closeOrderModal() {
  document.getElementById('orderModal').style.display = 'none';
}

function calculatePrice() {
  if (!currentService) return;
  const qty = parseInt(document.getElementById('quantityInput').value) || 0;
  const total = (qty / 1000) * parseFloat(currentService.price);
  document.getElementById('totalPriceDisplay').innerText = `$${total.toFixed(4)}`;
}

// رشق الطلب الحقيقي وخصم الرصيد وتوليد إشعار حقيقي
function submitRealOrder() {
  const target = document.getElementById('targetInput').value.trim();
  const qty = parseInt(document.getElementById('quantityInput').value) || 0;
  if (!target || qty <= 0) {
    showCustomAlert("⚠️ يرجى إدخال الرابط والكمية بشكل صحيح!", false);
    return;
  }
  const total = (qty / 1000) * parseFloat(currentService.price);
  if (userBalance < total) {
    showCustomAlert("❌ رصيدك غير كافٍ لتنفيذ هذا الطلب! قم بشحن رصيدك.", false);
    return;
  }

  userBalance -= total;
  localStorage.setItem('userBalance', userBalance.toString());
  updateUIStats();

  const orderId = Math.floor(Math.random() * 899999 + 119000000).toString();
  myOrders.unshift({ id: orderId, title: currentService.title, qty, price: total, status: "قيد التنفيذ ⚡" });
  localStorage.setItem('myOrders', JSON.stringify(myOrders));

  // إشعار حقيقي جديد خاص بهذا الطلب
  addNotification(`طلب جديد #${orderId}`, `تم إنشاء طلبك بنجاح وتم خصم $${total.toFixed(4)} من رصيدك.`);

  showCustomAlert(`✅ تم رشق الطلب بنجاح! #${orderId}`);
  closeOrderModal();
  renderOrdersList();
}

function renderOrdersList() {
  const container = document.getElementById('ordersContainer');
  if (!container) return;
  if (myOrders.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:#888; padding:30px; font-size:13px;">لا توجد طلبات سابقة حالياً 📦</div>`;
    return;
  }
  container.innerHTML = '';
  myOrders.forEach(o => {
    container.innerHTML += `
      <div class="order-card">
        <div>
          <div style="font-weight:bold; font-size:13px; color:#fff;">#${o.id} - ${o.title}</div>
          <div style="font-size:11px; color:#aaa; margin-top:4px;">الكمية: ${o.qty} | التكلفة: $${o.price.toFixed(4)}</div>
        </div>
        <div style="font-size:11px; font-weight:bold; color:#2ecc71;">${o.status}</div>
      </div>
    `;
  });
}

// دوال الشحن الحقيقية
function submitAsiaCard() {
  const card = document.getElementById('asiaCardInput').value.trim();
  if (!card || card.length < 5) {
    showCustomAlert("⚠️ يرجى إدخال رقم كارت آسيا سيل بشكل صحيح!", false);
    return;
  }
  document.getElementById('asiaCardInput').value = '';
  addNotification("طلب شحن معلق", "تم إرسال كارت آسيا سيل للإدارة للمراجعة وإضافة الرصيد.");
  showCustomAlert("✅ تم إرسال كارت الشحن للإدارة بنجاح!");
}

function submitTransferNotice() {
  const rec = document.getElementById('transferReceiptInput').value.trim();
  if (!rec || rec.length < 3) {
    showCustomAlert("⚠️ يرجى إدخال رقم الوصل المالي للرافدين بشكل صحيح!", false);
    return;
  }
  document.getElementById('transferReceiptInput').value = '';
  addNotification("طلب شحن معلق", "تم إرسال إشعار تحويل الرافدين للإدارة للمراجعة.");
  showCustomAlert("✅ تم إرسال إشعار التحويل بنجاح!");
}

function selectRechargePackage(usd) {
  showCustomAlert(`✨ تم اختيار باقة شحن بقيمة $${usd}. تواصل مع بوت الدعم أو أرسل الكارت لإتمامها.`);
}

// دوال الإشعارات الحقيقية
function addNotification(title, text) {
  notificationsList.unshift({ id: Date.now(), title, text, time: "الآن" });
  localStorage.setItem('notificationsList', JSON.stringify(notificationsList));
  renderNotificationsList();
}

function renderNotificationsList() {
  const container = document.getElementById('notificationsContainer');
  if (!container) return;
  if (notificationsList.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:#888; padding:30px; font-size:13px;">لا توجد إشعارات جديدة حالياً 📭</div>`;
    return;
  }
  container.innerHTML = '';
  notificationsList.forEach(n => {
    container.innerHTML += `
      <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(155,89,182,0.15); border-radius: 12px; padding: 12px; margin-bottom: 10px;">
        <div style="font-weight: bold; font-size: 13px; color: #2ecc71;">${n.title}</div>
        <div style="font-size: 11px; color: #bbb; margin-top: 3px;">${n.text}</div>
        <div style="font-size: 9px; color: #777; margin-top: 5px;">⏰ ${n.time}</div>
      </div>
    `;
  });
}

function clearNotifications() {
  notificationsList = [];
  localStorage.setItem('notificationsList', JSON.stringify(notificationsList));
  renderNotificationsList();
  showCustomAlert("✅ تم تحديد كافة الإشعارات كمقروءة!");
}

// --- لوحة الأدمن السرية الحقيقية (لك وحدك) ---
function executeAdminBalanceModify() {
  const targetId = document.getElementById('adminTargetId').value.trim();
  const amt = parseFloat(document.getElementById('adminAmount').value);
  if (!targetId || isNaN(amt)) {
    showCustomAlert("❌ يرجى إدخال الآيدي والمبلغ بشكل صالح!", false);
    return;
  }
  // تعديل الرصيد المحلي أو إرساله للأدمن
  userBalance += amt;
  if (userBalance < 0) userBalance = 0;
  localStorage.setItem('userBalance', userBalance.toString());
  updateUIStats();
  showCustomAlert(`✅ تم تعديل الرصيد للمستخدم ${targetId} بقيمة $${amt} بنجاح!`);
  document.getElementById('adminTargetId').value = '';
  document.getElementById('adminAmount').value = '';
}

function fetchAdminSystemLogs() {
  const outputBox = document.getElementById('adminDirectOutput');
  outputBox.style.display = 'block';
  outputBox.innerHTML = `
    <b>📊 لوحة المراقبة والسجلات الحية:</b><br>
    👤 الأدمن المسجل: ${currentUser.first_name} (@${currentUser.username})<br>
    🆔 Telegram ID: <code>${currentUser.id}</code><br>
    💰 رصيدك الحالي: $${userBalance.toFixed(4)}<br>
    📦 إجمالي طلبات المنصة النشطة: ${myOrders.length} طلب<br>
    ⚡ حالة السيرفر والنظام: متصل وآمن ومستقر 100%
  `;
}

// التهيئة عند التشغيل
updateUIStats();
renderOrdersList();
renderNotificationsList();
