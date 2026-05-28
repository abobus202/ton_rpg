# TON Underworld — Mini App (React + Vite)

Переезд с одного index.html на компонентный React-проект.
Вся отлаженная логика (TON Connect, BuyItem-payload, загрузка состояния) сохранена.

## Структура
```
src/
  main.jsx              — точка входа, TonConnectUIProvider
  App.jsx               — главный компонент
  config.js             — адреса (контракт, манифест, API), цены боксов
  index.css             — тёмная фэнтези-тема
  lib/
    ton.js              — сборка BuyItem-payload (проверено байт-в-байт) + toNano
    useTelegram.js      — хук: user.id и initData из Telegram
  components/
    ResourceBar.jsx     — полоса ресурсов сверху
    BoxCard.jsx         — карточка бокса
    WorkersList.jsx     — список рабочих (hp/возраст/уровень)
    BuildingsList.jsx   — список зданий (уровень/прочность)
vite.config.js          — base='/ton_rpg/' для GitHub Pages
package.json
```

## Установка
```bash
npm install
```

## Перед запуском — настроить config.js
Открой `src/config.js` и проверь:
- `CONTRACT_ADDRESS` — уже стоит твой.
- `MANIFEST_URL` — уже стоит твой.
- `API_BASE` — ВСТАВЬ свой адрес от ngrok (без слеша в конце).

## Разработка (локально)
```bash
npm run dev
```
Откроется http://localhost:5173/ton_rpg/
Вне Telegram кошелёк подключится, но user.id будет пустой
(Telegram-данные доступны только внутри Telegram).

## Сборка и деплой на GitHub Pages
```bash
npm run deploy
```
Эта команда собирает проект и публикует папку dist в ветку gh-pages
через инструмент gh-pages (ставится с зависимостями).

ВАЖНО про деплой:
- В package.json поле "homepage" должно быть твоим адресом
  (уже стоит https://abobus202.github.io/ton_rpg).
- В vite.config.js base должно совпадать с именем репозитория
  (уже стоит /ton_rpg/).
- После первого `npm run deploy` зайди в Settings → Pages и убедись,
  что Source = Deploy from a branch, Branch = gh-pages, папка / (root).

## Важно: манифест и .nojekyll
Файлы tonconnect-manifest.json, icon.png и .nojekyll должны остаться
доступными по адресу сайта. gh-pages публикует только содержимое dist,
поэтому положи эти три файла в папку `public/` — Vite копирует их в dist
автоматически при сборке. (manifest и icon уже можно положить туда.)

## Что осталось от старого index.html
Старый одностраничный index.html больше не нужен — этот проект его заменяет.
Но НЕ удаляй из репозитория tonconnect-manifest.json и icon.png
(они нужны TON Connect). Положи их в public/.
