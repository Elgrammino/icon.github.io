/* ============================================================
   ЛОГИКА. Править обычно ничего не нужно — всё в js/config.js
   ============================================================ */

const $  = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

const store = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v===null ? d : JSON.parse(v); }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
};

/* ---------- масштаб: 1pt = ширина экрана / 430 (iPhone 15 Pro Max) ---------- */
function updateScale(){
  const screen = $('#phoneScreen');
  if(!screen) return;
  const w = screen.getBoundingClientRect().width;
  if(w > 0) document.documentElement.style.setProperty('--pt', (w/430) + 'px');
  document.documentElement.style.setProperty('--app-height', window.innerHeight + 'px');

  // safe-area: в PWA сверху настоящая системная строка, в браузере её нет
  const standalone = window.matchMedia('(display-mode: standalone)').matches
                  || window.navigator.standalone === true;
  const root = document.documentElement.style;
  root.setProperty('--safe-top',    standalone ? 'env(safe-area-inset-top, 59px)'    : `calc(54 * var(--pt))`);
  root.setProperty('--safe-bottom', standalone ? 'env(safe-area-inset-bottom, 34px)' : `calc(20 * var(--pt))`);
}

/* ============================================================
   ЖИВЫЕ ИКОНКИ (часы со стрелками, календарь с датой)
   ============================================================ */
const WEEKDAYS = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];

function liveClockSVG(){
  const now = new Date();
  const s = now.getSeconds(), m = now.getMinutes(), h = now.getHours()%12;
  const secA = s*6, minA = m*6 + s*0.1, hrA = h*30 + m*0.5;
  const hand = (angle, len, w, color) => {
    const r = (angle-90) * Math.PI/180;
    return `<line x1="50" y1="50" x2="${50+Math.cos(r)*len}" y2="${50+Math.sin(r)*len}"
            stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`;
  };
  let ticks = '';
  for(let i=0;i<12;i++){
    const r = (i*30-90)*Math.PI/180;
    ticks += `<line x1="${50+Math.cos(r)*40}" y1="${50+Math.sin(r)*40}"
              x2="${50+Math.cos(r)*44}" y2="${50+Math.sin(r)*44}"
              stroke="#111" stroke-width="${i%3===0?3:1.6}" stroke-linecap="round"/>`;
  }
  return `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#fff"/>${ticks}
    ${hand(hrA,24,4.4,'#111')}${hand(minA,34,3.4,'#111')}${hand(secA,36,1.8,'#ff9500')}
    <circle cx="50" cy="50" r="3" fill="#111"/><circle cx="50" cy="50" r="1.4" fill="#ff9500"/></svg>`;
}

function liveCalendarSVG(){
  const now = new Date();
  const wd = WEEKDAYS[now.getDay()];
  const day = now.getDate();
  return `<svg viewBox="0 0 100 100"><rect width="100" height="100" fill="#fff"/>
    <text x="50" y="24" text-anchor="middle" fill="#ff3b30"
      font-family="-apple-system,SF Pro Text,sans-serif" font-size="15" font-weight="600">${wd}</text>
    <text x="50" y="78" text-anchor="middle" fill="#1c1c1e"
      font-family="-apple-system,SF Pro Display,sans-serif" font-size="54" font-weight="300">${day}</text></svg>`;
}

const LIVE = { clock: liveClockSVG, calendar: liveCalendarSVG };

/* ============================================================
   РЕНДЕР ИКОНОК
   ============================================================ */
function fallbackHTML(app){
  const ch = app.letter || (app.name||'?')[0] || '?';
  const hue = [...(app.name||ch)].reduce((a,c)=>a+c.charCodeAt(0),0) % 360;
  return `<div class="letter-glyph" style="background:linear-gradient(160deg,
      hsl(${hue} 70% 62%), hsl(${(hue+28)%360} 68% 48%))">${ch}</div>`;
}

function paintIcon(sq, app){
  if(app.live && LIVE[app.live]){
    sq.dataset.live = app.live;
    sq.innerHTML = LIVE[app.live]();
    return;
  }
  delete sq.dataset.live;
  if(!app.file){ sq.innerHTML = fallbackHTML(app); return; }
  const img = new Image();
  img.alt = '';
  img.onload  = () => { sq.innerHTML = ''; sq.appendChild(img); };
  img.onerror = () => { sq.innerHTML = fallbackHTML(app); };
  img.src = app.file;
}

function setBadge(wrap, n){
  let b = wrap.querySelector('.badge');
  const val = parseInt(n,10);
  if(!val || val <= 0){ if(b) b.remove(); return; }
  if(!b){ b = document.createElement('div'); b.className='badge'; wrap.appendChild(b); }
  b.textContent = val > 99 ? '99+' : val;
}

function buildCell(app){
  const cell = document.createElement('div');
  cell.className = 'icon-cell';
  cell.innerHTML = `
    <div class="icon-hop"><div class="icon-rot">
      <div class="icon-wrap">
        <div class="icon-squircle"></div>
        <div class="remove-dot"></div>
      </div>
    </div></div>
    <div class="icon-label"></div>`;
  applyApp(cell, app);

  // индивидуальные фазы покачивания — как на настоящем iOS
  const r = () => (Math.random()*0.05).toFixed(3);
  cell.style.setProperty('--rot-dur',  (0.14 + Math.random()*0.05).toFixed(3)+'s');
  cell.style.setProperty('--hop-dur',  (0.18 + Math.random()*0.05).toFixed(3)+'s');
  cell.style.setProperty('--rot-delay', '-'+r()+'s');
  cell.style.setProperty('--hop-delay', '-'+r()+'s');
  return cell;
}

function applyApp(cell, app){
  cell._app = app;
  paintIcon(cell.querySelector('.icon-squircle'), app);
  cell.querySelector('.icon-label').textContent = app.name || '';
  setBadge(cell.querySelector('.icon-wrap'), app.badge);
}

function renderScreen(el, apps){
  el.innerHTML = '';
  apps.forEach(a => el.appendChild(buildCell(a)));
}

function renderDock(){
  const dock = $('#dock');
  dock.innerHTML = '';
  CONFIG.dock.forEach(a => {
    const d = document.createElement('div');
    d.className = 'icon-squircle';
    paintIcon(d, a);
    dock.appendChild(d);
  });
}

/* обновление живых иконок раз в секунду */
setInterval(() => {
  $$('.icon-squircle[data-live]').forEach(sq => {
    sq.innerHTML = LIVE[sq.dataset.live]();
  });
  const c = $('#sbClock');
  if(c){
    const n = new Date();
    c.textContent = n.getHours() + ':' + String(n.getMinutes()).padStart(2,'0');
  }
}, 1000);

/* ============================================================
   СЛОВО → ИКОНКИ-БУКВЫ
   ============================================================ */
function lettersOf(word){
  return (word||'').toUpperCase().replace(/[^A-ZА-ЯЁ0-9]/g,'').split('');
}

function wordApps(word, baseApps){
  const chars = lettersOf(word);
  return baseApps.map((base, i) => {
    const ch = chars[i];
    if(!ch) return base;                       // букв меньше — иконка не меняется
    const L = CONFIG.letters[ch] || {};
    return { file:L.file, name:L.name || ch, letter:ch, badge:0 };
  });
}

/* ============================================================
   АНИМАЦИЯ ЗАМЕНЫ ИКОНКИ
   ============================================================ */
const EFFECTS = ['fly','flip','glitch','drop'];

function swapIcon(cell, nextApp){
  return new Promise(resolve => {
    const target = cell.querySelector('.icon-rot');
    const effect = EFFECTS[Math.floor(Math.random()*EFFECTS.length)];
    const dur = 520 + Math.random()*180;
    let frames;

    if(effect === 'fly'){
      const a = Math.random()*Math.PI*2, d = 170 + Math.random()*80;
      const dx = Math.cos(a)*d, dy = Math.sin(a)*d;
      frames = [
        {transform:'translate(0,0) scale(1)', opacity:1, offset:0},
        {transform:`translate(${dx}px,${dy}px) scale(.3) rotate(${(Math.random()*60-30)|0}deg)`, opacity:0, offset:.47},
        {transform:`translate(${-dx*.8}px,${-dy*.8}px) scale(.3)`, opacity:0, offset:.53},
        {transform:'translate(0,0) scale(1)', opacity:1, offset:1},
      ];
    } else if(effect === 'flip'){
      frames = [
        {transform:'perspective(500px) rotateY(0) scale(1)', offset:0},
        {transform:'perspective(500px) rotateY(90deg) scale(.9)', offset:.47},
        {transform:'perspective(500px) rotateY(-90deg) scale(.9)', offset:.53},
        {transform:'perspective(500px) rotateY(0) scale(1)', offset:1},
      ];
    } else if(effect === 'drop'){
      frames = [
        {transform:'translateY(0) scale(1)', opacity:1, offset:0},
        {transform:'translateY(220px) scale(.6)', opacity:0, offset:.47},
        {transform:'translateY(-180px) scale(.6)', opacity:0, offset:.53},
        {transform:'translateY(0) scale(1)', opacity:1, offset:1},
      ];
    } else { // glitch
      frames = [
        {transform:'translate(0,0)', filter:'none', opacity:1, offset:0},
        {transform:'translate(-5px,2px)', filter:'hue-rotate(70deg) saturate(4) contrast(1.6)', opacity:.85, offset:.12},
        {transform:'translate(4px,-3px)', filter:'hue-rotate(-60deg) saturate(3)', opacity:.7, offset:.24},
        {transform:'translate(-3px,1px) scale(1.06)', filter:'contrast(3) brightness(1.4)', opacity:.5, offset:.38},
        {transform:'translate(0,0) scale(.9)', filter:'brightness(2)', opacity:0, offset:.5},
        {transform:'translate(3px,-1px) scale(1.04)', filter:'hue-rotate(40deg) saturate(3)', opacity:.6, offset:.66},
        {transform:'translate(-2px,1px)', filter:'contrast(2)', opacity:.85, offset:.8},
        {transform:'translate(0,0)', filter:'none', opacity:1, offset:1},
      ];
    }

    const anim = target.animate(frames, {duration:dur, easing:'ease-in-out'});
    setTimeout(() => applyApp(cell, nextApp), dur*0.5);
    anim.onfinish = () => { target.style.cssText = ''; resolve(); };
  });
}

/* ============================================================
   СОСТОЯНИЕ ТРИГГЕРА:  normal → edit → word → normal …
   ============================================================ */
const SWAP_SCREEN = CONFIG.behavior.swapScreenIndex;
let phase = 'normal';
let busy = false;

function swapCells(){ return $$(`#screen${SWAP_SCREEN} .icon-cell`); }

function setEditMode(on){
  const scr = document.getElementById('screen'+SWAP_SCREEN);
  scr.classList.toggle('jiggling', on);
  $('#phoneScreen').classList.toggle('edit-mode', on);
}

async function runSwap(toWord){
  busy = true;
  const cells = swapCells();
  const base = CONFIG['screen'+(SWAP_SCREEN+1)];
  const targets = toWord ? wordApps($('#wordInput').value, base) : base;
  await Promise.all(cells.map((cell,i) => new Promise(res => {
    setTimeout(async () => { await swapIcon(cell, targets[i]); res(); }, Math.random()*220);
  })));
  busy = false;
}

async function onTrigger(){
  if(busy) return;
  // триггер работает только на «своём» экране
  if(activeIndex !== SWAP_SCREEN) return;

  if(phase === 'normal'){
    setEditMode(true);
    phase = 'edit';
  } else if(phase === 'edit'){
    await runSwap(true);
    phase = 'word';
  } else {
    await runSwap(false);
    setEditMode(false);
    phase = 'normal';
  }
}

/* зоны: невидимый switch-input внутри даёт вибрацию от настоящего касания */
function initZone(el, cfg){
  Object.assign(el.style, {left:'',right:'',top:'',width:'',height:''}, cfg);
  const input = el.querySelector('input');
  input.addEventListener('change', () => {
    input.checked = false;              // сбрасываем, чтобы работало многократно
    onTrigger();
  });
}
initZone($('#zonePrimary'), CONFIG.triggers.primary);
initZone($('#zoneBackup'),  CONFIG.triggers.backup);

$('#doneBtn').addEventListener('click', async () => {
  if(busy) return;
  if(phase === 'word'){ await runSwap(false); }
  setEditMode(false);
  phase = 'normal';
});

/* ============================================================
   ЛИСТАНИЕ ЭКРАНОВ
   ============================================================ */
const viewport = $('#viewport');
const track = $('#track');
let activeIndex = 0, startX = 0, dx = 0, dragging = false, vw = 0;

function setActive(i, animate = true){
  activeIndex = Math.max(0, Math.min(2, i));
  track.style.transition = animate ? '' : 'none';
  track.style.transform = `translateX(-${activeIndex*(100/3)}%)`;
  $$('#pageDots i').forEach((d,n) => d.classList.toggle('active', n===activeIndex));
  if(!animate) requestAnimationFrame(() => track.style.transition = '');
}

viewport.addEventListener('pointerdown', e => {
  if(busy) return;
  dragging = true; startX = e.clientX; dx = 0;
  vw = viewport.getBoundingClientRect().width;
  track.style.transition = 'none';
});
viewport.addEventListener('pointermove', e => {
  if(!dragging) return;
  dx = e.clientX - startX;
  let next = -activeIndex*vw + dx;
  const min = -2*vw;
  if(next > 0)   next = next*0.35;
  if(next < min) next = min + (next-min)*0.35;
  track.style.transform = `translateX(${next}px)`;
});
function endDrag(){
  if(!dragging) return;
  dragging = false;
  track.style.transition = '';
  setActive(Math.abs(dx) > vw*0.18 ? activeIndex + (dx<0?1:-1) : activeIndex);
}
viewport.addEventListener('pointerup', endDrag);
viewport.addEventListener('pointercancel', endDrag);

/* ============================================================
   ЖЕСТ: два пальца сверху вниз → страница ввода
   ============================================================ */
if(CONFIG.behavior.twoFingerSwipeDown){
  let twoStartY = null;
  document.addEventListener('touchstart', e => {
    twoStartY = e.touches.length === 2
      ? (e.touches[0].clientY + e.touches[1].clientY)/2
      : null;
  }, {passive:true});
  document.addEventListener('touchmove', e => {
    if(twoStartY === null || e.touches.length !== 2) return;
    const y = (e.touches[0].clientY + e.touches[1].clientY)/2;
    if(y - twoStartY > 90){ twoStartY = null; showInput(); }
  }, {passive:true});
  document.addEventListener('touchend', () => { twoStartY = null; }, {passive:true});
}

/* ============================================================
   ПЕРЕКЛЮЧЕНИЕ СТРАНИЦ ПРИЛОЖЕНИЯ
   ============================================================ */
function showPhone(){
  $('#viewInput').classList.remove('active');
  $('#viewPhone').classList.add('active');
  document.body.classList.add('lock-scroll');
  store.set('lastView','phone');
  requestAnimationFrame(updateScale);
  if(document.documentElement.requestFullscreen){
    document.documentElement.requestFullscreen().catch(()=>{});
  }
}
function showInput(){
  $('#viewPhone').classList.remove('active');
  $('#viewInput').classList.add('active');
  document.body.classList.remove('lock-scroll');
  store.set('lastView','input');
  if(document.fullscreenElement) document.exitFullscreen().catch(()=>{});
}
$('#goPhoneBtn').addEventListener('click', showPhone);

/* ============================================================
   ФАЛЬШИВЫЙ СНИМОК ДЛЯ МЕНЮ МНОГОЗАДАЧНОСТИ
   iOS снимает превью карточки в момент ухода в фон — подменяем
   содержимое ровно тогда. Работает не на 100%, обязательно
   проверить на своём телефоне перед выступлением.
   ============================================================ */
const fakeCover = $('#fakeCover');
function applyFake(){
  const src = store.get('fakeShot', null);
  if(src) fakeCover.style.backgroundImage = `url(${src})`;
}
applyFake();
document.addEventListener('visibilitychange', () => {
  if(document.visibilityState === 'hidden' && store.get('fakeShot', null)){
    fakeCover.classList.add('on');
  } else {
    setTimeout(() => fakeCover.classList.remove('on'), 120);
  }
});
window.addEventListener('pagehide', () => {
  if(store.get('fakeShot', null)) fakeCover.classList.add('on');
});

/* ============================================================
   СТРАНИЦА ВВОДА: слово, картинки, бейджи
   ============================================================ */
const wordInput = $('#wordInput');
wordInput.value = store.get('word', wordInput.value);
wordInput.addEventListener('input', () => store.set('word', wordInput.value));

function readFile(input, cb){
  const f = input.files[0];
  if(!f) return;
  const r = new FileReader();
  r.onload = () => cb(r.result, f.name);
  r.readAsDataURL(f);
}

$('#wallInput').addEventListener('change', e => readFile(e.target, (data, name) => {
  store.set('wallpaper', data);
  applyWallpaper();
  const l = $('#wallLabel'); l.classList.add('filled'); l.querySelector('span').textContent = '✓ ' + name;
}));
$('#fakeInput').addEventListener('change', e => readFile(e.target, (data, name) => {
  store.set('fakeShot', data);
  applyFake();
  const l = $('#fakeLabel'); l.classList.add('filled'); l.querySelector('span').textContent = '✓ ' + name;
}));

function applyWallpaper(){
  const w = store.get('wallpaper', null);
  if(w) $('#wallpaperLayer').style.backgroundImage = `url(${w})`;
}

/* бейджи */
function buildBadgeEditor(){
  const list = $('#badgeList');
  list.innerHTML = '';
  const saved = store.get('badges', {});
  ['screen1','screen2','screen3'].forEach((key, si) => {
    CONFIG[key].forEach((app, i) => {
      const id = `${key}:${i}`;
      if(saved[id] !== undefined) app.badge = saved[id];
      const row = document.createElement('div');
      row.className = 'badge-row';
      row.innerHTML = `<span>${si+1}. ${app.name}</span>`;
      const inp = document.createElement('input');
      inp.type = 'text'; inp.inputMode = 'numeric'; inp.value = app.badge || 0;
      inp.addEventListener('input', () => {
        const v = parseInt(inp.value,10) || 0;
        app.badge = v;
        const all = store.get('badges', {}); all[id] = v; store.set('badges', all);
        refreshBadges();
      });
      row.appendChild(inp);
      list.appendChild(row);
    });
  });
}
function refreshBadges(){
  ['screen0','screen1','screen2'].forEach((domId, si) => {
    const apps = CONFIG['screen'+(si+1)];
    $$(`#${domId} .icon-cell`).forEach((cell, i) => {
      if(phase === 'word' && si === SWAP_SCREEN) return;   // на буквах бейджей нет
      setBadge(cell.querySelector('.icon-wrap'), apps[i] ? apps[i].badge : 0);
    });
  });
}

/* ============================================================
   СТАРТ
   ============================================================ */
buildBadgeEditor();
renderScreen($('#screen0'), CONFIG.screen1);
renderScreen($('#screen1'), CONFIG.screen2);
renderScreen($('#screen2'), CONFIG.screen3);
renderDock();
applyWallpaper();
updateScale();

window.addEventListener('resize', () => { updateScale(); setActive(activeIndex, false); });
window.addEventListener('orientationchange', updateScale);
if(window.visualViewport) window.visualViewport.addEventListener('resize', updateScale);

/* запуск сразу на экране телефона, если открыто с ярлыка «Домой» */
const params = new URLSearchParams(location.search);
if(params.get('view') === 'phone' || store.get('lastView','input') === 'phone'){
  showPhone();
}

/* отладка зон: добавь ?zones=1 к адресу, чтобы увидеть их подсветку */
if(params.get('zones') === '1') document.body.classList.add('debug-zones');
