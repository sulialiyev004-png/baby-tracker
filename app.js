/* Baby tracker — plain JS, no build step. All data stays in this phone's localStorage. */
'use strict';
(function () {
  const STORE_KEY = 'babytracker.v1';
  const APP_VERSION = '1.0.0';
  const MIN = 60 * 1000, HOUR = 60 * MIN, DAY = 24 * HOUR;

  // ---------------------------------------------------------------- i18n
  const I18N = {
    az: {
      appName: 'Körpə gündəliyi',
      home: 'Əsas', today: 'Gün', stats: 'Statistika', settings: 'Ayarlar',
      feed: 'Qidalanma', left: 'Sol döş', right: 'Sağ döş', bottle: 'Butılka',
      sleep: 'Yuxu', sleeping: 'Yatır', diaper: 'Bez', med: 'Dərman',
      wet: 'Yaş', dirty: 'Çirkli', both: 'Hər ikisi',
      never: 'Hələ qeyd yoxdur', justNow: 'indicə',
      ago: 'əvvəl', u_d: 'gün', u_h: 'saat', u_m: 'dəq',
      tapToStop: 'Bitirmək üçün toxunun', tapToStart: 'Başlamaq üçün toxunun',
      slept: 'yatdı', woke: 'Oyandı', stop: 'Oyandı',
      time: 'Vaxt', fellAsleep: 'Yuxuya getdi', wokeUp: 'Oyandı', now: 'İndi', exactTime: 'Dəqiq saat',
      yesterday: 'dünən',
      save: 'Yadda saxla', delete: 'Sil', undo: 'Geri al', close: 'Bağla',
      logged: 'Qeyd edildi', saved: 'Yadda saxlanıldı', deleted: 'Silindi',
      sleepStarted: 'Yuxu başladı', sleepEnded: 'Yuxu bitdi',
      startSleep: 'Yuxunu başlat', stopSleep: 'Yuxunu bitir', addPastSleep: 'Keçmiş yuxunu əlavə et',
      editStart: 'Başlama vaxtını dəyiş', edit: 'Düzəliş',
      newMed: 'Yeni dərman', medName: 'Dərmanın adı', dose: 'Doza', dosePh: 'məs. 2,5 ml',
      needName: 'Dərmanın adını yazın',
      start: 'Başladı', end: 'Bitdi', stillSleeping: 'Boş qoyun — hələ yatır',
      note: 'Qeyd', notePh: 'istəyə görə',
      kind: 'Növ', amount: 'Miqdar (ml)',
      badTime: 'Vaxt düzgün deyil', endBeforeStart: 'Bitmə vaxtı başlanğıcdan sonra olmalıdır',
      otherSleepActive: 'Başqa yuxu artıq gedir',
      hint: 'Vaxtı dəyişmək üçün düyməni basıb saxlayın',
      lastUsed: 'son',
      noEvents: 'Bu gün üçün qeyd yoxdur',
      todayWord: 'Bu gün', yesterdayWord: 'Dünən',
      share: 'Xülasəni göndər', copied: 'Mətn kopyalandı',
      last7: 'Son 7 gün', feedsPerDay: 'Qidalanma (dəfə)', sleepPerDay: 'Yuxu (saat)',
      diapersPerDay: 'Bez (dəfə)', bottleMl: 'Butılka (ml)', avg: 'Orta', perDay: 'gündə',
      language: 'Dil', theme: 'Görünüş', dark: 'Qaranlıq', light: 'İşıqlı',
      babyName: 'Körpənin adı', babyNamePh: 'məs. Əli',
      backup: 'Ehtiyat nüsxə',
      backupInfo: 'iPhone bəzən saytın məlumatlarını silə bilər. Həftədə bir dəfə ehtiyat nüsxə saxlayın (Fayllara və ya WhatsApp-da özünüzə göndərin).',
      exportBtn: 'Ehtiyat nüsxəni saxla', importBtn: 'Ehtiyat nüsxədən bərpa et',
      lastBackup: 'Son ehtiyat nüsxə', neverBackup: 'hələ saxlanılmayıb',
      backupReminder: 'Ehtiyat nüsxə saxlamaq vaxtıdır',
      imported: (n) => `Bərpa edildi: ${n} yeni qeyd`,
      importBad: 'Bu fayl ehtiyat nüsxə deyil',
      exported: 'Ehtiyat nüsxə hazırdır',
      meds: 'Yadda qalan dərmanlar', remove: 'Sil', noMeds: 'Hələ dərman yoxdur',
      records: 'Qeydlərin sayı', saveError: 'Yadda saxlamaq alınmadı!',
      summaryTitle: 'Xülasə', total: 'cəmi',
      months: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avqust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr'],
      wd: ['B', 'B.e', 'Ç.a', 'Ç', 'C.a', 'C', 'Ş'],
      lastFeed: 'Son qidalanma',
      clock: 'saat'
    },
    ru: {
      appName: 'Дневник малыша',
      home: 'Главная', today: 'День', stats: 'Статистика', settings: 'Настройки',
      feed: 'Кормление', left: 'Левая грудь', right: 'Правая грудь', bottle: 'Бутылочка',
      sleep: 'Сон', sleeping: 'Спит', diaper: 'Подгузник', med: 'Лекарство',
      wet: 'Мокрый', dirty: 'Грязный', both: 'Оба',
      never: 'Ещё нет записей', justNow: 'только что',
      ago: 'назад', u_d: 'д', u_h: 'ч', u_m: 'мин',
      tapToStop: 'Нажмите, чтобы завершить', tapToStart: 'Нажмите, чтобы начать',
      slept: 'сон', woke: 'Проснулся', stop: 'Завершить',
      time: 'Время', fellAsleep: 'Уснул', wokeUp: 'Проснулся', now: 'Сейчас', exactTime: 'Точное время',
      yesterday: 'вчера',
      save: 'Сохранить', delete: 'Удалить', undo: 'Отменить', close: 'Закрыть',
      logged: 'Записано', saved: 'Сохранено', deleted: 'Удалено',
      sleepStarted: 'Сон начался', sleepEnded: 'Сон закончился',
      startSleep: 'Начать сон', stopSleep: 'Завершить сон', addPastSleep: 'Добавить прошедший сон',
      editStart: 'Изменить время начала', edit: 'Изменить',
      newMed: 'Новое лекарство', medName: 'Название', dose: 'Доза', dosePh: 'напр. 2,5 мл',
      needName: 'Введите название лекарства',
      start: 'Начало', end: 'Конец', stillSleeping: 'Оставьте пустым — ещё спит',
      note: 'Заметка', notePh: 'необязательно',
      kind: 'Тип', amount: 'Объём (мл)',
      badTime: 'Неверное время', endBeforeStart: 'Конец должен быть позже начала',
      otherSleepActive: 'Другой сон уже идёт',
      hint: 'Удерживайте кнопку, чтобы изменить время',
      lastUsed: 'посл.',
      noEvents: 'За этот день записей нет',
      todayWord: 'Сегодня', yesterdayWord: 'Вчера',
      share: 'Отправить сводку', copied: 'Текст скопирован',
      last7: 'Последние 7 дней', feedsPerDay: 'Кормления (раз)', sleepPerDay: 'Сон (часы)',
      diapersPerDay: 'Подгузники (раз)', bottleMl: 'Бутылочка (мл)', avg: 'В среднем', perDay: 'в день',
      language: 'Язык', theme: 'Тема', dark: 'Тёмная', light: 'Светлая',
      babyName: 'Имя малыша', babyNamePh: 'напр. Али',
      backup: 'Резервная копия',
      backupInfo: 'iPhone иногда может удалить данные сайта. Раз в неделю сохраняйте копию (в Файлы или отправьте себе в WhatsApp).',
      exportBtn: 'Сохранить копию', importBtn: 'Восстановить из копии',
      lastBackup: 'Последняя копия', neverBackup: 'ещё не сохранялась',
      backupReminder: 'Пора сохранить резервную копию',
      imported: (n) => `Восстановлено: ${n} новых записей`,
      importBad: 'Это не файл резервной копии',
      exported: 'Резервная копия готова',
      meds: 'Сохранённые лекарства', remove: 'Удалить', noMeds: 'Лекарств пока нет',
      records: 'Всего записей', saveError: 'Не удалось сохранить!',
      summaryTitle: 'Сводка', total: 'всего',
      months: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
      wd: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      lastFeed: 'Последнее кормление',
      clock: 'в'
    }
  };

  // ---------------------------------------------------------------- state
  function defaults() {
    return { v: 1, events: [], meds: [], lastMl: 90, lang: 'az', theme: 'dark', babyName: '', lastBackup: 0 };
  }
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        const s = Object.assign(defaults(), JSON.parse(raw));
        if (!Array.isArray(s.events)) s.events = [];
        if (!Array.isArray(s.meds)) s.meds = [];
        return s;
      }
    } catch (e) { /* fall through to defaults */ }
    return defaults();
  }
  let state = load();

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      showToast(t('saveError'), null, 8000);
      return false;
    }
  }

  // Ask iOS/Chrome not to evict our storage (best effort).
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) { }

  let view = 'home';
  let dayOffset = 0;        // Today view: 0 = today, -1 = yesterday ...
  let sheet = null;         // currently open bottom sheet state
  let picked = null;        // time chosen in a sheet; null = "now"
  let undoFn = null, toastTimer = null;
  let pendingReload = false;

  const $ = (id) => document.getElementById(id);
  const main = $('main'), sheetEl = $('sheet'), backdrop = $('backdrop'), toastEl = $('toast');

  function t(key, ...args) {
    const dict = I18N[state.lang] || I18N.az;
    const v = key in dict ? dict[key] : (key in I18N.az ? I18N.az[key] : key);
    return typeof v === 'function' ? v(...args) : v;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  // ---------------------------------------------------------------- time helpers
  const pad = (n) => String(n).padStart(2, '0');
  const hm = (ts) => { const d = new Date(ts); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
  function startOfDay(ts) { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); }
  function addDays(ts, n) { const d = new Date(ts); d.setDate(d.getDate() + n); return d.getTime(); }
  function sameDay(a, b) { return startOfDay(a) === startOfDay(b); }
  function num(n, digits) { return n.toFixed(digits).replace('.', ','); }

  function fmtDur(ms) {
    const totalMin = Math.max(0, Math.floor(ms / MIN));
    const d = Math.floor(totalMin / 1440), h = Math.floor((totalMin % 1440) / 60), m = totalMin % 60;
    if (d > 0) return `${d} ${t('u_d')}${h ? ' ' + h + ' ' + t('u_h') : ''}`;
    if (h > 0) return `${h} ${t('u_h')}${m ? ' ' + m + ' ' + t('u_m') : ''}`;
    return `${m} ${t('u_m')}`;
  }
  function fmtAgo(ms) {
    if (ms < MIN) return t('justNow');
    return fmtDur(ms) + ' ' + t('ago');
  }
  function fmtTimer(ms) {
    const s = Math.max(0, Math.floor(ms / 1000));
    return `${Math.floor(s / 3600)}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
  }
  function dayName(ts) {
    const d = new Date(ts);
    return `${d.getDate()} ${t('months')[d.getMonth()]}`;
  }
  function dayTitle(ts) {
    const today = startOfDay(Date.now());
    if (startOfDay(ts) === today) return `${t('todayWord')}, ${dayName(ts)}`;
    if (startOfDay(ts) === addDays(today, -1)) return `${t('yesterdayWord')}, ${dayName(ts)}`;
    return `${t('wd')[new Date(ts).getDay()]}, ${dayName(ts)}`;
  }
  // "14:20", "dünən 23:50", or "3 noyabr 09:00"
  function whenLabel(ts) {
    const now = Date.now();
    if (sameDay(ts, now)) return hm(ts);
    if (sameDay(ts, addDays(now, -1))) return `${t('yesterday')} ${hm(ts)}`;
    return `${dayName(ts)} ${hm(ts)}`;
  }
  // value for <input type="datetime-local">
  function toLocalInput(ts) {
    const d = new Date(ts);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  function fromLocalInput(str) {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(str || '');
    if (!m) return NaN;
    return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], 0, 0).getTime();
  }
  // "HH:MM" from a time input -> timestamp today, or yesterday if that would be in the future
  function fromTimeInput(str) {
    const m = /^(\d{1,2}):(\d{2})/.exec(str || '');
    if (!m) return NaN;
    const d = new Date(); d.setHours(+m[1], +m[2], 0, 0);
    if (d.getTime() > Date.now() + MIN) d.setDate(d.getDate() - 1);
    return d.getTime();
  }

  // ---------------------------------------------------------------- data helpers
  function sortEvents() { state.events.sort((a, b) => a.t - b.t); }
  function addEvent(ev) { ev.id = uid(); state.events.push(ev); sortEvents(); save(); return ev; }
  function removeEvent(id) {
    const i = state.events.findIndex((e) => e.id === id);
    if (i < 0) return null;
    const [ev] = state.events.splice(i, 1);
    save();
    return ev;
  }
  function getEvent(id) { return state.events.find((e) => e.id === id) || null; }
  function lastOf(type, filter) {
    let best = null;
    for (const e of state.events) if (e.type === type && (!filter || filter(e)) && (!best || e.t >= best.t)) best = e;
    return best;
  }
  function activeSleep() { return state.events.find((e) => e.type === 'sleep' && !e.end) || null; }
  function lastFinishedSleep() {
    let best = null;
    for (const e of state.events) if (e.type === 'sleep' && e.end && (!best || e.end > best.end)) best = e;
    return best;
  }
  function rememberMed(name, dose) {
    const key = name.trim().toLowerCase();
    const i = state.meds.findIndex((m) => m.name.trim().toLowerCase() === key);
    if (i >= 0) state.meds.splice(i, 1);
    state.meds.unshift({ name: name.trim(), dose: (dose || '').trim(), lastUsed: Date.now() });
  }

  const ICON = { feed: '🍼', sleep: '😴', diaper: '🧷', med: '💊' };
  function eventIcon(e) {
    if (e.type === 'feed') return e.sub === 'bottle' ? '🍼' : '🤱';
    if (e.type === 'diaper') return e.sub === 'wet' ? '💧' : e.sub === 'dirty' ? '💩' : '💧💩';
    return ICON[e.type] || '•';
  }
  function eventTitle(e) {
    if (e.type === 'feed') {
      if (e.sub === 'bottle') return `${t('bottle')}${e.ml ? ' · ' + e.ml + ' ml' : ''}`;
      return e.sub === 'L' ? t('left') : t('right');
    }
    if (e.type === 'diaper') return `${t('diaper')}: ${t(e.sub).toLowerCase()}`;
    if (e.type === 'med') return `${e.name}${e.dose ? ' · ' + e.dose : ''}`;
    if (e.type === 'sleep') return e.end ? `${t('sleep')} · ${fmtDur(e.end - e.t)}` : t('sleeping');
    return e.type;
  }

  // ---------------------------------------------------------------- rendering
  function applyTheme() {
    const root = document.documentElement;
    root.dataset.theme = state.theme;
    root.lang = state.lang;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = state.theme === 'light' ? '#f4f5f9' : '#0e121b';
  }

  function renderTitle() {
    const name = (state.babyName || '').trim();
    $('title').textContent = name ? `👶 ${name}` : t('appName');
    document.title = t('appName');
  }

  function renderBanner() {
    const a = activeSleep();
    const el = $('sleepBanner');
    if (!a) { el.hidden = true; el.innerHTML = ''; document.body.classList.remove('has-banner'); return; }
    el.hidden = false;
    document.body.classList.add('has-banner');
    el.innerHTML = `
      <button class="sb-main" data-act="sleep-sheet">
        <span class="sb-icon">😴</span>
        <span class="sb-label">${t('sleeping')}</span>
        <b class="sb-timer" data-timer="${a.t}">${fmtTimer(Date.now() - a.t)}</b>
      </button>
      <button class="sb-stop" data-act="sleep-stop">${t('stop')}</button>`;
  }

  function renderTabs() {
    const tabs = [['home', '🏠'], ['today', '📋'], ['stats', '📊'], ['settings', '⚙️']];
    $('tabs').innerHTML = tabs.map(([k, ic]) =>
      `<button data-tab="${k}" class="${view === k ? 'on' : ''}" aria-label="${t(k)}"><span class="ti">${ic}</span><span class="tl">${t(k)}</span>${k === 'settings' && needsBackup() ? '<i class="dot"></i>' : ''}</button>`
    ).join('');
  }

  function render() {
    applyTheme();
    renderTitle();
    renderBanner();
    renderTabs();
    if (view === 'home') renderHome();
    else if (view === 'today') renderToday();
    else if (view === 'stats') renderStats();
    else renderSettings();
  }

  function needsBackup() {
    if (!state.events.length) return false;
    const first = state.events[0].t;
    const ref = state.lastBackup || first;
    return Date.now() - ref > 7 * DAY;
  }

  // ---- Home
  // big number + small "ago" word, so the important part never wraps
  function agoInner(ms) {
    if (ms < MIN) return esc(t('justNow'));
    return `<span class="n">${esc(fmtDur(ms))}</span> <small>${esc(t('ago'))}</small>`;
  }
  function agoSpan(ts) { return `<span class="c-ago" data-since="${ts}">${agoInner(Date.now() - ts)}</span>`; }
  function card(kind, label, mainHtml, sub, cls) {
    return `<button class="card c-${kind} ${cls || ''}" data-card="${kind}">
      <span class="c-icon" aria-hidden="true">${ICON[kind]}</span>
      <span class="c-body">
        <span class="c-label">${label}</span>
        ${mainHtml}
        ${sub ? `<span class="c-sub">${sub}</span>` : ''}
      </span>
    </button>`;
  }
  function renderHome() {
    const never = `<span class="c-ago none">${t('never')}</span>`;
    const f = lastOf('feed'), d = lastOf('diaper'), m = lastOf('med');
    const a = activeSleep(), ls = lastFinishedSleep();

    const feedCard = card('feed', t('feed'), f ? agoSpan(f.t) : never, f ? `${esc(eventTitle(f))} · ${whenLabel(f.t)}` : '');
    let sleepCard;
    if (a) {
      sleepCard = card('sleep', `${t('sleeping')} · ${hm(a.t)}`,
        `<span class="c-ago" data-timer="${a.t}">${fmtTimer(Date.now() - a.t)}</span>`, t('tapToStop'), 'running');
    } else if (ls) {
      sleepCard = card('sleep', t('sleep'), agoSpan(ls.end),
        `${t('woke')} ${whenLabel(ls.end)} · ${fmtDur(ls.end - ls.t)}`);
    } else {
      sleepCard = card('sleep', t('sleep'), never, t('tapToStart'));
    }
    const diaperCard = card('diaper', t('diaper'), d ? agoSpan(d.t) : never, d ? `${t(d.sub)} · ${whenLabel(d.t)}` : '');
    const medCard = card('med', t('med'), m ? agoSpan(m.t) : never, m ? `${esc(eventTitle(m))} · ${whenLabel(m.t)}` : '');

    const foot = needsBackup()
      ? `<button class="reminder" data-act="goto-settings">💾 ${t('backupReminder')}</button>`
      : `<p class="hint">${t('hint')}</p>`;
    main.innerHTML = `<div class="home">${feedCard}${sleepCard}${diaperCard}${medCard}</div>${foot}`;
  }

  // ---- Today / timeline
  function eventsForDay(dayStart) {
    const dayEnd = addDays(dayStart, 1), now = Date.now();
    return state.events.filter((e) => {
      if (e.type === 'sleep') return e.t < dayEnd && (e.end || now) > dayStart;
      return e.t >= dayStart && e.t < dayEnd;
    });
  }
  function daySummary(dayStart) {
    const dayEnd = addDays(dayStart, 1), now = Date.now();
    const evs = eventsForDay(dayStart);
    const s = { feeds: 0, L: 0, R: 0, bottle: 0, ml: 0, sleepMs: 0, diapers: 0, wet: 0, dirty: 0, both: 0, meds: [] };
    for (const e of evs) {
      if (e.type === 'feed') { s.feeds++; s[e.sub]++; if (e.sub === 'bottle') s.ml += (+e.ml || 0); }
      else if (e.type === 'diaper') { s.diapers++; s[e.sub]++; }
      else if (e.type === 'med') s.meds.push(e);
      else if (e.type === 'sleep') {
        const end = Math.min(e.end || now, dayEnd), start = Math.max(e.t, dayStart);
        if (end > start) s.sleepMs += end - start;
      }
    }
    return s;
  }
  function renderToday() {
    const dayStart = startOfDay(addDays(Date.now(), dayOffset));
    const evs = eventsForDay(dayStart).slice().sort((a, b) => b.t - a.t);
    const s = daySummary(dayStart);
    const rows = evs.map((e) => {
      const time = e.type === 'sleep'
        ? `<span class="r-time">${sameDay(e.t, dayStart) ? hm(e.t) : '‹ ' + hm(e.t)}<small>${e.end ? '– ' + hm(e.end) : '…'}</small></span>`
        : `<span class="r-time">${hm(e.t)}</span>`;
      const title = e.type === 'sleep' && !e.end
        ? `${t('sleeping')} · <span data-durfrom="${e.t}">${fmtDur(Date.now() - e.t)}</span>`
        : esc(eventTitle(e));
      return `<li><button class="row r-${e.type}" data-act="edit" data-id="${e.id}">
        ${time}<span class="r-icon" aria-hidden="true">${eventIcon(e)}</span>
        <span class="r-text"><b>${title}</b>${e.note ? `<small>${esc(e.note)}</small>` : ''}</span>
        <span class="r-go" aria-hidden="true">›</span></button></li>`;
    }).join('');

    main.innerHTML = `
      <div class="daynav">
        <button class="navbtn" data-act="day" data-d="-1" aria-label="‹">‹</button>
        <div class="daytitle">${dayTitle(dayStart)}</div>
        <button class="navbtn" data-act="day" data-d="1" aria-label="›" ${dayOffset >= 0 ? 'disabled' : ''}>›</button>
      </div>
      <div class="summary">
        <span class="sum s-feed">🍼 <b>${s.feeds}</b></span>
        <span class="sum s-sleep">😴 <b>${fmtDur(s.sleepMs)}</b></span>
        <span class="sum s-diaper">🧷 <b>${s.diapers}</b></span>
        <span class="sum s-med">💊 <b>${s.meds.length}</b></span>
      </div>
      ${evs.length ? `<ul class="timeline">${rows}</ul>` : `<p class="empty">${t('noEvents')}</p>`}
      <button class="btn secondary wide share" data-act="share">📤 ${t('share')}</button>`;
  }

  // ---- Stats
  function renderStats() {
    const today = startOfDay(Date.now());
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const ds = addDays(today, -i);
      days.push({ ds, s: daySummary(ds) });
    }
    const firstEv = state.events.length ? startOfDay(state.events[0].t) : today;
    // averages use complete days only (not today) since the first record
    const full = days.filter((d) => d.ds < today && d.ds >= firstEv);

    function chart(title, cls, values, fmt, avgFmt) {
      const max = Math.max(...values, 0);
      const cols = days.map((d, i) => {
        const v = values[i];
        const h = max > 0 ? Math.max(v > 0 ? 4 : 0, Math.round((v / max) * 100)) : 0;
        const dt = new Date(d.ds);
        return `<div class="col ${d.ds === today ? 'is-today' : ''}">
          <span class="cv">${v > 0 ? fmt(v) : ''}</span>
          <span class="ct"><span class="cb" style="height:${h}%"></span></span>
          <span class="cd">${t('wd')[dt.getDay()]}<br>${dt.getDate()}</span>
        </div>`;
      }).join('');
      let avg = '';
      if (full.length) {
        const sum = full.reduce((acc, d) => acc + values[days.indexOf(d)], 0);
        avg = `<p class="avg">${t('avg')}: <b>${avgFmt(sum / full.length)}</b> ${t('perDay')}</p>`;
      }
      return `<section class="chart ${cls}"><h3>${title}</h3><div class="cols">${cols}</div>${avg}</section>`;
    }

    const feeds = days.map((d) => d.s.feeds);
    const sleepH = days.map((d) => d.s.sleepMs / HOUR);
    const diapers = days.map((d) => d.s.diapers);
    const ml = days.map((d) => d.s.ml);
    main.innerHTML = `
      <h2 class="vh">${t('last7')}</h2>
      ${chart('🍼 ' + t('feedsPerDay'), 'k-feed', feeds, (v) => v, (v) => num(v, 1))}
      ${chart('😴 ' + t('sleepPerDay'), 'k-sleep', sleepH, (v) => num(v, v >= 10 ? 0 : 1), (v) => num(v, 1))}
      ${chart('🧷 ' + t('diapersPerDay'), 'k-diaper', diapers, (v) => v, (v) => num(v, 1))}
      ${ml.some((v) => v > 0) ? chart('🍼 ' + t('bottleMl'), 'k-ml', ml, (v) => v, (v) => Math.round(v)) : ''}`;
  }

  // ---- Settings
  function renderSettings() {
    const seg = (key, opts) => `<div class="seg">${opts.map(([v, label]) =>
      `<button class="${state[key] === v ? 'on' : ''}" data-act="set" data-k="${key}" data-v="${v}">${label}</button>`).join('')}</div>`;
    const meds = state.meds.length
      ? state.meds.map((m, i) => `<li><span><b>${esc(m.name)}</b>${m.dose ? ' · ' + esc(m.dose) : ''}</span><button class="btn small danger" data-act="med-remove" data-i="${i}">${t('remove')}</button></li>`).join('')
      : `<li class="muted">${t('noMeds')}</li>`;
    main.innerHTML = `
      <section class="set">
        <h3>${t('language')}</h3>
        ${seg('lang', [['az', 'Azərbaycanca'], ['ru', 'Русский']])}
      </section>
      <section class="set">
        <h3>${t('theme')}</h3>
        ${seg('theme', [['dark', '🌙 ' + t('dark')], ['light', '☀️ ' + t('light')]])}
      </section>
      <section class="set">
        <h3><label for="babyName">${t('babyName')}</label></h3>
        <input id="babyName" class="field" type="text" autocomplete="off" placeholder="${t('babyNamePh')}" value="${esc(state.babyName)}">
      </section>
      <section class="set ${needsBackup() ? 'warn' : ''}">
        <h3>💾 ${t('backup')}</h3>
        <p class="muted">${t('backupInfo')}</p>
        <p>${t('lastBackup')}: <b>${state.lastBackup ? whenLabel(state.lastBackup) : t('neverBackup')}</b></p>
        <button class="btn primary wide" data-act="export">⬇️ ${t('exportBtn')}</button>
        <button class="btn secondary wide" data-act="import">⬆️ ${t('importBtn')}</button>
      </section>
      <section class="set">
        <h3>💊 ${t('meds')}</h3>
        <ul class="medlist">${meds}</ul>
      </section>
      <p class="muted center">${t('records')}: ${state.events.length} · v${APP_VERSION}</p>`;
  }

  // ---------------------------------------------------------------- sheets
  function openSheet(kind, opts) {
    sheet = Object.assign({ kind, openedAt: Date.now() }, opts || {});
    picked = null;
    hideToast(); // never let a toast cover the sheet's buttons
    renderSheet();
    backdrop.hidden = false;
    sheetEl.hidden = false;
    sheetEl.scrollTop = 0;
    requestAnimationFrame(() => { backdrop.classList.add('show'); sheetEl.classList.add('show'); });
  }
  function closeSheet() {
    sheet = null;
    sheetEl.classList.remove('show');
    backdrop.classList.remove('show');
    setTimeout(() => { if (!sheet) { sheetEl.hidden = true; backdrop.hidden = true; sheetEl.innerHTML = ''; } }, 220);
    if (pendingReload) location.reload();
  }
  function renderSheet() {
    if (!sheet) return;
    const top = sheetEl.scrollTop;
    let html = '';
    if (sheet.kind === 'feed') html = feedSheet();
    else if (sheet.kind === 'diaper') html = diaperSheet();
    else if (sheet.kind === 'med') html = medSheet();
    else if (sheet.kind === 'sleep') html = sleepSheet();
    else if (sheet.kind === 'edit') html = editSheet();
    sheetEl.innerHTML = `<div class="grab"></div><button class="x" data-act="close" aria-label="${t('close')}">✕</button>${html}`;
    sheetEl.scrollTop = top;
  }

  function pickedLabel() {
    if (picked === null) return t('now');
    return `${whenLabel(picked)} <span class="muted">(${fmtAgo(Date.now() - picked)})</span>`;
  }
  function timePick(labelKey) {
    const chips = [0, -15, -30, -60].map((m) => {
      const on = m === 0 ? picked === null : sheet.tpMin === m && picked !== null;
      const label = m === 0 ? t('now') : (m === -60 ? `−1 ${t('u_h')}` : `−${-m} ${t('u_m')}`);
      return `<button class="chip ${on ? 'on' : ''}" data-act="tp" data-min="${m}">${label}</button>`;
    }).join('');
    return `<div class="tp ${sheet.flash ? 'flash' : ''}">
      <div class="tp-head">🕐 ${t(labelKey || 'time')}: <b class="tp-val">${pickedLabel()}</b></div>
      <div class="tp-chips">${chips}</div>
      <label class="tp-exact"><span>${t('exactTime')}</span>
        <input type="time" class="tp-input" value="${hm(chosenTime())}"></label>
    </div>`;
  }
  function updateTimePick() {
    const val = sheetEl.querySelector('.tp-val');
    if (val) val.innerHTML = pickedLabel();
    sheetEl.querySelectorAll('.tp .chip').forEach((c) => {
      const m = +c.dataset.min;
      c.classList.toggle('on', m === 0 ? picked === null : sheet.tpMin === m && picked !== null);
    });
    const inp = sheetEl.querySelector('.tp-input');
    if (inp && document.activeElement !== inp) inp.value = hm(chosenTime());
  }
  const chosenTime = () => (picked === null ? Date.now() : picked);

  function feedSheet() {
    const lastBreast = lastOf('feed', (e) => e.sub === 'L' || e.sub === 'R');
    const badge = (side) => lastBreast && lastBreast.sub === side ? `<em class="badge">${t('lastUsed')} ${hm(lastBreast.t)}</em>` : '';
    if (sheet.ml == null) sheet.ml = state.lastMl || 90;
    const bottle = sheet.bottleOpen ? `
      <div class="bottle">
        <div class="ml-row">
          <button class="step" data-act="ml" data-d="-10" aria-label="−10">−</button>
          <div class="ml-val"><b>${sheet.ml}</b> ml</div>
          <button class="step" data-act="ml" data-d="10" aria-label="+10">+</button>
        </div>
        <div class="ml-chips">${[30, 60, 90, 120, 150, 180].map((v) =>
          `<button class="chip ${v === sheet.ml ? 'on' : ''}" data-act="ml-set" data-v="${v}">${v}</button>`).join('')}</div>
        <button class="btn primary wide" data-act="log-bottle">✓ ${t('save')} · ${sheet.ml} ml</button>
      </div>` : '';
    return `<h2>🍼 ${t('feed')}</h2>
      ${timePick()}
      <div class="opts two">
        <button class="opt" data-act="log-feed" data-sub="L"><span class="oi">🤱</span><span>${t('left')}</span>${badge('L')}</button>
        <button class="opt" data-act="log-feed" data-sub="R"><span class="oi">🤱</span><span>${t('right')}</span>${badge('R')}</button>
      </div>
      <button class="opt row-opt ${sheet.bottleOpen ? 'on' : ''}" data-act="bottle-toggle"><span class="oi">🍼</span><span>${t('bottle')}</span></button>
      ${bottle}`;
  }

  function diaperSheet() {
    return `<h2>🧷 ${t('diaper')}</h2>
      ${timePick()}
      <div class="opts three">
        <button class="opt" data-act="log-diaper" data-sub="wet"><span class="oi">💧</span><span>${t('wet')}</span></button>
        <button class="opt" data-act="log-diaper" data-sub="dirty"><span class="oi">💩</span><span>${t('dirty')}</span></button>
        <button class="opt" data-act="log-diaper" data-sub="both"><span class="oi">💧💩</span><span>${t('both')}</span></button>
      </div>`;
  }

  function medSheet() {
    const known = state.meds.map((m, i) => `
      <div class="med-row">
        <button class="opt med" data-act="log-med" data-i="${i}"><b>${esc(m.name)}</b>${m.dose ? `<span>${esc(m.dose)}</span>` : ''}</button>
        <button class="opt med-edit" data-act="med-fill" data-i="${i}" aria-label="${t('edit')}">✎</button>
      </div>`).join('');
    const formOpen = sheet.formOpen || !state.meds.length;
    const f = sheet.form || { name: '', dose: '' };
    const form = formOpen ? `
      <div class="medform">
        <label>${t('medName')}<input class="field" data-form="name" type="text" list="medNames" autocomplete="off" autocapitalize="words" value="${esc(f.name)}"></label>
        <datalist id="medNames">${state.meds.map((m) => `<option value="${esc(m.name)}">`).join('')}</datalist>
        <label>${t('dose')}<input class="field" data-form="dose" type="text" autocomplete="off" placeholder="${t('dosePh')}" value="${esc(f.dose)}"></label>
        <button class="btn primary wide" data-act="log-med-form">✓ ${t('save')}</button>
      </div>` : `<button class="btn secondary wide" data-act="med-new">＋ ${t('newMed')}</button>`;
    return `<h2>💊 ${t('med')}</h2>${timePick()}${known ? `<div class="meds">${known}</div>` : ''}${form}`;
  }

  function sleepSheet() {
    const a = activeSleep();
    if (a) {
      return `<h2>😴 ${t('sleeping')} <b class="timer" data-timer="${a.t}">${fmtTimer(Date.now() - a.t)}</b></h2>
        <p class="muted">${t('fellAsleep')}: ${whenLabel(a.t)}</p>
        ${timePick('wokeUp')}
        <button class="btn primary wide big" data-act="sleep-stop-picked">⏹ ${t('stopSleep')}</button>
        <button class="btn secondary wide" data-act="edit" data-id="${a.id}">✎ ${t('editStart')}</button>`;
    }
    return `<h2>😴 ${t('sleep')}</h2>
      ${timePick('fellAsleep')}
      <button class="btn primary wide big" data-act="sleep-start-picked">▶ ${t('startSleep')}</button>
      <button class="btn secondary wide" data-act="sleep-add-past">＋ ${t('addPastSleep')}</button>`;
  }

  function editSheet() {
    const d = sheet.draft;
    const segBtns = (opts) => `<div class="seg">${opts.map(([v, label]) =>
      `<button class="${d.sub === v ? 'on' : ''}" data-act="draft-sub" data-v="${v}">${label}</button>`).join('')}</div>`;
    let fields = '';
    if (d.type === 'feed') {
      fields = `<div class="fld"><span>${t('kind')}</span>${segBtns([['L', t('left')], ['R', t('right')], ['bottle', t('bottle')]])}</div>
        ${d.sub === 'bottle' ? `<label class="fld"><span>${t('amount')}</span><input class="field" data-k="ml" type="number" inputmode="numeric" min="0" max="500" value="${esc(d.ml)}"></label>` : ''}`;
    } else if (d.type === 'diaper') {
      fields = `<div class="fld"><span>${t('kind')}</span>${segBtns([['wet', '💧 ' + t('wet')], ['dirty', '💩 ' + t('dirty')], ['both', t('both')]])}</div>`;
    } else if (d.type === 'med') {
      fields = `<label class="fld"><span>${t('medName')}</span><input class="field" data-k="name" type="text" list="medNames2" autocomplete="off" value="${esc(d.name)}"></label>
        <datalist id="medNames2">${state.meds.map((m) => `<option value="${esc(m.name)}">`).join('')}</datalist>
        <label class="fld"><span>${t('dose')}</span><input class="field" data-k="dose" type="text" autocomplete="off" value="${esc(d.dose)}"></label>`;
    }
    const timeFields = d.type === 'sleep'
      ? `<label class="fld"><span>${t('fellAsleep')}</span><input class="field" data-k="tStr" type="datetime-local" value="${d.tStr}"></label>
         <label class="fld"><span>${t('wokeUp')}</span><input class="field" data-k="endStr" type="datetime-local" value="${d.endStr}">
         <small class="muted">${t('stillSleeping')}</small></label>`
      : `<label class="fld"><span>${t('time')}</span><input class="field" data-k="tStr" type="datetime-local" value="${d.tStr}"></label>`;
    return `<h2>${ICON[d.type]} ${sheet.isNew ? t('addPastSleep') : t('edit')}</h2>
      ${fields}${timeFields}
      <label class="fld"><span>${t('note')}</span><input class="field" data-k="note" type="text" autocomplete="off" placeholder="${t('notePh')}" value="${esc(d.note)}"></label>
      ${sheet.error ? `<p class="error">${esc(sheet.error)}</p>` : ''}
      <button class="btn primary wide" data-act="edit-save">✓ ${t('save')}</button>
      ${sheet.isNew ? '' : `<button class="btn danger wide" data-act="edit-delete">🗑 ${t('delete')}</button>`}`;
  }

  function openEdit(id) {
    const e = getEvent(id);
    if (!e) return;
    openSheet('edit', {
      id, draft: {
        type: e.type, sub: e.sub, ml: e.ml != null ? e.ml : '', name: e.name || '', dose: e.dose || '', note: e.note || '',
        tStr: toLocalInput(e.t), endStr: e.end ? toLocalInput(e.end) : ''
      }
    });
  }
  function openNewPastSleep() {
    const now = Date.now();
    openSheet('edit', {
      isNew: true, draft: { type: 'sleep', note: '', tStr: toLocalInput(now - HOUR), endStr: toLocalInput(now) }
    });
  }
  function saveEdit() {
    const d = sheet.draft;
    const tVal = fromLocalInput(d.tStr);
    if (isNaN(tVal)) { sheet.error = t('badTime'); return renderSheet(); }
    let endVal = null;
    if (d.type === 'sleep') {
      if (d.endStr) {
        endVal = fromLocalInput(d.endStr);
        if (isNaN(endVal)) { sheet.error = t('badTime'); return renderSheet(); }
        if (endVal <= tVal) { sheet.error = t('endBeforeStart'); return renderSheet(); }
      } else {
        const other = activeSleep();
        if (other && other.id !== sheet.id) { sheet.error = t('otherSleepActive'); return renderSheet(); }
      }
    }
    if (d.type === 'med' && !d.name.trim()) { sheet.error = t('needName'); return renderSheet(); }

    const target = sheet.isNew ? { type: d.type } : getEvent(sheet.id);
    if (!target) return closeSheet();
    const before = sheet.isNew ? null : JSON.parse(JSON.stringify(target));
    target.t = tVal;
    if (d.type === 'sleep') target.end = endVal;
    if (d.type === 'feed' || d.type === 'diaper') target.sub = d.sub;
    if (d.type === 'feed') {
      if (d.sub === 'bottle') target.ml = d.ml === '' ? null : Math.max(0, Math.round(+d.ml) || 0); else delete target.ml;
    }
    if (d.type === 'med') { target.name = d.name.trim(); target.dose = d.dose.trim(); rememberMed(target.name, target.dose); }
    if (d.note.trim()) target.note = d.note.trim(); else delete target.note;

    if (sheet.isNew) {
      const ev = addEvent(target);
      closeSheet(); render();
      showToast(`✓ ${t('logged')}`, () => { removeEvent(ev.id); render(); });
    } else {
      sortEvents(); save();
      const id = sheet.id;
      closeSheet(); render();
      showToast(`✓ ${t('saved')}`, () => {
        const cur = getEvent(id);
        if (cur) { Object.keys(cur).forEach((k) => delete cur[k]); Object.assign(cur, before); sortEvents(); save(); render(); }
      });
    }
  }
  function deleteFromEdit() {
    const ev = removeEvent(sheet.id);
    closeSheet(); render();
    if (ev) showToast(`🗑 ${t('deleted')}`, () => { state.events.push(ev); sortEvents(); save(); render(); }, 7000);
  }

  // ---------------------------------------------------------------- actions
  function logged(ev, label) {
    closeSheet();
    render();
    showToast(`✓ ${label} · ${whenLabel(ev.t)}`, () => { removeEvent(ev.id); render(); });
  }
  function startSleep(ts) {
    if (activeSleep()) return;
    const ev = addEvent({ type: 'sleep', t: ts, end: null });
    closeSheet(); render();
    showToast(`😴 ${t('sleepStarted')} · ${whenLabel(ts)}`, () => { removeEvent(ev.id); render(); });
  }
  function stopSleep(ts) {
    const a = activeSleep();
    if (!a) return;
    if (ts <= a.t) { showToast(t('endBeforeStart'), null, 4000); return; }
    a.end = ts; save();
    closeSheet(); render();
    showToast(`☀️ ${t('sleepEnded')} · ${fmtDur(a.end - a.t)}`, () => { a.end = null; save(); render(); });
  }

  function onCardTap(kind) {
    if (kind === 'sleep') {
      if (activeSleep()) stopSleep(Date.now()); else startSleep(Date.now());
      return;
    }
    openSheet(kind);
  }
  function onCardLong(kind) { openSheet(kind, { flash: true }); }

  function summaryText(dayStart) {
    const s = daySummary(dayStart);
    const name = (state.babyName || '').trim();
    const lines = [`👶 ${name ? name + ' — ' : ''}${dayTitle(dayStart)}`];
    const fParts = [];
    if (s.L) fParts.push(`${t('left').toLowerCase()} ${s.L}`);
    if (s.R) fParts.push(`${t('right').toLowerCase()} ${s.R}`);
    if (s.bottle) fParts.push(`${t('bottle').toLowerCase()} ${s.bottle}${s.ml ? ' (' + s.ml + ' ml)' : ''}`);
    lines.push(`🍼 ${t('feed')}: ${s.feeds}${fParts.length ? ' — ' + fParts.join(', ') : ''}`);
    lines.push(`😴 ${t('sleep')}: ${fmtDur(s.sleepMs)}`);
    const dParts = [];
    if (s.wet) dParts.push(`${t('wet').toLowerCase()} ${s.wet}`);
    if (s.dirty) dParts.push(`${t('dirty').toLowerCase()} ${s.dirty}`);
    if (s.both) dParts.push(`${t('both').toLowerCase()} ${s.both}`);
    lines.push(`🧷 ${t('diaper')}: ${s.diapers}${dParts.length ? ' — ' + dParts.join(', ') : ''}`);
    if (s.meds.length) lines.push(`💊 ${t('med')}: ${s.meds.map((m) => `${m.name}${m.dose ? ' ' + m.dose : ''} (${hm(m.t)})`).join(', ')}`);
    const f = lastOf('feed');
    if (f && dayStart === startOfDay(Date.now())) lines.push(`⏱ ${t('lastFeed')}: ${hm(f.t)} (${fmtAgo(Date.now() - f.t)})`);
    const a = activeSleep();
    if (a && dayStart === startOfDay(Date.now())) lines.push(`😴 ${t('sleeping')}: ${fmtDur(Date.now() - a.t)}`);
    return lines.join('\n');
  }
  async function shareSummary() {
    const text = summaryText(startOfDay(addDays(Date.now(), dayOffset)));
    if (navigator.share) {
      try { await navigator.share({ text }); return; } catch (e) { if (e && e.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(text); showToast(t('copied')); }
    catch (e) { window.prompt('', text); }
  }

  async function exportBackup() {
    const data = {
      app: 'baby-tracker', format: 1, exportedAt: new Date().toISOString(),
      events: state.events, meds: state.meds,
      settings: { lang: state.lang, theme: state.theme, babyName: state.babyName, lastMl: state.lastMl }
    };
    const d = new Date();
    const fname = `korpe-backup-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.json`;
    const json = JSON.stringify(data, null, 1);
    const markDone = () => { state.lastBackup = Date.now(); save(); render(); showToast(`✓ ${t('exported')}`); };
    // On iPhone the share sheet ("Save to Files", WhatsApp...) is the reliable way to keep a file.
    try {
      const file = new File([json], fname, { type: 'application/json' });
      const isTouch = matchMedia('(pointer: coarse)').matches;
      if (isTouch && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: fname });
        return markDone();
      }
    } catch (e) {
      if (e && e.name === 'AbortError') return;
    }
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = fname;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    markDone();
  }
  function importBackup(file) {
    const reader = new FileReader();
    reader.onload = () => {
      let data;
      try { data = JSON.parse(reader.result); } catch (e) { data = null; }
      if (!data || !Array.isArray(data.events)) { showToast(t('importBad'), null, 5000); return; }
      const have = new Set(state.events.map((e) => e.id));
      let added = 0;
      for (const e of data.events) {
        if (!e || typeof e.t !== 'number' || !['feed', 'sleep', 'diaper', 'med'].includes(e.type)) continue;
        if (!e.id) e.id = uid();
        if (have.has(e.id)) continue;
        // never import a second running sleep
        if (e.type === 'sleep' && !e.end && activeSleep()) continue;
        state.events.push(e); have.add(e.id); added++;
      }
      if (Array.isArray(data.meds)) {
        for (const m of data.meds.slice().reverse()) {
          if (m && m.name && !state.meds.some((x) => x.name.toLowerCase() === String(m.name).toLowerCase())) state.meds.push({ name: String(m.name), dose: String(m.dose || ''), lastUsed: m.lastUsed || 0 });
        }
      }
      if (data.settings && !state.babyName && data.settings.babyName) state.babyName = String(data.settings.babyName);
      sortEvents(); save(); render();
      showToast(`✓ ${t('imported', added)}`, null, 5000);
    };
    reader.readAsText(file);
  }

  // ---------------------------------------------------------------- toast
  function showToast(msg, undo, ms) {
    toastEl.innerHTML = `<span class="tm">${esc(msg)}</span>${undo ? `<button data-act="undo">${t('undo')}</button>` : ''}`;
    toastEl.hidden = false;
    requestAnimationFrame(() => toastEl.classList.add('show'));
    undoFn = undo || null;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, ms || (undo ? 6000 : 3000));
  }
  function hideToast() {
    toastEl.classList.remove('show');
    undoFn = null;
    setTimeout(() => { if (!toastEl.classList.contains('show')) toastEl.hidden = true; }, 250);
  }

  // ---------------------------------------------------------------- events: home cards (tap + long-press)
  let press = null, suppressClick = false;
  main.addEventListener('pointerdown', (e) => {
    const c = e.target.closest('[data-card]');
    if (!c) return;
    const kind = c.dataset.card;
    c.classList.add('pressed');
    press = {
      c, x: e.clientX, y: e.clientY,
      timer: setTimeout(() => {
        c.classList.remove('pressed');
        suppressClick = true;
        press = null;
        onCardLong(kind);
      }, 550)
    };
  });
  function cancelPress() { if (press) { clearTimeout(press.timer); press.c.classList.remove('pressed'); press = null; } }
  main.addEventListener('pointermove', (e) => {
    if (press && (Math.abs(e.clientX - press.x) > 12 || Math.abs(e.clientY - press.y) > 12)) cancelPress();
  });
  main.addEventListener('pointerup', cancelPress);
  main.addEventListener('pointercancel', cancelPress);
  main.addEventListener('contextmenu', (e) => { if (e.target.closest('[data-card]')) e.preventDefault(); });

  main.addEventListener('click', (e) => {
    const c = e.target.closest('[data-card]');
    if (c) {
      if (suppressClick) { suppressClick = false; return; }
      onCardTap(c.dataset.card);
      return;
    }
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const act = b.dataset.act;
    if (act === 'edit') openEdit(b.dataset.id);
    else if (act === 'day') { dayOffset = Math.min(0, dayOffset + +b.dataset.d); renderToday(); }
    else if (act === 'share') shareSummary();
    else if (act === 'goto-settings') { view = 'settings'; render(); }
    else if (act === 'set') {
      state[b.dataset.k] = b.dataset.v; save(); render();
    }
    else if (act === 'export') exportBackup();
    else if (act === 'import') { const f = $('importFile'); f.value = ''; f.click(); }
    else if (act === 'med-remove') { state.meds.splice(+b.dataset.i, 1); save(); renderSettings(); }
  });
  main.addEventListener('input', (e) => {
    if (e.target.id === 'babyName') { state.babyName = e.target.value; save(); renderTitle(); }
  });
  // suppress click after long-press even if it lands outside main
  document.addEventListener('pointerdown', (e) => { if (!e.target.closest('[data-card]')) suppressClick = false; }, true);

  $('importFile').addEventListener('change', (e) => { const f = e.target.files && e.target.files[0]; if (f) importBackup(f); });

  // ---------------------------------------------------------------- events: banner, tabs, toast
  $('sleepBanner').addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    if (b.dataset.act === 'sleep-stop') stopSleep(Date.now());
    else openSheet('sleep');
  });
  $('tabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]');
    if (!b) return;
    if (b.dataset.tab === 'today' && view !== 'today') dayOffset = 0;
    view = b.dataset.tab;
    render();
    main.scrollTop = 0;
  });
  toastEl.addEventListener('click', (e) => {
    if (e.target.closest('[data-act="undo"]') && undoFn) { const fn = undoFn; hideToast(); fn(); }
  });

  // ---------------------------------------------------------------- events: sheet
  backdrop.addEventListener('click', () => { if (sheet && Date.now() - sheet.openedAt > 400) closeSheet(); });
  sheetEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b || !sheet) return;
    const act = b.dataset.act;
    switch (act) {
      case 'close': closeSheet(); break;
      case 'tp': {
        const m = +b.dataset.min;
        picked = m === 0 ? null : Date.now() + m * MIN;
        sheet.tpMin = m;
        updateTimePick();
        break;
      }
      case 'log-feed': {
        const ev = addEvent({ type: 'feed', sub: b.dataset.sub, t: chosenTime() });
        logged(ev, b.dataset.sub === 'L' ? t('left') : t('right'));
        break;
      }
      case 'bottle-toggle':
        sheet.bottleOpen = !sheet.bottleOpen; renderSheet();
        if (sheet.bottleOpen) { const bt = sheetEl.querySelector('.bottle'); if (bt) bt.scrollIntoView({ block: 'end', behavior: 'smooth' }); }
        break;
      case 'ml': sheet.ml = Math.min(500, Math.max(5, sheet.ml + +b.dataset.d)); renderSheet(); break;
      case 'ml-set': sheet.ml = +b.dataset.v; renderSheet(); break;
      case 'log-bottle': {
        state.lastMl = sheet.ml;
        const ev = addEvent({ type: 'feed', sub: 'bottle', ml: sheet.ml, t: chosenTime() });
        logged(ev, `${t('bottle')} ${sheet.ml} ml`);
        break;
      }
      case 'log-diaper': {
        const ev = addEvent({ type: 'diaper', sub: b.dataset.sub, t: chosenTime() });
        logged(ev, `${t('diaper')}: ${t(b.dataset.sub).toLowerCase()}`);
        break;
      }
      case 'log-med': {
        const m = state.meds[+b.dataset.i];
        if (!m) break;
        rememberMed(m.name, m.dose);
        const ev = addEvent({ type: 'med', name: m.name, dose: m.dose, t: chosenTime() });
        logged(ev, eventTitle(ev));
        break;
      }
      case 'med-new': sheet.formOpen = true; sheet.form = { name: '', dose: '' }; renderSheet(); focusLater('[data-form="name"]'); break;
      case 'med-fill': {
        const m = state.meds[+b.dataset.i];
        sheet.formOpen = true; sheet.form = { name: m.name, dose: m.dose }; renderSheet(); focusLater('[data-form="dose"]');
        break;
      }
      case 'log-med-form': {
        const f = sheet.form || { name: '', dose: '' };
        if (!f.name.trim()) { showToast(t('needName'), null, 3000); focusLater('[data-form="name"]'); break; }
        rememberMed(f.name, f.dose);
        const ev = addEvent({ type: 'med', name: f.name.trim(), dose: f.dose.trim(), t: chosenTime() });
        logged(ev, eventTitle(ev));
        break;
      }
      case 'sleep-start-picked': startSleep(chosenTime()); break;
      case 'sleep-stop-picked': stopSleep(chosenTime()); break;
      case 'sleep-add-past': openNewPastSleep(); break;
      case 'edit': openEdit(b.dataset.id); break;
      case 'draft-sub': sheet.draft.sub = b.dataset.v; renderSheet(); break;
      case 'edit-save': saveEdit(); break;
      case 'edit-delete': deleteFromEdit(); break;
    }
  });
  sheetEl.addEventListener('input', (e) => {
    if (!sheet) return;
    const el = e.target;
    if (el.classList.contains('tp-input')) {
      const ts = fromTimeInput(el.value);
      if (!isNaN(ts)) { picked = ts; sheet.tpMin = null; updateTimePick(); }
    } else if (el.dataset.form) {
      sheet.form = sheet.form || { name: '', dose: '' };
      sheet.form[el.dataset.form] = el.value;
    } else if (el.dataset.k && sheet.draft) {
      sheet.draft[el.dataset.k] = el.value;
    }
  });
  // iOS fires "change" (not always "input") when the time wheel closes
  sheetEl.addEventListener('change', (e) => {
    if (e.target.classList && (e.target.classList.contains('tp-input') || e.target.dataset.k)) {
      e.target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });
  function focusLater(sel) { setTimeout(() => { const el = sheetEl.querySelector(sel); if (el) el.focus(); }, 60); }

  // Keep the bottom sheet above the iOS keyboard.
  if (window.visualViewport) {
    const vv = window.visualViewport;
    const fit = () => {
      const kb = Math.max(0, window.innerHeight - (vv.height + vv.offsetTop));
      document.documentElement.style.setProperty('--kb', kb + 'px');
    };
    vv.addEventListener('resize', fit);
    vv.addEventListener('scroll', fit);
  }

  // ---------------------------------------------------------------- live clock
  function tick() {
    const now = Date.now();
    document.querySelectorAll('[data-since]').forEach((el) => {
      const s = agoInner(now - +el.dataset.since);
      if (el._v !== s) { el.innerHTML = s; el._v = s; }
    });
    document.querySelectorAll('[data-timer]').forEach((el) => { el.textContent = fmtTimer(now - +el.dataset.timer); });
    document.querySelectorAll('[data-durfrom]').forEach((el) => {
      const s = fmtDur(now - +el.dataset.durfrom);
      if (el.textContent !== s) el.textContent = s;
    });
  }
  setInterval(tick, 1000);
  let lastDay = startOfDay(Date.now());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible') return;
    if (pendingReload && !sheet) return location.reload();
    if (startOfDay(Date.now()) !== lastDay) lastDay = startOfDay(Date.now());
    if (!sheet) render(); else tick();
  });

  // ---------------------------------------------------------------- service worker (offline)
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('service-worker.js').catch(() => { });
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!hadController) return;        // first install, nothing to refresh
      if (sheet) pendingReload = true; else location.reload();
    });
  }

  // test/debug hook (harmless)
  window.__bt = { get state() { return state; }, reload() { state = load(); render(); } };

  render();
})();
