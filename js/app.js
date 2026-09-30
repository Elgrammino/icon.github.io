'use strict';
/* =========================================================
   КОНФИГ
   Чтобы поставить СВОЮ картинку — положи файл с точно таким
   именем, как в поле `file`. Если файла нет — нарисуется
   заглушка, ничего не сломается.
   type: 'widget-calendar' | 'live-calendar' | 'live-clock' — живые
   элементы, которые на настоящем iPhone показывают текущие дату/время.
   ========================================================= */

// 1-я страница (как у свежего iPhone: виджет сверху, системные приложения)
const PAGE1 = [
  {type:'widget-calendar', name:'Календарь'},
  {name:'Фото',        file:'icons/screen1/photos.png',    glyph:'photo',  bg:'#fff'},
  {name:'Камера',      file:'icons/screen1/camera.png',    glyph:'camera', bg:'linear-gradient(#d5d5da,#8e8e93)'},
  {name:'Часы',        type:'live-clock'},
  {name:'Погода',      file:'icons/screen2/weather.png',   glyph:'cloud',  bg:'linear-gradient(#4fb3ff,#1e6fe0)'},
  {name:'Карты',       file:'icons/screen1/maps.png',      glyph:'pin',    bg:'linear-gradient(#7ed957,#2f9e44)'},
  {name:'Напоминания', file:'icons/screen1/reminders.png', glyph:'list',   bg:'#fff'},
  {name:'Заметки',     file:'icons/screen1/notes.png',     glyph:'note',   bg:'#fff'},
  {name:'Книги',       file:'icons/screen2/books.png',     glyph:'book',   bg:'linear-gradient(#ffa24a,#ff7a1a)'},
  {name:'App Store',   file:'icons/screen1/appstore.png',  glyph:'bag',    bg:'linear-gradient(#1ac8fc,#1a74e8)'},
  {name:'Подкасты',    file:'icons/screen2/podcasts.png',  glyph:'mic',    bg:'linear-gradient(#d56efc,#832bc1)'},
  {name:'Здоровье',    file:'icons/screen2/health.png',    glyph:'heart',  bg:'#fff'},
  {name:'Дом',         file:'icons/screen2/home.png',      glyph:'house',  bg:'#fff'},
  {name:'Wallet',      file:'icons/screen2/wallet.png',    glyph:'wallet', bg:'#1c1c1e'},
  {name:'Настройки',   file:'icons/screen1/settings.png',  glyph:'gear',   bg:'linear-gradient(#a2a2a7,#636366)'},
];

// 2-я страница
const PAGE2 = [
  {name:'Календарь',   type:'live-calendar'},
  {name:'Контакты',    file:'icons/screen1/contacts.png',   glyph:'person',  bg:'linear-gradient(#c9c9ce,#9a9aa2)'},
  {name:'Файлы',       file:'icons/screen1/files.png',      glyph:'folder',  bg:'#fff'},
  {name:'Калькулятор', file:'icons/screen2/calculator.png', glyph:'calc',    bg:'#1c1c1e'},
  {name:'Компас',      file:'icons/screen2/compass.png',    glyph:'compass', bg:'#1c1c1e'},
  {name:'Диктофон',    file:'icons/screen2/voicememos.png', glyph:'mic',     bg:'#1c1c1e'},
  {name:'Рулетка',     file:'icons/screen2/measure.png',    glyph:'ruler',   bg:'#1c1c1e'},
  {name:'Команды',     file:'icons/screen2/shortcuts.png',  glyph:'spark',   bg:'linear-gradient(#e0406b,#4a55d8)'},
];

// Док — одинаковый на всех страницах (по умолчанию у iPhone: Телефон, Safari, Сообщения, Музыка)
const DOCK = [
  {name:'Телефон',   file:'icons/dock/phone.png',    glyph:'phone',    bg:'linear-gradient(#5cf777,#0dbb29)'},
  {name:'Safari',    file:'icons/dock/safari.png',   glyph:'compass2', bg:'#fff'},
  {name:'Сообщения', file:'icons/dock/messages.png', glyph:'bubble',   bg:'linear-gradient(#5cf777,#0dbb29)'},
  {name:'Музыка',    file:'icons/dock/music.png',    glyph:'music',    bg:'linear-gradient(#ff6a80,#fa243c)'},
];

// icons/letters/{БУКВА}.png, для повторяющейся буквы — {БУКВА}_2.png, _3.png …
const LETTER_DIR = 'icons/letters/';

// Подписи под иконками-буквами: правдоподобные названия приложений,
// а не одна буква (одиночная буква под иконкой сразу выдаёт трюк).
// Массив = варианты для 1-го, 2-го… вхождения буквы в слово.
const LETTER_NAMES = {
  'А':['Альта','Аврора'],'Б':['Бриз','Баланс'],'В':['Волна','Вектор'],'Г':['Горизонт','Гармония'],
  'Д':['Динамика','Дюна'],'Е':['Еврика','Единство'],'Ё':['Ёлка'],'Ж':['Жар','Жетон'],'З':['Зелень','Зенит'],
  'И':['Искра','Импульс'],'Й':['Йота'],'К':['Коннект','Кадр'],'Л':['Люмен','Лагуна'],'М':['Мотив','Маяк'],
  'Н':['Нова','Нота'],'О':['Орбита','Облако'],'П':['Портал','Пульс'],'Р':['Радар','Ритм'],'С':['Синтез','Сфера'],
  'Т':['Тропа','Тема'],'У':['Унисон','Узор'],'Ф':['Фокус','Фаза'],'Х':['Хорда','Хронос'],'Ц':['Цитадель','Цель'],
  'Ч':['Чекин','Частота'],'Ш':['Шифр','Шторм'],'Щ':['Щит'],'Ъ':['Ъ'],'Ы':['Ы'],'Ь':['Ь'],'Э':['Эхо','Эфир'],
  'Ю':['Юнга','Юпитер'],'Я':['Ясно','Якорь'],
  'A':['Astral','Aura'],'B':['Bloom','Beacon'],'C':['Cloudy','Canvas'],'D':['Dynamo','Drift'],'E':['Elevate','Echo'],
  'F':['Feather','Flux'],'G':['Grove','Glyph'],'H':['Hertz','Haven'],'I':['Illuminate','Iris'],'J':['Juno','Jot'],
  'K':['Kinetic','Kite'],'L':['Lineo','Lumen'],'M':['Mountain','Maven'],'N':['Nova','Nimbus'],'O':['Orbit','Onyx'],
  'P':['Pulse','Prism'],'Q':['Quill','Quest'],'R':['Radar','Relay'],'S':['Spark','Scope'],'T':['Tempo','Tide'],
  'U':['Unity','Umbra'],'V':['Vivid','Vault'],'W':['Wave','Wisp'],'X':['Xenon'],'Y':['Yonder'],'Z':['Zenith','Zest'],
};

// Если для буквы нет своей картинки — пробуем похожую по начертанию из другого алфавита
const HOMOGLYPHS = {
  'А':'A','В':'B','Е':'E','К':'K','М':'M','Н':'H','О':'O','Р':'P','С':'C','Т':'T','Х':'X','У':'Y',
  'A':'А','B':'В','E':'Е','K':'К','M':'М','H':'Н','O':'О','P':'Р','C':'С','T':'Т','X':'Х','Y':'У',
};

/* ---------- запасные глифы (если нет картинки) ---------- */
const svg24 = p => `<svg viewBox="0 0 24 24" fill="none">${p}</svg>`;
const GLYPHS = {
  bubble: svg24('<path d="M12 4C7 4 3 7.2 3 11.2c0 2.3 1.3 4.3 3.4 5.6-.2 1.2-.8 2.3-1.7 3.2 1.8-.1 3.4-.8 4.6-1.8.9.2 1.8.3 2.7.3 5 0 9-3.2 9-7.3S17 4 12 4z" fill="#fff"/>'),
  person: svg24('<circle cx="12" cy="8" r="4" fill="#fff"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="#fff"/>'),
  photo: svg24('<circle cx="12" cy="8" r="3" fill="#ffd60a"/><circle cx="7" cy="9" r="2.4" fill="#ff9f0a"/><circle cx="17" cy="9" r="2.4" fill="#30d158"/><circle cx="12" cy="15" r="3" fill="#0a84ff"/>'),
  folder: svg24('<path d="M4 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" fill="#1e90ff"/>'),
  note: svg24('<rect x="4" y="4" width="16" height="16" rx="2" fill="#fff"/><line x1="7" y1="9" x2="17" y2="9" stroke="#e6b800" stroke-width="1.6"/><line x1="7" y1="13" x2="17" y2="13" stroke="#e6b800" stroke-width="1.6"/>'),
  compass: svg24('<circle cx="12" cy="12" r="9" fill="#fff"/><path d="M15 9l-2 6-6 2 2-6z" fill="#0a84ff"/>'),
  compass2: svg24('<circle cx="12" cy="12" r="9" fill="#1a8cff"/><path d="M8 16l3-7 5 1-3 7z" fill="#fff"/>'),
  pin: svg24('<path d="M12 3c-3.9 0-7 3-7 7 0 5.2 7 11 7 11s7-5.8 7-11c0-4-3.1-7-7-7z" fill="#fff"/><circle cx="12" cy="10" r="2.6" fill="#30d158"/>'),
  list: svg24('<circle cx="6" cy="7" r="1.6" fill="#0a84ff"/><circle cx="6" cy="12" r="1.6" fill="#ff3b30"/><circle cx="6" cy="17" r="1.6" fill="#ff9f0a"/><path d="M10 7h9M10 12h9M10 17h9" stroke="#ccc" stroke-width="1.2"/>'),
  bag: svg24('<path d="M12 5l-5 9h10zM6 17h12" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none"/>'),
  gear: svg24('<circle cx="12" cy="12" r="3.2" fill="#fff"/><path d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18 6l-1.6 1.6M7.6 16.4L6 18M18 18l-1.6-1.6M7.6 7.6L6 6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/>'),
  cloud: svg24('<path d="M7 17a4 4 0 010-8 5 5 0 019.6-1.5A4 4 0 0117 17H7z" fill="#fff"/>'),
  heart: svg24('<path d="M12 20s-7-4.4-7-9.5C5 7.5 7.2 5 10 5c1 0 2 .5 2 1.5 0-1 1-1.5 2-1.5 2.8 0 5 2.5 5 5.5C19 15.6 12 20 12 20z" fill="#ff2d55"/>'),
  wallet: svg24('<rect x="4" y="6" width="16" height="13" rx="2" fill="#fff"/><circle cx="16" cy="12.5" r="1.6" fill="#111"/>'),
  music: svg24('<circle cx="8" cy="17" r="2.4" fill="#fff"/><circle cx="17" cy="15" r="2.4" fill="#fff"/><path d="M10.4 17V6.6L19.4 5v10.4" stroke="#fff" stroke-width="1.6" fill="none"/>'),
  mic: svg24('<rect x="9" y="3" width="6" height="11" rx="3" fill="#fff"/><path d="M6 11a6 6 0 0012 0M12 17v3" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>'),
  book: svg24('<path d="M4 5h7v15H4a1 1 0 01-1-1V6a1 1 0 011-1z" fill="#fff"/><path d="M20 5h-7v15h7a1 1 0 001-1V6a1 1 0 00-1-1z" fill="#fff" opacity=".75"/>'),
  house: svg24('<path d="M4 11l8-6 8 6v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8z" fill="#ff9f0a"/>'),
  ruler: svg24('<rect x="3" y="9" width="18" height="6" rx="1.5" transform="rotate(-15 12 12)" fill="#ffd60a"/>'),
  calc: svg24('<rect x="5" y="3" width="14" height="18" rx="2" fill="#333"/><circle cx="8.5" cy="13.5" r="1.1" fill="#fff"/><circle cx="12" cy="13.5" r="1.1" fill="#fff"/><circle cx="15.5" cy="13.5" r="1.1" fill="#ff9f0a"/>'),
  phone: svg24('<path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z" fill="#fff"/>'),
  camera: svg24('<rect x="3" y="7" width="18" height="13" rx="2" fill="#1c1c1e"/><circle cx="12" cy="13.5" r="4" fill="none" stroke="#8e8e93" stroke-width="1.6"/>'),
  spark: svg24('<path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z" fill="#fff"/>'),
};

const MENU_GLYPHS = {
  edit:  '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="1.8" width="10" height="16.4" rx="2.4"/><rect x="7.4" y="5" width="2" height="2" rx=".5" fill="currentColor" stroke="none"/><rect x="10.6" y="5" width="2" height="2" rx=".5" fill="currentColor" stroke="none"/><rect x="7.4" y="8.4" width="2" height="2" rx=".5" fill="currentColor" stroke="none"/><rect x="10.6" y="8.4" width="2" height="2" rx=".5" fill="currentColor" stroke="none"/></svg>',
  share: '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7.5H5.5a1.5 1.5 0 00-1.5 1.5v7.5A1.5 1.5 0 005.5 18h9a1.5 1.5 0 001.5-1.5V9a1.5 1.5 0 00-1.5-1.5H13M10 12V1.8M6.8 4.8L10 1.6l3.2 3.2"/></svg>',
  remove:'<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10" cy="10" r="8"/><path d="M6 10h8"/></svg>',
};

/* =========================================================
   УТИЛИТЫ
   ========================================================= */
const $ = s => document.querySelector(s);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function el(tag, cls, html){
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
}
const encodePath = p => p.split('/').map(encodeURIComponent).join('/');
const store = {
  get(k){ try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v){ try { localStorage.setItem(k, v); return true; } catch { return false; } },
  del(k){ try { localStorage.removeItem(k); } catch {} },
};
const vibrate = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch {} };

const screenEl = $('#screen'), homeEl = $('#home'), trackEl = $('#track');
const dockEl = $('#dock'), indicatorEl = $('#indicator'), dotsEl = $('#dots');
const menuLayer = $('#menuLayer'), appLayer = $('#appLayer');

const isStandalone = () =>
  window.navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
const isDevice = () => isStandalone() || matchMedia('(max-width: 500px)').matches;

/* =========================================================
   ИКОНКИ
   ========================================================= */
function buildIcon(app){
  const icon = el('div', 'icon');
  if (app.type === 'live-clock'){ icon.classList.add('icon--clock'); icon.innerHTML = clockSVG(); return icon; }
  if (app.type === 'live-calendar'){
    icon.classList.add('icon--calendar');
    icon.innerHTML = '<span class="cal-wd"></span><span class="cal-day"></span>';
    return icon;
  }
  const fallback = () => {
    icon.textContent = '';
    icon.style.background = app.bg || '#2c2c2e';
    if (app.fallbackHTML){ icon.classList.add('letter-fallback'); icon.innerHTML = app.fallbackHTML; }
    else icon.innerHTML = GLYPHS[app.glyph] || '';
  };
  const sources = app.files || (app.file ? [app.file] : []);
  if (!sources.length){ fallback(); return icon; }
  const img = new Image();
  img.alt = ''; img.draggable = false; img.decoding = 'async';
  let i = 0;
  img.onerror = () => { i++; if (i < sources.length) img.src = encodePath(sources[i]); else fallback(); };
  img.src = encodePath(sources[0]);
  icon.appendChild(img);
  return icon;
}

function buildCell(app, {label = true} = {}){
  const cell = el('div', 'cell');
  const jig = el('div', 'jig');
  if (app.type === 'widget-calendar'){
    cell.classList.add('cell--widget');
    jig.append(el('div', 'widget', '<div class="w-wd"></div><div class="w-day"></div><div class="w-note">Нет событий на сегодня</div>'));
  } else {
    jig.append(buildIcon(app));
  }
  jig.append(el('div', 'badge'));
  if (label){ const l = el('div', 'label'); l.textContent = app.name || ''; jig.append(l); }
  cell.append(jig);
  cell._app = app;
  return cell;
}

/* ---------- живые «Часы» ---------- */
function clockSVG(){
  let ticks = '', nums = '';
  for (let h = 1; h <= 12; h++){
    const a = h * Math.PI / 6, x = 50 + Math.sin(a) * 33, y = 50 - Math.cos(a) * 33 + 4;
    nums += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}">${h}</text>`;
  }
  for (let m = 0; m < 60; m++){
    if (m % 5 === 0) continue;
    const a = m * Math.PI / 30;
    ticks += `<line x1="${(50 + Math.sin(a) * 42).toFixed(1)}" y1="${(50 - Math.cos(a) * 42).toFixed(1)}" x2="${(50 + Math.sin(a) * 44.5).toFixed(1)}" y2="${(50 - Math.cos(a) * 44.5).toFixed(1)}"/>`;
  }
  return `<svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="46.5" fill="#fff"/>
    <g stroke="#9a9aa0" stroke-width=".7">${ticks}</g>
    <g font-family="-apple-system,system-ui,'Segoe UI',sans-serif" font-size="11.5" font-weight="500" text-anchor="middle" fill="#000">${nums}</g>
    <g class="clock-h"><line x1="50" y1="52" x2="50" y2="29" stroke="#000" stroke-width="3.4" stroke-linecap="round"/></g>
    <g class="clock-m"><line x1="50" y1="52" x2="50" y2="15" stroke="#000" stroke-width="2.6" stroke-linecap="round"/></g>
    <circle cx="50" cy="50" r="2.9" fill="#000"/>
    <g class="clock-sec"><line x1="50" y1="60" x2="50" y2="11" stroke="#ff9500" stroke-width="1.1" stroke-linecap="round"/><circle cx="50" cy="50" r="2" fill="#ff9500"/></g>
    <circle cx="50" cy="50" r=".8" fill="#fff"/>
  </svg>`;
}

function updateLiveIcons(){
  const now = new Date();
  const wdShort = now.toLocaleDateString('ru-RU', {weekday:'short'}).replace('.', '').toUpperCase();
  const wdLong = now.toLocaleDateString('ru-RU', {weekday:'long'});
  document.querySelectorAll('.cal-wd').forEach(n => n.textContent = wdShort);
  document.querySelectorAll('.cal-day, .w-day').forEach(n => n.textContent = now.getDate());
  document.querySelectorAll('.w-wd').forEach(n => n.textContent = wdLong);

  const s = now.getSeconds() + now.getMilliseconds() / 1000;
  const m = now.getMinutes() + s / 60, h = (now.getHours() % 12) + m / 60;
  document.querySelectorAll('.clock-h').forEach(n => n.setAttribute('transform', `rotate(${h * 30} 50 50)`));
  document.querySelectorAll('.clock-m').forEach(n => n.setAttribute('transform', `rotate(${m * 6} 50 50)`));
  document.querySelectorAll('.clock-sec').forEach(n => { n.style.animationDelay = `-${s}s`; });

  const t = $('#sbTime');
  if (t) t.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
}

/* ---------- страница со словом ---------- */
function letterFallbackHTML(ch){
  return `<span class="letter-glyph">${ch}</span>`;
}
function letterBg(ch){
  const hue = (ch.codePointAt(0) * 47) % 360;
  return `radial-gradient(120% 90% at 30% 0%, hsl(${hue} 55% 28%), hsl(${(hue + 30) % 360} 60% 9%))`;
}
function letterTint(ch){ return `hsl(${(ch.codePointAt(0) * 47) % 360} 90% 70%)`; }

function renderWord(word){
  const page = pages[2];
  page.textContent = '';
  const chars = [...(word || '').toUpperCase()].filter(c => /[A-ZА-ЯЁ0-9 ]/.test(c)).slice(0, 24);
  const seen = {};
  for (const ch of chars){
    if (ch === ' '){ page.append(el('div', 'cell cell--empty')); continue; }
    const n = seen[ch] = (seen[ch] || 0) + 1;
    const files = [];
    if (n > 1) files.push(`${LETTER_DIR}${ch}_${n}.png`);
    files.push(`${LETTER_DIR}${ch}.png`);
    if (HOMOGLYPHS[ch]) files.push(`${LETTER_DIR}${HOMOGLYPHS[ch]}.png`);
    const names = LETTER_NAMES[ch] || [ch];
    const cell = buildCell({
      name: names[(n - 1) % names.length],
      files, bg: letterBg(ch), fallbackHTML: letterFallbackHTML(ch),
    });
    cell.querySelector('.icon').style.setProperty('--tint', letterTint(ch));
    page.append(cell);
  }
  randomizeJiggle();
}

/* ---------- сборка экрана ---------- */
const pages = [PAGE1, PAGE2, null].map(() => el('div', 'page'));
pages.forEach(p => trackEl.append(p));
PAGE1.forEach(a => pages[0].append(buildCell(a)));
PAGE2.forEach(a => pages[1].append(buildCell(a)));
DOCK.forEach(a => dockEl.append(buildCell(a, {label:false})));
pages.forEach(() => dotsEl.append(el('i')));

function randomizeJiggle(){
  screenEl.querySelectorAll('.jig').forEach(j => {
    j.style.setProperty('--jd', (0.24 + Math.random() * 0.06).toFixed(3) + 's');
    j.style.setProperty('--jdl', (-Math.random() * 0.3).toFixed(3) + 's');
  });
}

/* =========================================================
   ГЕОМЕТРИЯ (iOS 17/18, эталон iPhone 15/16: 393×852 pt)
   ========================================================= */
const L = {};
const safeProbe = el('div');
safeProbe.style.cssText = 'position:fixed;top:0;left:0;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)';
document.body.append(safeProbe);

function layout(){
  const W = screenEl.clientWidth, H = screenEl.clientHeight;
  if (!W || !H) return;
  const u = W / 393;
  const device = document.body.classList.contains('device');
  const cs = getComputedStyle(safeProbe);
  // на устройстве — реальные безопасные зоны; в мокапе — как у iPhone с Dynamic Island
  const safeTop = device ? parseFloat(cs.paddingTop) || 0 : 59 * u;

  const icon = 60 * u, side = 27 * u;
  const pitchX = (W - 2 * side - icon) / 3;
  const gridLeft = side - (pitchX - icon) / 2;
  const gridTop = (device && safeTop < 1 ? 14 * u : safeTop + 13 * u);
  const dockH = 92 * u, dockTop = H - 12 * u - dockH;
  const pillTop = dockTop - 41 * u;
  const rowBlock = icon + 19 * u;                        // иконка + подпись
  const pitchY = clamp((pillTop - 16 * u - gridTop - rowBlock) / 5, 88 * u, 112 * u);

  Object.assign(L, {W, H, u, safeTop, icon, pitchX, pitchY, gridTop, gridLeft, dockTop});
  const root = document.documentElement.style;
  root.setProperty('--u', u + 'px');
  const s = screenEl.style;
  s.setProperty('--W', W + 'px');
  s.setProperty('--icon', icon + 'px');
  s.setProperty('--pitchX', pitchX + 'px');
  s.setProperty('--pitchY', pitchY + 'px');
  s.setProperty('--gridTop', gridTop + 'px');
  s.setProperty('--gridLeft', gridLeft + 'px');
  s.setProperty('--dockTop', dockTop + 'px');
  s.setProperty('--dockH', dockH + 'px');
  s.setProperty('--pillTop', pillTop + 'px');
  s.setProperty('--safeTop', Math.max(safeTop, 20 * u) + 'px');
  pager.resize(W);
}

/* =========================================================
   ЛИСТАНИЕ СТРАНИЦ — физика UIScrollView (paging)
   ========================================================= */
const pager = {
  count: pages.length, index: 0, pos: 0, W: 1, raf: 0, dragging: false, startPos: 0, startIndex: 0,
  set(x){
    this.pos = x;
    trackEl.style.transform = `translate3d(${x}px,0,0)`;
    this.updateDots(Math.round(-x / this.W));
  },
  resize(W){ this.stop(); this.W = W; this.set(-this.index * W); },
  stop(){ cancelAnimationFrame(this.raf); this.raf = 0; },
  // резинка на краях: формула UIScrollView
  rubber(x){
    const min = -(this.count - 1) * this.W, max = 0, d = this.W;
    const rb = o => (1 - 1 / (o * 0.55 / d + 1)) * d;
    if (x > max) return max + rb(x - max);
    if (x < min) return min - rb(min - x);
    return x;
  },
  unrubber(x){
    const min = -(this.count - 1) * this.W, max = 0, d = this.W;
    const inv = r => (d / (1 - r / d) - d) / 0.55;
    if (x > max) return max + inv(Math.min(x - max, d * 0.95));
    if (x < min) return min - inv(Math.min(min - x, d * 0.95));
    return x;
  },
  begin(){
    this.stop();
    this.dragging = true;
    this.startPos = this.unrubber(this.pos);
    this.startIndex = clamp(Math.round(-this.pos / this.W), 0, this.count - 1);
    indicator.show();
  },
  drag(dx){ this.set(this.rubber(this.startPos + dx)); },
  end(v){
    this.dragging = false;
    const cur = -this.pos / this.W;
    let target;
    if (Math.abs(v) > 0.25) target = v < 0 ? Math.floor(cur + 0.02) + 1 : Math.ceil(cur - 0.02) - 1;
    else target = Math.round(cur);
    target = clamp(target, this.startIndex - 1, this.startIndex + 1);
    this.go(clamp(target, 0, this.count - 1), v);
  },
  // критически задемпфированная пружина; v — скорость пальца (px/ms), переносится в анимацию
  go(i, v = 0){
    this.stop();
    this.index = i;
    this.updateDots(i);
    const target = -i * this.W;
    const omega = 2 * Math.PI / 420;                 // «response» ≈ 0.42 с
    const x0 = this.pos - target, v0 = clamp(v, -4, 4);
    const t0 = performance.now();
    const step = now => {
      const t = now - t0;
      const e = Math.exp(-omega * t);
      const x = (x0 + (v0 + omega * x0) * t) * e;
      const vel = (v0 - omega * (v0 + omega * x0) * t) * e;
      if (Math.abs(x) < 0.3 && Math.abs(vel) < 0.01){
        this.raf = 0; this.set(target); indicator.settle(); return;
      }
      this.set(target + x);
      this.raf = requestAnimationFrame(step);
    };
    indicator.show();
    this.raf = requestAnimationFrame(step);
  },
  updateDots(i){
    i = clamp(i, 0, this.count - 1);
    if (i === this._dot) return;
    this._dot = i;
    [...dotsEl.children].forEach((d, k) => d.classList.toggle('on', k === i));
  },
};

/* пилюля «Поиск» превращается в точки, пока листаешь, и обратно */
const indicator = {
  timer: 0,
  show(){ clearTimeout(this.timer); indicatorEl.dataset.mode = 'dots'; },
  settle(){
    clearTimeout(this.timer);
    if (editing) return;
    this.timer = setTimeout(() => { if (!pager.dragging && !pager.raf) indicatorEl.dataset.mode = 'search'; }, 1400);
  },
};

/* =========================================================
   ЖЕСТЫ
   ========================================================= */
const SLOP = 8;           // px до распознавания свайпа
const LONG_PRESS = 500;   // мс до контекстного меню
let g = null;             // текущий жест
let editing = false, menuOpen = false, appOpen = null, menuGuardUntil = 0;
const secretTaps = [];

function relRect(node){
  const a = node.getBoundingClientRect(), b = screenEl.getBoundingClientRect();
  return {x: a.left - b.left, y: a.top - b.top, w: a.width, h: a.height};
}

screenEl.addEventListener('pointerdown', e => {
  if (g || !e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
  if (e.target.closest('.menu-layer, .app-layer, .edit-bar')) return;
  const cell = e.target.closest('.cell:not(.cell--empty)');
  g = {
    id: e.pointerId, x0: e.clientX, y0: e.clientY, t0: performance.now(),
    cell, axis: null, moved: false, long: false,
    onIndicator: !!e.target.closest('.indicator'),
    samples: [{t: e.timeStamp, x: e.clientX}],
    caught: !!pager.raf,
  };
  try { screenEl.setPointerCapture(e.pointerId); } catch {}
  if (g.caught){ pager.begin(); g.axis = 'x'; }       // «поймали» страницу на лету

  if (cell && !editing && !g.caught){
    g.pressTimer = setTimeout(() => cell.classList.add('pressed'), 60);
  }
  if (!g.caught && !g.onIndicator){
    g.longTimer = setTimeout(() => onLongPress(), cell ? LONG_PRESS : 650);
  }
});

screenEl.addEventListener('pointermove', e => {
  if (!g || e.pointerId !== g.id) return;
  const dx = e.clientX - g.x0, dy = e.clientY - g.y0;
  if (!g.axis){
    if (Math.hypot(dx, dy) < SLOP) return;
    g.moved = true;
    cancelPress();
    if (g.long){                                   // держали меню и повели — режим покачивания
      if (menuOpen){ closeMenu(); enterEditing(); }
      g.axis = 'none';
      return;
    }
    g.axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
    if (g.axis === 'x'){ g.x0 = e.clientX; pager.begin(); }
    return;
  }
  if (g.axis === 'x'){
    pager.drag(e.clientX - g.x0);
    g.samples.push({t: e.timeStamp, x: e.clientX});
    while (g.samples.length > 2 && e.timeStamp - g.samples[0].t > 100) g.samples.shift();
  }
});

function finishGesture(e, cancelled){
  if (!g || e.pointerId !== g.id) return;
  const cur = g; g = null;
  clearTimeout(cur.longTimer); clearTimeout(cur.holdTimer);
  if (cur.axis === 'x'){
    let v = 0;
    const s = cur.samples, a = s[0], b = s[s.length - 1];
    if (!cancelled && b.t - a.t > 8 && e.timeStamp - b.t < 60) v = (b.x - a.x) / (b.t - a.t);
    pager.end(v);
    return;
  }
  clearTimeout(cur.pressTimer);
  if (cur.long) menuGuardUntil = performance.now() + 450;
  if (cur.moved || cancelled || cur.long){ cur.cell && cur.cell.classList.remove('pressed'); return; }

  // это тап
  const y = e.clientY - screenEl.getBoundingClientRect().top;
  if (y < Math.max(L.gridTop - 4 * L.u, 30 * L.u) && !cur.cell){ registerSecretTap(); return; }
  if (editing){ if (!cur.cell) exitEditing(); return; }
  if (cur.onIndicator){ pageByIndicatorTap(e); return; }
  if (cur.cell){
    const cell = cur.cell;
    cell.classList.add('pressed');
    launchApp(cell);
  }
}
screenEl.addEventListener('pointerup', e => finishGesture(e, false));
screenEl.addEventListener('pointercancel', e => finishGesture(e, true));

function cancelPress(){
  if (!g) return;
  clearTimeout(g.pressTimer); clearTimeout(g.longTimer);
  g.cell && g.cell.classList.remove('pressed');
}

function onLongPress(){
  if (!g || g.moved) return;
  g.long = true;
  vibrate(10);
  if (editing) return;
  if (g.cell){
    g.cell.classList.remove('pressed');
    openMenu(g.cell);
    // продолжаешь держать — iOS переходит в режим покачивания
    const cur = g;
    cur.holdTimer = setTimeout(() => {
      if (g === cur && !cur.moved){ closeMenu(); enterEditing(); vibrate(10); }
    }, 900);
  } else {
    enterEditing();
  }
}

function pageByIndicatorTap(e){
  if (indicatorEl.dataset.mode !== 'dots') return;       // «Поиск» на iOS открывает Spotlight
  const r = indicatorEl.querySelector('.ind-dots').getBoundingClientRect();
  const mid = r.left + r.width / 2;
  pager.go(clamp(pager.index + (e.clientX < mid ? -1 : 1), 0, pager.count - 1));
}

function registerSecretTap(){
  const now = performance.now();
  secretTaps.push(now);
  while (secretTaps.length && now - secretTaps[0] > 900) secretTaps.shift();
  if (secretTaps.length >= 3){ secretTaps.length = 0; showInputView(); }
}

// колесо / трекпад и стрелки на компьютере
let wheelAcc = 0, wheelLock = 0;
screenEl.addEventListener('wheel', e => {
  if (appOpen || menuOpen) return;
  e.preventDefault();
  if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;
  if (performance.now() < wheelLock) return;
  wheelAcc += e.deltaX;
  if (Math.abs(wheelAcc) > 40){
    pager.go(clamp(pager.index + Math.sign(wheelAcc), 0, pager.count - 1));
    wheelAcc = 0; wheelLock = performance.now() + 450;
  }
}, {passive:false});
document.addEventListener('keydown', e => {
  if (!$('#viewPhone').classList.contains('active') || e.target.matches('input')) return;
  if (e.key === 'ArrowRight') pager.go(clamp(pager.index + 1, 0, pager.count - 1));
  if (e.key === 'ArrowLeft') pager.go(clamp(pager.index - 1, 0, pager.count - 1));
  if (e.key === 'Escape'){
    if (appOpen) closeApp(); else if (menuOpen) closeMenu(); else if (editing) exitEditing();
  }
});

// никаких «веб-штучек»: зум щипком, выделение, меню «Сохранить картинку», прокрутка страницы
['gesturestart', 'gesturechange', 'dblclick', 'contextmenu'].forEach(t =>
  screenEl.addEventListener(t, e => e.preventDefault()));
screenEl.addEventListener('touchmove', e => e.preventDefault(), {passive:false});
screenEl.addEventListener('dragstart', e => e.preventDefault());

/* =========================================================
   ЗАПУСК И ЗАКРЫТИЕ ПРИЛОЖЕНИЯ
   ========================================================= */
const OPEN_MS = 520, CLOSE_MS = 480;
const EASE_OPEN = 'cubic-bezier(0.22, 1, 0.36, 1)';
const EASE_CLOSE = 'cubic-bezier(0.25, 1, 0.4, 1)';

function launchApp(cell){
  if (appOpen) return;
  const src = cell.querySelector('.icon, .widget');
  const r = relRect(src);
  const W = L.W, H = L.H;
  const radiusFrom = src.classList.contains('widget') ? 22 * L.u : r.w * 0.2237;

  const card = el('div', 'app-card');
  const snap = src.cloneNode(true);
  snap.classList.add('icon');
  card.append(snap, el('div', 'home-ind'), el('div', 'home-ind-zone'));
  appLayer.append(card);
  appLayer.classList.add('active');
  src.style.visibility = 'hidden';

  const from = {left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px', borderRadius: radiusFrom + 'px'};
  const to = {left: '0px', top: '0px', width: W + 'px', height: H + 'px', borderRadius: '0px'};
  Object.assign(card.style, to);
  card.animate([from, to], {duration: OPEN_MS, easing: EASE_OPEN});
  snap.animate([{opacity: 1}, {opacity: 0}], {duration: OPEN_MS * 0.55, easing: 'ease-in', fill: 'forwards'});

  const ox = r.x + r.w / 2, oy = r.y + r.h / 2;
  homeEl.style.transformOrigin = `${ox}px ${oy}px`;
  homeEl.animate([{transform: 'scale(1)', opacity: 1}, {transform: 'scale(1.18)', opacity: 0}],
    {duration: OPEN_MS * 0.8, easing: EASE_OPEN, fill: 'forwards'});

  setTimeout(() => cell.classList.remove('pressed'), 120);
  appOpen = {card, snap, src, r, radiusFrom};
}

function closeApp(){
  if (!appOpen || appOpen.closing) return;
  const {card, snap, src, r, radiusFrom} = appOpen;
  appOpen.closing = true;
  const cur = relRect(card);
  // радиус в видимых пикселях (во время жеста карточка ещё и масштабирована)
  const scaleNow = cur.w / (card.offsetWidth || cur.w);
  const radiusNow = (parseFloat(getComputedStyle(card).borderRadius) || 0) * scaleNow;
  card.getAnimations().forEach(a => a.cancel());
  card.style.transform = '';
  const from = {left: cur.x + 'px', top: cur.y + 'px', width: cur.w + 'px', height: cur.h + 'px', borderRadius: radiusNow + 'px'};
  const to = {left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px', borderRadius: radiusFrom + 'px'};
  Object.assign(card.style, to);
  card.animate([from, to], {duration: CLOSE_MS, easing: EASE_CLOSE});
  snap.getAnimations().forEach(a => a.cancel());
  snap.animate([{opacity: 0}, {opacity: 1}], {duration: CLOSE_MS * 0.5, easing: 'ease-out', fill: 'forwards'});

  // читаем текущее состояние «Домой» ДО отмены анимаций (там может быть середина жеста)
  const hs = getComputedStyle(homeEl);
  const fromT = hs.transform === 'none' ? 'scale(1)' : hs.transform, fromO = hs.opacity;
  homeEl.getAnimations().forEach(a => a.cancel());
  homeEl.style.opacity = ''; homeEl.style.transform = '';
  homeEl.animate([{transform: fromT, opacity: fromO}, {transform: 'scale(1)', opacity: 1}],
    {duration: CLOSE_MS, easing: EASE_CLOSE});
  setTimeout(() => {
    src.style.visibility = '';
    card.remove();
    appLayer.classList.remove('active');
    appOpen = null;
  }, CLOSE_MS);
}

// жест «домой»: свайп вверх от нижнего края (или клик по полоске в мокапе)
let hg = null;
appLayer.addEventListener('pointerdown', e => {
  if (!appOpen || appOpen.closing || hg) return;
  const y = e.clientY - screenEl.getBoundingClientRect().top;
  if (y < L.H - 44 * L.u) return;
  hg = {id: e.pointerId, y0: e.clientY, x0: e.clientX, samples: [{t: e.timeStamp, y: e.clientY}], moved: false};
  try { appLayer.setPointerCapture(e.pointerId); } catch {}
});
appLayer.addEventListener('pointermove', e => {
  if (!hg || e.pointerId !== hg.id) return;
  const dy = Math.max(0, hg.y0 - e.clientY), dx = e.clientX - hg.x0;
  if (!hg.moved && dy < 4) return;
  hg.moved = true;
  const p = dy / L.H;
  const scale = Math.max(0.3, 1 - p * 1.1);
  const {card} = appOpen;
  card.getAnimations().forEach(a => a.cancel());
  card.style.transformOrigin = '50% 100%';
  card.style.transform = `translate(${dx * 0.6}px, ${-dy * 0.35}px) scale(${scale})`;
  card.style.borderRadius = Math.min(55, 55 * p * 4) * L.u / scale + 'px';
  homeEl.getAnimations().forEach(a => a.cancel());
  homeEl.style.opacity = Math.min(1, p * 3);
  homeEl.style.transform = `scale(${1.18 - Math.min(0.18, p * 0.5)})`;
  hg.samples.push({t: e.timeStamp, y: e.clientY});
  while (hg.samples.length > 2 && e.timeStamp - hg.samples[0].t > 100) hg.samples.shift();
});
function endHomeGesture(e){
  if (!hg || e.pointerId !== hg.id) return;
  const cur = hg; hg = null;
  const s = cur.samples, a = s[0], b = s[s.length - 1];
  const v = b.t - a.t > 8 ? (b.y - a.y) / (b.t - a.t) : 0;      // < 0 — вверх
  const dy = cur.y0 - e.clientY;
  const clearInline = () => { homeEl.style.opacity = ''; homeEl.style.transform = ''; };
  if (!cur.moved || dy > 60 * L.u || v < -0.3){
    closeApp();
  } else {                                                       // вернуть приложение на место
    const {card} = appOpen;
    const tr = card.style.transform, br = card.style.borderRadius;
    card.style.transform = ''; card.style.borderRadius = '0px';
    card.animate([{transform: tr, borderRadius: br}, {transform: 'none', borderRadius: '0px'}], {duration: 350, easing: EASE_OPEN});
    homeEl.animate([{opacity: homeEl.style.opacity, transform: homeEl.style.transform}, {opacity: 0, transform: 'scale(1.18)'}],
      {duration: 350, easing: EASE_OPEN, fill: 'forwards'});
    clearInline();
  }
}
appLayer.addEventListener('pointerup', endHomeGesture);
appLayer.addEventListener('pointercancel', endHomeGesture);

/* =========================================================
   КОНТЕКСТНОЕ МЕНЮ И РЕЖИМ ПОКАЧИВАНИЯ
   ========================================================= */
function openMenu(cell){
  menuOpen = true;
  const isWidget = cell.classList.contains('cell--widget');
  const src = cell.querySelector('.icon, .widget');
  const r = relRect(src);
  menuLayer.textContent = '';
  const blur = el('div', 'menu-blur');
  const lifted = src.cloneNode(true);
  lifted.classList.add('menu-icon');
  lifted.classList.remove('pressed');
  Object.assign(lifted.style, {left: r.x + 'px', top: r.y + 'px', width: r.w + 'px', height: r.h + 'px'});

  const items = isWidget
    ? [['Изменить экран «Домой»', 'edit', 'edit'], ['Удалить виджет', 'remove', 'remove', true]]
    : [['Изменить экран «Домой»', 'edit', 'edit'], ['Поделиться приложением', 'share', 'share'], ['Удалить приложение', 'remove', 'remove', true]];
  const menu = el('div', 'menu');
  for (const [text, glyph, action, danger] of items){
    const b = el('button', danger ? 'danger' : '', `<span>${text}</span>${MENU_GLYPHS[glyph]}`);
    b.type = 'button';
    b.addEventListener('click', () => { if (performance.now() < menuGuardUntil) return; closeMenu(); if (action === 'edit') setTimeout(enterEditing, 180); });
    menu.append(b);
  }
  menuLayer.append(blur, lifted, menu);
  menuLayer.classList.add('active');

  const mw = 270 * L.u, mh = items.length * 44 * L.u, gap = 12 * L.u, pad = 16 * L.u;
  const left = r.x + r.w / 2 < L.W / 2 ? clamp(r.x, pad, L.W - pad - mw) : clamp(r.x + r.w - mw, pad, L.W - pad - mw);
  const below = r.y + r.h + gap + mh < L.H - 40 * L.u;
  const top = below ? r.y + r.h + gap : r.y - gap - mh;
  Object.assign(menu.style, {left: left + 'px', top: top + 'px',
    transformOrigin: `${r.x + r.w / 2 - left}px ${below ? 0 : mh}px`});

  blur.animate([{opacity: 0}, {opacity: 1}], {duration: 220, easing: 'ease-out'});
  lifted.animate([{transform: 'scale(1)'}, {transform: 'scale(1.1)'}, {transform: 'scale(1.06)'}],
    {duration: 380, easing: 'cubic-bezier(.2,.9,.3,1)', fill: 'forwards'});
  menu.animate([{opacity: 0, transform: 'scale(.4)'}, {opacity: 1, transform: 'scale(1.02)', offset: .7}, {opacity: 1, transform: 'scale(1)'}],
    {duration: 380, easing: 'cubic-bezier(.2,.9,.3,1)'});
  blur.addEventListener('click', () => { if (performance.now() >= menuGuardUntil) closeMenu(); });
}

function closeMenu(){
  if (!menuOpen) return;
  menuOpen = false;
  const nodes = [...menuLayer.children];
  const anim = menuLayer.animate([{opacity: 1}, {opacity: 0}], {duration: 180, easing: 'ease-in'});
  anim.onfinish = () => { if (!menuOpen){ nodes.forEach(n => n.remove()); menuLayer.classList.remove('active'); } };
}

function enterEditing(){
  if (editing) return;
  editing = true;
  randomizeJiggle();
  screenEl.classList.add('editing');
  indicator.show();
}
function exitEditing(){
  if (!editing) return;
  editing = false;
  screenEl.classList.remove('editing');
  indicator.settle();
}
$('#doneBtn').addEventListener('click', exitEditing);

/* =========================================================
   НАСТРОЙКА / НАВИГАЦИЯ МЕЖДУ ЭКРАНАМИ
   ========================================================= */
const viewInput = $('#viewInput'), viewPhone = $('#viewPhone');
const wordInput = $('#wordInput');

function applyDeviceMode(){
  document.body.classList.toggle('device', isDevice());
  layout();
}

function showPhoneView(){
  viewInput.classList.remove('active');
  viewPhone.classList.add('active');
  $('#stepDot1').classList.remove('active');
  $('#stepDot2').classList.add('active');
  document.body.classList.add('phone-open');
  store.set('lastView', 'phone');
  if (document.activeElement) document.activeElement.blur();
  applyDeviceMode();
  pager.index = 0; pager.set(0);          // телефон всегда открывается на 1-й странице
  indicatorEl.dataset.mode = 'search';
  // На Android/компьютере — настоящий полноэкранный режим. На iPhone это делает только «На экран Домой».
  if (isDevice() && !isStandalone() && document.documentElement.requestFullscreen){
    document.documentElement.requestFullscreen().catch(() => {});
  }
}
function showInputView(){
  if (appOpen) closeApp();
  closeMenu(); exitEditing();
  viewPhone.classList.remove('active');
  viewInput.classList.add('active');
  $('#stepDot2').classList.remove('active');
  $('#stepDot1').classList.add('active');
  document.body.classList.remove('phone-open');
  store.set('lastView', 'input');
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
}
$('#goPhoneBtn').addEventListener('click', showPhoneView);
$('#backBtn').addEventListener('click', showInputView);

function setWord(w){
  renderWord(w);
  $('#wordEcho').textContent = (w || '').toUpperCase();
}
wordInput.addEventListener('input', () => { setWord(wordInput.value); store.set('lastWord', wordInput.value); });

/* ---------- обои: сохраняются, чтобы пережить перезапуск ---------- */
const wallpaperEl = $('#wallpaper');
function applyWallpaper(dataUrl, name){
  wallpaperEl.style.backgroundImage = dataUrl ? `url("${dataUrl}")` : '';
  $('#wallLabel').classList.toggle('filled', !!dataUrl);
  $('#wallText').textContent = dataUrl ? `✓ ${name || 'Свои обои'}` : '🖼 Загрузить фон';
  $('#wallReset').hidden = !dataUrl;
}
$('#wallInput').addEventListener('change', e => {
  const f = e.target.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  const img = new Image();
  img.onload = () => {
    // ужимаем до разрешения экрана iPhone, чтобы влезло в localStorage
    const k = Math.min(1, 1400 / Math.max(img.width, img.height));
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    let data = c.toDataURL('image/jpeg', 0.86);
    URL.revokeObjectURL(url);
    applyWallpaper(data, f.name);
    if (!store.set('wallpaper', data)) console.warn('Обои не поместились в хранилище — останутся до перезагрузки');
    store.set('wallpaperName', f.name);
  };
  img.src = url;
});
$('#wallReset').addEventListener('click', () => {
  store.del('wallpaper'); store.del('wallpaperName'); applyWallpaper(null);
  $('#wallInput').value = '';
});

/* ---------- статус-бар мокапа: батарея ---------- */
if (navigator.getBattery){
  navigator.getBattery().then(b => {
    const upd = () => { $('#sbBatt').style.width = Math.max(8, b.level * 100) + '%'; };
    upd(); b.addEventListener('levelchange', upd);
  }).catch(() => {});
}

/* =========================================================
   СТАРТ
   ========================================================= */
const params = new URLSearchParams(location.search);
const initialWord = params.get('word') || store.get('lastWord') || wordInput.value;
wordInput.value = initialWord;
setWord(initialWord);
applyWallpaper(store.get('wallpaper'), store.get('wallpaperName'));

updateLiveIcons();
setInterval(updateLiveIcons, 10000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) updateLiveIcons(); });

new ResizeObserver(() => layout()).observe(screenEl);
matchMedia('(max-width: 500px)').addEventListener('change', applyDeviceMode);
applyDeviceMode();

if (params.get('view') === 'phone' || store.get('lastView') === 'phone') showPhoneView();

if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)){
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// для автотестов
window.__phone = {pager, launchApp, closeApp, enterEditing, exitEditing, openMenu, closeMenu, L};
