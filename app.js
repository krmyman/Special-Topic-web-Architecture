/*
 * AI integration seam: set services.qwen.endpoint and services.macbert.endpoint
 * when a same-origin backend is available. Keep API keys on that backend.
 * The current prototype deliberately runs a local demo adapter only.
 */
const AI_CONFIG = Object.freeze({
  qwen: { endpoint: '', model: 'Qwen 3.5 9B' },
  macbert: { endpoint: '', model: 'MacBERT' },
});

const { localeNames, fontSizeScales, translations } = window.TEA_SENSE_I18N;
let currentLocale = 'zh-Hant';
const originalTextNodes = new WeakMap();
const originalAttributes = new WeakMap();
function t(source, params = {}) {
  let result = translations[currentLocale]?.[source] ?? source;
  for (const [key, value] of Object.entries(params)) result = result.replaceAll(`{${key}}`, value);
  return result;
}

function applyLocale(locale) {
  currentLocale = Object.hasOwn(localeNames, locale) ? locale : 'zh-Hant';
  document.documentElement.lang = currentLocale;
  document.title = t('茶感 Tea Sense｜飲品探索');
  document.querySelector('meta[name="description"]').content = t('以聊天探索符合口味與需求的飲品，查看人氣推薦、消息與附近店家。');

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.parentElement?.closest('#languageSelect')) continue;
    if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue);
    const original = originalTextNodes.get(node);
    const trimmed = original.trim();
    if (trimmed && translations[currentLocale]?.[trimmed]) {
      node.nodeValue = original.replace(trimmed, translations[currentLocale][trimmed]);
    } else if (trimmed) {
      node.nodeValue = original;
    }
  }

  const translatedAttributes = ['aria-label', 'title', 'placeholder', 'data-prompt'];
  document.querySelectorAll(translatedAttributes.map(attribute => `[${attribute}]`).join(',')).forEach(element => {
    let originals = originalAttributes.get(element);
    if (!originals) { originals = new Map(); originalAttributes.set(element, originals); }
    translatedAttributes.forEach(attribute => {
      if (!element.hasAttribute(attribute)) return;
      if (!originals.has(attribute)) originals.set(attribute, element.getAttribute(attribute));
      const source = originals.get(attribute);
      element.setAttribute(attribute, t(source));
    });
  });

  const page = document.body.dataset.currentPage || 'home';
  document.querySelector('#pageHeading').textContent = t(pageNames[page]);
  document.querySelector('#languageSelect').value = currentLocale;
  document.querySelector('#refreshRanking').textContent = t('↻ 更新排行');
  document.querySelector('#locationStatus').textContent = t('首頁載入時會詢問位置權限，用於附近探索');
  document.querySelector('#graphDetail').textContent = t('點選圖上的圓點，探索風味關聯。');
  toast.classList.remove('show');
  toast.textContent = '';
  syncPreferenceLabels();
  filterRanking();
  renderNews();
  renderPlaces();
  if (latestWeather) renderWeather(latestWeather);
  else setWeatherMessage(weatherMessageKey, weatherIconValue);
}

function applyFontSize(size) {
  const selectedSize = Object.hasOwn(fontSizeScales, size) ? size : 'medium';
  document.body.dataset.fontSize = selectedSize;
  document.querySelector('#fontSizeSelect').value = selectedSize;
}

const services = {
  async understand(text, preferences, signal) {
    if (AI_CONFIG.macbert.endpoint) {
      return this.post(AI_CONFIG.macbert.endpoint, { text, preferences, language: currentLocale }, signal);
    }
    // Swap this deterministic demo for the MacBERT semantic intent response.
    return { intent: 'drink_recommendation', entities: { text, preferences } };
  },
  async reply(context, signal) {
    if (AI_CONFIG.qwen.endpoint) {
      return this.post(AI_CONFIG.qwen.endpoint, { ...context, language: currentLocale }, signal);
    }
    // A local response keeps the interface usable without a model server.
    const text = context.text.toLocaleLowerCase();
    const terms = {
      'zh-Hant': { caffeine: ['咖啡'], low: ['低熱量', '熱量'], fresh: ['清爽', '累'], mood: ['心情', '開心', '茶'] },
      en: { caffeine: ['caffeine', 'coffee'], low: ['low calorie', 'calorie'], fresh: ['refreshing', 'tired', 'light'], mood: ['mood', 'happy', 'tea'] },
      ja: { caffeine: ['カフェイン', 'コーヒー'], low: ['低カロリー', 'カロリー'], fresh: ['さっぱり', '疲れ', '爽やか'], mood: ['気分', '楽しい', 'お茶'] },
      ko: { caffeine: ['카페인', '커피'], low: ['저칼로리', '칼로리'], fresh: ['상큼', '피곤', '가볍게'], mood: ['기분', '행복', '차'] },
    }[currentLocale];
    const matches = values => values.some(value => text.includes(value));
    if (matches(terms.caffeine)) return t('可以試試洛神花茶或桂花蜜香紅茶，茶香柔和又不含咖啡因。記得確認店家的實際配方與過敏原標示喔。');
    if (matches(terms.low)) return t('推薦無糖青茶或冷泡烏龍，清爽簡單。每家店的配方和熱量不同，點餐前可以再向店家確認。');
    if (matches(terms.fresh)) return t('想清爽一點的話，試試四季春青茶加一點檸檬，微糖少冰也很適合午後。');
    if (matches(terms.mood)) return t('一杯桂花烏龍鮮奶茶很適合好心情：烏龍茶香搭配淡淡花香，建議微糖少冰。');
    return t('收到！依照你的想法，我會先從清爽茶飲開始找。你也可以告訴我想要的甜度、茶種，或需要避開的食材。');
  },
  async post(endpoint, payload, signal) {
    const response = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), signal,
    });
    if (!response.ok) throw new Error(`Service request failed (${response.status})`);
    return response.json();
  },
};

const pageNames = { home: '首頁', top: '人氣排行', news: '飲品消息', map: '附近店家', relgt: '風味關係' };
const navButtons = [...document.querySelectorAll('.nav-link')];
const pages = [...document.querySelectorAll('.page')];
const toast = document.querySelector('#toast');
let toastTimer;

function showToast(message) {
  toast.textContent = t(message);
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function navigate(page) {
  if (!pageNames[page]) return;
  navButtons.forEach(button => {
    const active = button.dataset.page === page;
    button.classList.toggle('active', active);
    if (active) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });
  pages.forEach(section => section.classList.toggle('active', section.id === `page-${page}`));
  document.querySelector('#pageHeading').textContent = t(pageNames[page]);
  document.body.dataset.currentPage = page;
  history.replaceState(null, '', `#${page}`);
  document.querySelector('.sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navButtons.forEach(button => button.addEventListener('click', () => navigate(button.dataset.page)));
const initialPage = location.hash.slice(1);
if (pageNames[initialPage]) navigate(initialPage);

const drinks = window.TEA_SENSE_DATA.drinks;
let rankingOrder = [...drinks];
function renderRanking(list = rankingOrder) {
  document.querySelector('#rankingGrid').innerHTML = list.length ? list.map((drink, index) => `<article class="rank-item"><span class="rank-number">${String(index + 1).padStart(2, '0')}</span><span class="rank-emoji" aria-hidden="true">${drink.emoji}</span><div class="rank-copy"><strong>${t(drink.name)}</strong><small>${t(drink.detail)}</small></div><span class="rank-tag">${t(drink.tag)}</span><span class="rank-votes">♡ ${drink.votes}</span></article>`).join('') : `<div class="empty-state"><span aria-hidden="true">⌕</span><strong>${t('找不到符合條件的飲品')}</strong><button type="button" id="clearRankingFilters">${t('清除篩選條件')}</button></div>`;
  document.querySelector('#clearRankingFilters')?.addEventListener('click', () => { document.querySelector('#rankingSearch').value = ''; document.querySelector('#rankingCategory').value = 'all'; filterRanking(); });
}
function filterRanking() {
  const query = document.querySelector('#rankingSearch').value.trim().toLocaleLowerCase();
  const sort = document.querySelector('#rankingSort').value;
  const category = document.querySelector('#rankingCategory').value;
  const list = rankingOrder.filter(drink => (category === 'all' || drink.category === category) && `${t(drink.name)} ${t(drink.detail)} ${t(drink.tag)}`.toLocaleLowerCase().includes(query));
  if (sort === 'name') list.sort((a, b) => t(a.name).localeCompare(t(b.name), currentLocale));
  renderRanking(list);
}
document.querySelector('#rankingSearch').addEventListener('input', filterRanking);
document.querySelector('#rankingSort').addEventListener('change', filterRanking);
document.querySelector('#rankingCategory').addEventListener('change', filterRanking);
renderRanking();
document.querySelector('#refreshRanking').addEventListener('click', event => {
  const button = event.currentTarget;
  button.disabled = true;
  button.textContent = t('↻ 更新中');
  document.querySelector('#loadingModal').showModal();
  setTimeout(() => {
    document.querySelector('#loadingModal').close();
    button.disabled = false;
    button.textContent = t('↻ 更新排行');
    rankingOrder = [...rankingOrder.slice(1, 3), rankingOrder[0], ...rankingOrder.slice(3)];
    filterRanking();
    showToast(t('已更新展示排行'));
  }, 850);
});

const news = [
  { category: 'SEASONAL PICK', title: '桂花季來了，秋天的茶香正好', body: '從窨製烏龍到桂花蜜飲，認識這個季節最迷人的花香滋味。', source: '茶感編輯室 · 風味專題', art: '🌼', style: '' },
  { category: 'NEW ON THE MENU', title: '手炒黑糖的新喝法：搭配清焙烏龍', body: '濃郁黑糖與焙火茶韻相遇，甜而不膩的新組合值得一試。', source: '飲品情報 · 新品觀察', art: '🧋', style: 'clay' },
  { category: 'TEA & WELLNESS', title: '午後想少一點咖啡因，可以怎麼選？', body: '認識花草茶與低咖啡因茶飲，為午後留一點剛好的清醒。', source: '茶感編輯室 · 日常茶知識', art: '🌺', style: 'berry' },
  { category: 'LOCAL FINDS', title: '巷子裡的製茶小店，把茶做得很日常', body: '從產地到手沖，用一杯茶認識小店的風味故事。', source: '街角散步 · 店家故事', art: '🍃', style: 'night' },
];
function renderNews() {
  document.querySelector('#newsGrid').innerHTML = news.map(item => `<article class="news-card card"><div class="news-image ${item.style}" aria-hidden="true"><span>${item.art}</span></div><div class="news-copy"><span class="news-category">${item.category}</span><h2>${t(item.title)}</h2><p>${t(item.body)}</p><div class="news-source">${t(item.source)}</div></div></article>`).join('');
}
renderNews();

const places = window.TEA_SENSE_DATA.places;
function renderPlaces() {
  const category = document.querySelector('#placeCategory')?.value || 'all';
  const maxDistance = document.querySelector('#placeDistance')?.value || 'all';
  const openOnly = document.querySelector('#filterOpen')?.checked || false;
  const filtered = places.filter(place => (category === 'all' || place.category === category) && (maxDistance === 'all' || place.distanceMeters <= Number(maxDistance)) && (!openOnly || place.open));
  document.querySelector('#placeList').innerHTML = filtered.map(place => `<div class="place-row"><span class="place-thumb" aria-hidden="true">${place.emoji}</span><span class="place-copy"><strong>${t(place.name)}</strong><small>${t(place.type)} · ${t(place.open ? '營業中' : '目前休息')}</small></span><span class="place-distance">${place.distanceMeters} m</span></div>`).join('') || `<p class="muted">${t('沒有符合條件的示範店家')}</p>`;
}
document.querySelectorAll('#filterOpen, #placeCategory, #placeDistance').forEach(control => control.addEventListener('change', renderPlaces));
renderPlaces();
const weatherLabels = {
  0: '晴朗', 1: '大致晴朗', 2: '局部多雲', 3: '陰天', 45: '有霧', 48: '有霧',
  51: '毛毛雨', 53: '毛毛雨', 55: '毛毛雨', 56: '毛毛雨', 57: '毛毛雨',
  61: '下雨', 63: '下雨', 65: '下雨', 66: '下雨', 67: '下雨',
  71: '降雪', 73: '降雪', 75: '降雪', 77: '降雪', 80: '短暫陣雨', 81: '短暫陣雨', 82: '短暫陣雨', 85: '降雪', 86: '降雪', 95: '雷雨', 96: '雷雨', 99: '雷雨',
};
let latestWeather = null;
let weatherMessageKey = '允許定位後顯示目前天氣';
let weatherIconValue = '◌';
let weatherRequestId = 0;
function setWeatherMessage(messageKey, icon = '◌') {
  latestWeather = null;
  weatherMessageKey = messageKey;
  weatherIconValue = icon;
  document.querySelector('#weatherTemperature').textContent = '—°C';
  document.querySelector('#weatherDescription').textContent = t(messageKey);
  document.querySelector('#weatherIcon').textContent = icon;
}
function renderWeather(current) {
  latestWeather = current;
  const label = weatherLabels[current.weather_code] || '目前無法取得天氣資料';
  const isClearNight = current.weather_code === 0 && current.is_day === 0;
  const icons = { 晴朗: isClearNight ? '☾' : '☀', 大致晴朗: '🌤', 局部多雲: '⛅', 陰天: '☁', 有霧: '≋', 毛毛雨: '🌦', 下雨: '🌧', 短暫陣雨: '🌦', 降雪: '❄', 雷雨: '⛈' };
  document.querySelector('#weatherTemperature').textContent = `${Math.round(current.temperature_2m)}°C`;
  document.querySelector('#weatherDescription').textContent = `${t(label)} · ${t('濕度')} ${Math.round(current.relative_humidity_2m)}%`;
  document.querySelector('#weatherIcon').textContent = icons[label] || '◌';
}
async function fetchCurrentWeather(latitude, longitude) {
  const requestId = ++weatherRequestId;
  setWeatherMessage('正在取得天氣…');
  const parameters = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,is_day,weather_code',
    timezone: 'auto',
  });
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${parameters}`);
    if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
    const payload = await response.json();
    if (requestId !== weatherRequestId) return;
    const current = payload.current;
    if (!current || !Number.isFinite(current.temperature_2m) || !Number.isFinite(current.relative_humidity_2m) || !Number.isFinite(current.weather_code) || !Number.isFinite(current.is_day)) {
      throw new Error('Weather response is incomplete');
    }
    renderWeather(current);
  } catch (error) {
    if (requestId !== weatherRequestId) return;
    console.warn('Weather service unavailable:', error);
    setWeatherMessage('目前無法取得天氣資料');
  }
}
function locate({ automatic = false } = {}) {
  const status = document.querySelector('#locationStatus');
  if (!navigator.geolocation) {
    status.textContent = t('此瀏覽器不支援定位，顯示示意店家');
    setWeatherMessage('需要定位權限才能取得天氣');
    if (!automatic) showToast(t('瀏覽器目前不支援定位'));
    return;
  }
  status.textContent = t('正在取得位置…');
  setWeatherMessage('需要定位權限才能取得天氣');
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      status.textContent = t('已取得位置 {lat}, {lon}；店家仍為示意資料', { lat: latitude.toFixed(3), lon: longitude.toFixed(3) });
      fetchCurrentWeather(latitude, longitude);
      if (!automatic) showToast(t('定位成功；串接地圖資料後即可搜尋附近店家'));
    },
    error => {
      const messages = { 1: '你尚未授權定位，顯示示意店家', 2: '目前無法取得位置，顯示示意店家', 3: '定位逾時，顯示示意店家' };
      status.textContent = t(messages[error.code] || '定位失敗，顯示示意店家');
      setWeatherMessage('需要定位權限才能取得天氣');
      if (!automatic) showToast(t('未能取得位置，仍可瀏覽示意店家'));
    }, { enableHighAccuracy: false, timeout: 9000, maximumAge: 60000 },
  );
}
document.querySelector('#locateButton').addEventListener('click', locate);
document.querySelector('#locateFromList').addEventListener('click', locate);

const { graphDrinkMatches, graphConnections, graphEdges } = window.TEA_SENSE_DATA;
const edgeGroup = document.querySelector('.graph-edges');
const originalEdge = edgeGroup.querySelector('path');
const edgeSegments = originalEdge?.getAttribute('d')?.match(/M[^M]+/g) || [];
if (edgeSegments.length === graphEdges.length) {
  const weightedPaths = edgeSegments.map((segment, index) => { const path = document.createElementNS('http://www.w3.org/2000/svg', 'path'); path.setAttribute('d', segment.trim()); path.dataset.weight = String(graphEdges[index][2]); path.style.strokeWidth = `${1 + graphEdges[index][2] * 0.8}px`; path.style.opacity = String(0.35 + graphEdges[index][2] * 0.14); return path; });
  edgeGroup.replaceChildren(...weightedPaths);
}

document.querySelectorAll('.graph-node').forEach(node => { const strength = (graphConnections[node.dataset.name] || []).length; node.setAttribute('aria-label', `${t(node.dataset.name)} · ${t('關聯數')} ${strength}`); });
document.querySelectorAll('.graph-node').forEach(node => node.addEventListener('click', () => {
  const name = t(node.dataset.name);
  const linkedNames = graphConnections[node.dataset.name] || [];
  const selectedNodes = [...document.querySelectorAll('.graph-node')].filter(other => linkedNames.includes(other.dataset.name));
  document.querySelectorAll('.graph-node').forEach(other => other.classList.toggle('dim', other !== node && !selectedNodes.includes(other)));
  document.querySelectorAll('.graph-node').forEach(other => { other.classList.toggle('selected', other === node); other.setAttribute('aria-pressed', String(other === node)); });
  const related = linkedNames.map(t).join('、');
  document.querySelector('#graphDetail').textContent = `${name}: ${t('相關風味')} ${related}。${t('關聯為示範資料')}`;
  const matching = graphDrinkMatches[node.dataset.name] || []; const mount = document.querySelector('#graphDrinks'); mount.replaceChildren();
  if (matching.length) { const title = document.createElement('strong'); title.textContent = t('相關示範飲品'); mount.append(title); matching.forEach(drink => { const button = document.createElement('button'); button.type = 'button'; button.textContent = t(drink); button.addEventListener('click', () => { navigate('home'); sendMessage(`${t(drink)} ${t('風味推薦')}`); }); mount.append(button); }); }
}));
document.querySelectorAll('.graph-node').forEach(node => node.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); node.dispatchEvent(new MouseEvent('click', { bubbles: true })); } }));

function getPreferences() {
  const selected = [...document.querySelectorAll('.preference-options input:checked')].map(input => input.value);
  return selected.length ? selected : [];
}
const preferenceSummaryDefaults = new WeakMap([...document.querySelectorAll('.preference-item')].map(details => [
  details.querySelector('summary small'), details.querySelector('summary small').textContent,
]));
function syncPreferenceLabels() {
  document.querySelectorAll('.preference-item').forEach(details => {
    const summary = details.querySelector('summary small');
    const selected = [...details.querySelectorAll('input:checked')].map(input => t(input.value));
    const separator = currentLocale === 'en' ? ', ' : '、';
    summary.textContent = selected.length ? selected.join(separator) : t(preferenceSummaryDefaults.get(summary));
  });
}
function saveChat() {
  try { const messages = [...document.querySelectorAll('#chatMessages .message')]; const firstBubble = messages[0]?.querySelector('.bubble')?.textContent || ''; const isWelcome = messages[0]?.classList.contains('assistant-message') && firstBubble.startsWith('嗨！今天想喝點什麼呢？'); const saved = messages.slice(isWelcome ? 1 : 0).map(message => ({ role: message.classList.contains('user-message') ? 'user' : 'assistant', text: message.querySelector('.bubble')?.childNodes[0]?.textContent || message.querySelector('.bubble')?.textContent || '' })); localStorage.setItem('teaSenseChat', JSON.stringify(saved)); } catch {}
}
const demoRecommendations = drinks;
let recommendationIndex = 0;
const comparedDrinks = [];
function persistComparison() { try { localStorage.setItem('teaSenseComparedDrinks', JSON.stringify(comparedDrinks.map(item => item.id))); } catch {} }
try { const savedIds = JSON.parse(localStorage.getItem('teaSenseComparedDrinks') || '[]'); savedIds.forEach(id => { const item = drinks.find(drink => drink.id === id); if (item && !comparedDrinks.includes(item)) comparedDrinks.push(item); }); } catch {}
function matchingRecommendations() {
  const prefs = getPreferences();
  const allergenPrefs = prefs.filter(value => ['乳製品', '堅果', '蜂蜜', '大豆'].includes(value));
  const maxCalories = prefs.includes('低於 150 大卡') ? 150 : prefs.includes('低於 300 大卡') ? 300 : Infinity;
  const wantsNoCaffeine = prefs.includes('無咖啡因');
  const selectedToppings = prefs.filter(value => ['珍珠','椰果','仙草'].includes(value));
  const wantsNoToppings = prefs.includes('不加配料');
  const candidates = demoRecommendations.filter(item => (!allergenPrefs.some(allergen => item.allergens.includes(allergen))) && (!wantsNoCaffeine || item.caffeine === 'none') && (!prefs.includes('低咖啡因') || ['low', 'none'].includes(item.caffeine)) && (maxCalories === Infinity || (item.nutrition.caloriesMax !== null && item.nutrition.caloriesMax <= maxCalories)) && (!prefs.some(value => ['烏龍茶','紅茶','綠茶','花草茶'].includes(value)) || prefs.includes(item.teaType)) && (!selectedToppings.length || selectedToppings.some(topping => item.toppings.includes(topping))) && (!wantsNoToppings || item.toppings.length === 0));
  return candidates.length ? { items: candidates, hasMatch: true } : { items: demoRecommendations, hasMatch: false };
}
function renderComparison() {
  const mount = document.querySelector('#recommendationCompare'); mount.replaceChildren();
  if (!comparedDrinks.length) return;
  const clear = document.createElement('button'); clear.type = 'button'; clear.className = 'clear-comparison'; clear.textContent = t('清除比較'); clear.addEventListener('click', () => { comparedDrinks.length = 0; persistComparison(); renderComparison(); }); mount.append(clear);
  const heading = document.createElement('strong'); heading.textContent = t('飲品比較'); mount.append(heading);
  const table = document.createElement('div'); table.className = 'comparison-grid';
  const labels = ['品項', '風味', '建議甜度', '熱量', '咖啡因', '過敏原提醒'];
  const headingCell = document.createElement('div'); headingCell.className = 'comparison-row comparison-heading';
  labels.forEach(label => { const cell = document.createElement('span'); cell.textContent = t(label); headingCell.append(cell); }); table.append(headingCell);
  comparedDrinks.forEach((item, index) => {
    const row = document.createElement('div'); row.className = 'comparison-row';
    [item.name, item.flavors.map(t).join('、'), item.sweetness, item.nutrition.label, item.caffeineLabel, item.allergens.length ? item.allergens.map(t).join('、') : '未標示'].forEach(value => { const cell = document.createElement('span'); cell.textContent = t(value); row.append(cell); });
    const remove = document.createElement('button'); remove.type = 'button'; remove.textContent = t('移除'); remove.addEventListener('click', () => { comparedDrinks.splice(index, 1); persistComparison(); renderComparison(); }); row.append(remove); table.append(row);
  }); mount.append(table);
}

function renderRecommendationCard(container) {
  const filtered = matchingRecommendations();
  const item = filtered.items[recommendationIndex % filtered.items.length];
  container.querySelector('.recommendation-card')?.remove();
  const card = document.createElement('section'); card.className = 'recommendation-card'; card.setAttribute('aria-label', t('示範推薦卡'));
  const title = document.createElement('strong'); title.textContent = t(item.name);
  const flavor = document.createElement('p'); flavor.textContent = `${t('風味')}：${item.flavors.map(t).join('、')}`;
  const reason = document.createElement('p'); reason.className = 'recommendation-reason'; reason.textContent = `${t('推薦理由')}：${t(item.reason)}`;
  const adjustment = document.createElement('p'); adjustment.className = 'recommendation-adjustment'; adjustment.textContent = `${t('調整建議')}：${t(item.adjustment)}`;
  const specs = document.createElement('p'); specs.textContent = `${t('建議甜度')}：${t(item.sweetness)}　·　${t('熱量')}：${t(item.nutrition.label)}　·　${t('咖啡因')}：${t(item.caffeineLabel)}`;
  const art = document.createElement('div'); art.className = `drink-art drink-art-${item.category}`; art.setAttribute('aria-hidden','true'); const artEmoji = document.createElement('span'); artEmoji.textContent = item.emoji; art.append(artEmoji);
  const content = document.createElement('div'); content.className = 'recommendation-copy';
  const allergen = document.createElement('small'); allergen.textContent = `${t('過敏原提醒')}：${item.allergens.length ? item.allergens.map(t).join('、') : t('示範資料未標示常見過敏原')}。${t('請向店家確認實際成分與過敏原資訊。')}`;
  const preferenceSummary = document.createElement('small'); preferenceSummary.className = 'preference-reason'; preferenceSummary.textContent = `${t('本次套用條件')}：${getPreferences().length ? getPreferences().map(t).join('、') : t('未套用額外偏好')}`;
  if (!filtered.hasMatch) { const note = document.createElement('small'); note.className = 'recommendation-note'; note.textContent = t('目前示範清單中沒有完全符合條件的品項，以下列出一般示範選項供參考。過敏原條件不會自動放寬。'); card.append(note); const relax = document.createElement('button'); relax.type = 'button'; relax.className = 'relax-button'; relax.textContent = t('放寬熱量、茶種或配料條件'); relax.addEventListener('click', () => { document.querySelectorAll('input[name="calories"]').forEach(input => input.checked = false); document.querySelector('input[name="calories"][value="不限"]').checked = true; document.querySelectorAll('.preference-options input[type="checkbox"]').forEach(input => { if (!['乳製品','堅果','蜂蜜','大豆'].includes(input.value)) input.checked = false; }); syncPreferenceLabels(); renderRecommendationCard(container); }); card.append(relax); }
  const actions = document.createElement('div'); actions.className = 'recommendation-actions';
  const swap = document.createElement('button'); swap.type = 'button'; swap.textContent = t('換一杯'); swap.addEventListener('click', () => { recommendationIndex = (recommendationIndex + 1) % matchingRecommendations().items.length; renderRecommendationCard(container); });
  const compare = document.createElement('button'); compare.type = 'button'; compare.textContent = t('加入比較'); compare.addEventListener('click', () => { if (!comparedDrinks.some(entry => entry.id === item.id)) comparedDrinks.push(item); persistComparison(); compare.textContent = t('已加入比較'); compare.classList.add('is-added'); renderComparison(); });
  actions.append(swap, compare); content.append(title, flavor, reason, adjustment, specs, allergen, preferenceSummary, actions); card.append(art, content); container.append(card);
}

function addMessage(text, role) {
  document.querySelector('#chatMessages .empty-chat-state')?.remove();
  const wrapper = document.createElement('div');
  wrapper.className = `message ${role === 'user' ? 'user-message' : 'assistant-message'}`;
  const body = document.createElement('div');
  body.className = 'message-body';
  const meta = document.createElement('div');
  meta.className = 'message-meta';
  meta.textContent = t(role === 'user' ? '你 · 現在' : '茶感小助手 · 現在');
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  if (role !== 'user') {
    const avatar = document.createElement('span'); avatar.className = 'message-avatar'; avatar.textContent = '茶';
    wrapper.append(avatar);
  }
  body.append(meta, bubble);
  const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'message-delete'; remove.textContent = t('刪除'); remove.setAttribute('aria-label', `${t('刪除')} ${text.slice(0, 30)}`);
  body.append(remove); wrapper.append(body);
  document.querySelector('#chatMessages').append(wrapper);
  saveChat();
  wrapper.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
let activeGenerationController = null;
let activeGenerationId = 0;
let activeGenerationTimer = null;
function cancelActiveGeneration({ closeDialog = true } = {}) {
  activeGenerationId++;
  activeGenerationController?.abort();
  activeGenerationController = null;
  clearTimeout(activeGenerationTimer);
  activeGenerationTimer = null;
  document.querySelector('#stopGeneration').disabled = true;
  const modal = document.querySelector('#loadingModal');
  if (closeDialog && modal.open) modal.close();
}
async function sendMessage(text, { appendUser = true } = {}) {
  const cleaned = text.trim();
  if (!cleaned) return;
  document.body.classList.add('conversation-active');
  document.querySelector('.chat-card').classList.add('conversation-active');
  if (appendUser) addMessage(cleaned, 'user');
  document.querySelector('#chatInput').value = '';
  const modal = document.querySelector('#loadingModal');
  if (activeGenerationController) cancelActiveGeneration({ closeDialog: false });
  const generationId = ++activeGenerationId;
  activeGenerationController = new AbortController();
  document.querySelector('#stopGeneration').disabled = false;
  if (!modal.open) modal.showModal();
  try {
    const intent = await services.understand(cleaned, getPreferences(), activeGenerationController.signal);
    const answer = await services.reply({ text: cleaned, preferences: getPreferences(), intent, history: [], language: currentLocale }, activeGenerationController.signal);
    if (generationId !== activeGenerationId) return;
    activeGenerationTimer = setTimeout(() => {
      if (generationId !== activeGenerationId) return;
      modal.close();
      activeGenerationController = null; activeGenerationTimer = null;
      document.querySelector('#stopGeneration').disabled = true;
      addMessage(typeof answer === 'string' ? answer : (answer.reply || answer.text || t('我找到一些飲品方向，告訴我更多偏好就能幫你縮小選擇。')), 'assistant');
      if (!AI_CONFIG.qwen.endpoint) renderRecommendationCard(document.querySelector('#chatMessages .assistant-message:last-child .bubble'));
    }, 650);
  } catch (error) {
    if (generationId !== activeGenerationId || error.name === 'AbortError') return;
    modal.close(); activeGenerationController = null; document.querySelector('#stopGeneration').disabled = true;
    addMessage(t('目前暫時無法連線到推薦服務，請稍後再試。你仍可使用偏好選擇與其他展示頁面。'), 'assistant');
    const retry = document.createElement('button'); retry.type = 'button'; retry.className = 'retry-button'; retry.textContent = t('重試'); retry.addEventListener('click', () => { const lastUser = [...document.querySelectorAll('#chatMessages .user-message')].at(-1)?.querySelector('.bubble')?.textContent; document.querySelector('#chatMessages .assistant-message:last-child')?.remove(); if (lastUser) sendMessage(lastUser, { appendUser: false }); }); document.querySelector('#chatMessages .assistant-message:last-child .message-body')?.append(retry);
    console.error('Recommendation service error:', error);
  }
}
document.querySelector('#stopGeneration').addEventListener('click', () => {
  if (!activeGenerationController) return;
  cancelActiveGeneration();
  addMessage(t('已停止生成。你可以修改需求後再送出。'), 'assistant');
});
document.querySelector('#chatMessages').addEventListener('click', event => {
  if (event.target.closest('.message-delete')) { event.target.closest('.message').remove(); saveChat(); if (!document.querySelector('#chatMessages .message')) { const empty = document.createElement('div'); empty.className = 'empty-chat-state'; empty.textContent = t('對話目前是空的，輸入需求或點選快速需求即可開始。'); document.querySelector('#chatMessages').append(empty); } }
});
document.querySelector('#regenerateChat').addEventListener('click', () => {
  const messages = [...document.querySelectorAll('#chatMessages .user-message')]; const latest = messages.at(-1)?.querySelector('.bubble')?.textContent;
  if (latest) { document.querySelector('#chatMessages .assistant-message:last-child')?.remove(); sendMessage(latest, { appendUser: false }); }
});
document.querySelector('#clearChat').addEventListener('click', () => {
  if (!window.confirm(t('重置對話？此操作會清除目前對話和比較清單。'))) return;
  cancelActiveGeneration();
  document.querySelector('#chatMessages').innerHTML = '';
  const welcome = document.createElement('div'); welcome.className = 'message assistant-message';
  const avatar = document.createElement('span'); avatar.className = 'message-avatar'; avatar.textContent = '茶';
  const body = document.createElement('div'); body.className = 'message-body';
  const meta = document.createElement('div'); meta.className = 'message-meta'; meta.textContent = t('茶感小助手 · 現在');
  const bubble = document.createElement('div'); bubble.className = 'bubble'; bubble.textContent = t('嗨！今天想喝點什麼呢？可以告訴我你的心情、口味，或是想避開的食材。');
  const card = document.createElement('div'); card.className = 'suggestion-card';
  const kicker = document.createElement('div'); kicker.className = 'suggestion-kicker'; kicker.textContent = t('今日靈感');
  const name = document.createElement('strong'); name.textContent = t('桂花烏龍鮮奶茶');
  const description = document.createElement('span'); description.textContent = t('茶香溫潤 · 微糖少冰');
  card.append(kicker, name, description); bubble.append(card); body.append(meta, bubble); welcome.append(avatar, body); document.querySelector('#chatMessages').append(welcome);
  document.body.classList.remove('conversation-active'); document.querySelector('.chat-card').classList.remove('conversation-active');
  comparedDrinks.length = 0; persistComparison(); renderComparison();
  try { localStorage.removeItem('teaSenseChat'); } catch {}
});
document.querySelector('#chatForm').addEventListener('submit', event => { event.preventDefault(); sendMessage(document.querySelector('#chatInput').value); });
document.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click', () => sendMessage(button.dataset.prompt)));
document.querySelectorAll('.preference-options input').forEach(input => input.addEventListener('change', () => { syncPreferenceLabels(); }));
document.querySelector('#applyPreferences').addEventListener('click', () => {
  const preferences = getPreferences();
  try { localStorage.setItem('teaSenseDrinkPreferences', JSON.stringify(preferences)); } catch {}
  showToast(preferences.length ? t('已套用 {count} 項偏好', { count: preferences.length }) : t('已清除偏好條件'));
  document.querySelectorAll('#chatMessages .assistant-message').forEach(message => { if (message.querySelector('.recommendation-card')) renderRecommendationCard(message.querySelector('.bubble')); });
  closeDrinkPreferences();
});

const feedbackModal = document.querySelector('#feedbackModal');
const feedbackForm = document.querySelector('#feedbackForm');
const feedbackText = document.querySelector('#feedbackText');
try { const draft = localStorage.getItem('teaSenseFeedbackDraft'); if (draft) { const parsed = JSON.parse(draft); feedbackText.value = parsed.text || ''; document.querySelector('#feedbackType').value = parsed.type || document.querySelector('#feedbackType').value; } } catch {}
feedbackForm.addEventListener('input', () => { try { localStorage.setItem('teaSenseFeedbackDraft', JSON.stringify({ text: feedbackText.value, type: document.querySelector('#feedbackType').value })); } catch {} });
document.querySelector('#feedbackButton').addEventListener('click', () => feedbackModal.showModal());
document.querySelectorAll('[data-close-dialog]').forEach(button => {
  button.addEventListener('click', () => button.closest('dialog')?.close());
});
document.querySelector('#feedbackForm').addEventListener('submit', event => {
  event.preventDefault();
  feedbackModal.close();
  event.currentTarget.reset();
  try { localStorage.removeItem('teaSenseFeedbackDraft'); } catch {}
  showToast('回饋已在本機示範送出；正式版需設定接收服務');
});

const preferencesModal = document.querySelector('#preferencesModal');
function openPreferences() {
  document.querySelector('#themeSelect').value = document.body.classList.contains('dark') ? 'dark' : 'light';
  preferencesModal.showModal();
}
document.querySelector('#exportPreferences').addEventListener('click', () => {
  downloadJson('tea-sense-preferences.json', { schemaVersion: 1, preferences: getPreferences(), language: currentLocale, theme: document.body.classList.contains('dark') ? 'dark' : 'light', fontSize: document.body.dataset.fontSize || 'medium' });
});
document.querySelector('#exportDrinkCatalog').addEventListener('click', () => downloadJson('tea-sense-sample-drinks.json', { schemaVersion: window.TEA_SENSE_DATA.schemaVersion, drinks }));
document.querySelector('#importPreferencesFile').addEventListener('change', async event => {
  const file = event.currentTarget.files?.[0]; if (!file) return;
  try {
    const payload = JSON.parse(await file.text());
    if (payload.schemaVersion !== 1 || !Array.isArray(payload.preferences) || !payload.preferences.every(value => typeof value === 'string')) throw new Error('Invalid preferences file');
    document.querySelectorAll('.preference-options input').forEach(input => input.checked = payload.preferences.includes(input.value));
    syncPreferenceLabels();
    try { localStorage.setItem('teaSenseDrinkPreferences', JSON.stringify(getPreferences())); } catch {}
    showToast(t('偏好已匯入'));
  } catch { showToast(t('匯入檔案格式無效，請選擇茶感偏好 JSON。')); }
  event.currentTarget.value = '';
});
function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
document.querySelector('#profileButton').addEventListener('click', openPreferences);
const drinkPreferencesModal = document.querySelector('#drinkPreferencesModal');
const drinkPreferencesButton = document.querySelector('#openDrinkPreferences');
function closeDrinkPreferences() {
  if (drinkPreferencesModal.open) drinkPreferencesModal.close();
  drinkPreferencesButton.setAttribute('aria-expanded', 'false');
}
drinkPreferencesButton.addEventListener('click', () => {
  if (drinkPreferencesModal.open) closeDrinkPreferences();
  else {
    drinkPreferencesModal.show();
    drinkPreferencesButton.setAttribute('aria-expanded', 'true');
  }
});
document.querySelector('#closeDrinkPreferences').addEventListener('click', closeDrinkPreferences);
drinkPreferencesModal.addEventListener('click', event => {
  if (event.target === drinkPreferencesModal) closeDrinkPreferences();
});
document.addEventListener('pointerdown', event => {
  if (drinkPreferencesModal.open && !drinkPreferencesModal.contains(event.target) && event.target !== drinkPreferencesButton) closeDrinkPreferences();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && drinkPreferencesModal.open) closeDrinkPreferences();
});
drinkPreferencesModal.addEventListener('close', () => drinkPreferencesButton.setAttribute('aria-expanded', 'false'));
document.querySelector('#settingsForm').addEventListener('submit', event => {
  event.preventDefault();
  document.body.classList.toggle('dark', document.querySelector('#themeSelect').value === 'dark');
  const selectedLocale = document.querySelector('#languageSelect').value;
  const selectedFontSize = document.querySelector('#fontSizeSelect').value;
  applyLocale(selectedLocale);
  applyFontSize(selectedFontSize);
  try {
    localStorage.setItem('teaSenseLanguage', selectedLocale);
    localStorage.setItem('teaSenseFontSize', selectedFontSize);
    localStorage.setItem('teaSenseTheme', document.querySelector('#themeSelect').value);
  } catch { /* Settings remain active for this session. */ }
  preferencesModal.close();
  showToast(t('設定已套用'));
});
document.querySelector('#sidebarToggle').addEventListener('click', () => {
  document.body.classList.toggle('sidebar-expanded');
  document.querySelector('#sidebarToggle').setAttribute('aria-expanded', String(document.body.classList.contains('sidebar-expanded')));
});
document.querySelector('#mobileMenu').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
document.addEventListener('click', event => {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && !event.target.closest('#mobileMenu')) sidebar.classList.remove('open');
});

let savedLocale = 'zh-Hant';
try {
  const storedLocale = localStorage.getItem('teaSenseLanguage');
  if (storedLocale && Object.hasOwn(localeNames, storedLocale)) savedLocale = storedLocale;
} catch { /* Use Traditional Chinese when browser storage is unavailable. */ }
applyLocale(savedLocale);
renderComparison();
try { const savedPrefs = JSON.parse(localStorage.getItem('teaSenseDrinkPreferences') || '[]'); document.querySelectorAll('.preference-options input').forEach(input => input.checked = savedPrefs.includes(input.value)); syncPreferenceLabels(); } catch {}
try { const savedChat = JSON.parse(localStorage.getItem('teaSenseChat') || '[]'); if (savedChat.length) { const container = document.querySelector('#chatMessages'); container.innerHTML = ''; savedChat.forEach(item => { addMessage(String(item.text || ''), item.role === 'user' ? 'user' : 'assistant'); if (item.role !== 'user' && !AI_CONFIG.qwen.endpoint) renderRecommendationCard(document.querySelector('#chatMessages .assistant-message:last-child .bubble')); }); document.body.classList.add('conversation-active'); document.querySelector('.chat-card').classList.add('conversation-active'); } } catch {}
let savedFontSize = 'medium';
try {
  const storedFontSize = localStorage.getItem('teaSenseFontSize');
  if (storedFontSize && Object.hasOwn(fontSizeScales, storedFontSize)) savedFontSize = storedFontSize;
} catch { /* Use medium text when browser storage is unavailable. */ }
applyFontSize(savedFontSize);
let savedTheme = 'light';
try {
  if (localStorage.getItem('teaSenseTheme') === 'dark') savedTheme = 'dark';
} catch { /* Use the warm theme when browser storage is unavailable. */ }
document.body.classList.toggle('dark', savedTheme === 'dark');
if (document.body.dataset.currentPage === 'home') locate({ automatic: true });
