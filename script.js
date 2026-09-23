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

const currentUser = tg && tg.initDataUnsafe && tg.initDataUnsafe.user ? tg.initDataUnsafe.user : {
  id: "8816331690",
  first_name: "Layth Aziz",
  username: "l713i"
};

// تعبئة البيانات في الواجهة
if (currentUser) {
  const userNameEl = document.getElementById('userName');
  if (userNameEl) {
    userNameEl.innerText = currentUser.first_name || "مستخدم";
  }
}

function showCustomAlert(message, isSuccess = true) {
  const existingAlert = document.getElementById('customAlertBox');
  if (existingAlert) existingAlert.remove();

  const alertBox = document.createElement('div');
  alertBox.id = 'customAlertBox';
  alertBox.style.cssText = `
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    background: ${isSuccess ? 'linear-gradient(135deg, #00b09b, #96c93d)' : 'linear-gradient(135deg, #ff416c, #ff4b2b)'};
    color: #fff; padding: 14px 20px; border-radius: 14px; font-size: 13px; font-weight: bold;
    z-index: 99999; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: center; width: 90%; max-width: 350px;
  `;
  alertBox.innerText = message;
  document.body.appendChild(alertBox);

  setTimeout(() => {
    if (alertBox) alertBox.remove();
  }, 3500);
}

// --- لوحة الأدمن الخاصة بك (تظهر لك وحدك) ---
const ADMIN_ID = 1414595876;
if (currentUser && Number(currentUser.id) === ADMIN_ID) {
  const adminPanelContainer = document.createElement('div');
  adminPanelContainer.innerHTML = `
    <div style="background: linear-gradient(135deg, #1f1c2c, #393154); border: 2px solid #ff416c; border-radius: 16px; padding: 15px; margin: 15px 0; color: #fff; box-shadow: 0 8px 25px rgba(255,65,108,0.3);">
      <div style="font-weight: bold; font-size: 15px; margin-bottom: 12px; color: #ff758c;">🛠 لوحة تحكم الأدمن الشاملة</div>
      <div style="margin-bottom: 8px;">
        <input type="number" id="adminTargetId" placeholder="آيدي الزبون (مثال: 8816331690)" style="width: 100%; padding: 8px; border-radius: 6px; border: none; background: rgba(255,255,255,0.1); color: #fff; margin-bottom: 6px; font-size: 12px;">
        <input type="number" id="adminAmount" placeholder="المبلغ ($) (مثال: 5 أو -5 للخصم)" step="0.01" style="width: 100%; padding: 8px; border-radius: 6px; border: none; background: rgba(255,255,255,0.1); color: #fff; margin-bottom: 8px; font-size: 12px;">
        <button onclick="executeAdminBalanceAction()" style="width: 100%; background: #00b09b; color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 12px;">➕ إضافة أو خصم الرصيد فوراً</button>
      </div>
      <div style="display: flex; gap: 8px; margin-top: 8px;">
        <button onclick="requestUsersList()" style="flex: 1; background: #3498db; color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 11px;">👥 المشتركين</button>
        <button onclick="requestUserLogs()" style="flex: 1; background: #9b59b6; color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 11px;">📋 سجل حركات زبون</button>
      </div>
    </div>
  `;
  const homeView = document.getElementById('homeView');
  if (homeView) homeView.insertBefore(adminPanelContainer, homeView.firstChild);
}

function executeAdminBalanceAction() {
  const targetIdInput = document.getElementById('adminTargetId');
  const amountInput = document.getElementById('adminAmount');
  if (!targetIdInput || !amountInput) return;
  const targetId = targetIdInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (!targetId || isNaN(amount)) {
    showCustomAlert("❌ يرجى إدخال آيدي صحيح ومبلغ صالح!", false);
    return;
  }

  if (tg) {
    tg.sendData(JSON.stringify({ action: "admin_manage_balance", target_id: targetId, amount: amount }));
    showCustomAlert(`✅ تم إرسال أمر تعديل الرصيد للآيدي ${targetId} بنجاح!`);
    targetIdInput.value = '';
    amountInput.value = '';
  }
}

function requestUsersList() {
  if (tg) {
    tg.sendData(JSON.stringify({ action: "admin_get_users_list" }));
    showCustomAlert("📤 جاري طلب قائمة المشتركين...");
  }
}

function requestUserLogs() {
  const targetId = prompt("أدخل آيدي الزبون لعرض سجل حركاته:");
  if (!targetId) return;
  if (tg) {
    tg.sendData(JSON.stringify({ action: "admin_get_user_logs", target_id: targetId }));
    showCustomAlert(`📤 جاري جلب سجل حركات الزبون...`);
  }
}

// --- إنشاء صفحة الملف الشخصي (Profile) للزبون ---
function buildProfileTab() {
  let profileTab = document.getElementById('profileTab');
  if (!profileTab) {
    profileTab = document.createElement('div');
    profileTab.id = 'profileTab';
    profileTab.className = 'tab-content';
    profileTab.style.display = 'none';
    profileTab.innerHTML = `
      <div style="background: rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; margin-top: 15px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #f1c40f, #e67e22); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 28px;">👑</div>
          <h3 id="profName" style="margin: 0; color: #fff;">${currentUser.first_name || 'مستخدم'}</h3>
          <p style="color: #aaa; font-size: 12px; margin: 4px 0 0;">حساب فعّال داخل التطبيق</p>
        </div>
        
        <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 11px; color: #aaa;">الرصيد الحالي:</div>
            <div id="profBalance" style="font-size: 16px; font-weight: bold; color: #2ecc71;">$0.0000</div>
          </div>
          <button onclick="switchTab('walletTab')" style="background: #9b59b6; border: none; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;">شحن الرصيد</button>
        </div>

        <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 11px; color: #aaa;">يوزر التليجرام:</div>
            <div style="font-size: 13px; color: #fff; font-weight: bold;">@${currentUser.username || 'بدون_يوزر'}</div>
          </div>
          <button onclick="copyText('@${currentUser.username || 'بدون_يوزر'}')" style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 6px 10px; border-radius: 6px; font-size: 11px; cursor: pointer;">نسخ</button>
        </div>

        <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 11px; color: #aaa;">آيدي الحساب (ID):</div>
            <div id="profId" style="font-size: 13px; color: #fff; font-weight: bold;">${currentUser.id}</div>
          </div>
          <button onclick="copyText('${currentUser.id}')" style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 6px 10px; border-radius: 6px; font-size: 11px; cursor: pointer;">نسخ</button>
        </div>
      </div>
    `;
    document.body.appendChild(profileTab); // أو أضفه بجانب الـ homeView حسب تصميمك
  }
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showCustomAlert("✅ تم النسخ إلى الحافظة بنجاح!");
  }).catch(() => {
    showCustomAlert("❌ فشل النسخ!", false);
  });
}

buildProfileTab();

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
    showCustomAlert('يرجى إدخال الرابط أو اسم المستخدم بشكل صحيح!', false);
    return;
  }
  if (userBalance < total) {
    showCustomAlert('❌ رصيدك غير كافٍ لتنفيذ هذا الطلب!', false);
    return;
  }

  userBalance -= total;
  const userBalanceEl = document.getElementById('userBalance');
  if (userBalanceEl) userBalanceEl.innerText = `$${userBalance.toFixed(4)}`;
  
  const newOrderId = Math.floor(Math.random() * 899999 + 119000000).toString();
  myOrders.unshift({ id: newOrderId, title: currentService.title, qty: qty, price: total, status: "قيد التنفيذ ⚡" });
  localStorage.setItem('myOrders', JSON.stringify(myOrders));
  updateStatsDisplay();
  
  if (tg) {
    tg.sendData(JSON.stringify({ action: "log_service_usage", service_title: currentService.title, qty: qty, cost: total, target: target }));
  }
  showCustomAlert(`✅ تم إنشاء الطلب بنجاح! #${newOrderId}`);
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

function submitAsiaCard() {
  const cardInput = document.getElementById('asiaCardInput');
  if (!cardInput) return;
  const card = cardInput.value.trim();
  if (!card) {
    showCustomAlert("يرجى إدخال رقم كارت آسيا سيل أولاً!", false);
    return;
  }
  const phone = prompt("يرجى إدخال رقم هاتفك لتأكيد الشحن وتفعيل الرصيد:");
  if (!phone) {
    showCustomAlert("❌ يلزم إدخال رقم الهاتف لإكمال الطلب!", false);
    return;
  }
  if (currentUser) {
    const textData = `طلب_شحن_آسيا | الاسم: ${currentUser.first_name} | المعرف: @${currentUser.username || 'بدون'} | الهاتف: ${phone} | الآيدي: ${currentUser.id} | الكارت: ${card}`;
    cardInput.value = '';
    tg.close();
    window.location.href = `https://t.me/RoyalSocial_bot?start=${encodeURIComponent(textData)}`;
  }
}

function submitTransferNotice() {
  const recInput = document.getElementById('transferReceiptInput');
  if (!recInput) return;
  const rec = recInput.value.trim();
  if (!rec) {
    showCustomAlert("يرجى إدخال رقم الوصل أو اسم المحول!", false);
    return;
  }
  const phone = prompt("يرجى إدخال رقم هاتفك للتواصل وتأكيد الشحن:");
  if (!phone) {
    showCustomAlert("❌ يلزم إدخال رقم الهاتف لإكمال الطلب!", false);
    return;
  }
  if (currentUser) {
    const textData = `طلب_شحن_الرافدين | الاسم: ${currentUser.first_name} | المعرف: @${currentUser.username || 'بدون'} | الهاتف: ${phone} | الآيدي: ${currentUser.id} | الوصل: ${rec}`;
    recInput.value = '';
    tg.close();
    window.location.href = `https://t.me/RoyalSocial_bot?start=${encodeURIComponent(textData)}`;
  }
}

updateStatsDisplay();
