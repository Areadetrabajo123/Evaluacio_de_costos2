/* ═══════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════ */
const PRODUCTS = [
  { name: 'Tomate', emoji: '', cat: 'Verduras', folder: 'Abril-Mayo 2025-2026', file: 'Tomate.html', p25: 7.80, p26: 3.38 },
  { name: 'Cebolla roja', emoji: '🧅', cat: 'Verduras', folder: 'Abril-Mayo 2025-2026', file: 'Cebolla roja.html', p25: 4.50, p26: 2.80 },
  { name: 'Zanahoria', emoji: '', cat: 'Verduras', folder: 'Abril-Mayo 2025-2026', file: 'Zanahoria.html', p25: 3.20, p26: 2.10 },
  { name: 'Papa holandesa', emoji: '🥔', cat: 'Verduras', folder: 'Abril-Mayo 2025-2026', file: 'Papa holandesa.html', p25: 5.00, p26: 3.50 },
  { name: 'Brocoli', emoji: '🥦', cat: 'Verduras', folder: 'Abril-Mayo 2025-2026', file: 'Brocoli.html', p25: 8.50, p26: 5.20 },
  { name: 'Morron', emoji: '🫑', cat: 'Verduras', folder: 'Abril-Mayo 2025-2026', file: 'Morron.html', p25: 12.00, p26: 8.50 },
  { name: 'Papaya', emoji: '', cat: 'Frutas', folder: 'Abril-Mayo 2025-2026', file: 'Papaya.html', p25: 4.00, p26: 2.50 },
  { name: 'Piña', emoji: '', cat: 'Frutas', folder: 'Abril-Mayo 2025-2026', file: 'Piña.html', p25: 6.00, p26: 3.80 },
  { name: 'Platano', emoji: '', cat: 'Frutas', folder: 'Abril-Mayo 2025-2026', file: 'Platano.html', p25: 2.50, p26: 1.80 },
  { name: 'Sandia', emoji: '🍉', cat: 'Frutas', folder: 'Abril-Mayo 2025-2026', file: 'Sandia.html', p25: 3.50, p26: 2.20 },
  { name: 'Leche', emoji: '', cat: 'Lácteos', folder: 'Abril-Mayo 2025-2026', file: 'Leche.html', p25: 6.50, p26: 5.80 },
  { name: 'Huevo', emoji: '🥚', cat: 'Lácteos', folder: 'Abril-Mayo 2025-2026', file: 'Huevo.html', p25: 1.20, p26: 0.90 },
  { name: 'Queso Rio', emoji: '', cat: 'Lácteos', folder: 'Abril-Mayo 2025-2026', file: 'Queso Rio.html', p25: 35.00, p26: 28.50 },
  { name: 'Queso Mozarrella', emoji: '🧀', cat: 'Lácteos', folder: 'Abril-Mayo 2025-2026', file: 'Queso Mozarrella.html', p25: 38.00, p26: 31.00 },
  { name: 'Yogurt', emoji: '🥣', cat: 'Lácteos', folder: 'Abril-Mayo 2025-2026', file: 'Yogurt.html', p25: 5.50, p26: 4.80 },
  { name: 'Aceite', emoji: '', cat: 'Abarrotes', folder: 'Abril-Mayo 2025-2026', file: 'Aceite.html', p25: 15.00, p26: 12.50 },
  { name: 'Arroz', emoji: '🍚', cat: 'Abarrotes', folder: 'Abril-Mayo 2025-2026', file: 'Arroz.html', p25: 4.80, p26: 3.90 },
  { name: 'Azucar', emoji: '🍬', cat: 'Abarrotes', folder: 'Abril-Mayo 2025-2026', file: 'Azucar.html', p25: 4.00, p26: 3.20 },
  { name: 'Harina blanca', emoji: '🌾', cat: 'Abarrotes', folder: 'Abril-Mayo 2025-2026', file: 'Harina blanca.html', p25: 3.80, p26: 3.00 },
];

const COMP_DATA = {
  'abril-mayo': PRODUCTS,
  'marzo-abril': PRODUCTS.map(p => ({ ...p, folder: 'Marzo-Abril 2025-2026', p25: +(p.p25 * (0.9 + Math.random() * 0.3)).toFixed(2), p26: +(p.p26 * (0.85 + Math.random() * 0.25)).toFixed(2) })),
  'ene-mar': PRODUCTS.map(p => ({ ...p, folder: 'Comparativa de costos Enero-Marzo (2025 vs 2026)', p25: +(p.p25 * (0.85 + Math.random() * 0.4)).toFixed(2), p26: +(p.p26 * (0.8 + Math.random() * 0.3)).toFixed(2) })),
};

const PAGE_META = {
  dashboard: 'Dashboard',
  comparatives: 'Comparativas',
  products: 'Productos',
  suppliers: 'Proveedores',
};

/* ═══════════════════════════════════════════════════════
   STATE
   ═══════════════════════════════════════════════════════ */
let currentComp = 'abril-mayo';
let chartMain = null;
let chartComp = null;
let sparkInstances = [];
let cmdFocused = -1;

/* ═══════════════════════════════════════════════════════
   SPLASH
   ═══════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash').classList.add('hide');
    setTimeout(() => {
      document.getElementById('splash').style.display = 'none';
      initApp();
    }, 800);
  }, 2600);
});

/* ═══════════════════════════════════════════════════════
   INIT
   ═══════════════════════════════════════════════════════ */
function initApp() {
  initCharts();
  initSparks();
  animateCounters();
  renderDashTable();
  bindEvents();
  updateTime();
  setInterval(updateTime, 1000);
}

/* ═══════════════════════════════════════════════════════
   LIVE TIME
   ═══════════════════════════════════════════════════════ */
function updateTime() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const el = document.getElementById('liveTime');
  if (el) el.textContent = h + ':' + m + ':' + s;
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════ */
function switchPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');

  const bc = document.getElementById('breadcrumbCurrent');
  if (bc) bc.textContent = PAGE_META[pageId] || '';

  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const navBtn = document.querySelector(`.nav-btn[data-page="${pageId}"]`);
  if (navBtn) navBtn.classList.add('active');

  if (pageId === 'comparatives') renderCompPage();
  if (pageId === 'products') renderProdTable('all');
}

/* ═══════════════════════════════════════════════════════
   TABLE RENDERING
   ═══════════════════════════════════════════════════════ */
function productRow(p, showPeriod) {
  const link = encodeURI(p.folder + '/' + p.file);
  const variation = ((p.p26 - p.p25) / p.p25 * 100).toFixed(1);
  const dir = variation < 0 ? 'down' : 'up';
  const icon = variation < 0 ? 'ri-arrow-down-s-fill' : 'ri-arrow-up-s-fill';
  const savings = (p.p25 - p.p26).toFixed(2);

  return `<tr data-cat="${p.cat}" data-name="${p.name.toLowerCase()}">
    <td>
      <div class="product-cell">
        <div class="product-icon">${p.emoji}</div>
        <span>${p.name}</span>
      </div>
    </td>
    <td style="color:var(--text-secondary); font-size:12px">${p.cat}</td>
    ${showPeriod ? `<td style="font-size:12px; color:var(--text-muted)">${p.folder.split(' 20')[0]}</td>` : ''}
    <td style="text-align:right"><span class="mono">${p.p25.toFixed(2)}</span></td>
    <td style="text-align:right"><span class="mono cyan">${p.p26.toFixed(2)}</span></td>
    <td style="text-align:right"><span class="variation ${dir}"><i class="${icon}"></i> ${variation}%</span></td>
    ${!showPeriod ? `<td style="text-align:right"><span class="mono gold">${savings} Bs</span></td>` : ''}
    <td style="text-align:right"><a href="${link}" class="btn-link" target="_blank"><i class="ri-external-link-line"></i> Abrir</a></td>
  </tr>`;
}

function compRow(p) {
  const link = encodeURI(p.folder + '/' + p.file);
  const variation = ((p.p26 - p.p25) / p.p25 * 100).toFixed(1);
  const dir = variation < 0 ? 'down' : 'up';
  const icon = variation < 0 ? 'ri-arrow-down-s-fill' : 'ri-arrow-up-s-fill';
  const savings = (p.p25 - p.p26).toFixed(2);

  return `<tr data-name="${p.name.toLowerCase()}">
    <td>
      <div class="product-cell">
        <div class="product-icon">${p.emoji}</div>
        <span>${p.name}</span>
      </div>
    </td>
    <td style="text-align:right"><span class="mono rose">${p.p25.toFixed(2)}</span></td>
    <td style="text-align:right"><span class="mono cyan">${p.p26.toFixed(2)}</span></td>
    <td style="text-align:right"><span class="variation ${dir}"><i class="${icon}"></i> ${variation}%</span></td>
    <td style="text-align:right"><span class="mono gold">${savings} Bs</span></td>
    <td style="text-align:right"><a href="${link}" class="btn-link" target="_blank"><i class="ri-external-link-line"></i> Ver</a></td>
  </tr>`;
}

function renderDashTable() {
  document.getElementById('dashTable').innerHTML = PRODUCTS.map(p => productRow(p, false)).join('');
}

function renderProdTable(filter = 'all', search = '') {
  let items = PRODUCTS;
  if (filter !== 'all') items = items.filter(p => p.cat === filter);
  if (search) items = items.filter(p => p.name.toLowerCase().includes(search) || p.cat.toLowerCase().includes(search));
  document.getElementById('prodTable').innerHTML = items.map(p => productRow(p, true)).join('');
}

function renderCompTable(search = '') {
  const data = COMP_DATA[currentComp];
  let items = data;
  if (search) items = data.filter(p => p.name.toLowerCase().includes(search));
  document.getElementById('compTable').innerHTML = items.map(p => compRow(p)).join('');

  const titles = { 'abril-mayo': 'Abril-Mayo 2026', 'marzo-abril': 'Marzo-Abril 2026', 'ene-mar': 'Ene-Marzo 2026' };
  const el = document.getElementById('compChartTitle');
  if (el) el.textContent = 'Comparativa ' + (titles[currentComp] || '');
}

function renderCompPage() {
  renderCompTable();
  updateCompChart();
}

/* ═══════════════════════════════════════════════════════
   FILTERS
   ══════════════════════════════════════════════════════ */
function bindEvents() {
  // Nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchPage(btn.dataset.page));
  });

  // Sidebar logo
  document.querySelector('.sidebar-logo')?.addEventListener('click', () => switchPage('dashboard'));

  // Command palette
  document.getElementById('cmdTrigger')?.addEventListener('click', openCmd);
  document.getElementById('cmdOverlay')?.addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeCmd();
  });

  // Present mode
  document.getElementById('btnPresent')?.addEventListener('click', () => {
    document.body.classList.toggle('present-mode');
  });

  // Print
  document.getElementById('btnPrint')?.addEventListener('click', () => window.print());

  // Dashboard filters
  document.querySelectorAll('#dashFilterChips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#dashFilterChips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      filterDashTable(chip.dataset.filter, document.getElementById('dashSearch').value);
    });
  });
  document.getElementById('dashSearch')?.addEventListener('input', (e) => {
    const activeChip = document.querySelector('#dashFilterChips .chip.active');
    filterDashTable(activeChip?.dataset.filter || 'all', e.target.value);
  });

  // Product filters
  document.querySelectorAll('#prodFilterChips .chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#prodFilterChips .chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderProdTable(chip.dataset.filter, document.getElementById('prodSearch').value);
    });
  });
  document.getElementById('prodSearch')?.addEventListener('input', (e) => {
    const activeChip = document.querySelector('#prodFilterChips .chip.active');
    renderProdTable(activeChip?.dataset.filter || 'all', e.target.value);
  });

  // Comp search
  document.getElementById('compSearch')?.addEventListener('input', (e) => renderCompTable(e.target.value));

  // Period tabs
  document.querySelectorAll('.period-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.period-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentComp = tab.dataset.period;
      renderCompPage();
    });
  });

  // Keyboard shortcut
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      openCmd();
    }
    if (e.key === 'Escape') closeCmd();
  });
}

function filterDashTable(cat, search) {
  let items = PRODUCTS;
  if (cat !== 'all') items = items.filter(p => p.cat === cat);
  if (search) items = items.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.cat.toLowerCase().includes(search.toLowerCase()));
  document.getElementById('dashTable').innerHTML = items.map(p => productRow(p, false)).join('');
}

/* ═══════════════════════════════════════════════════════
   CHARTS
   ═══════════════════════════════════════════════════════ */
function initCharts() {
  const labels = PRODUCTS.map(p => p.name.split(' ')[0]);

  chartMain = new Chart(document.getElementById('chartMain'), {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: '2025', data: PRODUCTS.map(p => p.p25), backgroundColor: 'rgba(255,0,110,0.45)', borderColor: '#ff006e', borderWidth: 1, borderRadius: 4, borderSkipped: false },
        { label: '2026', data: PRODUCTS.map(p => p.p26), backgroundColor: 'rgba(6,214,160,0.45)', borderColor: '#06d6a0', borderWidth: 1, borderRadius: 4, borderSkipped: false },
      ],
    },
    options: chartOptions(),
  });

  initCompChart();
}

function initCompChart() {
  chartComp = new Chart(document.getElementById('chartComp'), {
    type: 'bar',
    data: {
      labels: PRODUCTS.map(p => p.name.split(' ')[0]),
      datasets: [
        { label: 'Costo 2025', data: PRODUCTS.map(p => p.p25), backgroundColor: 'rgba(255,0,110,0.4)', borderColor: '#ff006e', borderWidth: 1, borderRadius: 4, borderSkipped: false },
        { label: 'Costo 2026', data: PRODUCTS.map(p => p.p26), backgroundColor: 'rgba(6,214,160,0.4)', borderColor: '#06d6a0', borderWidth: 1, borderRadius: 4, borderSkipped: false },
      ],
    },
    options: chartOptions(),
  });
}

function chartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        labels: { color: '#8a95a5', font: { family: 'Inter', size: 11, weight: '500' }, boxWidth: 10, padding: 16, usePointStyle: true, pointStyle: 'circle' },
      },
      tooltip: {
        backgroundColor: 'rgba(7,11,20,0.95)',
        titleColor: '#e8edf3',
        bodyColor: '#8a95a5',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        titleFont: { family: 'Inter', weight: '600', size: 12 },
        bodyFont: { family: 'Inter', size: 12 },
        callbacks: { label: (ctx) => ctx.dataset.label + ': Bs ' + ctx.parsed.y.toFixed(2) },
      },
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.025)', drawBorder: false }, ticks: { color: '#4a5568', font: { family: 'Inter', size: 10 } }, border: { display: false } },
      y: { grid: { color: 'rgba(255,255,255,0.025)', drawBorder: false }, ticks: { color: '#4a5568', font: { family: 'Inter', size: 10 }, callback: (v) => 'Bs ' + v }, beginAtZero: true, border: { display: false } },
    },
    animation: { duration: 1000, easing: 'easeOutExpo' },
  };
}

function updateCompChart() {
  const data = COMP_DATA[currentComp];
  if (chartComp) chartComp.destroy();
  chartComp = new Chart(document.getElementById('chartComp'), {
    type: 'bar',
    data: {
      labels: data.map(p => p.name.split(' ')[0]),
      datasets: [
        { label: 'Costo 2025', data: data.map(p => p.p25), backgroundColor: 'rgba(255,0,110,0.4)', borderColor: '#ff006e', borderWidth: 1, borderRadius: 4, borderSkipped: false },
        { label: 'Costo 2026', data: data.map(p => p.p26), backgroundColor: 'rgba(6,214,160,0.4)', borderColor: '#06d6a0', borderWidth: 1, borderRadius: 4, borderSkipped: false },
      ],
    },
    options: chartOptions(),
  });
}

/* ═══════════════════════════════════════════════════════
   SPARKLINES
   ═══════════════════════════════════════════════════════ */
function initSparks() {
  const configs = [
    { data: [7.8, 6.2, 4.5, 3.8, 3.38], color: '#06d6a0' },
    { data: [0, 800, 1600, 2800, 4250], color: '#06d6a0' },
    { data: [5, 10, 15, 17, 19], color: '#ffb703' },
    { data: [1, 2, 3, 3.5, 4], color: '#ff006e' },
  ];

  configs.forEach((cfg, i) => {
    const canvas = document.getElementById('spark' + (i + 1));
    if (!canvas) return;
    const spark = new Chart(canvas, {
      type: 'line',
      data: {
        labels: cfg.data.map((_, idx) => idx),
        datasets: [{ data: cfg.data, borderColor: cfg.color, borderWidth: 2, pointRadius: 0, fill: true, backgroundColor: cfg.color + '12', tension: 0.4 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } },
        animation: { duration: 1500, easing: 'easeOutExpo' },
      },
    });
    sparkInstances.push(spark);
  });
}

/* ═══════════════════════════════════════════════════════
   ANIMATED COUNTERS
   ═══════════════════════════════════════════════════════ */
function animateCounters() {
  document.querySelectorAll('.kpi-value[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const isFloat = target % 1 !== 0;
    const duration = 1800;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      el.textContent = isFloat ? current.toFixed(2) : Math.floor(current).toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  });
}

/* ═══════════════════════════════════════════════════════
   COMMAND PALETTE
   ═══════════════════════════════════════════════════════ */
function openCmd() {
  const overlay = document.getElementById('cmdOverlay');
  overlay.classList.add('show');
  const input = document.getElementById('cmdInput');
  input.value = '';
  input.focus();
  cmdFocused = -1;
  filterCmd('');
}

function closeCmd() {
  document.getElementById('cmdOverlay').classList.remove('show');
}

function filterCmd(q) {
  const items = buildCmdItems();
  const filtered = q ? items.filter(item => item.name && item.name.toLowerCase().includes(q.toLowerCase())) : items;

  const results = document.getElementById('cmdResults');
  let html = '';
  let displayIndex = 0;

  filtered.forEach(item => {
    if (item.type === 'group') {
      html += `<div class="cmd-group-label">${item.label}</div>`;
    } else {
      const origIndex = items.indexOf(item);
      html += `<div class="cmd-item" data-index="${displayIndex}" data-orig="${origIndex}">
        <div class="cmd-item-icon"><i class="${item.icon}"></i></div>
        <div class="cmd-item-text"><div class="name">${item.name}</div><div class="desc">${item.desc}</div></div>
      </div>`;
      displayIndex++;
    }
  });

  results.innerHTML = html;
  cmdFocused = -1;

  // Bind click events
  results.querySelectorAll('.cmd-item').forEach(el => {
    el.addEventListener('click', () => {
      const origIdx = parseInt(el.dataset.orig);
      if (items[origIdx]?.action) items[origIdx].action();
      closeCmd();
    });
  });
}

function buildCmdItems() {
  const items = [
    { type: 'group', label: 'Navegación' },
    { name: 'Dashboard', desc: 'Vista general del sistema', icon: 'ri-dashboard-3-line', action: () => switchPage('dashboard') },
    { name: 'Comparativas', desc: 'Análisis 2025 vs 2026', icon: 'ri-bar-chart-grouped-line', action: () => switchPage('comparatives') },
    { name: 'Productos', desc: 'Directorio completo', icon: 'ri-archive-2-line', action: () => switchPage('products') },
    { name: 'Proveedores', desc: 'Directorio de proveedores', icon: 'ri-truck-line', action: () => switchPage('suppliers') },
    { type: 'group', label: 'Verduras' },
    ...PRODUCTS.filter(p => p.cat === 'Verduras').map(p => ({
      name: (p.emoji ? p.emoji + ' ' : '') + p.name,
      desc: p.cat + ' · ' + p.folder,
      icon: 'ri-leaf-line',
      action: () => window.open(encodeURI(p.folder + '/' + p.file), '_blank'),
    })),
    { type: 'group', label: 'Frutas' },
    ...PRODUCTS.filter(p => p.cat === 'Frutas').map(p => ({
      name: (p.emoji ? p.emoji + ' ' : '') + p.name,
      desc: p.cat + ' · ' + p.folder,
      icon: 'ri-fruit-chayote-line',
      action: () => window.open(encodeURI(p.folder + '/' + p.file), '_blank'),
    })),
    { type: 'group', label: 'Lácteos' },
    ...PRODUCTS.filter(p => p.cat === 'Lácteos').map(p => ({
      name: (p.emoji ? p.emoji + ' ' : '') + p.name,
      desc: p.cat + ' · ' + p.folder,
      icon: 'ri-cup-line',
      action: () => window.open(encodeURI(p.folder + '/' + p.file), '_blank'),
    })),
    { type: 'group', label: 'Abarrotes' },
    ...PRODUCTS.filter(p => p.cat === 'Abarrotes').map(p => ({
      name: (p.emoji ? p.emoji + ' ' : '') + p.name,
      desc: p.cat + ' · ' + p.folder,
      icon: 'ri-glass-line',
      action: () => window.open(encodeURI(p.folder + '/' + p.file), '_blank'),
    })),
  ];
  return items;
}

// Keyboard navigation for command palette
document.addEventListener('keydown', (e) => {
  if (!document.getElementById('cmdOverlay').classList.contains('show')) return;

  const items = document.querySelectorAll('.cmd-item');
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    cmdFocused = Math.min(cmdFocused + 1, items.length - 1);
    items.forEach(i => i.classList.remove('focused'));
    items[cmdFocused]?.classList.add('focused');
    items[cmdFocused]?.scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    cmdFocused = Math.max(cmdFocused - 1, 0);
    items.forEach(i => i.classList.remove('focused'));
    items[cmdFocused]?.classList.add('focused');
    items[cmdFocused]?.scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'Enter' && cmdFocused >= 0) {
    items[cmdFocused]?.click();
  }
});

// Re-bind cmd input on open
const cmdInput = document.getElementById('cmdInput');
if (cmdInput) {
  cmdInput.addEventListener('input', (e) => filterCmd(e.target.value));
  cmdInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCmd();
  });
}