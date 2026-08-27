/* ============================================================
   КОНФИГ — единственный файл, который нужно править под себя.
   Метрики взяты под iPhone 15 Pro Max (430×932 pt), иконка 64pt,
   сетка 4×6. Всё остальное считается автоматически.
   ============================================================ */

const CONFIG = {

  /* --- ЭКРАН 1 (12 иконок = 3 ряда, как на твоём телефоне) ---
     file  — путь к твоей картинке
     name  — подпись под иконкой
     live  — 'clock' | 'calendar' → иконка рисуется живой (реальное время/дата)
     badge — число на красном бейдже (можно менять на странице ввода)          */
  screen1: [
    {name:'Сообщения',   file:'icons/screen1/messages.png',   badge:0},
    {name:'Контакты',    file:'icons/screen1/contacts.png',   badge:0},
    {name:'Календарь',   file:'icons/screen1/calendar.png',   live:'calendar', badge:11},
    {name:'Фото',        file:'icons/screen1/photos.png',     badge:0},
    {name:'Файлы',       file:'icons/screen1/files.png',      badge:0},
    {name:'Заметки',     file:'icons/screen1/notes.png',      badge:0},
    {name:'Часы',        file:'icons/screen1/clock.png',      live:'clock',    badge:0},
    {name:'Навигатор',   file:'icons/screen1/navigator.png',  badge:0},
    {name:'2ГИС',        file:'icons/screen1/maps.png',       badge:0},
    {name:'Напоминания', file:'icons/screen1/reminders.png',  badge:0},
    {name:'App Store',   file:'icons/screen1/appstore.png',   badge:0},
    {name:'Настройки',   file:'icons/screen1/settings.png',   badge:2},
  ],

  /* --- ЭКРАН 2 --- */
  screen2: [
    {name:'Погода',      file:'icons/screen2/weather.png',    badge:0},
    {name:'Здоровье',    file:'icons/screen2/health.png',     badge:0},
    {name:'Кошелёк',     file:'icons/screen2/wallet.png',     badge:0},
    {name:'Музыка',      file:'icons/screen2/music.png',      badge:0},
    {name:'Подкасты',    file:'icons/screen2/podcasts.png',   badge:3},
    {name:'Книги',       file:'icons/screen2/books.png',      badge:0},
    {name:'Дом',         file:'icons/screen2/home.png',       badge:0},
    {name:'Команды',     file:'icons/screen2/shortcuts.png',  badge:0},
    {name:'Диктофон',    file:'icons/screen2/voicememos.png', badge:0},
    {name:'Рулетка',     file:'icons/screen2/measure.png',    badge:0},
    {name:'Компас',      file:'icons/screen2/compass.png',    badge:0},
    {name:'Калькулятор', file:'icons/screen2/calculator.png', badge:0},
  ],

  /* --- ЭКРАН 3 — здесь происходит превращение в слово ---
     До триггера показываются эти обычные иконки.                        */
  screen3: [
    {name:'Почта',       file:'icons/screen3/mail.png',       badge:5},
    {name:'Телеграм',    file:'icons/screen3/telegram.png',   badge:0},
    {name:'Браузер',     file:'icons/screen3/browser.png',    badge:0},
    {name:'Заказы',      file:'icons/screen3/orders.png',     badge:0},
    {name:'Банк',        file:'icons/screen3/bank.png',       badge:0},
    {name:'Такси',       file:'icons/screen3/taxi.png',       badge:0},
    {name:'Доставка',    file:'icons/screen3/delivery.png',   badge:0},
    {name:'Билеты',      file:'icons/screen3/tickets.png',    badge:0},
    {name:'Спорт',       file:'icons/screen3/sport.png',      badge:0},
    {name:'Переводчик',  file:'icons/screen3/translate.png',  badge:0},
    {name:'Сканер',      file:'icons/screen3/scanner.png',    badge:0},
    {name:'Архив',       file:'icons/screen3/archive.png',    badge:0},
  ],

  /* --- ДОК (одинаков на всех экранах, без подписей) --- */
  dock: [
    {file:'icons/dock/phone.png'},
    {file:'icons/dock/camera.png'},
    {file:'icons/dock/safari.png'},
    {file:'icons/dock/extra.png'},
  ],

  /* --- ИКОНКИ-БУКВЫ ---
     Ключ — символ. file — твоя картинка. name — подпись под иконкой
     (название "приложения", начинающегося на эту букву).
     Если файла нет, иконка отрисуется как цветной сквиркл с буквой.       */
  letters: {
    'А':{file:'icons/letters/А.png', name:'Афиша'},
    'Б':{file:'icons/letters/Б.png', name:'Банк'},
    'В':{file:'icons/letters/В.png', name:'Виджеты'},
    'Г':{file:'icons/letters/Г.png', name:'Гид'},
    'Д':{file:'icons/letters/Д.png', name:'Дневник'},
    'Е':{file:'icons/letters/Е.png', name:'Еда'},
    'Ж':{file:'icons/letters/Ж.png', name:'Журнал'},
    'З':{file:'icons/letters/З.png', name:'Заметки'},
    'И':{file:'icons/letters/И.png', name:'Игры'},
    'Й':{file:'icons/letters/Й.png', name:'Йога'},
    'К':{file:'icons/letters/К.png', name:'Кино'},
    'Л':{file:'icons/letters/Л.png', name:'Локатор'},
    'М':{file:'icons/letters/М.png', name:'Музыка'},
    'Н':{file:'icons/letters/Н.png', name:'Новости'},
    'О':{file:'icons/letters/О.png', name:'Облако'},
    'П':{file:'icons/letters/П.png', name:'Погода'},
    'Р':{file:'icons/letters/Р.png', name:'Радио'},
    'С':{file:'icons/letters/С.png', name:'Список'},
    'Т':{file:'icons/letters/Т.png', name:'Такси'},
    'У':{file:'icons/letters/У.png', name:'Уроки'},
    'Ф':{file:'icons/letters/Ф.png', name:'Фото'},
    'Х':{file:'icons/letters/Х.png', name:'Хроно'},
    'Ц':{file:'icons/letters/Ц.png', name:'Цитаты'},
    'Ч':{file:'icons/letters/Ч.png', name:'Часы'},
    'Ш':{file:'icons/letters/Ш.png', name:'Шаги'},
    'Щ':{file:'icons/letters/Щ.png', name:'Щит'},
    'Э':{file:'icons/letters/Э.png', name:'Эфир'},
    'Ю':{file:'icons/letters/Ю.png', name:'Юмор'},
    'Я':{file:'icons/letters/Я.png', name:'Ярлык'},
    'A':{file:'icons/letters/A.png', name:'Alarm'},
    'B':{file:'icons/letters/B.png', name:'Books'},
    'C':{file:'icons/letters/C.png', name:'Camera'},
    'D':{file:'icons/letters/D.png', name:'Drive'},
    'E':{file:'icons/letters/E.png', name:'Editor'},
    'F':{file:'icons/letters/F.png', name:'Files'},
    'G':{file:'icons/letters/G.png', name:'Gallery'},
    'H':{file:'icons/letters/H.png', name:'Health'},
    'I':{file:'icons/letters/I.png', name:'Inbox'},
    'J':{file:'icons/letters/J.png', name:'Journal'},
    'K':{file:'icons/letters/K.png', name:'Keynote'},
    'L':{file:'icons/letters/L.png', name:'Lists'},
    'M':{file:'icons/letters/M.png', name:'Music'},
    'N':{file:'icons/letters/N.png', name:'Notes'},
    'O':{file:'icons/letters/O.png', name:'Office'},
    'P':{file:'icons/letters/P.png', name:'Photos'},
    'Q':{file:'icons/letters/Q.png', name:'Quiz'},
    'R':{file:'icons/letters/R.png', name:'Radio'},
    'S':{file:'icons/letters/S.png', name:'Stocks'},
    'T':{file:'icons/letters/T.png', name:'Timer'},
    'U':{file:'icons/letters/U.png', name:'Updates'},
    'V':{file:'icons/letters/V.png', name:'Voice'},
    'W':{file:'icons/letters/W.png', name:'Weather'},
    'X':{file:'icons/letters/X.png', name:'Xtra'},
    'Y':{file:'icons/letters/Y.png', name:'Yield'},
    'Z':{file:'icons/letters/Z.png', name:'Zones'},
  },

  /* --- ЗОНЫ ТРИГГЕРА (невидимые) ---
     Координаты в процентах от экрана. Обе зоны делают одно и то же,
     вторая — запасная, на случай если первая не сработала.
     Лежат в пустой области под иконками, там нечего задеть.              */
  triggers: {
    primary: { left:'2%',  top:'52%', width:'26%', height:'16%' },
    backup:  { right:'2%', top:'52%', width:'26%', height:'16%' },
  },

  /* --- ПОВЕДЕНИЕ --- */
  behavior: {
    swapScreenIndex: 2,      // на каком экране происходит превращение (0,1,2)
    haptics: true,           // вибрация при срабатывании триггера
    twoFingerSwipeDown: true // два пальца сверху вниз → страница ввода
  }
};
