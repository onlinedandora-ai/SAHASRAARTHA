/**
 * SVG-based Interactive Financial Visualizations for SFO Mobile & Desktop
 * Asset Class Allocation Donut Chart, Historical Yield Trajectory, NAV Curve
 */

import { formatINR, formatPercent } from '../utils/formatters.js';

export function renderAssetClassAllocationDonut(assets) {
  const classTotals = {
    DEBT: 0,
    UNLISTED_EQUITY: 0,
    LISTED_EQUITY: 0,
    COMMODITY: 0,
    REAL_ESTATE: 0
  };

  assets.forEach(a => {
    const cls = a.assetClass || 'DEBT';
    if (classTotals[cls] !== undefined) {
      classTotals[cls] += Number(a.currentValuation || 0);
    } else {
      classTotals.DEBT += Number(a.currentValuation || 0);
    }
  });

  const total = Object.values(classTotals).reduce((sum, v) => sum + v, 0) || 1;

  const slices = [
    { label: "Venture Debt & Yield", classKey: "DEBT", value: classTotals.DEBT, color: "#3b82f6", pct: (classTotals.DEBT / total) * 100 },
    { label: "Unlisted VC (Artha IV)", classKey: "UNLISTED_EQUITY", value: classTotals.UNLISTED_EQUITY, color: "#8b5cf6", pct: (classTotals.UNLISTED_EQUITY / total) * 100 },
    { label: "Listed Equity (9 scrips)", classKey: "LISTED_EQUITY", value: classTotals.LISTED_EQUITY, color: "#10b981", pct: (classTotals.LISTED_EQUITY / total) * 100 },
    { label: "ETFs & Gold Hedge", classKey: "COMMODITY", value: classTotals.COMMODITY, color: "#f59e0b", pct: (classTotals.COMMODITY / total) * 100 },
    { label: "Real Estate (TechPark)", classKey: "REAL_ESTATE", value: classTotals.REAL_ESTATE, color: "#ec4899", pct: (classTotals.REAL_ESTATE / total) * 100 }
  ].filter(s => s.value > 0);

  const size = 200;
  const center = size / 2;
  const radius = 70;
  const strokeWidth = 26;

  let cumulativeAngle = -90;

  const paths = slices.map((slice) => {
    const angle = (slice.pct / 100) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + Math.max(angle - 1, 0.5); // gap
    cumulativeAngle += angle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;
    const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

    return `
      <path d="${d}" fill="none" stroke="${slice.color}" stroke-width="${strokeWidth}" 
            stroke-linecap="round" class="donut-slice">
        <title>${slice.label}: ${formatINR(slice.value)} (${slice.pct.toFixed(1)}%)</title>
      </path>
    `;
  }).join('');

  return `
    <div style="display: flex; flex-direction: column; align-items: center; gap: 16px;">
      <div style="position: relative; width: ${size}px; height: ${size}px;">
        <svg viewBox="0 0 ${size} ${size}" width="100%" height="100%">
          ${paths}
        </svg>
        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none;">
          <span style="font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 600;">Fund AUM</span>
          <span style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); font-family: 'Outfit', sans-serif;">${formatINR(total, { compact: true })}</span>
        </div>
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; width: 100%; font-size: 0.76rem;">
        ${slices.map(s => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 6px 8px; background: #fcf9f5; border-radius: 6px; border: 1px solid #ede4da;">
            <div style="display: flex; align-items: center; gap: 6px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <span style="width: 8px; height: 8px; border-radius: 2px; background: ${s.color}; flex-shrink: 0;"></span>
              <span style="color: var(--text-secondary); text-overflow: ellipsis; overflow: hidden; font-size: 0.72rem; font-weight: 600;">${s.label}</span>
            </div>
            <span style="font-weight: 800; color: #0f172a; margin-left: 6px; font-size: 0.74rem;">${s.pct.toFixed(1)}%</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

export function renderAssetHistoricalYieldChart(history = []) {
  if (!history || history.length === 0) return `<p style="font-size: 0.8rem; color: var(--text-muted);">No historical revaluations recorded yet.</p>`;

  const width = 360;
  const height = 120;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 15;
  const padBottom = 25;

  const minVal = Math.min(...history.map(h => h.value)) * 0.95;
  const maxVal = Math.max(...history.map(h => h.value)) * 1.05 || 1;

  const getX = (idx) => padLeft + (idx / Math.max(history.length - 1, 1)) * (width - padLeft - padRight);
  const getY = (val) => height - padBottom - ((val - minVal) / (maxVal - minVal)) * (height - padTop - padBottom);

  const points = history.map((h, idx) => `${getX(idx)},${getY(h.value)}`).join(' ');
  const areaPoints = `${getX(0)},${height - padBottom} ${points} ${getX(history.length - 1)},${height - padBottom}`;

  return `
    <div style="width: 100%; overflow-x: auto;">
      <svg viewBox="0 0 ${width} ${height}" width="100%" height="120" style="overflow: visible;">
        <defs>
          <linearGradient id="yieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#10b981" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#10b981" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Axis line -->
        <line x1="${padLeft}" y1="${height - padBottom}" x2="${width - padRight}" y2="${height - padBottom}" stroke="var(--border-subtle)" stroke-width="1" />

        <!-- Area fill -->
        <polygon points="${areaPoints}" fill="url(#yieldGrad)" />

        <!-- Stroke line -->
        <polyline points="${points}" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />

        <!-- Data points -->
        ${history.map((h, idx) => `
          <circle cx="${getX(idx)}" cy="${getY(h.value)}" r="3.5" fill="#10b981" stroke="#0f172a" stroke-width="2">
            <title>${h.date}: ₹${h.value.toLocaleString('en-IN')}</title>
          </circle>
          <text x="${getX(idx)}" y="${height - 8}" text-anchor="middle" font-size="8" fill="var(--text-muted)">
            ${h.date.slice(5)}
          </text>
        `).join('')}
      </svg>
    </div>
  `;
}
