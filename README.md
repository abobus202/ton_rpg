# Telegram Mini App — как развернуть

Веб-страница с кнопками «Открыть бокс», которая через TON Connect шлёт
платёж (сообщение BuyItem) на твой контракт. После оплаты бэкенд-слушатель
видит транзакцию, раскодирует покупку и выдаёт игроку случайный предмет.

## Файлы
- `index.html` — само приложение
- `tonconnect-manifest.json` — манифест для TON Connect
- `icon.svg` — иконка (нужно сконвертировать в PNG, см. ниже)

---

## ШАГ 1. Подготовить иконку

Манифесту нужен PNG (не SVG). Конвертируй icon.svg в icon.png любым способом:
- онлайн-конвертер svg→png (например cloudconvert), размер 256x256
- положи получившийся `icon.png` рядом с index.html

(Без иконки тоже обычно работает, но лучше сделать.)

---

## ШАГ 2. Залить на GitHub Pages

1. Создай новый публичный репозиторий на github.com (например `ton-rpg-app`).
2. Загрузи в него три файла: `index.html`, `tonconnect-manifest.json`, `icon.png`.
   (через сайт: Add file → Upload files → перетащи → Commit)
3. В репозитории: Settings → Pages.
4. В разделе "Build and deployment": Source = **Deploy from a branch**,
   Branch = **main**, папка = **/ (root)**. Save.
5. Через 1-2 минуты вверху появится адрес вида:
   `https://ТВОЙ_ЛОГИН.github.io/ton-rpg-app/`
   ЗАПОМНИ его.

---

## ШАГ 3. Прописать свой адрес в двух местах

Теперь, когда знаешь свой github.io адрес, поправь:

### A) tonconnect-manifest.json
Замени USERNAME и REPO на свои:
```json
{
  "url": "https://ТВОЙ_ЛОГИН.github.io/ton-rpg-app",
  "name": "Idle RPG TON",
  "iconUrl": "https://ТВОЙ_ЛОГИН.github.io/ton-rpg-app/icon.png"
}
```

### B) index.html
Найди строку (раздел НАСТРОЙКИ, ближе к концу файла):
```js
const MANIFEST_URL = "https://USERNAME.github.io/REPO/tonconnect-manifest.json";
```
Замени на свой адрес:
```js
const MANIFEST_URL = "https://ТВОЙ_ЛОГИН.github.io/ton-rpg-app/tonconnect-manifest.json";
```

Залей изменённые файлы обратно (повторный Upload / Commit).
Адрес контракта (CONTRACT_ADDRESS) уже прописан — менять не нужно.

---

## ШАГ 4. Создать бота и привязать Mini App

1. В Telegram открой **@BotFather**.
2. `/newbot` → задай имя и username (заканчивается на `bot`).
   Получишь токен — он понадобится позже для бэкенд-логики, сохрани.
3. Привяжи Mini App к боту:
   - `/newapp` → выбери своего бота
   - заполни название, описание, картинку
   - **Web App URL**: вставь `https://ТВОЙ_ЛОГИН.github.io/ton-rpg-app/`
4. Альтернатива — кнопка меню:
   - `/mybots` → выбери бота → Bot Settings → Menu Button
   - укажи текст кнопки и тот же URL.

---

## ШАГ 5. Запустить и проверить полный цикл

1. На компьютере запусти бэкенд-слушатель (он должен работать, чтобы
   открывать боксы):
   ```bash
   cd backend
   python listener.py
   ```
2. В Telegram открой своего бота → нажми кнопку запуска Mini App.
3. Нажми «Connect Wallet» → подключи Tonkeeper (в TESTNET-режиме!).
4. Нажми «Открыть бокс» → подтверди оплату 0.1 TEST TON в кошельке.
5. Через несколько секунд:
   - в Mini App: «Оплата отправлена!»
   - в окне слушателя:
     ```
     Новый платёж!
     BuyItem: itemTag='box:characters' playerId='tg_...'
     [+] Бокс персонажей открыт! Игрок получил: Рыцарь
     ```

🎉 Это полный цикл: клик в Telegram → блокчейн → дроп на сервере.

Проверить инвентарь:
```bash
python show_inventory.py tg_ТВОЙ_TELEGRAM_ID
```

---

## Частые проблемы
- **TON Connect не открывает кошелёк** — проверь, что MANIFEST_URL
  правильный и файл доступен по https (открой его в браузере).
- **«Транзакция отменена»** — ты отклонил в кошельке, или кошелёк
  в mainnet-режиме (нужен testnet).
- **Платёж прошёл, но бокс не открылся** — слушатель не запущен,
  или сумма меньше 0.05 TON.
- **Mini App не открывается в Telegram** — URL в BotFather должен
  быть точным https-адресом с github.io.

## Важно про testnet
Сейчас всё в testnet (тестовые монеты). Это правильно для разработки.
Перед mainnet: поменяй адрес контракта на mainnet-версию,
выключи debug в контракте, передеплой, обнови CONTRACT_ADDRESS в index.html.
