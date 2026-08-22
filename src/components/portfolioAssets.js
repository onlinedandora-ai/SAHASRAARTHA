/**
 * Screen 2: Portfolio Assets & Screen 3: Asset Drill-down View
 * Conforms to Blueprint Screens 2 & 3:
 * - Asset Class Allocation Donut (Real Estate, Equity, Debt, Unlisted VC, Commodity)
 * - SFO Assets List (Purchase Price, Current Valuation, IRR, Allocation %)
 * - Filter by Asset Class & Status
 * - Tap Card to launch Screen 3 Asset Drill-Down (Metadata, Yield Chart, Partner Fractional Value, Exit Terms, Title Deeds)
 */

import { store } from '../state/store.js';
import { formatINR, formatPercent, formatDate } from '../utils/formatters.js';
import { renderAssetClassAllocationDonut, renderAssetHistoricalYieldChart } from './charts.js';

let activeClassFilter = 'ALL';
let activeStatusFilter = 'ALL';

export function renderPortfolioAssets() {
  const user = store.currentUser;
  const calcs = store.getCalculations();
  const psr = user.sharePct ? user.sharePct / 100 : (user.psr || 0.05);

  let assets = store.portfolioAssets;
  if (activeClassFilter !== 'ALL') {
    assets = assets.filter(a => a.assetClass === activeClassFilter);
  }
  if (activeStatusFilter !== 'ALL') {
    assets = assets.filter(a => a.status === activeStatusFilter);
  }

  const selectedAsset = store.selectedAssetId ? store.portfolioAssets.find(a => a.assetId === store.selectedAssetId) : null;

  return `
    <div class="view-section" style="padding-bottom: 24px;">
      
      <!-- Section Header -->
      <div class="section-header" style="margin-bottom: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
            <span class="role-tag role-lp" style="font-size: 0.68rem;">Portfolio Deployments</span>
            <span class="mono" style="font-size: 0.72rem; color: var(--accent-gold);">5 Core Assets</span>
          </div>
          <h2 style="font-size: 1.3rem;">Portfolio Assets</h2>
          <p style="font-size: 0.78rem;">SFO Master Deployment & Valuation Architecture</p>
        </div>
      </div>

      <!-- ASSET CLASS ALLOCATION DONUT CARD -->
      <div class="card" style="margin-bottom: 16px;">
        <div class="card-header" style="margin-bottom: 8px;">
          <h4 style="font-size: 0.95rem; color: var(--text-primary);">Asset Class Allocation</h4>
          <span class="badge badge-verified" style="font-size: 0.65rem;">Unitized NAV ₹${calcs.navPerUnit.toFixed(2)}</span>
        </div>
        ${renderAssetClassAllocationDonut(store.portfolioAssets)}
      </div>

      <!-- ASSET CLASS & STATUS FILTERS -->
      <div style="margin-bottom: 14px; display: flex; flex-direction: column; gap: 8px;">
        <div class="filter-pills" style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px;">
          <button class="filter-pill ${activeClassFilter === 'ALL' ? 'active' : ''}" data-class="ALL">All Classes</button>
          <button class="filter-pill ${activeClassFilter === 'DEBT' ? 'active' : ''}" data-class="DEBT">Venture Debt</button>
          <button class="filter-pill ${activeClassFilter === 'UNLISTED_EQUITY' ? 'active' : ''}" data-class="UNLISTED_EQUITY">Unlisted VC</button>
          <button class="filter-pill ${activeClassFilter === 'LISTED_EQUITY' ? 'active' : ''}" data-class="LISTED_EQUITY">Listed Equity</button>
          <button class="filter-pill ${activeClassFilter === 'COMMODITY' ? 'active' : ''}" data-class="COMMODITY">ETFs & Gold</button>
        </div>
      </div>

      <!-- SFO ASSET CARDS LIST -->
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${assets.map(asset => {
          const partnerFractionalVal = Number(asset.currentValuation) * psr;
          return `
            <div class="card asset-card" data-asset-id="${asset.assetId}" style="cursor: pointer; padding: 16px; border-left: 4px solid ${getAssetColor(asset.assetClass)}; transition: transform 0.2s, border-color 0.2s;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                    <span class="badge" style="background: rgba(255,255,255,0.06); font-size: 0.62rem; color: ${getAssetColor(asset.assetClass)}; font-weight: 700;">
                      ${formatAssetClass(asset.assetClass)}
                    </span>
                    <span class="mono" style="font-size: 0.7rem; color: var(--text-muted);">${asset.assetCode}</span>
                  </div>
                  <h3 style="font-size: 1.05rem; color: var(--text-primary); margin-top: 4px;">${asset.assetName}</h3>
                  <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
                    ${asset.manager} &bull; ${asset.location}
                  </div>
                </div>

                <div style="text-align: right; flex-shrink: 0;">
                  <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); font-family: 'Outfit', sans-serif;">
                    ${formatINR(asset.currentValuation, { compact: true })}
                  </div>
                  <div style="font-size: 0.72rem; color: var(--accent-emerald); font-weight: 700;">
                    ${asset.irrPct ? `IRR ${asset.irrPct}%` : 'Yield Accruing'}
                  </div>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border-subtle); font-size: 0.74rem;">
                <div>
                  <span style="color: var(--text-muted);">Purchase / Cost:</span>
                  <strong style="color: var(--text-secondary); margin-left: 4px;">${formatINR(asset.totalInvestedAmount, { compact: true })}</strong>
                </div>
                <div>
                  <span style="color: var(--text-muted);">Your Stake (${(psr * 100).toFixed(2)}%):</span>
                  <strong style="color: var(--accent-gold); margin-left: 4px;">${formatINR(partnerFractionalVal)}</strong>
                </div>
              </div>

              <div style="margin-top: 10px; display: flex; align-items: center; justify-content: space-between; font-size: 0.72rem; color: var(--accent-blue);">
                <span>Tap to view Asset Drill-Down & Valuation Graph &rarr;</span>
                <span class="badge badge-verified" style="font-size: 0.6rem;">${asset.allocationPct}% AUM</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- SCREEN 3: ASSET DRILL-DOWN MODAL -->
      ${selectedAsset ? renderAssetDrilldownModal(selectedAsset, user, psr) : ''}

    </div>
  `;
}

function renderAssetDrilldownModal(asset, user, psr) {
  const partnerFractionalVal = Number(asset.currentValuation) * psr;
  const partnerPrincipalInAsset = Number(asset.totalInvestedAmount) * psr;
  const assetGain = partnerFractionalVal - partnerPrincipalInAsset;

  return `
    <div class="modal-backdrop active" id="asset-drilldown-backdrop">
      <div class="modal-sheet" style="max-height: 88vh; overflow-y: auto;">
        
        <div class="modal-header" style="position: sticky; top: 0; background: var(--bg-card); z-index: 10; padding-bottom: 10px;">
          <div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="badge" style="background: rgba(255,255,255,0.06); font-size: 0.65rem; color: ${getAssetColor(asset.assetClass)}; font-weight: 700;">
                ${formatAssetClass(asset.assetClass)}
              </span>
              <span class="mono" style="font-size: 0.72rem; color: var(--accent-gold);">${asset.assetCode}</span>
            </div>
            <h3 style="font-size: 1.15rem; color: var(--text-primary); margin-top: 2px;">${asset.assetName}</h3>
          </div>
          <button class="modal-close" id="btn-close-drilldown">&times;</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 8px;">
          
          <!-- Partner Stake Snapshot in this Asset -->
          <div class="card highlight-gold" style="padding: 14px;">
            <span class="metric-label" style="font-size: 0.7rem; color: var(--accent-gold);">YOUR FRACTIONAL HOLDING VALUE</span>
            <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 4px;">
              <span class="metric-value emerald" style="font-size: 1.4rem;">${formatINR(partnerFractionalVal)}</span>
              <span style="font-size: 0.78rem; color: var(--text-muted);">PSR Stake: <strong>${(psr * 100).toFixed(3)}%</strong></span>
            </div>
            <div style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 4px;">
              Contributed: <strong>${formatINR(partnerPrincipalInAsset)}</strong> &bull; Unrealised Surplus: <strong style="color: var(--accent-emerald);">+${formatINR(assetGain)}</strong>
            </div>
          </div>

          <!-- Historical Revaluations & Yield Graph (Screen 3 Spec) -->
          <div class="card" style="padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <h4 style="font-size: 0.88rem; color: var(--text-primary);">Historical Revaluation Trajectory</h4>
              <span class="badge badge-verified" style="font-size: 0.62rem;">Manager Statement Reconciled</span>
            </div>
            ${renderAssetHistoricalYieldChart(asset.historicalRevaluations)}
          </div>

          <!-- Asset Metadata & Operations -->
          <div class="card" style="padding: 14px;">
            <h4 style="font-size: 0.88rem; color: var(--text-primary); margin-bottom: 10px;">Asset Specification & Terms</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 0.76rem;">
              <div>
                <div style="color: var(--text-muted);">Manager / Sponsor</div>
                <strong style="color: var(--text-primary);">${asset.manager}</strong>
              </div>
              <div>
                <div style="color: var(--text-muted);">Acquisition Date</div>
                <strong style="color: var(--text-primary);">${formatDate(asset.acquisitionDate)}</strong>
              </div>
              <div>
                <div style="color: var(--text-muted);">Asset Class</div>
                <strong style="color: var(--text-primary);">${formatAssetClass(asset.assetClass)}</strong>
              </div>
              <div>
                <div style="color: var(--text-muted);">Location / Exchange</div>
                <strong style="color: var(--text-primary);">${asset.location}</strong>
              </div>
            </div>

            <div style="margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border-subtle);">
              <div style="font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase;">Exit & Liquidation Terms</div>
              <p style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 2px; line-height: 1.4;">${asset.exitTerms}</p>
            </div>
          </div>

          <!-- Portfolio Companies (if Artha IV) -->
          ${asset.portfolioCompanies ? `
            <div class="card" style="padding: 14px;">
              <h4 style="font-size: 0.88rem; color: var(--text-primary); margin-bottom: 8px;">Underlying Portfolio Look-Through</h4>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${asset.portfolioCompanies.map(c => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; background: rgba(255,255,255,0.02); border-radius: 4px; font-size: 0.74rem;">
                    <div>
                      <div style="font-weight: 600; color: var(--text-primary);">${c.name}</div>
                      <div style="font-size: 0.65rem; color: var(--text-muted);">${c.status}</div>
                    </div>
                    <div style="text-align: right;">
                      <div style="font-weight: 700; color: var(--accent-gold);">${formatINR(c.sfoLookThroughINR)}</div>
                      <div style="font-size: 0.65rem; color: var(--accent-emerald);">${c.multiple > 1 ? c.multiple + 'x Mark' : 'Cost'}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Attached Title Deeds & Reports (Download with Watermark) -->
          <div class="card" style="padding: 14px;">
            <h4 style="font-size: 0.88rem; color: var(--text-primary); margin-bottom: 8px;">Attached Title Deeds & Valuation Reports</h4>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${(asset.documents || []).map(doc => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: rgba(255,255,255,0.02); border-radius: 4px; font-size: 0.74rem;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" color="var(--accent-gold)"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <span style="color: var(--text-primary); font-weight: 500;">${doc.title}</span>
                  </div>
                  <button class="btn btn-secondary btn-sm btn-download-asset-doc" data-doc-title="${doc.title}" style="padding: 3px 8px; font-size: 0.68rem;">
                    Download
                  </button>
                </div>
              `).join('')}
            </div>
          </div>

          <button class="btn btn-secondary" id="btn-close-drilldown-bottom" style="width: 100%;">Close Detail View</button>
        </div>

      </div>
    </div>
  `;
}

function getAssetColor(cls) {
  switch (cls) {
    case 'DEBT': return '#D4AF37'; // Regal Gold
    case 'UNLISTED_EQUITY': return '#7B1930'; // Royal Burgundy
    case 'LISTED_EQUITY': return '#10B981'; // Emerald Green
    case 'COMMODITY': return '#E5A024'; // Amber Gold
    case 'REAL_ESTATE': return '#3B82F6'; // Royal Navy Blue
    default: return '#D4AF37';
  }
}

function formatAssetClass(cls) {
  switch (cls) {
    case 'DEBT': return 'Venture Debt / Yield';
    case 'UNLISTED_EQUITY': return 'Unlisted Venture Capital';
    case 'LISTED_EQUITY': return 'Listed Equities';
    case 'COMMODITY': return 'ETFs & Precious Metals';
    case 'REAL_ESTATE': return 'Commercial Real Estate';
    default: return cls;
  }
}

export function attachPortfolioAssetsEvents() {
  // Class filter pills
  document.querySelectorAll('.filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      activeClassFilter = btn.getAttribute('data-class');
      store.notify();
    });
  });

  // Tap asset card to open drilldown
  document.querySelectorAll('.asset-card').forEach(card => {
    card.addEventListener('click', () => {
      const assetId = card.getAttribute('data-asset-id');
      store.openModal('DRILLDOWN', { assetId });
    });
  });

  // Close drilldown
  document.getElementById('btn-close-drilldown')?.addEventListener('click', () => {
    store.closeModal();
  });

  document.getElementById('btn-close-drilldown-bottom')?.addEventListener('click', () => {
    store.closeModal();
  });

  // Download asset document
  document.querySelectorAll('.btn-download-asset-doc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = btn.getAttribute('data-doc-title');
      alert(`[SFO Secure Watermark]: Generating signed download for "${title}" with Partner ID watermark (${store.currentUser.partnerId})...`);
    });
  });
}
