import os
import telebot
from telebot import types

# التوكن الخاص بك
TOKEN = "8840353818:AAGoOXv5lN2mB00mYKR2GDV58rHXTOFd8GE"
bot = telebot.TeleBot(TOKEN)


@bot.message_handler(commands=['start'])
def send_welcome(message):
  user_name = message.from_user.first_name

  # إنشاء زر الـ Mini App
  markup = types.InlineKeyboardMarkup()
  # يمكنك تغيير الرابط لاحقاً برابط استضافتك لواجهة الـ Mini App
  web_app = types.WebAppInfo(url='https://your-mini-app-url.vercel.app')
  btn = types.InlineKeyboardButton(
      text='🚀 افتح بوت الخدمات (Mini App)', web_app=web_app
  )
  markup.add(btn)

  welcome_text = (
      f'مرحباً بك يا {user_name} في بوت الخدمات الرقمية 👑\n\n'
      '• خدمات متكاملة لجميع منصات التواصل الاجتماعي.\n'
      '• سرعة في التنفيذ وأمان تام لحساباتك.\n\n'
      'اضغط على الزر بالأسفل لفتح التطبيق وبدء الاستخدام 👇'
  )
  bot.send_message(message.chat.id, welcome_text, reply_markup=markup)


if __name__ == '__main__':
  print('البوت يعمل الآن بنجاح...')
  bot.infinity_polling()
