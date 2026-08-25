/**
 * Screen 2: Portfolio Holdings & Assets Master Architecture
 * Directly implements the official Excel "Holdings" tab:
 * - Full 18-Securities Master Holdings Table as of 13-August-2026
 * - Quantities independently verified against Held Away Report
 * - Exact Qty, Cost (INR), Market (INR), Unrealised, % Return, and % of Portfolio
 * - Asset Category Drill-downs (AIF Venture Debt, Unlisted VC, Listed Equities, ETFs, Dry Powder)
 * - Partner Fractional Stake Calculator (based on logged in partner's PSR)
 */

import { store } from '../state/store.js';
import { HOLDINGS_AS_AT_13_AUG_2026, PORTFOLIO_ASSETS, SFO_METADATA } from '../data/sfo_data.js';
import { formatINR, formatPercent, formatDate } from '../utils/formatters.js';
import { renderAssetClassAllocationDonut } from './charts.js';

let activeViewMode = 'TABLE'; // 'TABLE' | 'CARDS' | 'ALLOCATION'
let activeCategoryFilter = 'ALL';
let holdingsSearch = '';

export function renderPortfolioAssets() {
  const user = store.currentUser;
  const calcs = store.getCalculations();
  const psr = user.sharePct ? user.sharePct / 100 : (user.psr || 0.07869);
  const isSuperAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.partnerId === 'SH-SA-001';

  // Filter 18-Securities Holdings
  let filteredHoldings = HOLDINGS_AS_AT_13_AUG_2026;
  if (activeCategoryFilter !== 'ALL') {
    filteredHoldings = filteredHoldings.filter(h => {
      if (activeCategoryFilter === 'AIF') return h.category.includes('AIF');
      if (activeCategoryFilter === 'EQUITY') return h.category.includes('Listed Equity');
      if (activeCategoryFilter === 'ETF') return h.category.includes('ETF');
      return true;
    });
  }

  if (holdingsSearch.trim()) {
    const q = holdingsSearch.toLowerCase().trim();
    filteredHoldings = filteredHoldings.filter(h =>
      h.security.toLowerCase().includes(q) ||
      h.category.toLowerCase().includes(q) ||
      (h.notes && h.notes.toLowerCase().includes(q))
    );
  }

  // Holdings Totals
  const totalCost = HOLDINGS_AS_AT_13_AUG_2026.reduce((sum, h) => sum + h.cost, 0); // 14,788,797
  const totalMarket = HOLDINGS_AS_AT_13_AUG_2026.reduce((sum, h) => sum + h.market, 0); // 14,750,639
  const totalUnrealised = HOLDINGS_AS_AT_13_AUG_2026.reduce((sum, h) => sum + h.unrealised, 0); // -38,158
  const totalReturnPct = totalCost > 0 ? (totalUnrealised / totalCost) * 100 : 0; // -0.26%
  const brokerCash = store.brokerCash || 1507071.00;
  const bankCash = store.bankBalance || 170151.17;
  const grossAssets = totalMarket + brokerCash + bankCash; // 1,64,27,861.17

  // Selected asset for drill-down modal
  const selectedAsset = store.selectedAssetId ? store.portfolioAssets.find(a => a.assetId === store.selectedAssetId) : null;

  return `
    <div class="view-section" style="padding-bottom: 28px; display: flex; flex-direction: column; gap: 14px; width: 100%; box-sizing: border-box;">
      
      <!-- 1. SECTION HEADER WITH STATUTORY SUBTITLE -->
      <div class="card highlight-gold" style="padding: 14px 16px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; flex-wrap: wrap;">
          <div>
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
              <span class="role-tag role-lp" style="font-size: 0.68rem; font-weight: 800;">PORTFOLIO HOLDINGS</span>
              <span class="mono" style="font-size: 0.7rem; color: var(--accent-gold); font-weight: 700;">18 Reconciled Securities</span>
            </div>
            <h2 style="font-size: 1.15rem; color: var(--text-primary); font-weight: 900; margin: 4px 0 2px 0;">
              HOLDINGS AS AT 13-AUGUST-2026
            </h2>
            <p style="font-size: 0.74rem; color: var(--text-secondary); margin: 0; line-height: 1.35;">
              Quantities independently verified; 31-Mar-2026 holdings rolled forward through all FY2026-27 trades tie exactly to the Held Away Report
            </p>
          </div>

          <div style="text-align: right;">
            <div style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Total Securities Valuation</div>
            <div style="font-size: 1.25rem; font-weight: 900; color: #ea580c; font-family: monospace;">₹1,47,50,639</div>
            <div style="font-size: 0.68rem; color: var(--accent-emerald); font-weight: 700;">+ Cash Reserves = ₹1,64,27,861</div>
          </div>
        </div>

        <!-- View Mode Segmented Controls -->
        <div style="display: flex; gap: 6px; margin-top: 12px; background: rgba(0,0,0,0.04); padding: 4px; border-radius: 10px;">
          <button class="btn btn-sm btn-view-mode ${activeViewMode === 'TABLE' ? 'btn-primary' : 'btn-secondary'}" data-mode="TABLE" style="flex: 1; padding: 6px 8px; font-size: 0.74rem; font-weight: 700;">
            📋 Holdings Table (18)
          </button>
          <button class="btn btn-sm btn-view-mode ${activeViewMode === 'CARDS' ? 'btn-primary' : 'btn-secondary'}" data-mode="CARDS" style="flex: 1; padding: 6px 8px; font-size: 0.74rem; font-weight: 700;">
            📊 Category View
          </button>
          <button class="btn btn-sm btn-view-mode ${activeViewMode === 'ALLOCATION' ? 'btn-primary' : 'btn-secondary'}" data-mode="ALLOCATION" style="flex: 1; padding: 6px 8px; font-size: 0.74rem; font-weight: 700;">
            📈 Asset Donut
          </button>
        </div>
      </div>

      ${activeViewMode === 'TABLE' ? `
        <!-- 2. FULL 18-SECURITIES MASTER HOLDINGS TABLE (Exact Replica of Excel) -->
        <div class="card" style="padding: 16px; border: 1.5px solid var(--border-color);">
          
          <!-- Filters & Search Bar -->
          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <input type="text" id="input-holdings-search" placeholder="Search security name, category, ticker..." value="${holdingsSearch}" style="flex: 1; min-width: 180px; padding: 8px 12px; font-size: 0.8rem; border-radius: 8px; border: 1.5px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); outline: none;">
              
              <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px;">
                <button class="btn-filter-cat role-chip ${activeCategoryFilter === 'ALL' ? 'active' : ''}" data-cat="ALL" style="padding: 4px 8px; font-size: 0.68rem; font-weight: 700; border-radius: 6px; cursor: pointer; border: 1px solid var(--border-color); background: ${activeCategoryFilter === 'ALL' ? '#fff7ed' : 'var(--bg-card)'}; color: ${activeCategoryFilter === 'ALL' ? '#ea580c' : 'var(--text-secondary)'};">
                  All (18)
                </button>
                <button class="btn-filter-cat role-chip ${activeCategoryFilter === 'AIF' ? 'active' : ''}" data-cat="AIF" style="padding: 4px 8px; font-size: 0.68rem; font-weight: 700; border-radius: 6px; cursor: pointer; border: 1px solid var(--border-color); background: ${activeCategoryFilter === 'AIF' ? '#fff7ed' : 'var(--bg-card)'}; color: ${activeCategoryFilter === 'AIF' ? '#ea580c' : 'var(--text-secondary)'};">
                  AIFs (2)
                </button>
                <button class="btn-filter-cat role-chip ${activeCategoryFilter === 'ETF' ? 'active' : ''}" data-cat="ETF" style="padding: 4px 8px; font-size: 0.68rem; font-weight: 700; border-radius: 6px; cursor: pointer; border: 1px solid var(--border-color); background: ${activeCategoryFilter === 'ETF' ? '#fff7ed' : 'var(--bg-card)'}; color: ${activeCategoryFilter === 'ETF' ? '#ea580c' : 'var(--text-secondary)'};">
                  ETFs (7)
                </button>
                <button class="btn-filter-cat role-chip ${activeCategoryFilter === 'EQUITY' ? 'active' : ''}" data-cat="EQUITY" style="padding: 4px 8px; font-size: 0.68rem; font-weight: 700; border-radius: 6px; cursor: pointer; border: 1px solid var(--border-color); background: ${activeCategoryFilter === 'EQUITY' ? '#fff7ed' : 'var(--bg-card)'}; color: ${activeCategoryFilter === 'EQUITY' ? '#ea580c' : 'var(--text-secondary)'};">
                  Listed Equities (9)
                </button>
              </div>
            </div>
          </div>

          <!-- Responsive Scrollable Table -->
          <div style="overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 0 -8px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem; min-width: 620px;">
              <thead>
                <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-secondary); text-align: right; background: rgba(0,0,0,0.02);">
                  <th style="text-align: left; padding: 8px 6px; font-weight: 800; font-size: 0.72rem; min-width: 180px;">Security</th>
                  <th style="padding: 8px 6px; font-weight: 800; font-size: 0.72rem;">Qty</th>
                  <th style="padding: 8px 6px; font-weight: 800; font-size: 0.72rem;">Cost (INR)</th>
                  <th style="padding: 8px 6px; font-weight: 800; font-size: 0.72rem; color: #ea580c;">Market (INR)</th>
                  <th style="padding: 8px 6px; font-weight: 800; font-size: 0.72rem;">Unrealised</th>
                  <th style="padding: 8px 6px; font-weight: 800; font-size: 0.72rem;">% Return</th>
                  <th style="padding: 8px 6px; font-weight: 800; font-size: 0.72rem;">% Port</th>
                </tr>
              </thead>
              <tbody>
                ${filteredHoldings.map((h, idx) => {
                  const isUnrealisedLoss = h.unrealised < 0;
                  const isUnrealisedGain = h.unrealised > 0;
                  const unFormatted = h.unrealised === 0 
                    ? '-' 
                    : isUnrealisedLoss 
                      ? `(${Math.abs(h.unrealised).toLocaleString('en-IN')})` 
                      : `+${h.unrealised.toLocaleString('en-IN')}`;
                  const retFormatted = h.returnPct === 0 ? '0.00%' : `${h.returnPct > 0 ? '+' : ''}${h.returnPct.toFixed(2)}%`;
                  const unColor = isUnrealisedLoss ? '#ef4444' : isUnrealisedGain ? '#10b981' : 'var(--text-muted)';
                  const retColor = isUnrealisedLoss ? '#ef4444' : isUnrealisedGain ? '#10b981' : 'var(--text-muted)';

                  return `
                    <tr style="border-bottom: 1px solid var(--border-subtle); transition: background 0.15s ease;">
                      <td style="padding: 8px 6px; text-align: left;">
                        <div style="font-weight: 800; color: var(--text-primary); line-height: 1.3;">
                          ${h.security}
                        </div>
                        <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 1px;">
                          <span style="display: inline-block; padding: 1px 5px; border-radius: 4px; background: var(--bg-input); font-weight: 600;">${h.category}</span>
                        </div>
                      </td>
                      <td style="padding: 8px 6px; text-align: right; font-family: monospace; color: var(--text-secondary); font-weight: 600;">
                        ${h.qty.toLocaleString('en-IN')}
                      </td>
                      <td style="padding: 8px 6px; text-align: right; font-family: monospace; color: var(--text-secondary);">
                        ₹${h.cost.toLocaleString('en-IN')}
                      </td>
                      <td style="padding: 8px 6px; text-align: right; font-family: monospace; font-weight: 800; color: var(--text-primary);">
                        ₹${h.market.toLocaleString('en-IN')}
                      </td>
                      <td style="padding: 8px 6px; text-align: right; font-family: monospace; font-weight: 700; color: ${unColor};">
                        ${unFormatted}
                      </td>
                      <td style="padding: 8px 6px; text-align: right; font-family: monospace; font-weight: 800; color: ${retColor};">
                        ${retFormatted}
                      </td>
                      <td style="padding: 8px 6px; text-align: right; font-family: monospace; font-weight: 700; color: var(--text-secondary);">
                        ${h.portfolioPct.toFixed(2)}%
                      </td>
                    </tr>
                  `;
                }).join('')}

                <!-- TOTAL STICKY ROW -->
                <tr style="border-top: 2px solid var(--border-color); background: rgba(234, 88, 12, 0.06); font-weight: 900;">
                  <td style="padding: 10px 6px; text-align: left; font-size: 0.8rem; color: #1e293b;">
                    <strong>TOTAL SECURITIES (18)</strong>
                  </td>
                  <td style="padding: 10px 6px; text-align: right; font-family: monospace; color: var(--text-secondary); font-size: 0.78rem;">
                    —
                  </td>
                  <td style="padding: 10px 6px; text-align: right; font-family: monospace; color: #1e293b; font-size: 0.82rem;">
                    ₹${totalCost.toLocaleString('en-IN')}
                  </td>
                  <td style="padding: 10px 6px; text-align: right; font-family: monospace; color: #ea580c; font-size: 0.86rem;">
                    ₹${totalMarket.toLocaleString('en-IN')}
                  </td>
                  <td style="padding: 10px 6px; text-align: right; font-family: monospace; color: #ef4444; font-size: 0.82rem;">
                    (₹${Math.abs(totalUnrealised).toLocaleString('en-IN')})
                  </td>
                  <td style="padding: 10px 6px; text-align: right; font-family: monospace; color: #ef4444; font-size: 0.82rem;">
                    ${totalReturnPct.toFixed(2)}%
                  </td>
                  <td style="padding: 10px 6px; text-align: right; font-family: monospace; color: #1e293b; font-size: 0.82rem;">
                    100.00%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Total Gross Asset Liquidity Reconciled Footnote -->
          <div style="margin-top: 12px; padding: 10px 12px; background: var(--bg-input); border-radius: 8px; border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 4px; font-size: 0.72rem; color: var(--text-secondary);">
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px;">
              <span>+ Nuvama Broker Cash Ledger (Client 50191350):</span>
              <strong style="font-family: monospace; color: var(--text-primary);">₹${brokerCash.toLocaleString('en-IN')}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px;">
              <span>+ ICICI Bank Current Account (818305500002):</span>
              <strong style="font-family: monospace; color: var(--text-primary);">₹${bankCash.toLocaleString('en-IN')}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 4px; border-top: 1px dashed var(--border-subtle); padding-top: 4px; font-weight: 800; color: #ea580c;">
              <span>= RECONCILED TOTAL GROSS ASSETS:</span>
              <strong style="font-family: monospace; font-size: 0.82rem;">₹${grossAssets.toLocaleString('en-IN')}</strong>
            </div>
          </div>

          <!-- Statutory Disclosures from Sheet -->
          <div style="margin-top: 10px; font-size: 0.68rem; color: var(--text-muted); line-height: 1.35;">
            <div>&bull; <strong>Note:</strong> Artha Fund IV is shown at the capital account closing balance of Rs 17,15,956 per the manager statement dated 30-Jun-2026.</div>
            <div style="margin-top: 2px;">&bull; Nuvama carries it at par (Rs 20,00,000) because par is the unit face value, not a valuation. RevX Class E1 is likewise at par because it is a distributing class.</div>
          </div>
        </div>
      ` : activeViewMode === 'CARDS' ? `
        <!-- 3. CATEGORY AGGREGATED CARDS WITH DRILL-DOWN -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${PORTFOLIO_ASSETS.map(asset => {
            const partnerFractionalVal = Number(asset.currentValuation) * psr;
            return `
              <div class="card asset-card" data-asset-id="${asset.assetId}" style="cursor: pointer; padding: 16px; border-left: 4px solid ${getAssetColor(asset.assetClass)}; transition: transform 0.2s, border-color 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap;">
                  <div style="flex: 1 1 180px; min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                      <span class="badge" style="background: rgba(234,88,12,0.08); font-size: 0.62rem; color: ${getAssetColor(asset.assetClass)}; font-weight: 700;">
                        ${formatAssetClass(asset.assetClass)}
                      </span>
                      <span class="mono" style="font-size: 0.7rem; color: var(--text-muted);">${asset.assetCode}</span>
                    </div>
                    <h3 style="font-size: 1.02rem; color: var(--text-primary); margin-top: 4px; word-break: break-word; font-weight: 800;">${asset.assetName}</h3>
                    <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px; word-break: break-word;">
                      ${asset.manager} &bull; ${asset.location}
                    </div>
                  </div>

                  <div style="text-align: right; flex-shrink: 0; min-width: 90px;">
                    <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-primary); font-family: monospace;">
                      ${formatINR(asset.currentValuation)}
                    </div>
                    <div style="font-size: 0.72rem; color: var(--accent-emerald); font-weight: 700;">
                      ${asset.irrPct ? `IRR ${asset.irrPct}%` : 'Yield Accruing'}
                    </div>
                  </div>
                </div>

                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border-subtle); font-size: 0.74rem; width: 100%;">
                  <div style="flex: 1 1 120px; min-width: 0;">
                    <span style="color: var(--text-muted);">Invested Cost:</span>
                    <strong style="color: var(--text-secondary); margin-left: 4px; font-family: monospace;">${formatINR(asset.totalInvestedAmount)}</strong>
                  </div>
                  <div style="flex: 1 1 120px; min-width: 0;">
                    <span style="color: var(--text-muted);">Your Stake (${(psr * 100).toFixed(3)}%):</span>
                    <strong style="color: var(--accent-gold); margin-left: 4px; font-family: monospace;">${formatINR(partnerFractionalVal)}</strong>
                  </div>
                </div>

                <div style="margin-top: 10px; display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; font-size: 0.72rem; color: #ea580c;">
                  <span style="font-weight: 700;">Tap to view Asset Drill-Down &rarr;</span>
                  <span class="badge badge-verified" style="font-size: 0.62rem; flex-shrink: 0;">${asset.allocationPct}% Weight</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <!-- 4. ASSET CLASS ALLOCATION DONUT -->
        <div class="card" style="padding: 16px;">
          <div class="card-header" style="margin-bottom: 8px;">
            <h4 style="font-size: 0.95rem; color: var(--text-primary); font-weight: 800;">Asset Class Allocation</h4>
            <span class="badge badge-verified" style="font-size: 0.65rem;">Unitized NAV ₹${calcs.navPerUnit.toFixed(2)}</span>
          </div>
          ${renderAssetClassAllocationDonut(PORTFOLIO_ASSETS)}
        </div>
      `}

      <!-- ASSET DRILL-DOWN MODAL -->
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
              <span class="badge" style="background: rgba(234,88,12,0.08); font-size: 0.65rem; color: ${getAssetColor(asset.assetClass)}; font-weight: 700;">
                ${formatAssetClass(asset.assetClass)}
              </span>
              <span class="mono" style="font-size: 0.72rem; color: var(--accent-gold);">${asset.assetCode}</span>
            </div>
            <h3 style="font-size: 1.15rem; color: var(--text-primary); margin-top: 2px; font-weight: 800;">${asset.assetName}</h3>
          </div>
          <button class="modal-close" id="btn-close-drilldown">&times;</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 8px;">
          
          <!-- Partner Stake Snapshot in this Asset -->
          <div class="card highlight-gold" style="padding: 14px;">
            <span class="metric-label" style="font-size: 0.7rem; color: var(--accent-gold);">YOUR FRACTIONAL HOLDING VALUE</span>
            <div class="metric-value emerald" style="font-size: 1.4rem; margin-top: 2px; font-family: monospace;">${formatINR(partnerFractionalVal)}</div>
            <div style="display: flex; justify-content: space-between; margin-top: 8px; font-size: 0.75rem; border-top: 1px dashed var(--border-color); padding-top: 8px;">
              <div>
                <span style="color: var(--text-secondary);">Your Cost:</span>
                <strong style="font-family: monospace; margin-left: 4px;">${formatINR(partnerPrincipalInAsset)}</strong>
              </div>
              <div>
                <span style="color: var(--text-secondary);">Your Gain/Loss:</span>
                <strong style="color: ${assetGain >= 0 ? 'var(--accent-emerald)' : '#ef4444'}; font-family: monospace; margin-left: 4px;">
                  ${assetGain >= 0 ? '+' : ''}${formatINR(assetGain)}
                </strong>
              </div>
            </div>
          </div>

          <!-- Look-Through Portfolio Companies (for Artha VC) -->
          ${asset.portfolioCompanies ? `
            <div class="card" style="padding: 14px;">
              <h4 style="font-size: 0.88rem; color: var(--text-primary); font-weight: 800; margin-bottom: 8px;">Look-Through Portfolio Companies</h4>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${asset.portfolioCompanies.map(c => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; background: var(--bg-input); border-radius: 6px; font-size: 0.74rem;">
                    <div>
                      <strong style="color: var(--text-primary);">${c.name}</strong>
                      <div style="font-size: 0.65rem; color: var(--text-muted);">${c.status}</div>
                    </div>
                    <div style="text-align: right; font-family: monospace;">
                      <div style="font-weight: 700; color: var(--text-primary);">₹${c.sfoLookThroughINR.toLocaleString('en-IN')}</div>
                      <div style="font-size: 0.65rem; color: var(--accent-gold);">${c.pctOfFund}% of Fund</div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Direct Scrips List (for Equities / ETFs) -->
          ${asset.scripsList ? `
            <div class="card" style="padding: 14px;">
              <h4 style="font-size: 0.88rem; color: var(--text-primary); font-weight: 800; margin-bottom: 8px;">Underlying Securities</h4>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                ${asset.scripsList.map(s => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; background: var(--bg-input); border-radius: 6px; font-size: 0.74rem;">
                    <div>
                      <strong style="color: var(--text-primary);">${s.scrip}</strong>
                      <div style="font-size: 0.65rem; color: var(--text-muted);">${s.sector || s.type}</div>
                    </div>
                    <div style="text-align: right; font-family: monospace;">
                      <div style="font-weight: 700; color: var(--text-primary);">₹${s.val.toLocaleString('en-IN')}</div>
                      <div style="font-size: 0.65rem; color: ${s.ret >= 0 ? 'var(--accent-emerald)' : '#ef4444'}; font-weight: 700;">
                        ${s.ret >= 0 ? '+' : ''}${s.ret}%
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Valuation History Timeline -->
          <div class="card" style="padding: 14px;">
            <h4 style="font-size: 0.88rem; color: var(--text-primary); font-weight: 800; margin-bottom: 8px;">Revaluation Audit Log</h4>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${asset.historicalRevaluations.map(rev => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px; border-bottom: 1px solid var(--border-subtle); font-size: 0.72rem;">
                  <div>
                    <span class="mono" style="color: var(--accent-gold); font-weight: 700;">${formatDate(rev.date)}</span>
                    <div style="font-size: 0.66rem; color: var(--text-muted);">${rev.note}</div>
                  </div>
                  <strong class="mono" style="color: var(--text-primary);">${formatINR(rev.value)}</strong>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Notes & Terms -->
          <div style="font-size: 0.72rem; color: var(--text-secondary); background: var(--bg-input); padding: 10px; border-radius: 8px; border: 1px solid var(--border-color);">
            <strong>Exit Terms:</strong> ${asset.exitTerms}
          </div>

        </div>
      </div>
    </div>
  `;
}

function getAssetColor(assetClass) {
  switch (assetClass) {
    case 'DEBT': return '#ea580c';
    case 'UNLISTED_EQUITY': return '#8b5cf6';
    case 'LISTED_EQUITY': return '#2563eb';
    case 'COMMODITY': return '#d4af37';
    case 'REAL_ESTATE': return '#10b981';
    default: return '#64748b';
  }
}

function formatAssetClass(assetClass) {
  switch (assetClass) {
    case 'DEBT': return 'Venture Debt';
    case 'UNLISTED_EQUITY': return 'Venture Capital (Unlisted)';
    case 'LISTED_EQUITY': return 'Listed Equity';
    case 'COMMODITY': return 'Precious Metals & ETFs';
    case 'REAL_ESTATE': return 'Real Estate';
    default: return assetClass;
  }
}

export function attachPortfolioAssetsEvents() {
  // View mode switcher buttons (Table, Cards, Allocation)
  document.querySelectorAll('.btn-view-mode').forEach(btn => {
    btn.addEventListener('click', () => {
      activeViewMode = btn.getAttribute('data-mode') || 'TABLE';
      store.notify();
    });
  });

  // Category filter chips
  document.querySelectorAll('.btn-filter-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategoryFilter = btn.getAttribute('data-cat') || 'ALL';
      store.notify();
    });
  });

  // Holdings search
  const searchInput = document.getElementById('input-holdings-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      holdingsSearch = e.target.value;
      store.notify();
      setTimeout(() => {
        const renewedInput = document.getElementById('input-holdings-search');
        if (renewedInput) {
          renewedInput.focus();
          renewedInput.setSelectionRange(holdingsSearch.length, holdingsSearch.length);
        }
      }, 40);
    });
  }

  // Card click for drill-down modal
  document.querySelectorAll('.asset-card').forEach(card => {
    card.addEventListener('click', () => {
      const assetId = card.getAttribute('data-asset-id');
      store.selectedAssetId = assetId;
      store.notify();
    });
  });

  // Close drill-down modal
  document.getElementById('btn-close-drilldown')?.addEventListener('click', () => {
    store.selectedAssetId = null;
    store.notify();
  });

  document.getElementById('asset-drilldown-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'asset-drilldown-backdrop') {
      store.selectedAssetId = null;
      store.notify();
    }
  });
}
