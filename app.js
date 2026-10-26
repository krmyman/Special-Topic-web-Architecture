/*
 * AI integration seam: set services.qwen.endpoint and services.macbert.endpoint
 * when a same-origin backend is available. Keep API keys on that backend.
 * The current prototype deliberately runs a local demo adapter only.
 */
const AI_CONFIG = Object.freeze({
  qwen: { endpoint: '', model: 'Qwen 3.5 9B' },
  macbert: { endpoint: '', model: 'MacBERT' },
});

const services = {
  async understand(text, preferences) {
    if (AI_CONFIG.macbert.endpoint) {
      return this.post(AI_CONFIG.macbert.endpoint, { text, preferences });
    }
    // Swap this deterministic demo for the MacBERT semantic intent response.
    return { intent: 'drink_recommendation', entities: { text, preferences } };
  },
  async reply(context) {
    if (AI_CONFIG.qwen.endpoint) {
      return this.post(AI_CONFIG.qwen.endpoint, context);
    }
    // A local response keeps the interface usable without a model server.
    const text = context.text.toLowerCase();
    if (text.includes('咖啡') || text.includes('無咖啡因')) return '可以試試洛神花茶或桂花蜜香紅茶，茶香柔和又不含咖啡因。記得確認店家的實際配方與過敏原標示喔。';
    if (text.includes('低熱量') || text.includes('熱量')) return '推薦無糖青茶或冷泡烏龍，清爽簡單。每家店的配方和熱量不同，點餐前可以再向店家確認。';
    if (text.includes('清爽') || text.includes('累')) return '想清爽一點的話，試試四季春青茶加一點檸檬，微糖少冰也很適合午後。';
    if (text.includes('心情') || text.includes('開心') || text.includes('茶')) return '一杯桂花烏龍鮮奶茶很適合好心情：烏龍茶香搭配淡淡花香，建議微糖少冰。';
    return '收到！依照你的想法，我會先從清爽茶飲開始找。你也可以告訴我想要的甜度、茶種，或需要避開的食材。';
  },
  async post(endpoint, payload) {
    const response = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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
  toast.textContent = message;
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
  document.querySelector('#pageHeading').textContent = pageNames[page];
  history.replaceState(null, '', `#${page}`);
  document.querySelector('.sidebar').classList.remove('open');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

navButtons.forEach(button => button.addEventListener('click', () => navigate(button.dataset.page)));
const initialPage = location.hash.slice(1);
if (pageNames[initialPage]) navigate(initialPage);

const drinks = [
  { name: '桂花烏龍鮮奶茶', detail: '花香烏龍 · 溫潤奶香', emoji: '🧋', votes: '2,480', tag: '人氣冠軍' },
  { name: '四季春青茶', detail: '清新回甘 · 無負擔', emoji: '🍵', votes: '1,926', tag: '清爽推薦' },
  { name: '黑糖珍珠鮮奶', detail: '濃郁黑糖 · Q 彈珍珠', emoji: '🥤', votes: '1,674', tag: '經典不敗' },
  { name: '柚香翡翠', detail: '柚子果香 · 茶韻清甜', emoji: '🍋', votes: '1,438', tag: '果香系' },
  { name: '冬瓜檸檬', detail: '古早冬瓜 · 清新檸檬', emoji: '🍹', votes: '1,209', tag: '酸甜平衡' },
  { name: '蜜香紅茶', detail: '天然蜜韻 · 純茶首選', emoji: '🫖', votes: '986', tag: '無奶推薦' },
  { name: '芋泥波波鮮奶', detail: '綿密芋泥 · 鮮乳香醇', emoji: '🥛', votes: '854', tag: '療癒系' },
  { name: '百香雙響炮', detail: '百香果香 · 雙料口感', emoji: '🍊', votes: '726', tag: '酸甜果茶' },
  { name: '桂圓紅棗茶', detail: '桂圓棗香 · 暖心熱飲', emoji: '☕', votes: '613', tag: '暖心推薦' },
];
function renderRanking(list = drinks) {
  document.querySelector('#rankingGrid').innerHTML = list.map((drink, index) => `<article class="rank-item"><span class="rank-number">${String(index + 1).padStart(2, '0')}</span><span class="rank-emoji" aria-hidden="true">${drink.emoji}</span><div class="rank-copy"><strong>${drink.name}</strong><small>${drink.detail}</small></div><span class="rank-tag">${drink.tag}</span><span class="rank-votes">♡ ${drink.votes}</span></article>`).join('');
}
renderRanking();
document.querySelector('#refreshRanking').addEventListener('click', event => {
  const button = event.currentTarget;
  button.disabled = true;
  button.textContent = '↻ 更新中';
  document.querySelector('#loadingModal').showModal();
  setTimeout(() => {
    document.querySelector('#loadingModal').close();
    button.disabled = false;
    button.textContent = '↻ 更新排行';
    renderRanking([...drinks.slice(1, 3), drinks[0], ...drinks.slice(3)]);
    showToast('已更新展示排行');
  }, 850);
});

const news = [
  { category: 'SEASONAL PICK', title: '桂花季來了，秋天的茶香正好', body: '從窨製烏龍到桂花蜜飲，認識這個季節最迷人的花香滋味。', source: '茶感編輯室 · 風味專題', art: '🌼', style: '' },
  { category: 'NEW ON THE MENU', title: '手炒黑糖的新喝法：搭配清焙烏龍', body: '濃郁黑糖與焙火茶韻相遇，甜而不膩的新組合值得一試。', source: '飲品情報 · 新品觀察', art: '🧋', style: 'clay' },
  { category: 'TEA & WELLNESS', title: '午後想少一點咖啡因，可以怎麼選？', body: '認識花草茶與低咖啡因茶飲，為午後留一點剛好的清醒。', source: '茶感編輯室 · 日常茶知識', art: '🌺', style: 'berry' },
  { category: 'LOCAL FINDS', title: '巷子裡的製茶小店，把茶做得很日常', body: '從產地到手沖，用一杯茶認識小店的風味故事。', source: '街角散步 · 店家故事', art: '🍃', style: 'night' },
];
document.querySelector('#newsGrid').innerHTML = news.map(item => `<article class="news-card card"><div class="news-image ${item.style}" aria-hidden="true"><span>${item.art}</span></div><div class="news-copy"><span class="news-category">${item.category}</span><h2>${item.title}</h2><p>${item.body}</p><div class="news-source">${item.source}</div></div></article>`).join('');

const places = [
  { name: '青禾茶室', type: '手沖茶飲 · 烏龍專門', distance: '350 m', emoji: '🍵' },
  { name: '山日子茶飲', type: '鮮奶茶 · 自家烘焙', distance: '650 m', emoji: '🧋' },
  { name: '小島製茶', type: '台灣茶 · 季節限定', distance: '900 m', emoji: '🫖' },
];
function renderPlaces() {
  document.querySelector('#placeList').innerHTML = places.map(place => `<div class="place-row"><span class="place-thumb" aria-hidden="true">${place.emoji}</span><span class="place-copy"><strong>${place.name}</strong><small>${place.type}</small></span><span class="place-distance">${place.distance}</span></div>`).join('');
}
renderPlaces();
function locate() {
  const status = document.querySelector('#locationStatus');
  if (!navigator.geolocation) {
    status.textContent = '此瀏覽器不支援定位，顯示示意店家';
    showToast('瀏覽器目前不支援定位');
    return;
  }
  status.textContent = '正在取得位置…';
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      status.textContent = `已取得位置 ${latitude.toFixed(3)}, ${longitude.toFixed(3)}；店家仍為示意資料`;
      showToast('定位成功；串接地圖資料後即可搜尋附近店家');
    },
    error => {
      const messages = { 1: '你尚未授權定位，顯示示意店家', 2: '目前無法取得位置，顯示示意店家', 3: '定位逾時，顯示示意店家' };
      status.textContent = messages[error.code] || '定位失敗，顯示示意店家';
      showToast('未能取得位置，仍可瀏覽示意店家');
    }, { enableHighAccuracy: false, timeout: 9000, maximumAge: 60000 },
  );
}
document.querySelector('#locateButton').addEventListener('click', locate);
document.querySelector('#locateFromList').addEventListener('click', locate);

document.querySelectorAll('.graph-node').forEach(node => node.addEventListener('click', () => {
  const name = node.dataset.name;
  const related = [...node.parentElement.children].filter(other => other !== node && other.classList.contains('graph-node'));
  document.querySelectorAll('.graph-node').forEach(other => other.classList.toggle('dim', other !== node && !related.includes(other)));
  document.querySelectorAll('.graph-node').forEach(other => other.classList.toggle('selected', other === node));
  document.querySelector('#graphDetail').textContent = `${name}：已選取風味節點。正式版本可由 RelGT 模型提供關聯強度與推薦說明。`;
}));

function getPreferences() {
  const selected = [...document.querySelectorAll('.preference-options input:checked')].map(input => input.value);
  return selected.length ? selected : [];
}
function addMessage(text, role) {
  const wrapper = document.createElement('div');
  wrapper.className = `message ${role === 'user' ? 'user-message' : 'assistant-message'}`;
  const body = document.createElement('div');
  body.className = 'message-body';
  const meta = document.createElement('div');
  meta.className = 'message-meta';
  meta.textContent = role === 'user' ? '你 · 現在' : '茶感小助手 · 現在';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.textContent = text;
  if (role !== 'user') {
    const avatar = document.createElement('span'); avatar.className = 'message-avatar'; avatar.textContent = '茶';
    wrapper.append(avatar);
  }
  body.append(meta, bubble); wrapper.append(body);
  document.querySelector('#chatMessages').append(wrapper);
  wrapper.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
async function sendMessage(text) {
  const cleaned = text.trim();
  if (!cleaned) return;
  addMessage(cleaned, 'user');
  document.querySelector('#chatInput').value = '';
  const modal = document.querySelector('#loadingModal');
  modal.showModal();
  try {
    const intent = await services.understand(cleaned, getPreferences());
    const answer = await services.reply({ text: cleaned, preferences: getPreferences(), intent, history: [] });
    setTimeout(() => {
      modal.close();
      addMessage(typeof answer === 'string' ? answer : (answer.reply || answer.text || '我找到一些飲品方向，告訴我更多偏好就能幫你縮小選擇。'), 'assistant');
    }, 650);
  } catch (error) {
    modal.close();
    addMessage('目前暫時無法連線到推薦服務，請稍後再試。你仍可使用偏好選擇與其他展示頁面。', 'assistant');
    console.error('Recommendation service error:', error);
  }
}
document.querySelector('#chatForm').addEventListener('submit', event => { event.preventDefault(); sendMessage(document.querySelector('#chatInput').value); });
document.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click', () => sendMessage(button.dataset.prompt)));
function clearChat() {
  const messages = document.querySelector('#chatMessages');
  messages.innerHTML = '<div class="message assistant-message"><span class="message-avatar">茶</span><div class="message-body"><div class="message-meta">茶感小助手 <span>現在</span></div><div class="bubble">對話已重置。今天想從什麼口味開始？</div></div></div>';
  showToast('對話已重置');
}
document.querySelector('#resetButton').addEventListener('click', clearChat);
document.querySelector('#clearChat').addEventListener('click', clearChat);

document.querySelector('#applyPreferences').addEventListener('click', () => {
  const preferences = getPreferences();
  showToast(preferences.length ? `已套用 ${preferences.length} 項偏好` : '已清除偏好條件');
});
document.querySelectorAll('.preference-options input').forEach(input => input.addEventListener('change', () => {
  const details = input.closest('details');
  const summary = details.querySelector('summary small');
  const checked = [...details.querySelectorAll('input:checked')].map(option => option.value);
  summary.textContent = checked.length ? checked.join('、') : '不限';
}));

const feedbackModal = document.querySelector('#feedbackModal');
document.querySelector('#feedbackButton').addEventListener('click', () => feedbackModal.showModal());
document.querySelector('#feedbackForm').addEventListener('submit', event => {
  event.preventDefault();
  feedbackModal.close();
  event.currentTarget.reset();
  showToast('回饋已在本機示範送出；正式版需設定接收服務');
});

const preferencesModal = document.querySelector('#preferencesModal');
document.querySelector('#preferencesButton').addEventListener('click', () => preferencesModal.showModal());
document.querySelector('#profileButton').addEventListener('click', () => preferencesModal.showModal());
document.querySelector('#settingsForm').addEventListener('submit', event => {
  event.preventDefault();
  document.body.classList.toggle('dark', document.querySelector('#themeSelect').value === 'dark');
  preferencesModal.close();
  showToast('設定已套用');
});
document.querySelector('#mobileMenu').addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open'));
document.addEventListener('click', event => {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && !event.target.closest('#mobileMenu')) sidebar.classList.remove('open');
});
