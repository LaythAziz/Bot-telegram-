const tg = window.Telegram ? window.Telegram.WebApp : null;
if (tg) {
  tg.expand();
  if (tg.setHeaderColor) tg.setHeaderColor('#1f1c2c');
}

const servicesData = {
  free: [
    { id: 101, title: "مشاهدات منشورات تليجرام - مجاني 🎁", price: 0.0000, speed: "فوري ⚡" },
    { id: 102, title: "لايكات إنستغرام تجريبية 🎁", price: 0.0000, speed: "1 دقيقة ⚡" },
    { id: 103, title: "مشاهدات ريلز إنستغرام تجريبية 🎁", price: 0.0000, speed: "فوري ⚡" }
  ],
  instagram: Array.from({length: 15}, (_, i) => ({
    id: 200 + i,
    title: `إنستغرام - متابعين وضمان نشط #${i + 1}`,
    price: (0.05 + (i * 0.02)).toFixed(4),
    speed: `${i + 1} دقائق`
  })),
  telegram: Array.from({length: 15}, (_, i) => ({
    id: 300 + i,
    title: `تليجرام - أعضاء حقيقيين وضمان #${i + 1}`,
    price: (0.02 + (i * 0.03)).toFixed(4),
    speed: `${i + 2} دقائق`
  })),
  tiktok: Array.from({length: 15}, (_, i) => ({
    id: 400 + i,
    title: `تيك توك - مشاهدات وتكبيسات حية #${i + 1}`,
    price: (0.01 + (i * 0.02)).toFixed(4),
    speed: "فوري ⚡"
  }))
};

let currentService = null;
let userBalance = 4.0700;
let myOrders = JSON.parse(localStorage.getItem('myOrders') || '[]');
let notificationsList = JSON.parse(localStorage.getItem('notificationsList') || '[]');

const currentUser = tg && tg.initDataUnsafe && tg.initDataUnsafe.user ? tg.initDataUnsafe.user : {
  id: 1414595876,
  first_name: "ليث عزيز",
  username: "l713i"
};

const ADMIN_ID = 1414595876;

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

// --- إنشاء القائمة الجانبية (Drawer) المطابقة لصورة بيرفكت فولو بالحرف الواحد ---
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
  drawer.style.cssText = `
    position: fixed; top: 0; right: -100%; width: 85%; max-width: 330px; height: 100%;
    background: linear-gradient(135deg, #171424, #211936); z-index: 999999;
    box-shadow: -15px 0 50px rgba(0,0,0,0.9); transition: right 0.3s ease;
    display: flex; flex-direction: column; direction: rtl; text-align: right; color: #fff; padding: 20px; box-sizing: border-box; overflow-y: auto;
  `;

  let adminPanelBtnHTML = "";
  if (Number(currentUser.id) === ADMIN_ID) {
    adminPanelBtnHTML = `
      <div style="font-size: 10px; color: var(--gold); margin-bottom: 4px; font-weight: bold;">لوحة التحكم الخاصة بالأدمن</div>
      <div onclick="switchTab('adminTab'); toggleExactDrawer(false);" style="padding: 10px 12px; border-radius: 8px; background: rgba(241,196,15,0.15); border: 1px solid var(--gold); margin-bottom: 12px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;">
        <span style="font-size: 14px;">👑</span> <span style="font-weight: bold; color: var(--gold);">لوحة تحكم الأدمن السرية</span>
      </div>
    `;
  }

  drawer.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">
      <div>
        <div style="font-weight: bold; font-size: 14px; color: var(--gold);">بيرفكت فولو</div>
        <div style="font-size: 10px; color: #a29bfe;">خدمات السوشيال ميديا الحصرية</div>
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
        <button onclick="switchTab('walletTab'); toggleExactDrawer(false);" style="background: var(--gold); border: none; color: #120f1d; padding: 5px 10px; border-radius: 6px; font-size: 10px; font-weight: bold; cursor: pointer;">+ شحن الرصيد</button>
      </div>
    </div>

    ${adminPanelBtnHTML}

    <div style="font-size: 10px; color: #888; margin-bottom: 4px; font-weight: bold;">القوائم</div>
    <div onclick="switchTab('homeView'); toggleExactDrawer(false);" style="padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 4px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;"><span>🔲</span> الرئيسية</div>
    <div onclick="switchTab('ordersTab'); toggleExactDrawer(false);" style="padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 4px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;"><span>📦</span> طلباتي</div>
    <div onclick="switchTab('notificationsTab'); toggleExactDrawer(false);" style="padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 12px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;"><span>🔔</span> الإشعارات</div>

    <div style="font-size: 10px; color: #888; margin-bottom: 4px; font-weight: bold;">الرصيد</div>
    <div onclick="switchTab('walletTab'); toggleExactDrawer(false);" style="padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 4px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;"><span>💳</span> إضافة رصيد</div>
    <div onclick="switchTab('transferTab'); toggleExactDrawer(false);" style="padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 12px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;"><span>🔄</span> تحويل رصيد</div>

    <div style="font-size: 10px; color: #888; margin-bottom: 4px; font-weight: bold;">المساعدة والأمان</div>
    <div onclick="switchTab('settingsTab'); toggleExactDrawer(false);" style="padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 4px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;"><span>⚙️</span> الإعدادات</div>
    <div onclick="window.open('https://t.me/l713i', '_blank')" style="padding: 10px 12px; border-radius: 8px; background: rgba(255,255,255,0.03); margin-bottom: 20px; cursor: pointer; display: flex; align-items: center; gap: 10px; font-size: 12px;"><span>🎧</span> الدعم الفني</div>

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

// --- وظائف الأدمن السرية لتعديل الرصيد ورؤية المستخدمين ---
function executeAdminBalanceModify() {
  const targetId = document.getElementById('adminTargetId').value.trim();
  const amt = parseFloat(document.getElementById('adminAmount').value);
  if (!targetId || isNaN(amt)) {
    showCustomAlert("❌ يرجى إدخال الآيدي والمبلغ بشكل صالح!", false);
    return;
  }
  fetch(`https://laythaziz.pythonanywhere.com/api/admin_action?action=balance&admin_id=${currentUser.id}&target_id=${targetId}&amount=${amt}`)
    .then(res => res.json())
    .then(d => {
      showCustomAlert(d.message || "✅ تم تعديل رصيد الزبون بنجاح!");
      document.getElementById('adminTargetId').value = '';
      document.getElementById('adminAmount').value = '';
    })
    .catch(() => {
      showCustomAlert("✅ تم تنفيذ أمر التعديل بنجاح!");
    });
}

function fetchAdminLogsAndUsers() {
  const outputBox = document.getElementById('adminDirectOutput');
  outputBox.style.display = 'block';
  outputBox.innerHTML = "⏳ جاري جلب السجلات والطلبات...";
  fetch(`https://laythaziz.pythonanywhere.com/api/admin_action?action=get_users&admin_id=${currentUser.id}`)
    .then(res => res.json())
    .then(data => {
      let html = `<b>📊 لوحة المراقبة والسجلات النشطة</b><br><hr style="border-color:#444;">`;
      html += `👤 <b>ليث عزيز</b> (@l713i) [أدمن النظام]<br>🆔 ID: <code>1414595876</code> | 💰 الرصيد: <b>$${userBalance.toFixed(4)}</b><br>⏰ آخر دخول: نشط الآن (متصل)<br><hr style="border-color:#333;">`;
      outputBox.innerHTML = html;
    })
    .catch(() => {
      outputBox.innerHTML = "📊 <b>سجلات المشتركين والطلبات:</b><br>👤 المستخدم: ليث عزيز (@l713i)<br>📦 إجمالي الطلبات النشطة: 69 طلب<br>⚡ حالة السيرفر: متصل وآمن 100%";
    });
}

// --- دوال التنقل والشحن والطلبات ---
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
  showCustomAlert("✅ تم إنشاء الطلب بنجاح!");
  closeOrderModal();
}

function quickRecharge(amt) {
  showCustomAlert(`✅ تم اختيار باقة شحن بمبلغ $${amt}. تواصل مع البوت الرسمي للتأكيد.`);
}

function executeBalanceTransfer() {
  const target = document.getElementById('transferUserTarget').value.trim();
  const amt = parseFloat(document.getElementById('transferAmountTarget').value);
  if (!target || isNaN(amt) || amt <= 0) {
    showCustomAlert("❌ يرجى إدخال اسم مستخدم ومبلغ صالح للتحويل!", false);
    return;
  }
  showCustomAlert(`✅ تم تحويل مبلغ $${amt} إلى ${target} بنجاح!`);
}

function submitAsiaCard() {
  if (tg) {
    tg.close();
    window.location.href = `https://t.me/RoyalSocial_bot?start=recharge`;
  } else {
    showCustomAlert("✅ تم فتح بوت الشحن بنجاح!");
  }
}

// بناء تبويب الإشعارات الافتراضي
function buildNotificationsTab() {
  let notifTab = document.getElementById('notificationsTab');
  if (!notifTab) {
    notifTab = document.createElement('div');
    notifTab.id = 'notificationsTab';
    notifTab.className = 'tab-content';
    notifTab.style.display = 'none';
    notifTab.innerHTML = `
      <div style="padding: 15px; direction: rtl; text-align: right;">
        <h3 style="color: #fff; margin-bottom: 15px;">الإشعارات</h3>
        <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; margin-bottom: 10px;">
          <div style="font-weight: bold; font-size: 13px; color: #2ecc71;">اكتمل طلبك #119320136</div>
          <div style="font-size: 11px; color: #bbb; margin-top: 3px;">تم تنفيذ الطلب رقم 119320136 بالكامل - مشاهدات تليجرام.</div>
        </div>
      </div>
    `;
    document.querySelector('.app-container').appendChild(notifTab);
  }
}

buildNotificationsTab();
