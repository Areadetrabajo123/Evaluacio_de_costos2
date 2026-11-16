/* ============================================================
   dashboard.js — Motor de dashboards de producto
   Sistema de Gestión de Costos — UAB
   Uso: <body data-producto="aceite" data-comparativa="abr-may-2025-2026">
   ============================================================ */

(function () {
  const body = document.body;
  const producto = body.dataset.producto;
  const comparativa = body.dataset.comparativa;
  const root = document.getElementById('dash');

  if (!producto || !root) {
    console.error('dashboard.js: falta data-producto o #dash');
    return;
  }

  // Ruta base: los HTML viven a 2 niveles de profundidad respecto a la raíz
  // (ej: /Abril-Mayo 2025-2026/Aceite.html → ../../assets/data/productos/aceite.json)
  const base = '../../assets/data/productos/';

  fetch(base + producto + '.json')
    .then(r => {
      if (!r.ok) throw new Error('No se pudo cargar ' + producto + '.json');
      return r.json();
    })
    .then(data => render(data))
    .catch(err => {
      root.innerHTML = '<div style="color:#ef5350;padding:20px;font-family:sans-serif;">Error: ' + err.message + '</div>';
      console.error(err);
    });

  function fmt(n) { return n.toFixed(2).replace('.', ','); }
  function pct(n) { return (n >= 0 ? '+' : '') + n.toFixed(1).replace('.', ',') + '%'; }

  function render(data) {
    const periodos = data.periodos;
    const unidad = data.unidad;
    const meses = [...new Set(periodos.map(p => p.mes))];
    const promedios = {};
    meses.forEach(m => {
      const rows = periodos.filter(p => p.mes === m);
      promedios[m] = {
        v2025: rows.reduce((s, r) => s + r.v2025, 0) / rows.length,
        v2026: rows.reduce((s, r) => s + r.v2026, 0) / rows.length
      };
    });

    // KPIs (4 tarjetas)
    const kpis = meses.slice(0, 2).flatMap(m => [
      { v: promedios[m].v2025, label: 'Prom. ' + m + ' 2025', cls: 'green' },
      { v: promedios[m].v2026, label: 'Prom. ' + m + ' 2026', cls: 'blue' }
    ]).slice(0, 4);

    // Si hay más de 2 meses, los KPIs muestran los primeros 2 meses
    const kpiHTML = kpis.map(k =>
      '<div class="kpi"><div class="kpi-val ' + k.cls + '">' + fmt(k.v) + ' ' + unidad.split('/')[0] + '</div><div class="kpi-label">' + k.label + '</div></div>'
    ).join('');

    // Tablas por mes
    const tablasHTML = meses.map(m => {
      const rows = periodos.filter(p => p.mes === m);
      const prom = promedios[m];
      const varPct = ((prom.v2026 - prom.v2025) / prom.v2025) * 100;
      const mejor = varPct < 0 ? '2026 mejor' : (varPct > 0 ? '2025 mejor' : 'Igual');
      const filas = rows.map(r => {
        const v = ((r.v2026 - r.v2025) / r.v2025) * 100;
        const res = v < 0 ? '2026 mejor' : (v > 0 ? '2025 mejor' : 'Igual');
        return '<tr><td>' + r.semana + '</td><td class="g25c">' + fmt(r.v2025) + '</td><td class="g26c">' + fmt(r.v2026) + '</td><td class="varc">' + pct(v) + '</td><td class="res"><span class="pill">' + res + '</span></td></tr>';
      }).join('');
      return '<div class="tbl-box"><h3><span class="badge badge-mar" style="margin-right:6px;">' + m.toUpperCase() + '</span>Detalle Semanal</h3><p class="ts">Costo ' + unidad + ' · comparativo de gestiones</p><table><thead><tr><td>Semana</td><td style="text-align:right;padding-right:8px;">2025</td><td style="text-align:right;padding-right:8px;">2026</td><td style="text-align:right;padding-right:8px;">Var.</td><td style="text-align:right;">Resultado</td></tr></thead><tbody>' + filas + '<tr class="avg-row"><td class="avg-label">Prom. Mensual</td><td class="avg-25">' + fmt(prom.v2025) + '</td><td class="avg-26">' + fmt(prom.v2026) + '</td><td class="avg-var">' + pct(varPct) + '</td><td class="res"><span class="pill">' + mejor + '</span></td></tr></tbody></table></div>';
    }).join('');

    // Barras de ahorro por mes
    const savHTML = meses.map(m => {
      const rows = periodos.filter(p => p.mes === m);
      const prom = promedios[m];
      const diff = prom.v2026 - prom.v2025;
      const varPct = (diff / prom.v2025) * 100;
      const esAhorro = diff < 0;
      const color = esAhorro ? '#6fd97a' : '#e05ccc';
      const maxDiff = Math.max(...rows.map(r => Math.abs(r.v2026 - r.v2025)), 0.01);
      const items = rows.map(r => {
        const d = r.v2026 - r.v2025;
        const w = Math.round((Math.abs(d) / maxDiff) * 100);
        return '<div class="sav-item"><div class="sav-header"><span class="sav-week">' + r.semana + '</span><span class="sav-val" style="color:' + color + ';">' + (d >= 0 ? '+' : '') + fmt(d) + ' ' + unidad + ' — ' + (d < 0 ? 'Ahorro' : (d > 0 ? 'Incremento' : 'Sin cambio')) + '</span></div><div class="sav-desc">Variación ' + pct((d / r.v2025) * 100) + ' respecto a 2025</div><div class="bar-track"><div class="bar-fill" style="width:' + w + '%;background:' + color + ';"></div></div></div>';
      }).join('');
      return '<div class="sav-box"><h3><span class="badge badge-mar" style="margin-right:6px;">' + m.toUpperCase() + '</span>' + (esAhorro ? 'Ahorro' : 'Variación') + ' por Semana</h3><p class="ts">Diferencia semanal (' + unidad + ') · 2026 vs 2025</p>' + items + '<div class="total-box"><div><div class="total-label">' + (esAhorro ? 'Ahorro' : 'Incremento') + ' Total Mensual</div><div class="total-sub">Variación promedio por ' + unidad.split('/')[1] + ' en 2026</div></div><div class="total-val" style="color:' + color + ';">' + (diff >= 0 ? '+' : '') + fmt(diff) + ' ' + unidad + '</div></div></div>';
    }).join('');

    // Gráfico
    const labels = periodos.map(p => p.mes.substring(0, 3) + ' ' + p.semana);
    const d25 = periodos.map(p => p.v2025);
    const d26 = periodos.map(p => p.v2026);
    const prom25 = periodos.map(p => promedios[p.mes].v2025);
    const prom26 = periodos.map(p => promedios[p.mes].v2026);
    const min = Math.floor(Math.min(...d25, ...d26) - 1);
    const max = Math.ceil(Math.max(...d25, ...d26) + 1);

    root.innerHTML =
      '<div class="kpi-header"><h2 class="title">Evolución de Costos — ' + data.producto + '</h2><span class="vs-badge">2025 VS. 2026</span></div>' +
      '<div class="kpi-grid">' + kpiHTML + '</div>' +
      '<div class="chart-box"><p class="sub">Precio Semanal (' + unidad + ') — barras + tendencia + promedios mensuales</p>' +
        '<div class="toggle-row"><span>Mostrar:</span>' +
        '<div class="tog-btn g25" data-g="0">● Gestión 2025</div>' +
        '<div class="tog-btn g26" data-g="1">● Gestión 2026</div>' +
        '<div class="tog-btn p25" data-g="2">– Prom. mensual 2025</div>' +
        '<div class="tog-btn p26" data-g="3">– Prom. mensual 2026</div></div>' +
        '<div style="position:relative;width:100%;height:300px;"><canvas id="combo"></canvas></div></div>' +
      '<div class="tables-row">' + tablasHTML + '</div>' +
      '<div class="savings-row">' + savHTML + '</div>';

    // Chart.js
    const gridColor = 'rgba(255,255,255,0.06)';
    const tickColor = '#5a7a8a';
    const chart = new Chart(document.getElementById('combo'), {
      data: {
        labels: labels,
        datasets: [
          { type:'bar',  label:'Gestión 2025', data:d25, backgroundColor:'rgba(111,217,122,0.65)', borderRadius:4, order:3 },
          { type:'bar',  label:'Gestión 2026', data:d26, backgroundColor:'rgba(91,184,245,0.65)',  borderRadius:4, order:3 },
          { type:'line', label:'Tendencia 2025', data:d25, borderColor:'#6fd97a', backgroundColor:'transparent', tension:0.35, pointRadius:4, pointBackgroundColor:'#6fd97a', borderWidth:2, order:2 },
          { type:'line', label:'Tendencia 2026', data:d26, borderColor:'#5bb8f5', backgroundColor:'transparent', tension:0.35, pointRadius:4, pointBackgroundColor:'#5bb8f5', borderDash:[5,3], borderWidth:2, order:2 },
          { type:'line', label:'Prom. mensual 2025', data:prom25, borderColor:'#f0a500', backgroundColor:'transparent', tension:0, pointRadius:0, borderDash:[8,4], borderWidth:2.5, order:1 },
          { type:'line', label:'Prom. mensual 2026', data:prom26, borderColor:'#e05ccc', backgroundColor:'transparent', tension:0, pointRadius:0, borderDash:[8,4], borderWidth:2.5, order:1 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks:{ color:tickColor, font:{size:11}, autoSkip:false }, grid:{ color:gridColor } },
          y: { min:min, max:max, ticks:{ color:tickColor, font:{size:11}, callback: v => 'Bs ' + v }, grid:{ color:gridColor } }
        }
      }
    });

    // Toggles
    const groupMap = { 0:[0,2], 1:[1,3], 2:[4], 3:[5] };
    const visible = [true, true, true, true];
    document.querySelectorAll('.tog-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const g = parseInt(btn.dataset.g, 10);
        visible[g] = !visible[g];
        btn.classList.toggle('off', !visible[g]);
        groupMap[g].forEach(i => { chart.data.datasets[i].hidden = !visible[g]; });
        chart.update();
      });
    });
  }
})();
