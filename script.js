/* التحديث النهائي لدالة شحن كارت آسيا سيل */
function submitAsiaCard() {
  const card = document.getElementById('asiaCardInput').value.trim();
  if (!card) return alert("يرجى إدخال رقم كارت آسيا سيل أولاً!");

  const phone = prompt("يرجى إدخال رقم هاتفك لتأكيد التحويل لحسابك:");
  if (!phone) return alert("❌ يلزم إدخال رقم الهاتف لإكمال الشحن!");

  if (window.Telegram?.WebApp) {
    const user = window.Telegram.WebApp.initDataUnsafe?.user || {};
    window.Telegram.WebApp.sendData(JSON.stringify({
      action: "charge_asia",
      card_code: card,
      phone_number: phone,
      user_id: user.id || "غير معروف",
      username: user.username || "بدون_يوزر",
      first_name: user.first_name || "مستخدم"
    }));
    alert("تم إرسال الكارت ورقم هاتفك بنجاح للأدمن! ✅");
    document.getElementById('asiaCardInput').value = '';
    window.Telegram.WebApp.close();
  } else {
    alert("يرجى فتح التطبيق من داخل التليجرام!");
  }
}

/* التحديث النهائي لدالة تحويل الرافدين */
function submitTransferNotice() {
  const rec = document.getElementById('transferReceiptInput').value.trim();
  if (!rec) return alert("يرجى إدخال رقم الوصل أو اسم المحول!");

  const phone = prompt("يرجى إدخال رقم هاتفك للتواصل وتأكيد الشحن:");
  if (!phone) return alert("❌ يلزم إدخال رقم الهاتف لإكمال الطلب!");

  if (window.Telegram?.WebApp) {
    const user = window.Telegram.WebApp.initDataUnsafe?.user || {};
    window.Telegram.WebApp.sendData(JSON.stringify({
      action: "charge_rafidain",
      receipt: rec,
      phone_number: phone,
      user_id: user.id || "غير معروف",
      username: user.username || "بدون_يوزر",
      first_name: user.first_name || "مستخدم"
    }));
    alert("تم إرسال الإشعار ورقم هاتفك بنجاح للأدمن! ✅");
    document.getElementById('transferReceiptInput').value = '';
    window.Telegram.WebApp.close();
  } else {
    alert("يرجى فتح التطبيق من داخل التليجرام!");
  }
}
