@echo off
:: Запуск WhatsApp
adb shell am start -n com.whatsapp/com.whatsapp.HomeActivity
:: Ожидание секунда для полной загрузки приложения
timeout /t 1
adb shell input keyevent 22
:: Повторная симуляция нажатия клавиши ➜
adb shell input keyevent 22
:: Ещё одна симуляция нажатия клавиши ➜
adb shell input keyevent 22
:: Ещё одна симуляция нажатия клавиши ➜
adb shell input keyevent 22
