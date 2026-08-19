/* =========================================================
   КОНФИГ ИКОНОК
   Чтобы поставить СВОЮ картинку — положи файл в нужную папку
   с точно таким именем, как указано в поле `file`, ничего
   больше менять не нужно. Если файла нет — покажется
   сгенерированная заглушка, ничего не сломается.
   ========================================================= */

// icons/screen1/*  — 1-й домашний экран (обычные приложения)
const SCREEN1_APPS = [
  {name:'Сообщения',   file:'icons/screen1/messages.png',   glyphKey:'bubble', bg:'linear-gradient(160deg,#3ddc5a,#22b23f)'},
  {name:'Контакты',    file:'icons/screen1/contacts.png',   glyphKey:'person', bg:'linear-gradient(160deg,#c9c9ce,#9a9aa2)'},
  {name:'Календарь',   file:'icons/screen1/calendar.png',   glyphKey:'calendar', bg:'#ffffff'},
  {name:'Фото',        file:'icons/screen1/photos.png',     glyphKey:'photo', bg:'#ffffff'},
  {name:'Файлы',       file:'icons/screen1/files.png',      glyphKey:'folder', bg:'linear-gradient(160deg,#5eb8ff,#0a84ff)'},
  {name:'Заметки',     file:'icons/screen1/notes.png',      glyphKey:'note', bg:'#ffffff'},
  {name:'Часы',        file:'icons/screen1/clock.png',      glyphKey:'clock', bg:'#1c1c1e'},
  {name:'Навигатор',   file:'icons/screen1/navigator.png',  glyphKey:'compass2', bg:'linear-gradient(160deg,#3d5afe,#1a237e)'},
  {name:'Карты',       file:'icons/screen1/maps.png',       glyphKey:'pin', bg:'linear-gradient(160deg,#7ed957,#2f9e44)'},
  {name:'Напоминания', file:'icons/screen1/reminders.png',  glyphKey:'list', bg:'#ffffff'},
  {name:'App Store',   file:'icons/screen1/appstore.png',   glyphKey:'bag', bg:'linear-gradient(160deg,#4facfe,#0a84ff)'},
  {name:'Настройки',   file:'icons/screen1/settings.png',   glyphKey:'gear', bg:'linear-gradient(160deg,#8e8e93,#636366)'},
];

// icons/screen2/* — 2-й домашний экран
const SCREEN2_APPS = [
  {name:'Погода',      file:'icons/screen2/weather.png',    glyphKey:'cloud', bg:'linear-gradient(160deg,#6ec6ff,#1e88e5)'},
  {name:'Здоровье',    file:'icons/screen2/health.png',     glyphKey:'heart', bg:'linear-gradient(160deg,#ff8a80,#ff453a)'},
  {name:'Кошелёк',     file:'icons/screen2/wallet.png',     glyphKey:'wallet', bg:'#1c1c1e'},
  {name:'Музыка',      file:'icons/screen2/music.png',      glyphKey:'music', bg:'linear-gradient(160deg,#ff6bcb,#e0459f)'},
  {name:'Подкасты',    file:'icons/screen2/podcasts.png',   glyphKey:'mic', bg:'linear-gradient(160deg,#a970ff,#7c3aed)'},
  {name:'Книги',       file:'icons/screen2/books.png',      glyphKey:'book', bg:'linear-gradient(160deg,#ff9f5a,#ff7a1a)'},
  {name:'Дом',         file:'icons/screen2/home.png',       glyphKey:'house', bg:'linear-gradient(160deg,#7ee0c9,#2fbf8f)'},
  {name:'Команды',     file:'icons/screen2/shortcuts.png',  glyphKey:'spark', bg:'#1c1c1e'},
  {name:'Диктофон',    file:'icons/screen2/voicememos.png', glyphKey:'mic', bg:'linear-gradient(160deg,#ff5c5c,#c62828)'},
  {name:'Рулетка',     file:'icons/screen2/measure.png',    glyphKey:'ruler', bg:'linear-gradient(160deg,#ffcf5c,#ff9f0a)'},
  {name:'Компас',      file:'icons/screen2/compass.png',    glyphKey:'compass', bg:'#ffffff'},
  {name:'Калькулятор', file:'icons/screen2/calculator.png', glyphKey:'calc', bg:'#1c1c1e'},
];

// icons/dock/* — нижняя панель, одинаковая на всех экранах
const DOCK_APPS = [
  {file:'icons/dock/phone.png',  glyphKey:'phone',  bg:'linear-gradient(160deg,#3ddc5a,#22b23f)'},
  {file:'icons/dock/camera.png', glyphKey:'camera', bg:'linear-gradient(160deg,#3a3a3c,#1c1c1e)'},
  {file:'icons/dock/safari.png', glyphKey:'compass2', bg:'#ffffff'},
  {file:'icons/dock/extra.png',  glyphKey:'spark',  bg:'#0b0b12'},
];

// icons/letters/{БУКВА}.png — своя картинка на конкретную букву (необязательно)
// Пример: icons/letters/А.png, icons/letters/M.png
function letterIconPath(letter){
  return `icons/letters/${letter}.png`;
}

const LETTER_COLORS = [
  'linear-gradient(160deg,#5eb8ff,#0a84ff)',
  'linear-gradient(160deg,#7ee08a,#30d158)',
  'linear-gradient(160deg,#ffb85c,#ff9f0a)',
  'linear-gradient(160deg,#ff7a7a,#ff453a)',
  'linear-gradient(160deg,#c98aff,#bf5af2)',
  'linear-gradient(160deg,#ff8fc0,#ff375f)',
  'linear-gradient(160deg,#7de6e0,#64d2ff)',
  'linear-gradient(160deg,#ffe066,#ffd60a)',
  'linear-gradient(160deg,#9d9cff,#5e5ce6)',
  'linear-gradient(160deg,#8ee6d6,#66d4cf)',
];

/* ---------- generic fallback glyphs (абстрактные, не бренды) ---------- */
function svgIcon(paths){ return `<svg viewBox="0 0 24 24" fill="none">${paths}</svg>`; }
const GLYPHS = {
  bubble: svgIcon('<path d="M4 5h16v11H9l-4 4v-4H4V5z" fill="white"/>'),
  person: svgIcon('<circle cx="12" cy="8" r="4" fill="white"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" fill="white"/>'),
  calendar: svgIcon('<rect x="4" y="5" width="16" height="15" rx="2" fill="white"/><rect x="4" y="5" width="16" height="4" fill="#e0453d"/>'),
  photo: svgIcon('<circle cx="12" cy="8" r="3" fill="#ffd60a"/><circle cx="7" cy="9" r="2.4" fill="#ff9f0a"/><circle cx="17" cy="9" r="2.4" fill="#30d158"/><circle cx="12" cy="15" r="3" fill="#0a84ff"/>'),
  folder: svgIcon('<path d="M4 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V7z" fill="white"/>'),
  note: svgIcon('<rect x="4" y="4" width="16" height="16" rx="2" fill="white"/><line x1="7" y1="9" x2="17" y2="9" stroke="#e6b800" stroke-width="1.6"/><line x1="7" y1="13" x2="17" y2="13" stroke="#e6b800" stroke-width="1.6"/><line x1="7" y1="17" x2="13" y2="17" stroke="#e6b800" stroke-width="1.6"/>'),
  clock: svgIcon('<circle cx="12" cy="12" r="9" fill="white"/><line x1="12" y1="12" x2="12" y2="7" stroke="#111" stroke-width="1.6" stroke-linecap="round"/><line x1="12" y1="12" x2="15.5" y2="13.5" stroke="#e0453d" stroke-width="1.6" stroke-linecap="round"/>'),
  compass: svgIcon('<circle cx="12" cy="12" r="9" fill="white"/><path d="M15 9l-2 6-6 2 2-6z" fill="#0a84ff"/>'),
  compass2: svgIcon('<circle cx="12" cy="12" r="9" fill="white"/><path d="M8 16l3-7 5 1-3 7z" fill="#0a84ff"/>'),
  pin: svgIcon('<path d="M12 3c-3.9 0-7 3-7 7 0 5.2 7 11 7 11s7-5.8 7-11c0-4-3.1-7-7-7z" fill="white"/><circle cx="12" cy="10" r="2.6" fill="#30d158"/>'),
  list: svgIcon('<circle cx="6" cy="7" r="1.6" fill="white"/><circle cx="6" cy="12" r="1.6" fill="white"/><circle cx="6" cy="17" r="1.6" fill="white"/><line x1="10" y1="7" x2="19" y2="7" stroke="white" stroke-width="1.6"/><line x1="10" y1="12" x2="19" y2="12" stroke="white" stroke-width="1.6"/><line x1="10" y1="17" x2="19" y2="17" stroke="white" stroke-width="1.6"/>'),
  bag: svgIcon('<rect x="5" y="8" width="14" height="12" rx="2" fill="white"/><path d="M9 8V6a3 3 0 016 0v2" stroke="white" stroke-width="1.8"/>'),
  gear: svgIcon('<circle cx="12" cy="12" r="3.2" fill="white"/><path d="M12 3v2.4M12 18.6V21M21 12h-2.4M5.4 12H3M18 6l-1.6 1.6M7.6 16.4L6 18M18 18l-1.6-1.6M7.6 7.6L6 6" stroke="white" stroke-width="1.8" stroke-linecap="round"/>'),
  cloud: svgIcon('<path d="M7 17a4 4 0 010-8 5 5 0 019.6-1.5A4 4 0 0117 17H7z" fill="white"/>'),
  heart: svgIcon('<path d="M12 20s-7-4.4-7-9.5C5 7.5 7.2 5 10 5c1 0 2 .5 2 1.5 0-1 1-1.5 2-1.5 2.8 0 5 2.5 5 5.5C19 15.6 12 20 12 20z" fill="white"/>'),
  wallet: svgIcon('<rect x="4" y="6" width="16" height="13" rx="2" fill="white"/><circle cx="16" cy="12.5" r="1.6" fill="#111"/>'),
  music: svgIcon('<circle cx="8" cy="17" r="2.4" fill="white"/><circle cx="17" cy="15" r="2.4" fill="white"/><path d="M10.4 17V6.6L19.4 5v10.4" stroke="white" stroke-width="1.6" fill="none"/>'),
  mic: svgIcon('<rect x="9" y="3" width="6" height="11" rx="3" fill="white"/><path d="M6 11a6 6 0 0012 0M12 17v3" stroke="white" stroke-width="1.6" stroke-linecap="round"/>'),
  book: svgIcon('<path d="M4 5h7v15H4a1 1 0 01-1-1V6a1 1 0 011-1z" fill="white"/><path d="M20 5h-7v15h7a1 1 0 001-1V6a1 1 0 00-1-1z" fill="white" opacity="0.7"/>'),
  house: svgIcon('<path d="M4 11l8-6 8 6v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8z" fill="white"/>'),
  ruler: svgIcon('<rect x="3" y="9" width="18" height="6" rx="1.5" transform="rotate(-15 12 12)" fill="white"/>'),
  calc: svgIcon('<rect x="5" y="3" width="14" height="18" rx="2" fill="white"/><rect x="7.5" y="6" width="9" height="3.5" fill="#333"/><circle cx="8.5" cy="13.5" r="1.1" fill="#333"/><circle cx="12" cy="13.5" r="1.1" fill="#333"/><circle cx="15.5" cy="13.5" r="1.1" fill="#333"/><circle cx="8.5" cy="17" r="1.1" fill="#333"/><circle cx="12" cy="17" r="1.1" fill="#333"/><circle cx="15.5" cy="17" r="1.1" fill="#333"/>'),
  phone: svgIcon('<path d="M6 3l3 1 .5 4-2 1.5A14 14 0 0015 14l1.5-2 4 .5 1 3-2 2c-1 1-3 1-6 0-4-1.3-8-5.3-9.3-9.3-1-3-1-5 0-6l2-2z" fill="white"/>'),
  camera: svgIcon('<rect x="3" y="7" width="18" height="13" rx="2" fill="white"/><path d="M8 7l1.5-2.5h5L16 7" stroke="white" stroke-width="1.6" fill="none"/><circle cx="12" cy="13.5" r="4" fill="#222"/>'),
  spark: svgIcon('<path d="M12 3l1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8z" fill="#ffd60a"/>'),
};

/* =========================================================
   РЕНДЕР
   ========================================================= */

// пробуем загрузить реальную картинку; если её нет — рисуем заглушку
function iconInner(app){
  const fallback = `<div class="icon-squircle" style="background:${app.bg}">${GLYPHS[app.glyphKey] || ''}</div>`;
  if(!app.file) return fallback;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `<div class="icon-squircle"><img src="${app.file}" alt=""></div>`;
  const div = wrapper.firstElementChild;
  const img = div.querySelector('img');
  img.onerror = () => { div.outerHTML = fallback; };
  return div.outerHTML;
}

function iconCell(app, label){
  const div = document.createElement('div');
  div.className = 'icon-cell';
  div.innerHTML = `${iconInner(app)}<div class="icon-label">${label||''}</div>`;
  // повторно навешиваем обработчик onerror, т.к. innerHTML сбрасывает inline-события
  const img = div.querySelector('img');
  if(img){
    const bg = app.bg, glyph = GLYPHS[app.glyphKey] || '';
    img.addEventListener('error', ()=>{
      const sq = div.querySelector('.icon-squircle');
      sq.style.background = bg;
      sq.innerHTML = glyph;
    });
  }
  return div;
}

function renderStaticScreen(container, apps){
  container.innerHTML = '';
  apps.forEach(a => container.appendChild(iconCell(a, a.name)));
}

function renderDock(){
  const dock = document.getElementById('dock');
  dock.innerHTML = '';
  DOCK_APPS.forEach(a => {
    const cell = iconCell(a, '');
    // в доке иконка без подписи и без обёртки .icon-cell — берём только сквиркл
    const sq = cell.querySelector('.icon-squircle');
    dock.appendChild(sq);
  });
}

function renderWordScreen(word){
  const container = document.getElementById('screen3');
  container.innerHTML = '';
  const letters = (word||'').toUpperCase().replace(/[^A-ZА-ЯЁ0-9]/g,'').split('');
  letters.slice(0,24).forEach((ch, i) => {
    const app = {
      file: letterIconPath(ch),
      bg: LETTER_COLORS[i % LETTER_COLORS.length],
      glyphKey: null,
    };
    // для букв заглушка — сам символ, а не абстрактная иконка
    const fallback = `<div class="icon-squircle" style="background:${app.bg}"><span class="letter-glyph">${ch}</span></div>`;
    const div = document.createElement('div');
    div.className = 'icon-cell';
    const wrap = document.createElement('div');
    wrap.innerHTML = `<div class="icon-squircle"><img src="${app.file}" alt=""></div>`;
    const sqDiv = wrap.firstElementChild;
    const img = sqDiv.querySelector('img');
    img.addEventListener('error', ()=>{ sqDiv.outerHTML = fallback; });
    div.appendChild(sqDiv);
    const label = document.createElement('div');
    label.className = 'icon-label';
    label.textContent = ch;
    div.appendChild(label);
    container.appendChild(div);
  });
}

/* ---------- init ---------- */
renderStaticScreen(document.getElementById('screen1'), SCREEN1_APPS);
renderStaticScreen(document.getElementById('screen2'), SCREEN2_APPS);
renderDock();
renderWordScreen(document.getElementById('wordInput').value);

/* ---------- view navigation ---------- */
const viewInput = document.getElementById('viewInput');
const viewPhone = document.getElementById('viewPhone');
const stepDot1 = document.getElementById('stepDot1');
const stepDot2 = document.getElementById('stepDot2');

function showPhoneView(){
  viewInput.classList.remove('active');
  viewPhone.classList.add('active');
  stepDot1.classList.remove('active');
  stepDot2.classList.add('active');
  localStorage.setItem('lastView', 'phone');
  // best-effort: настоящий полный экран без адресной строки на iPhone Safari
  // даёт только "Добавить на экран Домой" — см. README. Здесь пробуем то,
  // что поддерживают Android/десктоп браузеры.
  const el = document.documentElement;
  if(el.requestFullscreen){ el.requestFullscreen().catch(()=>{}); }
}
function showInputView(){
  viewPhone.classList.remove('active');
  viewInput.classList.add('active');
  stepDot2.classList.remove('active');
  stepDot1.classList.add('active');
  localStorage.setItem('lastView', 'input');
  if(document.fullscreenElement){ document.exitFullscreen().catch(()=>{}); }
}

document.getElementById('goPhoneBtn').addEventListener('click', showPhoneView);
document.getElementById('backBtn').addEventListener('click', showInputView);

document.getElementById('wordInput').addEventListener('input', (e)=>{
  renderWordScreen(e.target.value);
  document.getElementById('wordEcho').textContent = (e.target.value||'').toUpperCase();
  localStorage.setItem('lastWord', e.target.value);
});

document.getElementById('wallInput').addEventListener('change', (e)=>{
  const f = e.target.files[0];
  if(!f) return;
  const url = URL.createObjectURL(f);
  document.getElementById('wallpaperLayer').style.backgroundImage = `url(${url})`;
  document.getElementById('wallpaperLayer').style.backgroundColor = 'transparent';
  const lbl = document.getElementById('wallLabel');
  lbl.classList.add('filled');
  lbl.firstChild.textContent = `✓ ${f.name} `;
});

// восстановить последнее слово + сразу открыть экран телефона,
// если запущено с ярлыка "Домой" (?view=phone) или раньше уже было открыто
const savedWord = localStorage.getItem('lastWord');
if(savedWord){
  document.getElementById('wordInput').value = savedWord;
  renderWordScreen(savedWord);
  document.getElementById('wordEcho').textContent = savedWord.toUpperCase();
}
const params = new URLSearchParams(location.search);
if(params.get('view') === 'phone' || localStorage.getItem('lastView') === 'phone'){
  showPhoneView();
}

/* ---------- swipe между домашними экранами (как на настоящем iOS) ---------- */
const viewport = document.getElementById('viewport');
const track = document.getElementById('track');
const dots = document.querySelectorAll('#pageDots i');
let activeIndex = 0;
let startX = 0, currentDX = 0, dragging = false, viewportWidth = 0;

function setActive(idx, animate=true){
  activeIndex = Math.max(0, Math.min(2, idx));
  track.style.transition = animate ? '' : 'none';
  track.style.transform = `translateX(-${activeIndex * (100/3)}%)`;
  dots.forEach((d,i)=> d.classList.toggle('active', i===activeIndex));
  if(!animate) requestAnimationFrame(()=>{ track.style.transition=''; });
}

function pointerDown(x){
  dragging = true; startX = x; currentDX = 0;
  viewportWidth = viewport.getBoundingClientRect().width;
  track.style.transition = 'none';
}
function pointerMove(x){
  if(!dragging) return;
  currentDX = x - startX;
  const base = -activeIndex * viewportWidth;
  let next = base + currentDX;
  const min = -2*viewportWidth, max = 0;
  if(next > max) next = max + (next-max)*0.35;
  if(next < min) next = min + (next-min)*0.35;
  track.style.transform = `translateX(${next}px)`;
}
function pointerUp(){
  if(!dragging) return;
  dragging = false;
  const threshold = viewportWidth * 0.18;
  if(Math.abs(currentDX) > threshold){
    setActive(activeIndex + (currentDX < 0 ? 1 : -1));
  } else {
    setActive(activeIndex);
  }
}

viewport.addEventListener('pointerdown', (e)=>{ pointerDown(e.clientX); viewport.setPointerCapture(e.pointerId); });
viewport.addEventListener('pointermove', (e)=> pointerMove(e.clientX));
viewport.addEventListener('pointerup', pointerUp);
viewport.addEventListener('pointercancel', pointerUp);

window.addEventListener('resize', ()=> setActive(activeIndex, false));
