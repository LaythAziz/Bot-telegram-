import telebot

TOKEN = "8840353818:AAGoOXv5lN2mB00mYKR2GDV58rHXTOFd8GE"
bot = telebot.TeleBot(TOKEN)


@bot.message_handler(commands=["start"])
def send_welcome(message):
  bot.reply_to(
      message, "أهلاً بك! تم تشغيل البوت بنجاح عبر سحابة GitHub مجاناً 🚀"
  )


print("Bot is running...")
bot.infinity_polling()
