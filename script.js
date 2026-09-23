const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) {
  tg.expand();
  if (tg.setHeaderColor) tg.setHeaderColor('#120f1d');
}

const servicesData = {
  free: [
    { id: 101, title: "مشاهدات منشورات تليجرام - مجاني 🎁", price: 0.0000, speed: "فوري ⚡" },
    { id: 102, title: "لايكات إنستغرام تجريبية 🎁", price: 0.0000, speed: "1 دقيقة ⚡" }
  ],
  instagram: Array.from({length: 10}, (_, i) => ({
    id: 200 + i,
    title: `إنستغرام - متابعين حقيقيين وضمان #${i + 1}`,
    price: (0.05 + (i * 0.02)).toFixed(4),
    speed: `${i + 1} دقائق`
  })),
  telegram: Array.from({length: 10}, (_, i) => ({
    id: 300 + i,
    title: `تليجرام - أعضاء قنوات بريميوم #${i + 1}`,
    price: (0.02 + (i * 0.03)).toFixed(4),
    speed: `${i + 2} دقائق`
  })),
  tiktok: Array.from({length: 10}, (_, i) => ({
    id: 400 + i,
    title: `تيك توك - مشاهدات وتكبيسات #${i + 1}`,
    price: (0.01 + (i * 0.02)).toFixed(4),
    speed: "فوري ⚡"
  }))
};

let currentService = null;
let userBalance = parseFloat(localStorage.getItem('userBalance') || '0.0000');
let myOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
let notificationsList = JSON.parse(localStorage.getItem('notificationsList') || '[]');
let systemLogs = JSON.parse(localStorage.getItem('systemLogs') || '[]');

let subscribersDatabase = JSON.parse(localStorage.getItem('subscribersDatabase') || JSON.stringify([
  { id: 1414595876, name: "ليث عزيز", username: "l713i", balance: userBalance },
  { id: 1029384756, name: "أحمد علي", username: "ahmed_99", balance: 1.5000 },
  { id: 9876543210, name: "محمد جاسم", username: "mohammed_fx", balance: 10.0000 }
]));

const currentUser = tg && tg.initDataUnsafe && tg.initDataUnsafe.user ? tg.initDataUnsafe.user : {
  id: 1414595876,
  first_name: "ليث عزيز",
  username: "l713i"
};

const ADMIN_ID = 1414595876;

// التحقق من الأدمن وإظهار لوحته فوراً في الصفحة الرئيسية
function checkAdminAccess() {
  if (Number(currentUser.id) === ADMIN_ID) {
    const adminDash = document.getElementById('adminMainDashboard');
    if (adminDash) adminDash.style.display = 'block';
  }
}

function logSystemEvent(action, desc) {
  const timestamp = new Date().toLocaleString('ar-IQ');
  systemLogs.unshift({ timestamp, action, desc });
  localStorage.setItem('systemLogs', JSON.stringify(systemLogs));
}

function updateUIStats() {
  const balEl = document.getElementById('userBalance');
  if (balEl) balEl.innerText = `$${userBalance.toFixed(4)}`;
  const compEl = document.getElementById('completedCount');
  const pendEl = document.getElementById('pendingCount');
  if (compEl) compEl.innerText = myOrders.filter(o => o.status.includes('مكتمل')).length;
  if (pendEl) pendEl.innerText = myOrders.filter(o => o.status.includes('قيد')).length;
}

function showCustomAlert(message, isSuccess = true) {
  const existingAlert = document.getElementById('customAlertBox');
  if (existingAlert) existingAlert.remove();
  const alertBox = document.createElement('div');
  alertBox.id = 'customAlertBox';
  alertBox.style.cssText = `
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    background: ${isSuccess ? '#27ae60' : '#c0392b'}; color: #fff; padding: 12px 20px;
    border-radius: 12px; font-size: 12px; font-weight: bold; z-index: 99999; text-align: center; direction: rtl;
  `;
  alertBox.innerText = message;
  document.body.appendChild(alertBox);
  setTimeout(() => alertBox.remove(), 3000);
}

// القائمة الجانبية (Drawer) النظيفة بدون تكرار
function createExactDrawer() {
  let existingOverlay = document.getElementById('exactDrawerOverlay');
  if (existingOverlay) existingOverlay.remove();

  const overlay = document.createElement('div');
  overlay.id = 'exactDrawerOverlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.75); z-index: 999998; display: none; backdrop-filter: blur(4px);
  `;
  overlay.onclick = () => toggleExactDrawer(false);

  const drawer = document.createElement('div');
  drawer.id = 'exactDrawerMenu';
  drawer.style.cssText = `
    position: fixed; top: 0; right: -100%; width: 85%; max-width: 330px; height: 100%;
    background: linear-gradient(135deg, #171424, #211936); z-index: 999999;
    box-shadow: -15px 0 50px rgba(0,0,0,0.9); transition: right 0.3s ease;
    display: flex; flex-direction: column; direction: rtl; text-align: right; color: #fff; padding: 20px; box-sizing: border-box; overflow-y: auto;
  `;

  drawer.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">
      <div>
        <div style="font-weight: bold; font-size: 14px; color: var(--gold);">RoyalSocial</div>
        <div style="font-size: 10px; color: #a29bfe;">نظام الخدمات والتحكم المتقدم</div>
      </div>
      <button onclick="toggleExactDrawer(false)" style="background: rgba(255,255,255,0.08); border: none; color: #fff; width: 28px; height: 28px; border-radius: 50%; font-size: 14px; cursor: pointer;">✕</button>
    </div>

    <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 12px; margin-bottom: 14px;">
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
        <div style="width: 40px; height: 40px; background: var(--gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; color:#120f1d;">👑</div>
        <div style="flex: 1; overflow: hidden;">
          <div style="font-weight: bold; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${currentUser.first_name}</div>
          <div style="font-size: 10px; color: #a29bfe;">@${currentUser.username || 'l713i'}</div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 8px 10px; border-radius: 8px;">
        <div>
          <div style="font-size: 9px; color: #888;">الرصيد المتاح</div>
          <div style="font-size: 13px; font-weight: bold; color: #2ecc71;">$${userBalance.toFixed(4)}</div>
        </div>
        <button onclick="switchTab('walletTab'); toggleExactDrawer(false);" style="background: var(--gold); border: none; color: #120f1d; padding: 5px 10px; border-radius: 6px; font-size: 10px; font-weight: bold; cursor: pointer;">+ شحن</button>
      </div>
    </div>

    <div style="font-size: 10px; color: #888; margin-bottom: 4px; font-weight: bold;">القوائم</div>
    <div onclick="switchTab('homeView'); toggleExactDrawer(false);" style="padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 4px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;"><span>🔲</span> الرئيسية</div>
    <div onclick="switchTab('ordersTab'); toggleExactDrawer(false);" style="padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 4px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;"><span>📦</span> طلباتي</div>
    <div onclick="switchTab('notificationsTab'); toggleExactDrawer(false);" style="padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 12px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;"><span>🔔</span> الإشعارات</div>
    <div onclick="switchTab('walletTab'); toggleExactDrawer(false);" style="padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 12px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;"><span>💳</span> شحن الرصيد</div>

    <button onclick="if(tg) tg.close();" style="width: 100%; background: linear-gradient(135deg, #ff416c, #ff4b2b); color: #fff; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 12px; margin-top: auto;">🚪 تسجيل الخروج</button>
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
      setTimeout(() => { overlay.style.display = 'none'; }, 300);
    }
  }
}

// دالة البحث الفوري عن المشترك بالاسم أو الآيدي
function searchSubscriberByName() {
  const query = document.getElementById('searchUserInput').value.trim().toLowerCase();
  const resultBox = document.getElementById('searchUserResult');
  
  if (!query) {
    resultBox.style.display = 'none';
    return;
  }

  const found = subscribersDatabase.filter(sub => 
    sub.name.toLowerCase().includes(query) || 
    sub.username.toLowerCase().includes(query) || 
    sub.id.toString().includes(query)
  );

  resultBox.style.display = 'block';
  if (found.length === 0) {
    resultBox.innerHTML = "❌ لم يتم العثور على أي مشترك بهذا الاسم أو الآيدي.";
  } else {
    let html = `<b>🔍 نتائج البحث (${found.length}):</b><br>`;
    found.forEach(sub => {
      html += `• <b>${sub.name}</b> (@${sub.username}) | ID: <code>${sub.id}</code> | الرصيد: <b style="color:#2ecc71;">$${sub.balance.toFixed(4)}</b><br>`;
    });
    resultBox.innerHTML = html;
  }
}

// تعديل رصيد المشتركين
function executeAdminBalanceModify() {
  const targetId = parseInt(document.getElementById('adminTargetId').value.trim());
  const amt = parseFloat(document.getElementById('adminAmount').value);
  if (!targetId || isNaN(amt)) {
    showCustomAlert("❌ يرجى إدخال الآيدي والمبلغ بشكل صالح!", false);
    return;
  }

  const sub = subscribersDatabase.find(s => s.id === targetId);
  if (sub) {
    sub.balance += amt;
    if (sub.balance < 0) sub.balance = 0;
  }

  if (targetId === currentUser.id) {
    userBalance += amt;
    if (userBalance < 0) userBalance = 0;
    localStorage.setItem('userBalance', userBalance.toString());
    updateUIStats();
  }

  localStorage.setItem('subscribersDatabase', JSON.stringify(subscribersDatabase));
  logSystemEvent("تعديل رصيد مشترك", `تم تعديل رصيد المشترك ID: ${targetId} بقيمة $${amt}`);
  showCustomAlert(`✅ تم تعديل الرصيد بنجاح!`);
  document.getElementById('adminTargetId').value = '';
  document.getElementById('adminAmount').value = '';
}

function fetchAdminSystemLogs() {
  const outputBox = document.getElementById('adminDirectOutput');
  outputBox.style.display = 'block';
  let html = `<b>📊 سجل الأحداث والنشاطات الحية:</b><br><hr style="border-color:#444;">`;
  if (systemLogs.length === 0) {
    html += `لا توجد أحداث مسجلة حتى الآن.<br>`;
  } else {
    systemLogs.forEach(log => {
      html += `• [${log.timestamp}] <b>${log.action}</b>: ${log.desc}<br>`;
    });
  }
  outputBox.innerHTML = html;
}

// التنقل والطلبات
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

function closeOrderModal() { document.getElementById('orderModal').style.display = 'none'; }

function calculatePrice() {
  if (!currentService) return;
  const qty = parseInt(document.getElementById('quantityInput').value) || 0;
  const total = (qty / 1000) * parseFloat(currentService.price);
  document.getElementById('totalPriceDisplay').innerText = `$${total.toFixed(4)}`;
}

function submitRealOrder() {
  const target = document.getElementById('targetInput').value.trim();
  const qty = parseInt(document.getElementById('quantityInput').value) || 0;
  if (!target || qty <= 0) { showCustomAlert("⚠️ يرجى إدخال الرابط والكمية بشكل صحيح!", false); return; }
  const total = (qty / 1000) * parseFloat(currentService.price);
  if (userBalance < total) { showCustomAlert("❌ رصيدك غير كافٍ!", false); return; }

  userBalance -= total;
  localStorage.setItem('userBalance', userBalance.toString());
  updateUIStats();

  const orderId = Math.floor(Math.random() * 899999 + 119000000).toString();
  myOrders.unshift({ id: orderId, title: currentService.title, qty, price: total, status: "قيد التنفيذ ⚡" });
  localStorage.setItem('myOrders', JSON.stringify(myOrders));

  logSystemEvent("طلب رشق جديد", `تم تنفيذ طلب #${orderId} بقيمة $${total.toFixed(4)}`);
  showCustomAlert(`✅ تم رشق الطلب بنجاح! #${orderId}`);
  closeOrderModal();
}

function submitAsiaCard() {
  const card = document.getElementById('asiaCardInput').value.trim();
  if (!card) { showCustomAlert("⚠️ أدخل رقم الكارت أو الوصل!", false); return; }
  logSystemEvent("طلب شحن", `تم إرسال كارت أو وصل شحن جديد للمراجعة`);
  showCustomAlert("✅ تم إرسال طلب الشحن للإدارة بنجاح!");
}

checkAdminAccess();
updateUIStats();
