const faIcons = {
  mountain: 'fa-solid fa-mountain',
  map: 'fa-solid fa-map-location-dot',
  edit: 'fa-solid fa-pen-to-square',
  calendar: 'fa-solid fa-calendar-check',
  walk: 'fa-solid fa-person-hiking',
  book: 'fa-solid fa-book-open',
  weather: 'fa-solid fa-cloud-sun',
  pin: 'fa-solid fa-location-dot',
  warning: 'fa-solid fa-triangle-exclamation',
  helicopter: 'fa-solid fa-helicopter',
  tree: 'fa-solid fa-tree',
  scale: 'fa-solid fa-scale-balanced',
  bag: 'fa-solid fa-suitcase-rolling',
  file: 'fa-solid fa-file-lines',
  search: 'fa-solid fa-magnifying-glass',
  sign: 'fa-solid fa-diamond-turn-right',
  bed: 'fa-solid fa-bed',
  help: 'fa-solid fa-circle-question',
  info: 'fa-solid fa-circle-info',
  users: 'fa-solid fa-users-slash',
  compass: 'fa-solid fa-compass',
  megaphone: 'fa-solid fa-bullhorn'
};
function icon(name){const cls=faIcons[name]||'fa-solid fa-file-lines';return `<i class="${cls} icon" aria-hidden="true"></i>`}
document.querySelectorAll('[data-icon]').forEach(el=>el.outerHTML=icon(el.dataset.icon));
const groups={weather:[['山區氣象','weather']],map:[['PAC 位置','pin'],['百岳位置','mountain'],['山坡地經常管制區','warning'],['救難直升機停機坪','helicopter'],['國家公園生態保護區內事故熱點','tree']],knowledge:[['法令資訊','scale'],['登山建議裝備清單','bag'],['登山安全教材','file'],['路線介紹','map']],query:[['申請日期查詢','calendar'],['登山路線開放狀態','sign'],['宿營地及床位查詢','bed']],help:[['登山須知','book'],['常見問題','help']],other:[['違規名單','users'],['旅遊登山資訊','compass']]};
function resource(label,name='file',map=false,wide=false){return `<button class="resource-link${wide?' wide':''}" data-detail="${label}">${icon(name)}<span class="label">${label}</span>${map?'<span class="chip">地圖</span>':''}<span class="chevron" aria-hidden="true">›</span></button>`}
Object.entries(groups).forEach(([key,items])=>document.getElementById(`${key}-links`).innerHTML=items.map(([label,name])=>resource(label,name,key==='map',label.length>15)).join(''));
const stages=[{title:'認識登山',subtitle:'獲取登山知識',icon:'mountain',links:['登山安全教材','登山安全防護原則','國家公園步道分級','登山建議裝備清單','登山留守制度']},{title:'規劃行程',subtitle:'選擇路線與地圖',icon:'map',links:['路線介紹','百岳位置','山區氣象','登山路線開放狀態','宿營地與床位查詢']},{title:'辦理申請',subtitle:'申請/修改資料',icon:'edit',links:['開始登山申請','申請日期查詢','登山須知','常見問題']},{title:'行前確認',subtitle:'必要整備',icon:'calendar',links:['山區氣象','登山路線開放狀態','登山建議裝備清單','PAC 位置']},{title:'完成登山',subtitle:'下山回報',icon:'walk',links:['出園回報']}];
const stepsEl = document.getElementById('steps');
if (stepsEl) stepsEl.innerHTML=stages.map((s,i)=>`<button class="step" data-stage="${i}" aria-label="${s.title}：查看相關資訊"><span class="step-circle">${icon(s.icon)}</span><strong>${s.title}</strong><small>${s.subtitle}</small></button>`).join('');
const modal=document.getElementById('modal'),content=document.getElementById('modal-content');
function openModal(title,html){document.getElementById('modal-title').textContent=title;content.innerHTML=html;if(!modal.open)modal.showModal()}
function openStage(i){const s=stages[i];openModal('依據登山經驗建議參考資料',`<div class="stage-tabs">${stages.map((x,k)=>`<button class="${k===i?'active':''}" data-stage="${k}" aria-pressed="${k===i}">${x.title}</button>`).join('')}</div><h3>${s.title}（${s.subtitle}）</h3><div class="modal-links">${s.links.map(label=>resource(label)).join('')}</div>`)}
const allItems=[...new Set(Object.values(groups).flat().map(x=>x[0]).concat(['開始登山申請','出園回報']))];
function detail(label){openModal(label,`<div class="prototype-note"><strong>${label}</strong><p>此頁為首頁改版互動雛型，尚未串接正式${label.includes('申請')?'申請服務':'內容'}。正式上線時，此入口將導向對應服務。</p></div>`)}
const notices = [
  { agencyId: 'nps', org: '國家公園署', date: '2026-03-20', title: '登山前請確認路線開放狀態及最新天候資訊', content: '一、為確保登山安全，請山友於出發前密切關注各國家公園步道開放情形，並準備充足裝備與落實留守人員聯繫機制。\n二、如有受天候影響封閉之步道，請勿強行入山。\n三、行程中如遇天候驟變，應評估隊伍狀況及早撤退。' },
  { agencyId: 'sheipa', org: '雪管處', date: '2026-03-18', title: '115年雪霸國家公園清明連假期間入園申請注意事項', content: '一、115年清明連續假期，雪霸國家公園生態保護區入園申請熱門。\n二、為維護公平性，請獲准隊伍如需異動人員或取消行程，務必於入園前1天15:00前至系統辦理。\n三、山區氣候多變，行前請評估隊員體能狀況及裝備完整性，並確實遵守園區禁止事項。' },
  { agencyId: 'yushan', org: '玉管處', date: '2026-03-15', title: '排雲山莊容宿量調整措施及行前備妥裝備提醒', content: '一、進入高海拔山區請備妥防寒保暖衣物、雨具與定位通訊設備，並落實留守人通報機制。\n二、排雲山莊相關住宿請提早於規定期限內辦理，並於收到核准通知後完成手續。\n三、請各登山隊伍隨時留意本站與玉管處官方最新訊息公告。' }
];
let noticeIndex = 0;
function showNotice(delta) {
  noticeIndex = (noticeIndex + delta + notices.length) % notices.length;
  const item = notices[noticeIndex];
  const badgeEl = document.getElementById('announcement-badge');
  const titleEl = document.getElementById('announcement-title');
  if (badgeEl) {
    badgeEl.className = `bulletin-badge agency-${item.agencyId} mr-2 shrink-0`;
    badgeEl.textContent = item.org;
  }
  if (titleEl) {
    titleEl.textContent = item.title;
  }
}

const prevBtn = document.getElementById('previous');
const nextBtn = document.getElementById('next');
if (prevBtn) prevBtn.onclick = () => showNotice(-1);
if (nextBtn) nextBtn.onclick = () => showNotice(1);

const newsModalOverlay = document.getElementById('news-modal-overlay');
const newsModalClose = document.getElementById('news-modal-close');

function openNewsModal(item) {
  const badge = document.getElementById('news-modal-agency');
  const title = document.getElementById('news-modal-title');
  const meta = document.getElementById('news-modal-meta');
  const body = document.getElementById('news-modal-body');
  if (badge) {
    badge.className = `bulletin-badge agency-${item.agencyId}`;
    badge.textContent = item.org;
  }
  if (title) title.textContent = item.title;
  if (meta) meta.textContent = `發布日期：${item.date}`;
  if (body) body.textContent = item.content;
  if (newsModalOverlay) newsModalOverlay.style.display = 'flex';
}

function closeNewsModal() {
  if (newsModalOverlay) newsModalOverlay.style.display = 'none';
}

const annBtn = document.getElementById('announcement-text');
if (annBtn) {
  annBtn.onclick = (e) => {
    e.preventDefault();
    openNewsModal(notices[noticeIndex]);
  };
}

if (newsModalClose) newsModalClose.onclick = closeNewsModal;
if (newsModalOverlay) {
  newsModalOverlay.onclick = (e) => {
    if (e.target === newsModalOverlay) closeNewsModal();
  };
}

const quickMenuModal = document.getElementById('quick-menu-modal');
const quickMenuClose = document.getElementById('quick-menu-close');

function openQuickMenu() {
  if (quickMenuModal) {
    quickMenuModal.style.display = 'flex';
    document.body.classList.add('th-noscroll');
  }
}

function closeQuickMenu() {
  if (quickMenuModal) {
    quickMenuModal.style.display = 'none';
    document.body.classList.remove('th-noscroll');
  }
}

if (quickMenuClose) quickMenuClose.onclick = closeQuickMenu;
if (quickMenuModal) {
  quickMenuModal.onclick = (e) => {
    if (e.target === quickMenuModal) closeQuickMenu();
  };
}

setInterval(() => {
  if (!document.hidden && (!newsModalOverlay || newsModalOverlay.style.display === 'none') && (!quickMenuModal || quickMenuModal.style.display === 'none') && !modal.open) {
    showNotice(1);
  }
}, 7000);
document.getElementById('close-modal').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close()}});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.stage!==undefined)return openQuickMenu();if(b.dataset.action==='quick-menu')return openQuickMenu();if(b.dataset.detail)return detail(b.dataset.detail);if(b.dataset.action==='announcements')return window.location.href='../news.html';if(b.dataset.action==='sitemap')openModal('網站導覽',`<h3>登山階段</h3><div class="stage-tabs">${stages.map((s,i)=>`<button data-stage="${i}">${s.title}</button>`).join('')}</div><h3>服務入口</h3><div class="modal-links">${allItems.map(x=>resource(x)).join('')}</div>`);if(b.dataset.action==='search'){openModal('搜尋服務',`<label for="search-input">輸入服務名稱或關鍵字</label><input class="search-input" id="search-input" type="search" placeholder="例如：氣象、路線、申請"><div class="modal-links" id="search-results">${allItems.map(x=>resource(x)).join('')}</div>`);const input=document.getElementById('search-input');input.focus();input.oninput=()=>{const result=allItems.filter(x=>x.includes(input.value.trim()));document.getElementById('search-results').innerHTML=result.length?result.map(x=>resource(x)).join(''):'<p role="status">找不到符合的服務，請試試其他關鍵字。</p>'}}});

(function() {
  const langBtn = document.getElementById('th-lang-btn');
  const langDropdown = document.getElementById('th-lang-dropdown');
  const langChevron = document.getElementById('th-lang-chevron');
  const langCurrent = document.getElementById('th-lang-current');
  const langWrapper = document.getElementById('th-lang-wrapper');

  if (langBtn && langDropdown) {
    langBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = !langDropdown.classList.contains('hidden');
      if (isOpen) {
        langDropdown.classList.add('hidden');
        if (langChevron) langChevron.classList.remove('rotate-180');
        langBtn.setAttribute('aria-expanded', 'false');
      } else {
        langDropdown.classList.remove('hidden');
        if (langChevron) langChevron.classList.add('rotate-180');
        langBtn.setAttribute('aria-expanded', 'true');
      }
    });

    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.addEventListener('click', function() {
        const langKey = this.dataset.lang;
        const labels = { 'zh-TW': '繁體中文', 'en': 'English', 'ja': '日本語' };
        if (langCurrent && labels[langKey]) langCurrent.textContent = labels[langKey];
        document.querySelectorAll('[data-lang]').forEach(b => {
          b.classList.remove('is-active');
          const chk = b.querySelector('.fa-check');
          if (chk) chk.remove();
        });
        this.classList.add('is-active');
        this.insertAdjacentHTML('beforeend', '<i class="fa-solid fa-check text-xs text-[#587a68]"></i>');
        langDropdown.classList.add('hidden');
        if (langChevron) langChevron.classList.remove('rotate-180');
      });
    });

    document.addEventListener('click', function(e) {
      if (langWrapper && !langWrapper.contains(e.target)) {
        langDropdown.classList.add('hidden');
        if (langChevron) langChevron.classList.remove('rotate-180');
      }
    });
  }

  const menuBtn = document.getElementById('th-menubtn');
  const menuMask = document.getElementById('th-menumask');
  const menuClose = document.getElementById('th-menuclose');

  if (menuBtn && menuMask) {
    function openMenu() {
      menuMask.classList.remove('hidden');
      document.body.classList.add('th-noscroll');
      menuBtn.setAttribute('aria-expanded', 'true');
    }
    function closeMenu() {
      menuMask.classList.add('hidden');
      document.body.classList.remove('th-noscroll');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
    menuBtn.addEventListener('click', openMenu);
    if (menuClose) menuClose.addEventListener('click', closeMenu);
    menuMask.addEventListener('click', function(e) {
      if (e.target === menuMask) closeMenu();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        closeMenu();
        closeQuickMenu();
        closeNewsModal();
        if (langDropdown) langDropdown.classList.add('hidden');
      }
    });
  }
})();

