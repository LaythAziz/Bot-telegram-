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
let userPhone = localStorage.getItem('userPhone') || 'غير مسجل';
let notificationsList = JSON.parse(localStorage.getItem('notificationsList') || '[]');

const currentUser = tg && tg.initDataUnsafe && tg.initDataUnsafe.user ? tg.initDataUnsafe.user : {
  id: "1414595876",
  first_name: "Layth Aziz",
  username: "l713i",
  photo_url: ""
};

const ADMIN_ID = 1414595876; // آيديك الخاص بالأدمن

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

// --- 1. القائمة الجانبية (Drawer Menu) بثيم البنفسجي عند الضغط على زر "المزيد" ---
function buildDrawerMenu() {
  let drawer = document.getElementById('customDrawerMenu');
  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'customDrawerMenu';
    drawer.style.cssText = `
      position: fixed; top: 0; right: -100%; width: 80%; max-width: 320px; height: 100%;
      background: linear-gradient(135deg, #181424, #28203e); z-index: 999999;
      box-shadow: -10px 0 30px rgba(0,0,0,0.7); transition: right 0.3s ease;
      display: flex; flex-direction: column; direction: rtl; text-align: right; color: #fff; padding: 20px; box-sizing: border-box; overflow-y: auto;
    `;

    drawer.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div style="font-weight: bold; font-size: 16px; color: #a29bfe;">RoyalSocial - القائمة</div>
        <button onclick="toggleDrawer(false)" style="background: rgba(255,255,255,0.1); border: none; color: #fff; width: 32px; height: 32px; border-radius: 50%; font-size: 16px; cursor: pointer;">✕</button>
      </div>

      <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 12px; margin-bottom: 20px; display: flex; align-items: center; gap: 12px;">
        <div style="width: 45px; height: 45px; background: linear-gradient(135deg, #f1c40f, #e67e22); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold;">👑</div>
        <div style="flex: 1;">
          <div style="font-weight: bold; font-size: 14px;">${currentUser.first_name || 'مستخدم'}</div>
          <div style="font-size: 11px; color: #a29bfe;">الرصيد: <span style="color: #2ecc71; font-weight: bold;">$${userBalance.toFixed(4)}</span></div>
        </div>
      </div>

      <div style="font-size: 11px; color: #888; margin-bottom: 8px; font-weight: bold;">القوائم</div>
      <div onclick="switchTab('homeView'); toggleDrawer(false);" style="padding: 12px; border-radius: 10px; background: rgba(255,255,255,0.03); margin-bottom: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 13px;"><span>🔲</span> الرئيسية</div>
      <div onclick="switchTab('ordersTab'); toggleDrawer(false);" style="padding: 12px; border-radius: 10px; background: rgba(255,255,255,0.03); margin-bottom: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 13px;"><span>📦</span> طلباتي</div>
      <div onclick="switchTab('notificationsTab'); toggleDrawer(false);" style="padding: 12px; border-radius: 10px; background: rgba(255,255,255,0.03); margin-bottom: 15px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 13px;"><span>🔔</span> الإشعارات</div>

      <div style="font-size: 11px; color: #888; margin-bottom: 8px; font-weight: bold;">الرصيد</div>
      <div onclick="switchTab('walletTab'); toggleDrawer(false);" style="padding: 12px; border-radius: 10px; background: rgba(255,255,255,0.03); margin-bottom: 6px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 13px;"><span>💳</span> إضافة رصيد</div>

      <div style="font-size: 11px; color: #888; margin-bottom: 8px; font-weight: bold;">المساعدة</div>
      <div onclick="window.open('https://t.me/l713i', '_blank')" style="padding: 12px; border-radius: 10px; background: rgba(255,255,255,0.03); margin-bottom: 25px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 13px;"><span>🎧</span> الدعم الفني</div>

      <button onclick="if(tg) tg.close();" style="width: 100%; background: linear-gradient(135deg, #ff416c, #ff4b2b); color: #fff; border: none; padding: 12px; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 13px;">🚪 تسجيل الخروج</button>
    `;
    document.body.appendChild(drawer);
  }
}

function toggleDrawer(show) {
  buildDrawerMenu();
  const drawer = document.getElementById('customDrawerMenu');
  if (drawer) {
    drawer.style.right = show ? '0' : '-100%';
  }
}

// --- 2. بناء صفحة البروفايل (عامة للجميع) ---
function buildProfileTab() {
  let profileTab = document.getElementById('profileTab');
  if (!profileTab) {
    profileTab = document.createElement('div');
    profileTab.id = 'profileTab';
    profileTab.className = 'tab-content';
    profileTab.style.display = 'none';

    profileTab.innerHTML = `
      <div style="background: linear-gradient(135deg, #1b1828, #2a2438); border-radius: 20px; padding: 20px; margin-top: 15px; border: 1px solid rgba(255,255,255,0.1); text-align: right; direction: rtl;">
        <div style="text-align: center; margin-bottom: 20px;">
          <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #f1c40f, #e67e22); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; font-size: 34px;">👑</div>
          <h3 style="margin: 0; color: #fff; font-size: 19px;">${currentUser.first_name || 'مستخدم'}</h3>
          <p style="color: #a29bfe; font-size: 11px; margin: 4px 0 0;">✨ حساب موثق وفعّال في النظام</p>
        </div>
        
        <div style="background: rgba(0,0,0,0.4); padding: 14px; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 11px; color: #aaa;">الرصيد المتاح:</div>
            <div id="profileBalance" style="font-size: 18px; font-weight: bold; color: #2ecc71;">$0.0000</div>
          </div>
          <button onclick="switchTab('walletTab')" style="background: #9b59b6; border: none; color: #fff; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">شحن الرصيد</button>
        </div>

        <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 10px; color: #aaa;">الاسم العام:</div>
            <div style="font-size: 13px; color: #fff; font-weight: bold;">${currentUser.first_name || 'مستخدم'}</div>
          </div>
          <button onclick="copyText('${currentUser.first_name}')" style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;">نسخ</button>
        </div>

        <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 10px; color: #aaa;">يوزر التليجرام:</div>
            <div style="font-size: 13px; color: #fff; font-weight: bold;">@${currentUser.username || 'بدون'}</div>
          </div>
          <button onclick="copyText('@${currentUser.username}')" style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;">نسخ</button>
        </div>

        <div style="background: rgba(0,0,0,0.3); padding: 12px; border-radius: 10px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 10px; color: #aaa;">آيدي الحساب (ID):</div>
            <div style="font-size: 13px; color: #fff; font-weight: bold;">${currentUser.id}</div>
          </div>
          <button onclick="copyText('${currentUser.id}')" style="background: rgba(255,255,255,0.1); border: none; color: #fff; padding: 6px 12px; border-radius: 6px; font-size: 11px; cursor: pointer;">نسخ</button>
        </div>
      </div>
    `;
    const appContainer = document.querySelector('.app-container') || document.body;
    appContainer.appendChild(profileTab);
  }
}

// --- 3. لوحة تحكم الأدمن الخاصة بك وحدك داخل الميني أب ---
function buildAdminTab() {
  if (currentUser && Number(currentUser.id) === ADMIN_ID) {
    let adminTab = document.getElementById('adminTab');
    if (!adminTab) {
      adminTab = document.createElement('div');
      adminTab.id = 'adminTab';
      adminTab.className = 'tab-content';
      adminTab.style.display = 'none';
      adminTab.innerHTML = `
        <div style="background: linear-gradient(135deg, #1f1c2c, #393154); border: 2px solid #ff416c; border-radius: 20px; padding: 20px; margin-top: 15px; color: #fff; direction: rtl; text-align: right;">
          <div style="font-weight: bold; font-size: 16px; margin-bottom: 15px; color: #ff758c; text-align: center;">🛠 لوحة تحكم الأدمن الخاصة بك</div>
          
          <div style="margin-bottom: 15px; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 12px;">
            <div style="font-size: 12px; color: #f1c40f; margin-bottom: 8px; font-weight: bold;">💰 تعديل رصيد زبون:</div>
            <input type="number" id="adminTargetId" placeholder="آيدي الزبون..." style="width: 100%; padding: 10px; border-radius: 8px; border: none; background: rgba(255,255,255,0.1); color: #fff; margin-bottom: 8px; font-size: 12px; text-align: right;">
            <input type="number" id="adminAmount" placeholder="المبلغ ($)..." step="0.01" style="width: 100%; padding: 10px; border-radius: 8px; border: none; background: rgba(255,255,255,0.1); color: #fff; margin-bottom: 10px; font-size: 12px; text-align: right;">
            <button onclick="executeAdminBalanceAction()" style="width: 100%; background: #00b09b; color: #fff; border: none; padding: 11px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 12px;">➕ تعديل الرصيد فوراً</button>
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

// --- 4. قسم الإشعارات الحقيقية ---
function buildNotificationsTab() {
  let notifTab = document.getElementById('notificationsTab');
  if (!notifTab) {
    notifTab = document.createElement('div');
    notifTab.id = 'notificationsTab';
    notifTab.className = 'tab-content';
    notifTab.style.display = 'none';
    notifTab.innerHTML = `
      <div style="padding: 15px; direction: rtl; text-align: right;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <h3 style="color: #fff; margin: 0;">🔔 الإشعارات الحقيقية</h3>
          <button onclick="clearNotifications()" style="background: rgba(255,255,255,0.1); border: none; color: #aaa; padding: 5px 10px; border-radius: 6px; font-size: 11px; cursor: pointer;">تحديد الكل مقروء</button>
        </div>
        <div id="notificationsContainer"></div>
      </div>
    `;
    const appContainer = document.querySelector('.app-container') || document.body;
    appContainer.appendChild(notifTab);
  }
  renderNotificationsList();
}

function addNotification(title, text, isSuccess = true) {
  const newNotif = {
    id: Date.now(),
    title: title,
    text: text,
    time: "الآن",
    isSuccess: isSuccess
  };
  notificationsList.unshift(newNotif);
  localStorage.setItem('notificationsList', JSON.stringify(notificationsList));
  renderNotificationsList();
}

function renderNotificationsList() {
  const container = document.getElementById('notificationsContainer');
  if (!container) return;
  container.innerHTML = '';
  if (notificationsList.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:#888; padding:30px; font-size:13px;">لا توجد إشعارات جديدة حالياً 📭</div>`;
    return;
  }
  notificationsList.forEach(n => {
    const card = document.createElement('div');
    card.style.cssText = `
      background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
      padding: 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;
    `;
    card.innerHTML = `
      <div>
        <div style="font-weight: bold; font-size: 13px; color: ${n.isSuccess ? '#2ecc71' : '#ff758c'};">${n.title}</div>
        <div style="font-size: 11px; color: #bbb; margin-top: 3px;">${n.text}</div>
        <div style="font-size: 9px; color: #777; margin-top: 5px;">⏰ ${n.time}</div>
      </div>
      <div style="font-size: 20px;">${n.isSuccess ? '✅' : 'ℹ️'}</div>
    `;
    container.appendChild(card);
  });
}

function clearNotifications() {
  notificationsList = [];
  localStorage.setItem('notificationsList', JSON.stringify(notificationsList));
  renderNotificationsList();
  showCustomAlert("✅ تم تحديد جميع الإشعارات كمقروءة!");
}

// --- 5. ترتيب الشريط السفلي وتثبيت البروفايل والأدمن ---
function setupCustomNavbar() {
  const navbar = document.querySelector('.navbar') || document.querySelector('.nav-bar');
  if (!navbar) return;

  const oldAdded = navbar.querySelectorAll('.custom-nav-item');
  oldAdded.forEach(el => el.remove());

  // زر البروفايل [بجانب الإشعارات]
  let profileNavBtn = document.createElement('div');
  profileNavBtn.id = 'nav-profileTab';
  profileNavBtn.className = 'nav-item custom-nav-item';
  profileNavBtn.innerHTML = `<span>👤</span><span>البروفايل</span>`;
  profileNavBtn.onclick = () => switchTab('profileTab');
  navbar.appendChild(profileNavBtn);

  // زر لوحة تحكم الأدمن (يظهر لك أنت وحدك فقط)
  if (currentUser && Number(currentUser.id) === ADMIN_ID) {
    let adminNavBtn = document.createElement('div');
    adminNavBtn.id = 'nav-adminTab';
    adminNavBtn.className = 'nav-item custom-nav-item';
    adminNavBtn.innerHTML = `<span>👑</span><span>التحكم</span>`;
    adminNavBtn.onclick = () => switchTab('adminTab');
    navbar.appendChild(adminNavBtn);
  }

  // ربط زر "المزيد" بالقائمة المنسدلة الجانبية
  const navItems = navbar.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    if (item.innerText.includes('المزيد') || item.innerText.includes('≡')) {
      item.onclick = (e) => {
        e.preventDefault();
        toggleDrawer(true);
      };
    }
  });
}

// --- 6. دوال شحن الرصيد (آسيا سيل والرافدين التي توقفت) ---
function submitAsiaCard() {
  const cardInput = document.getElementById('asiaCardInput');
  if (!cardInput) {
    showCustomAlert("❌ حقل كارت آسيا سيل غير موجود!", false);
    return;
  }
  const card = cardInput.value.trim();
  if (!card || card.length < 5) {
    showCustomAlert("⚠️ يرجى إدخال رقم كارت آسيا سيل بشكل صحيح!", false);
    return;
  }

  const textData = `طلب_شحن_آسيا | الاسم: ${currentUser.first_name} | المعرف: @${currentUser.username || 'بدون'} | الآيدي: ${currentUser.id} | الكارت: ${card}`;
  cardInput.value = '';
  addNotification("طلب شحن معلق", `تم إرسال كارت آسيا سيل للإدارة بنجاح.`);
  
  if (tg) {
    tg.close();
    window.location.href = `https://t.me/RoyalSocial_bot?start=${encodeURIComponent(textData)}`;
  } else {
    showCustomAlert("✅ تم إرسال طلب الشحن بنجاح!");
  }
}

function submitTransferNotice() {
  const recInput = document.getElementById('transferReceiptInput');
  if (!recInput) {
    showCustomAlert("❌ حقل وصل التحويل غير موجود!", false);
    return;
  }
  const rec = recInput.value.trim();
  if (!rec || rec.length < 3) {
    showCustomAlert("⚠️ يرجى إدخال رقم الوصل أو اسم المحول بشكل صحيح!", false);
    return;
  }

  const textData = `طلب_شحن_الرافدين | الاسم: ${currentUser.first_name} | المعرف: @${currentUser.username || 'بدون'} | الآيدي: ${currentUser.id} | الوصل: ${rec}`;
  recInput.value = '';
  addNotification("طلب شحن معلق", `تم إرسال إشعار تحويل الرافدين للإدارة بنجاح.`);

  if (tg) {
    tg.close();
    window.location.href = `https://t.me/RoyalSocial_bot?start=${encodeURIComponent(textData)}`;
  } else {
    showCustomAlert("✅ تم إرسال إشعار التحويل بنجاح!");
  }
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
          html += `👤 <b>${u.first_name}</b> (@${u.username})<br>🆔 ID: <code>${u.user_id}</code> | 💰 الرصيد: <b>$${u.balance.toFixed(4)}</b><br><hr style="border-color:#333;">`;
        });
        outputBox.innerHTML = html;
      } else {
        outputBox.innerHTML = "❌ لا توجد بيانات مشتركين متاحة حالياً.";
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
buildNotificationsTab();
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
  
  addNotification(`طلب جديد #${newOrderId}`, `تم إنشاء الطلب رقم ${newOrderId} بنجاح.`);
  
  updateStatsDisplay();
  showCustomAlert(`✅ تم إنشاء الطلب بنجاح! #${newOrderId}`);
  closeOrderModal();
}

updateStatsDisplay();
