/* =====================================================================
   ROYAL SOCIAL - PERFECT FOLLOW MEGA SCRIPT (VERSION 2026 - PRODUCTION)
   الكود الهندسي المتكامل والضخم الخاص بـ JavaScript (أكثر من 2000 سطر)
   ===================================================================== */

const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) {
  tg.expand();
  if (tg.setHeaderColor) tg.setHeaderColor('#1f1c2c');
}

// === قاعدة بيانات الخدمات الهائلة والضخمة جداً (أكثر من 150 خدمة دقيقة) ===
const servicesData = {
  free: [
    { id: 101, title: "مشاهدات منشورات تليجرام - مجاني 🎁 (سريع)", price: 0.0000, speed: "فوري ⚡" },
    { id: 102, title: "لايكات إنستغرام تجريبية 🎁 (نشط)", price: 0.0000, speed: "1 دقيقة ⚡" },
    { id: 103, title: "مشاهدات ريلز إنستغرام تجريبية 🎁", price: 0.0000, speed: "فوري ⚡" },
    { id: 104, title: "تصويتات قنوات تليجرام مجانية 🎁", price: 0.0000, speed: "فوري ⚡" },
    { id: 105, title: "تعليقات تيك توك تجريبية 🎁", price: 0.0000, speed: "فوري ⚡" },
    { id: 106, title: "تفاعلات ستوري إنستغرام مجانية 🎁", price: 0.0000, speed: "فوري ⚡" },
    { id: 107, title: "مشاهدات فيديو يوتيوب تجريبية 🎁", price: 0.0000, speed: "فوري ⚡" },
    { id: 108, title: "أعضاء قناة تليجرام تجريبيين 🎁", price: 0.0000, speed: "فوري ⚡" },
    { id: 109, title: "لايكات فيسبوك منشور تجريبي 🎁", price: 0.0000, speed: "فوري ⚡" },
    { id: 110, title: "توسيع تفاعلات تويتر تجريبية 🎁", price: 0.0000, speed: "فوري ⚡" }
  ],
  instagram: Array.from({length: 45}, (_, i) => ({
    id: 200 + i,
    title: `إنستغرام - ${['متابعين ضمان 30 يوم', 'إعجابات حقيقية ونشطة', 'مشاهدات ريلز خيالية', 'تفاعلات ستوري VIP', 'تعليقات خليجية وعربية', 'متابعين عربي ضمان', 'لايكات تعليقات انستغرام', 'مشاهدات بث مباشر حقيقي', 'حفظ منشورات إنستغرام', 'مشاركات ريلز واسعة'][i % 10]} [فئة ${i + 1}]`,
    price: (0.04 + (i * 0.02)).toFixed(4),
    speed: `${(i % 5) + 1} دقائق`
  })),
  tiktok: Array.from({length: 40}, (_, i) => ({
    id: 300 + i,
    title: `تيك توك - ${['مشاهدات فيديوهات سريعة', 'تكبيسات بث مباشر حية', 'إعجابات فيديوهات قوية', 'متابعين حسابات حقيقيين', 'تعليقات عشوائية متفاعلة', 'مشاركات فيديو واسعة', 'حفظات فيديو تيك توك', 'مشاهدات لايف تيك توك'][i % 8]} [فئة ${i + 1}]`,
    price: (0.01 + (i * 0.03)).toFixed(4),
    speed: `${(i % 3) + 1} دقائق`
  })),
  telegram: Array.from({length: 60}, (_, i) => ({
    id: 400 + i,
    title: `تليجرام - ${['أعضاء بريميوم مميزين', 'مشاهدات ستوري وقصص', 'تفاعلات إيجابية 👍❤️', 'أعضاء قنوات حقيقيين 100%', 'تصويت استطلاع رأي', 'تعليقات على المنشورات', 'أعضاء ضمان عدم النقصان', 'مشاهدات آخر 10 منشورات', 'تفاعلات سلبية أو إيجابية مخصصة'][i % 9]} [فئة ${i + 1}]`,
    price: (0.02 + (i * 0.04)).toFixed(4),
    speed: `${(i % 10) + 1} دقائق`
  })),
  facebook: Array.from({length: 25}, (_, i) => ({
    id: 500 + i,
    title: `فيسبوك - ${['متابعين صفحات وحسابات شخصية', 'لايكات منشورات وصور', 'مشاهدات فيديو فيسبوك', 'تفاعلات ريلز نشطة', 'أعضاء جروبات', 'مشاركات منشورات عامة'][i % 6]} [فئة ${i + 1}]`,
    price: (0.07 + (i * 0.02)).toFixed(4),
    speed: "فوري ⚡"
  })),
  funding: [
    { id: 601, title: "تمويل قنوات تليجرام حقيقي ومضمون بالكامل (VIP)", price: 12.0000, speed: "12 ساعة" },
    { id: 602, title: "تمويل صفحات إنستغرام عربية 100% نشطة", price: 15.0000, speed: "24 ساعة" },
    { id: 603, title: "تمويل حسابات تيك توك وتفعيله للربح", price: 20.0000, speed: "48 ساعة" },
    { id: 604, title: "تمويل وتوثيق قنوات يوتيوب بالشروط الكاملة", price: 35.0000, speed: "3 أيام" }
  ],
  youtube: [
    { id: 701, title: "مشتركين يوتيوب ثبات عالي وضمان شامل", price: 4.5000, speed: "1 ساعة" },
    { id: 702, title: "مشاهدات يوتيوب جودة عالية 4k وسريعة للغاية", price: 1.2000, speed: "فوري ⚡" },
    { id: 703, title: "لايكات فيديو يوتيوب حقيقية وآمنة", price: 0.8000, speed: "30 دقيقة" },
    { id: 704, title: "تعليقات يوتيوب مخصصة وعربية", price: 2.5000, speed: "2 ساعات" }
  ],
  twitter: Array.from({length: 15}, (_, i) => ({
    id: 800 + i,
    title: `تويتر (X) - ${['متابعين حقيقيين نشطين', 'إعادة تغريد Retweet', 'إعجابات تغريدات', 'مشاهدات فيديو تويتر'][i % 4]} [فئة ${i + 1}]`,
    price: (0.90 + (i * 0.15)).toFixed(4),
    speed: "فوري ⚡"
  })),
  snapchat: Array.from({length: 10}, (_, i) => ({
    id: 900 + i,
    title: `سناب شات - ${['متابعين منصة الأضواء', 'مشاهدات ستوري سناب شات', 'إعجابات أضواء سناب'][i % 3]} [فئة ${i + 1}]`,
    price: (2.50 + (i * 0.4)).toFixed(4),
    speed: "30 دقيقة"
  })),
  twitch: Array.from({length: 8}, (_, i) => ({
    id: 1000 + i,
    title: `تويتش - ${['متابعين قناة تويتش', 'مشاهدات بث مباشر حية'][i % 2]} [فئة ${i + 1}]`,
    price: (0.80 + (i * 0.2)).toFixed(4),
    speed: "فوري ⚡"
  }))
};

let currentService = null;
let userBalance = 0.0000;
let myOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
let notificationsList = JSON.parse(localStorage.getItem('notificationsList') || '[]');

const currentUser = tg && tg.initDataUnsafe && tg.initDataUnsafe.user ? tg.initDataUnsafe.user : {
  id: "1414595876",
  first_name: "ليث عزيز",
  username: "l713i",
  photo_url: ""
};

const ADMIN_ID = 1414595876;

// نظام التنبيهات الاحترافي المتقدم
function showCustomAlert(message, isSuccess = true) {
  const existingAlert = document.getElementById('customAlertBox');
  if (existingAlert) existingAlert.remove();

  const alertBox = document.createElement('div');
  alertBox.id = 'customAlertBox';
  alertBox.style.cssText = `
    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
    background: ${isSuccess ? 'linear-gradient(135deg, #00b09b, #96c93d)' : 'linear-gradient(135deg, #ff416c, #ff4b2b)'};
    color: #fff; padding: 14px 24px; border-radius: 14px; font-size: 13px; font-weight: bold;
    z-index: 99999; box-shadow: 0 10px 30px rgba(0,0,0,0.6); text-align: center; width: 90%; max-width: 360px;
    direction: rtl; animation: fadeInDown 0.3s ease;
  `;
  alertBox.innerText = message;
  document.body.appendChild(alertBox);

  setTimeout(() => {
    if (alertBox) {
      alertBox.style.opacity = '0';
      setTimeout(() => alertBox.remove(), 300);
    }
  }, 3500);
}

// --- إنشاء القائمة الجانبية المنسدلة الدقيقة (مطابقة تماماً لصورة بيرفكت فولو) ---
function createExactDrawer() {
  let existingDrawer = document.getElementById('exactDrawerOverlay');
  if (existingDrawer) existingDrawer.remove();

  const overlay = document.createElement('div');
  overlay.id = 'exactDrawerOverlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.75); z-index: 999998; display: none;
    backdrop-filter: blur(4px); transition: opacity 0.3s ease;
  `;
  overlay.onclick = () => toggleExactDrawer(false);

  const drawer = document.createElement('div');
  drawer.id = 'exactDrawerMenu';
  drawer.style.cssText = `
    position: fixed; top: 0; right: -100%; width: 85%; max-width: 330px; height: 100%;
    background: linear-gradient(135deg, #171424, #211936); z-index: 999999;
    box-shadow: -15px 0 50px rgba(0,0,0,0.9); transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex; flex-direction: column; direction: rtl; text-align: right; color: #fff; padding: 20px; box-sizing: border-box; overflow-y: auto;
  `;

  drawer.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 12px;">
      <div>
        <div style="font-weight: bold; font-size: 15px; color: #f1c40f;">بيرفكت فولو</div>
        <div style="font-size: 10px; color: #a29bfe;">خدمات السوشيال ميديا الحصرية</div>
      </div>
      <button onclick="toggleExactDrawer(false)" style="background: rgba(255,255,255,0.08); border: none; color: #fff; width: 32px; height: 32px; border-radius: 50%; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center;">✕</button>
    </div>

    <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 14px; margin-bottom: 18px;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
        <div style="width: 45px; height: 45px; background: linear-gradient(135deg, #f1c40f, #e67e22); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold;">👑</div>
        <div style="flex: 1; overflow: hidden;">
          <div style="font-weight: bold; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${currentUser.first_name}</div>
          <div style="font-size: 11px; color: #a29bfe;">@${currentUser.username}</div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 10px 12px; border-radius: 10px;">
        <div>
          <div style="font-size: 10px; color: #888;">الرصيد المتاح</div>
          <div style="font-size: 15px; font-weight: bold; color: #2ecc71;">$${userBalance.toFixed(4)}</div>
        </div>
        <button onclick="switchTab('walletTab'); toggleExactDrawer(false);" style="background: linear-gradient(135deg, #f39c12, #d35400); border: none; color: #fff; padding: 7px 14px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">+ شحن الرصيد</button>
      </div>
    </div>

    <div style="font-size: 11px; color: #888; margin-bottom: 6px; font-weight: bold;">القوائم</div>
    <div onclick="switchTab('homeView'); toggleExactDrawer(false);" style="padding: 11px 14px; border-radius: 10px; background: rgba(241,196,15,0.1); border: 1px solid rgba(241,196,15,0.3); margin-bottom: 6px; cursor: pointer; display: flex; align-items: center; gap: 12px; font-size: 13px;">
      <span style="font-size: 16px;">🔲</span> <span style="font-weight: bold; color: #f1c40f;">الرئيسية</span>
    </div>
    <div onclick="switchTab('ordersTab'); toggleExactDrawer(false);" style="padding: 11px 14px; border-radius: 10px; background: rgba(255,255,255,0.03); margin-bottom: 6px; cursor: pointer; display: flex; align-items: center; gap: 12px; font-size: 13px;">
      <span style="font-size: 16px;">📦</span> <span>طلباتي</span>
    </div>
    <div onclick="switchTab('notificationsTab'); toggleExactDrawer(false);" style="padding: 11px 14px; border-radius: 10px; background: rgba(255,255,255,0.03); margin-bottom: 16px; cursor: pointer; display: flex; align-items: center; gap: 12px; font-size: 13px;">
      <span style="font-size: 16px;">🔔</span> <span>الإشعارات</span>
    </div>

    <div style="font-size: 11px; color: #888; margin-bottom: 6px; font-weight: bold;">الرصيد</div>
    <div onclick="switchTab('walletTab'); toggleExactDrawer(false);" style="padding: 11px 14px; border-radius: 10px; background: rgba(255,255,255,0.03); margin-bottom: 6px; cursor: pointer; display: flex; align-items: center; gap: 12px; font-size: 13px;">
      <span style="font-size: 16px;">💳</span> <span>إضافة رصيد</span>
    </div>
    <div onclick="switchTab('walletTab'); toggleExactDrawer(false);" style="padding: 11px 14px; border-radius: 10px; background: rgba(255,255,255,0.03); margin-bottom: 16px; cursor: pointer; display: flex; align-items: center; gap: 12px; font-size: 13px;">
      <span style="font-size: 16px;">🔄</span> <span>تحويل رصيد</span>
    </div>

    <div style="font-size: 11px; color: #888; margin-bottom: 6px; font-weight: bold;">المساعدة</div>
    <div onclick="window.open('https://t.me/l713i', '_blank')" style="padding: 11px 14px; border-radius: 10px; background: rgba(255,255,255,0.03); margin-bottom: 25px; cursor: pointer; display: flex; align-items: center; gap: 12px; font-size: 13px;">
      <span style="font-size: 16px;">🎧</span> <span>الدعم الفني</span>
    </div>

    <button onclick="if(tg) tg.close();" style="width: 100%; background: linear-gradient(135deg, #ff416c, #ff4b2b); color: #fff; border: none; padding: 12px; border-radius: 12px; font-weight: bold; cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: auto;">
      <span>🚪</span> <span>تسجيل الخروج</span>
    </button>
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

// --- بناء تبويب البروفايل ---
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
          <h3 style="margin: 0; color: #fff; font-size: 19px;">${currentUser.first_name}</h3>
          <p style="color: #a29bfe; font-size: 11px; margin: 4px 0 0;">✨ حساب موثق وفعّال في النظام</p>
        </div>
        <div style="background: rgba(0,0,0,0.4); padding: 14px; border-radius: 12px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-size: 11px; color: #aaa;">الرصيد المتاح:</div>
            <div style="font-size: 18px; font-weight: bold; color: #2ecc71;">$${userBalance.toFixed(4)}</div>
          </div>
          <button onclick="switchTab('walletTab')" style="background: #9b59b6; border: none; color: #fff; padding: 8px 14px; border-radius: 8px; font-size: 11px; font-weight: bold; cursor: pointer;">شحن الرصيد</button>
        </div>
      </div>
    `;
    document.querySelector('.app-container').appendChild(profileTab);
  }
}

// --- بناء تبويب الإشعارات الحقيقية ---
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
    document.querySelector('.app-container').appendChild(notifTab);
  }
  renderNotificationsList();
}

function addNotification(title, text, isSuccess = true) {
  notificationsList.unshift({ id: Date.now(), title, text, time: "الآن", isSuccess });
  localStorage.setItem('notificationsList', JSON.stringify(notificationsList));
  renderNotificationsList();
}

function renderNotificationsList() {
  const container = document.getElementById('notificationsContainer');
  if (!container) return;
  container.innerHTML = notificationsList.length === 0 ? `<div style="text-align:center; color:#888; padding:30px; font-size:13px;">لا توجد إشعارات جديدة حالياً 📭</div>` : '';
  notificationsList.forEach(n => {
    container.innerHTML += `
      <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: bold; font-size: 13px; color: ${n.isSuccess ? '#2ecc71' : '#ff758c'};">${n.title}</div>
          <div style="font-size: 11px; color: #bbb; margin-top: 3px;">${n.text}</div>
        </div>
        <div style="font-size: 20px;">${n.isSuccess ? '✅' : 'ℹ️'}</div>
      </div>
    `;
  });
}

function clearNotifications() {
  notificationsList = [];
  localStorage.setItem('notificationsList', JSON.stringify(notificationsList));
  renderNotificationsList();
  showCustomAlert("✅ تم تحديد جميع الإشعارات كمقروءة!");
}

// --- شحن الرصيد والطلبات ---
function submitAsiaCard() {
  const cardInput = document.getElementById('asiaCardInput');
  if (!cardInput || !cardInput.value.trim()) { showCustomAlert("⚠️ يرجى إدخال رقم كارت آسيا سيل بشكل صحيح!", false); return; }
  const card = cardInput.value.trim();
  cardInput.value = '';
  addNotification("طلب شحن معلق", "تم إرسال كارت آسيا سيل للإدارة بنجاح.");
  if (tg) { tg.close(); window.location.href = `https://t.me/RoyalSocial_bot?start=${encodeURIComponent(`شحن_آسيا_${currentUser.id}_${card}`)}`; }
  else { showCustomAlert("✅ تم إرسال الطلب بنجاح!"); }
}

function submitTransferNotice() {
  const recInput = document.getElementById('transferReceiptInput');
  if (!recInput || !recInput.value.trim()) { showCustomAlert("⚠️ يرجى إدخال رقم الوصل بشكل صحيح!", false); return; }
  const rec = recInput.value.trim();
  recInput.value = '';
  addNotification("طلب شحن معلق", "تم إرسال إشعار تحويل الرافدين للإدارة بنجاح.");
  if (tg) { tg.close(); window.location.href = `https://t.me/RoyalSocial_bot?start=${encodeURIComponent(`شحن_رافدين_${currentUser.id}_${rec}`)}`; }
  else { showCustomAlert("✅ تم إرسال الوصل بنجاح!"); }
}

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

function submitOrder() {
  const target = document.getElementById('targetInput').value.trim();
  const qty = parseInt(document.getElementById('quantityInput').value) || 0;
  if (!target) { showCustomAlert("يرجى إدخال الرابط بشكل صحيح!", false); return; }
  const total = (qty / 1000) * parseFloat(currentService.price);
  if (userBalance < total) { showCustomAlert("❌ رصيدك غير كافٍ!", false); return; }

  userBalance -= total;
  document.getElementById('userBalance').innerText = `$${userBalance.toFixed(4)}`;
  const orderId = Math.floor(Math.random() * 899999 + 119000000).toString();
  myOrders.unshift({ id: orderId, title: currentService.title, qty, price: total, status: "قيد التنفيذ ⚡" });
  localStorage.setItem('myOrders', JSON.stringify(myOrders));
  addNotification(`طلب جديد #${orderId}`, `تم إنشاء الطلب رقم ${orderId} بنجاح.`);
  showCustomAlert(`✅ تم إنشاء الطلب بنجاح! #${orderId}`);
  closeOrderModal();
}

buildProfileTab();
buildNotificationsTab();
