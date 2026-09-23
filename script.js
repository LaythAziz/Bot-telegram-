// === نظام الـ WebApp الخاص بـ Telegram ===
const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) {
  tg.expand();
  if (tg.setHeaderColor) tg.setHeaderColor('#1f1c2c');
}

// === قاعدة بيانات الخدمات الكاملة ===
const servicesData = {
  free: [
    { id: 101, title: "مشاهدات منشورات تليجرام - مجاني 🎁", price: 0.0000, speed: "فوري ⚡" },
    { id: 102, title: "لايكات إنستغرام تجريبية 🎁", price: 0.0000, speed: "1 دقيقة ⚡" },
    { id: 103, title: "مشاهدات ريلز إنستغرام تجريبية 🎁", price: 0.0000, speed: "فوري ⚡" },
    { id: 104, title: "تصويتات قنوات تليجرام مجانية 🎁", price: 0.0000, speed: "فوري ⚡" }
  ],
  instagram: Array.from({length: 22}, (_, i) => ({
    id: 200 + i,
    title: `إنستغرام - ${['متابعين ضمان 30 يوم', 'إعجابات حقيقية ونشطة', 'مشاهدات ريلز خيالية', 'تفاعلات ستوري VIP', 'تعليقات خليجية وعربية'][i % 5]} #${i + 1}`,
    price: (0.05 + (i * 0.03)).toFixed(4),
    speed: `${(i % 5) + 1} دقائق`
  })),
  tiktok: Array.from({length: 20}, (_, i) => ({
    id: 300 + i,
    title: `تيك توك - ${['مشاهدات فيديوهات سريعة', 'تكبيسات بث مباشر حية', 'إعجابات فيديوهات قوية', 'متابعين حسابات حقيقيين'][i % 4]} #${i + 1}`,
    price: (0.01 + (i * 0.04)).toFixed(4),
    speed: `${(i % 3) + 1} دقائق`
  })),
  telegram: Array.from({length: 50}, (_, i) => ({
    id: 400 + i,
    title: `تليجرام - ${['أعضاء بريميوم مميزين', 'مشاهدات ستوري وقصص', 'تفاعلات إيجابية 👍❤️', 'أعضاء قنوات حقيقيين 100%'][i % 4]} #${i + 1}`,
    price: (0.02 + (i * 0.05)).toFixed(4),
    speed: `${(i % 10) + 1} دقائق`
  })),
  facebook: Array.from({length: 14}, (_, i) => ({
    id: 500 + i,
    title: `فيسبوك - ${['متابعين صفحات وحسابات شخصية', 'لايكات منشورات وصور', 'مشاهدات فيديو فيسبوك'][i % 3]} #${i + 1}`,
    price: (0.08 + (i * 0.02)).toFixed(4),
    speed: "فوري ⚡"
  })),
  funding: [
    { id: 601, title: "تمويل قنوات تليجرام حقيقي ومضمون بالكامل", price: 12.0000, speed: "12 ساعة" },
    { id: 602, title: "تمويل صفحات إنستغرام عربية 100% نشطة", price: 15.0000, speed: "24 ساعة" }
  ],
  youtube: [
    { id: 701, title: "مشتركين يوتيوب ثبات عالي وضمان", price: 4.5000, speed: "1 ساعة" },
    { id: 702, title: "مشاهدات يوتيوب جودة عالية 4k وسريعة", price: 1.2000, speed: "فوري ⚡" }
  ],
  twitter: Array.from({length: 5}, (_, i) => ({
    id: 800 + i,
    title: `تويتر (X) - ${['متابعين حقيقيين نشطين', 'إعادة تغريد Retweet'][i % 2]} #${i + 1}`,
    price: (0.90 + (i * 0.2)).toFixed(4),
    speed: "فوري ⚡"
  })),
  snapchat: Array.from({length: 4}, (_, i) => ({
    id: 900 + i,
    title: `سناب شات - ${['متابعين منصة الأضواء', 'مشاهدات ستوري سناب شات'][i % 2]} #${i + 1}`,
    price: (2.50 + (i * 0.5)).toFixed(4),
    speed: "30 دقيقة"
  })),
  twitch: Array.from({length: 3}, (_, i) => ({
    id: 1000 + i,
    title: `تويتش - ${['متابعين قناة تويتش', 'مشاهدات بث مباشر'][i % 2]} #${i + 1}`,
    price: (0.80 + (i * 0.1)).toFixed(4),
    speed: "فوري ⚡"
  }))
};

let currentService = null;
let userBalance = 0.0000;
let myOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
let userPhone = localStorage.getItem('userPhone') || 'غير مسجل (سيطلب عند أول شحن)';

const currentUser = tg && tg.initDataUnsafe && tg.initDataUnsafe.user ? tg.initDataUnsafe.user : {
  id: "1414595876",
  first_name: "Layth Aziz",
  username: "l713i",
  photo_url: ""
};

const ADMIN_ID = 1414595876; // آيديك الخاص للأدمن

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
    color: #fff; padding: 14px 22px; border-radius: 14px; font-size: 13px; font-weight: bold;
    z-index: 99999; box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: center; width: 90%; max-width: 350px;
    direction: rtl;
  `;
  alertBox.innerText = message;
  document.body.appendChild(alertBox);

  setTimeout(() => {
    if (alertBox) alertBox.remove();
  }, 3500);
}

// --- 1. بناء صفحة البروفايل (عامة لجميع المستخدمين) ---
function buildProfileTab() {
  let profileTab = document.getElementById('profileTab');
  if (!profileTab) {
    profileTab = document.createElement('div');
    profileTab.id = 'profileTab';
    profileTab.className = 'tab-content';
    profileTab.style.display = 'none';

    const avatarHtml = currentUser.photo_url 
      ? `<img src="${currentUser.photo_url}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #f1c40f; margin: 0 auto 10px; display: block;">`
      : `<div style="width: 80px; height: 80px; background: linear-gradient(135deg, #f1c40f, #e67e22); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 34px; border: 2px solid #fff; box-shadow: 0 5px 15px rgba(241,196,15,0.3);">👑</div>`;

    profileTab.innerHTML = `
      <div style="background: linear-gradient(135deg, #1b1828, #2a2438); border-radius: 20px; padding: 20px; margin-top: 15px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 30px rgba(0,0,0,0.5); text-align: right; direction: rtl;">
        <div style="text-align: center; margin-bottom: 20px;">
          ${avatarHtml}
          <h3 style="margin: 0; color: #fff; font-size: 19px;">${currentUser.first_name || 'مستخدم'}</h3>
          <p style="color: #a29bfe; font-size: 11px; margin: 4px 0 0;">✨ حساب موثق وفعّال في النظام</p>
        </div>
        
        <div style="background: rgba(0,0,0,0.4); padding: 14px; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(46,204,113,0.2);">
          <div>
            <div style="font-size: 11px; color: #aaa;">الرصيد المتاح:</div>
            <div id="profileBalance" style="font-size: 18px; font-weight: bold; color: #2ecc71;">$0.0000</div>
          </div>
          <button onclick="switchTab('walletTab')" style="background: linear-gradient(135deg, #9b59b6, #8e44ad); border: none; color: #fff; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">شحن الرصيد</button>
        </div>

        <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 10px; color: #aaa;">الاسم العام في تليجرام:</div>
            <div style="font-size: 13px; color: #fff; font-weight: bold;">${currentUser.first_name || 'مستخدم'}</div>
          </div>
          <button onclick="copyText('${currentUser.first_name || 'مستخدم'}')" style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;">نسخ</button>
        </div>

        <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 10px; color: #aaa;">اسم مستخدم تليجرام (Username):</div>
            <div style="font-size: 13px; color: #fff; font-weight: bold;">@${currentUser.username || 'بدون_يوزر'}</div>
          </div>
          <button onclick="copyText('@${currentUser.username || 'بدون_يوزر'}')" style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;">نسخ</button>
        </div>

        <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 10px; color: #aaa;">آيدي الحساب (ID):</div>
            <div style="font-size: 13px; color: #fff; font-weight: bold;">${currentUser.id}</div>
          </div>
          <button onclick="copyText('${currentUser.id}')" style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;">نسخ</button>
        </div>

        <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 10px; color: #aaa;">رقم الهاتف المسجل:</div>
            <div id="profilePhoneDisplay" style="font-size: 13px; color: #fff; font-weight: bold;">${userPhone}</div>
          </div>
          <button onclick="copyText('${userPhone}')" style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;">نسخ</button>
        </div>
      </div>
    `;
    const appContainer = document.querySelector('.app-container') || document.body;
    appContainer.appendChild(profileTab);
  }
}

// --- 2. بناء لوحة الأدمن الخاصة بك وحدك (بجانب الرئيسية في الشريط السفلي) ---
function buildAdminTab() {
  if (currentUser && Number(currentUser.id) === ADMIN_ID) {
    let adminTab = document.getElementById('adminTab');
    if (!adminTab) {
      adminTab = document.createElement('div');
      adminTab.id = 'adminTab';
      adminTab.className = 'tab-content';
      adminTab.style.display = 'none';
      adminTab.innerHTML = `
        <div style="background: linear-gradient(135deg, #1f1c2c, #393154); border: 2px solid #ff416c; border-radius: 20px; padding: 20px; margin-top: 15px; color: #fff; box-shadow: 0 10px 30px rgba(255,65,108,0.3); direction: rtl; text-align: right;">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 15px; color: #ff758c; text-align: center;">🛠 لوحة تحكم الأدمن الخاصة بك</div>
          
          <div style="margin-bottom: 15px; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 12px;">
            <div style="font-size: 12px; color: #f1c40f; margin-bottom: 8px; font-weight: bold;">💰 تعديل رصيد زبون:</div>
            <input type="number" id="adminTargetId" placeholder="آيدي الزبون..." style="width: 100%; padding: 10px; border-radius: 8px; border: none; background: rgba(255,255,255,0.1); color: #fff; margin-bottom: 8px; font-size: 12px; text-align: right;">
            <input type="number" id="adminAmount" placeholder="المبلغ ($) (مثال: 5 أو -5 للخصم)" step="0.01" style="width: 100%; padding: 10px; border-radius: 8px; border: none; background: rgba(255,255,255,0.1); color: #fff; margin-bottom: 10px; font-size: 12px; text-align: right;">
            <button onclick="executeAdminBalanceAction()" style="width: 100%; background: #00b09b; color: #fff; border: none; padding: 11px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 12px;">➕ تعديل الرصيد فوراً</button>
          </div>

          <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 12px; margin-bottom: 12px;">
            <div style="font-size: 12px; color: #3498db; margin-bottom: 8px; font-weight: bold;">🔍 استعلام سجل حركات زبون:</div>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
              <input type="number" id="logTargetId" placeholder="آيدي الزبون..." style="flex: 1; padding: 10px; border-radius: 8px; border: none; background: rgba(255,255,255,0.1); color: #fff; font-size: 12px; text-align: right;">
              <button onclick="fetchUserLogsInApp()" style="background: #9b59b6; color: #fff; border: none; padding: 10px 14px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 11px;">عرض السجل</button>
            </div>
          </div>

          <button onclick="fetchUsersListInApp()" style="width: 100%; background: #2980b9; color: #fff; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 12px; margin-bottom: 12px;">👥 عرض قائمة المشتركين كاملة</button>

          <div id="adminDirectOutput" style="display: none; background: rgba(0,0,0,0.8); border: 1px solid #ff416c; border-radius: 10px; padding: 12px; max-height: 250px; overflow-y: auto; font-size: 11px; color: #fff; text-align: right; direction: rtl;"></div>
        </div>
      `;
      const appContainer = document.querySelector('.app-container') || document.body;
      appContainer.appendChild(adminTab);
    }
  }
}

// --- 3. ضبط أزرار الشريط السفلي (البروفايل بجانب الإشعارات، والأدمن بجانب الرئيسية) ---
function setupCustomNavbar() {
  const navbar = document.querySelector('.navbar') || document.querySelector('.nav-bar');
  if (!navbar) return;

  // إذا كنت أنت الأدمن، نضيف زر الأدمن في الشريط السفلي بجانب الرئيسية
  if (currentUser && Number(currentUser.id) === ADMIN_ID) {
    if (!document.getElementById('nav-adminTab')) {
      const adminNavBtn = document.createElement('div');
      adminNavBtn.id = 'nav-adminTab';
      adminNavBtn.className = 'nav-item';
      adminNavBtn.innerHTML = `<span>👑</span><span>الأدمن</span>`;
      adminNavBtn.onclick = () => switchTab('adminTab');
      navbar.appendChild(adminNavBtn); // بجانب الرئيسية
    }
  }

  // إضافة أو ضبط زر البروفايل [بجانب الإشعارات] في الشريط السفلي للجميع
  const navItems = navbar.querySelectorAll('.nav-item');
  // نبحث عن زر الإشعارات ونضع البروفايل بجانبه
  navItems.forEach((item, index) => {
    if (item.innerText.includes('الإشعارات') || item.id.includes('notif')) {
      // إمكانية تحويل الزر المجاور ليفتح البروفايل
    }
  });
}

function executeAdminBalanceAction() {
  const targetId = document.getElementById('adminTargetId').value.trim();
  const amount = parseFloat(document.getElementById('adminAmount').value);
  if (!targetId || isNaN(amount)) {
    showCustomAlert("❌ يرجى إدخال آيدي صحيح ومبلغ صالح!", false);
    return;
  }
  fetch(`https://laythaziz.pythonanywhere.com/api/admin_action?action=balance&admin_id=${currentUser.id}&target_id=${targetId}&amount=${amount}`)
    .then(res => res.json())
    .then(data => {
      showCustomAlert(data.message || "✅ تم تحديث الرصيد بنجاح!");
      document.getElementById('adminTargetId').value = '';
      document.getElementById('adminAmount').value = '';
    })
    .catch(() => { showCustomAlert("✅ تم إرسال أمر تعديل الرصيد بنجاح!"); });
}

function fetchUsersListInApp() {
  const outputBox = document.getElementById('adminDirectOutput');
  outputBox.style.display = 'block';
  outputBox.innerHTML = "⏳ جاري جلب قائمة المشتركين...";
  fetch(`https://laythaziz.pythonanywhere.com/api/admin_action?action=get_users&admin_id=${currentUser.id}`)
    .then(res => res.json())
    .then(data => {
      if (data.users && data.users.length > 0) {
        let html = `<b>👥 إجمالي المشتركين: ${data.users.length}</b><br><hr style="border-color:#444;">`;
        data.users.forEach(u => {
          html += `👤 <b>${u.first_name}</b> (@${u.username})<br>🆔 ID: <code>${u.user_id}</code> | 💰 الرصيد: <b>$${u.balance.toFixed(4)}</b><br>📅 الانضمام: ${u.join_date}<br><hr style="border-color:#333;">`;
        });
        outputBox.innerHTML = html;
      } else {
        outputBox.innerHTML = "❌ لا توجد بيانات مشتركين متاحة حالياً.";
      }
    })
    .catch(() => { outputBox.innerHTML = "⚠️ تعذر الاتصال بالسيرفر."; });
}

function fetchUserLogsInApp() {
  const targetId = document.getElementById('logTargetId').value.trim();
  const outputBox = document.getElementById('adminDirectOutput');
  if (!targetId) {
    showCustomAlert("❌ يرجى إدخال آيدي الزبون أولاً!", false);
    return;
  }
  outputBox.style.display = 'block';
  outputBox.innerHTML = `⏳ جاري جلب سجل الحركات للآيدي ${targetId}...`;
  fetch(`https://laythaziz.pythonanywhere.com/api/admin_action?action=get_logs&admin_id=${currentUser.id}&target_id=${targetId}`)
    .then(res => res.json())
    .then(data => {
      if (data.logs && data.logs.length > 0) {
        let html = `📋 <b>سجل حركات: ${data.name}</b> (<code>${targetId}</code>)<br>💰 الرصيد: <b>$${data.balance.toFixed(4)}</b><br><hr style="border-color:#444;">`;
        data.logs.forEach(l => {
          html += `⚡ <b>${l.type}</b><br>📝 ${l.details}<br>📅 ${l.date} | ⏰ ${l.time}<br><hr style="border-color:#333;">`;
        });
        outputBox.innerHTML = html;
      } else {
        outputBox.innerHTML = `❌ لا توجد حركات مسجلة للآيدي ${targetId}.`;
      }
    })
    .catch(() => { outputBox.innerHTML = "⚠️ تعذر الاتصال بالسيرفر."; });
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showCustomAlert("✅ تم النسخ إلى الحافظة بنجاح!");
  }).catch(() => {
    showCustomAlert("❌ فشل النسخ!", false);
  });
}

buildProfileTab();
buildAdminTab();
setTimeout(setupCustomNavbar, 300);

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
    tg.sendData(JSON.stringify({ action: "log_service_usage", service_title: currentService.title, qty: qty, cost: total }));
  }
  showCustomAlert(`✅ تم إنشاء الطلب بنجاح! #${newOrderId}`);
  closeOrderModal();
}

function requestPhoneAndProceed(callbackFunc) {
  if (userPhone && userPhone !== 'غير مسجل (سيطلب عند أول شحن)' && userPhone.length > 5) {
    callbackFunc(userPhone);
    return;
  }
  const phone = prompt("📱 يرجى إدخال رقم هاتفك لمرة واحدة فقط (سيتم حفظه وتثبيته في بروفايلك للأبد):");
  if (!phone || phone.trim().length < 6) {
    showCustomAlert("❌ يلزم إدخال رقم هاتف صحيح لإتمام العملية!", false);
    return;
  }
  userPhone = phone.trim();
  localStorage.setItem('userPhone', userPhone);
  
  const phoneDisp = document.getElementById('profilePhoneDisplay');
  if (phoneDisp) phoneDisp.innerText = userPhone;

  if (tg) {
    tg.sendData(JSON.stringify({ action: "save_user_phone", phone: userPhone }));
  }
  callbackFunc(userPhone);
}

function submitAsiaCard() {
  const cardInput = document.getElementById('asiaCardInput');
  if (!cardInput) return;
  const card = cardInput.value.trim();
  if (!card) {
    showCustomAlert("يرجى إدخال رقم كارت آسيا سيل أولاً!", false);
    return;
  }
  requestPhoneAndProceed((phone) => {
    if (currentUser) {
      const textData = `طلب_شحن_آسيا | الاسم: ${currentUser.first_name} | المعرف: @${currentUser.username || 'بدون'} | الهاتف: ${phone} | الآيدي: ${currentUser.id} | الكارت: ${card}`;
      cardInput.value = '';
      tg.close();
      window.location.href = `https://t.me/RoyalSocial_bot?start=${encodeURIComponent(textData)}`;
    }
  });
}

function submitTransferNotice() {
  const recInput = document.getElementById('transferReceiptInput');
  if (!recInput) return;
  const rec = recInput.value.trim();
  if (!rec) {
    showCustomAlert("يرجى إدخال رقم الوصل أو اسم المحول!", false);
    return;
  }
  requestPhoneAndProceed((phone) => {
    if (currentUser) {
      const textData = `طلب_شحن_الرافدين | الاسم: ${currentUser.first_name} | المعرف: @${currentUser.username || 'بدون'} | الهاتف: ${phone} | الآيدي: ${currentUser.id} | الوصل: ${rec}`;
      recInput.value = '';
      tg.close();
      window.location.href = `https://t.me/RoyalSocial_bot?start=${encodeURIComponent(textData)}`;
    }
  });
}

updateStatsDisplay();
