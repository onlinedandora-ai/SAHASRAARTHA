/**
 * Executive Director / Committee Macro View & Financial Analytics
 * Comprehensive Balance Sheet, P&L, Artha Look-Through & Fund Flow Flywheel
 */

import { store } from '../state/store.js';
import { 
  HEADLINE_POSITION, 
  SURPLUS_DRIVERS, 
  MASTER_ACCOUNTS_RECONCILIATION, 
  ARTHA_LOOKTHROUGH, 
  REVISED_BALANCE_SHEET, 
  PROFIT_AND_LOSS_STATEMENT, 
  FUND_FLOW_FLYWHEEL 
} from '../data/sfo_data.js';
import { formatINR, formatUnits, formatPercent, formatDate } from '../utils/formatters.js';
import { renderAssetAllocationDonut, renderNAVTrajectoryChart } from './charts.js';

export function renderCommitteeView() {
  const calcs = store.getCalculations();

  return `
    <div class="view-section">
      <!-- Section Header -->
      <div class="section-header">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <span class="role-tag role-committee">Working Committee & Macro Analytics</span>
            <span class="mono" style="font-size: 0.8rem; color: var(--accent-emerald);">5-Way Reconciled Position</span>
          </div>
          <h2>Sahasraartha Family Office Macro Analytics</h2>
          <p>Consolidated Balance Sheet, Performance Drivers & Private Venture Look-Through</p>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary btn-sm" onclick="window.print()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print Macro Summary
          </button>
        </div>
      </div>

      <!-- Headline Position & NAV Trajectory -->
      <div class="grid-2">
        <div class="card highlight-gold">
          <div class="card-header">
            <div>
              <span class="metric-label" style="color: var(--accent-gold);">HEADLINE POSITION</span>
              <h3 class="card-title" style="margin-top: 4px;">Audited Portfolio Valuation</h3>
            </div>
            <span class="badge badge-verified">Reconciled to Aug 2026</span>
          </div>

          <div class="grid-2">
            <div class="metric-card">
              <span class="metric-label">Total Assets</span>
              <span class="metric-value gold">${formatINR(HEADLINE_POSITION.asOf13Aug2026.totalAssets)}</span>
              <span style="font-size: 0.76rem; color: var(--text-muted);">Vs ₹1.56 Cr (31-Mar-2026)</span>
            </div>

            <div class="metric-card">
              <span class="metric-label">Contributor Funds</span>
              <span class="metric-value">${formatINR(HEADLINE_POSITION.asOf13Aug2026.contributorFunds)}</span>
              <span style="font-size: 0.76rem; color: var(--text-muted);">28 Partners Wishlisted</span>
            </div>

            <div class="metric-card">
              <span class="metric-label">Accumulated Surplus</span>
              <span class="metric-value emerald">${formatINR(HEADLINE_POSITION.asOf13Aug2026.accumulatedSurplus)}</span>
              <span style="font-size: 0.76rem; color: var(--text-muted);">+${formatINR(HEADLINE_POSITION.asOf13Aug2026.accumulatedSurplus - HEADLINE_POSITION.asOf31Mar2026.accumulatedSurplus)} growth in FY27</span>
            </div>

            <div class="metric-card">
              <span class="metric-label">Return on Capital</span>
              <span class="metric-value emerald mono">+${HEADLINE_POSITION.asOf13Aug2026.returnOnCapitalPct.toFixed(2)}%</span>
              <div class="metric-trend trend-up">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
                Up from +2.31% at FY26
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">NAV Growth Trajectory (Inception to Aug '26)</h3>
              <p class="card-subtitle">Fractional Unit NAV Index Progression (Base ₹100.00)</p>
            </div>
          </div>
          ${renderNAVTrajectoryChart()}
        </div>
      </div>

      <!-- Surplus Drivers Breakdown Table -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">What Drove the Surplus (Inception to 13-Aug-2026)</h3>
            <p class="card-subtitle">Attribution analysis of all cash distributions, gains, fee deductions and MTM movements</p>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Component / Revenue Stream</th>
                <th class="text-right">Amount (INR)</th>
                <th>Category</th>
                <th>Basis & Audit Source</th>
              </tr>
            </thead>
            <tbody>
              ${SURPLUS_DRIVERS.map(d => `
                <tr>
                  <td><strong>${d.component}</strong></td>
                  <td class="text-right mono" style="font-weight: 700; color: ${d.amount >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)'};">
                    ${d.amount >= 0 ? '+' : ''}${formatINR(d.amount)}
                  </td>
                  <td>
                    <span class="badge ${d.type === 'income' || d.type === 'gain' ? 'badge-approved' : d.type === 'loss' || d.type === 'expense' ? 'badge-rejected' : 'badge-category'}">
                      ${d.type.toUpperCase()}
                    </span>
                  </td>
                  <td style="font-size: 0.8rem; color: var(--text-secondary);">${d.basis}</td>
                </tr>
              `).join('')}
              <tr style="background: rgba(245, 158, 11, 0.08); font-weight: bold;">
                <td><strong>TOTAL ACCUMULATED SURPLUS</strong></td>
                <td class="text-right mono" style="color: var(--accent-gold); font-size: 1.05rem;">
                  ${formatINR(HEADLINE_POSITION.asOf13Aug2026.accumulatedSurplus)}
                </td>
                <td><span class="badge badge-verified">Ties to Balance Sheet</span></td>
                <td>Reconciled 100% against Bank & Broker Closings</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- The SFO Flywheel Demonstration -->
      <div class="card highlight-gold">
        <div class="card-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h3 class="card-title" style="color: var(--accent-gold);">${FUND_FLOW_FLYWHEEL.title}</h3>
              <span class="badge badge-approved">Demonstrated, Not Projected</span>
            </div>
            <p class="card-subtitle">${FUND_FLOW_FLYWHEEL.summary}</p>
          </div>
          <span class="badge badge-verified" style="font-size: 0.85rem;">13.3% Annualized Yield</span>
        </div>

        <div class="grid-2" style="margin-top: 10px;">
          <div>
            <h4 style="font-size: 0.9rem; color: var(--accent-emerald); text-transform: uppercase; margin-bottom: 10px;">Sources of Inflows (₹2.23 Cr Total)</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${FUND_FLOW_FLYWHEEL.sources.map(s => `
                <div style="display: flex; justify-content: space-between; font-size: 0.84rem; padding: 6px 10px; background: var(--bg-primary); border-radius: 4px;">
                  <span style="color: var(--text-secondary);">${s.item}</span>
                  <strong class="mono" style="color: var(--accent-emerald);">${formatINR(s.amount)}</strong>
                </div>
              `).join('')}
            </div>
          </div>

          <div>
            <h4 style="font-size: 0.9rem; color: #f59e0b; text-transform: uppercase; margin-bottom: 10px;">Uses & Deployments (₹2.20 Cr Total)</h4>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${FUND_FLOW_FLYWHEEL.uses.map(u => `
                <div style="display: flex; justify-content: space-between; font-size: 0.84rem; padding: 6px 10px; background: var(--bg-primary); border-radius: 4px;">
                  <span style="color: var(--text-secondary);">${u.item}</span>
                  <strong class="mono" style="color: var(--accent-blue);">${formatINR(u.amount)}</strong>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Artha Look-Through Startup Portfolio Analysis -->
      <div class="card">
        <div class="card-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h3 class="card-title">Artha Fund IV — Private Venture Look-Through (Folio 330035)</h3>
              <span class="badge badge-category">SEBI Reg: IN/AIF2/24-25/1507</span>
            </div>
            <p class="card-subtitle">SFO owns 0.3381% of underlying startup assets across 7 portfolio companies</p>
          </div>
          <div class="metric-card" style="text-align: right;">
            <span class="metric-label">Capital Drawn / Comm.</span>
            <span class="mono" style="font-weight: 700; color: var(--accent-gold);">₹20.00 L / ₹1.00 Cr</span>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Portfolio Company</th>
                <th class="text-right">Fund Deployed (Cr)</th>
                <th class="text-right">Fund Carrying Value (Cr)</th>
                <th class="text-right">Multiple</th>
                <th class="text-right">% of Fund</th>
                <th class="text-right">SFO Look-Through (INR)</th>
                <th>Status & Audit Commentary</th>
              </tr>
            </thead>
            <tbody>
              ${ARTHA_LOOKTHROUGH.portfolioCompanies.map(c => `
                <tr>
                  <td><strong>${c.name}</strong></td>
                  <td class="text-right mono">₹${c.deployedCr.toFixed(3)} Cr</td>
                  <td class="text-right mono font-weight-bold" style="color: ${c.multiple > 1 ? 'var(--accent-emerald)' : c.multiple === 0 ? 'var(--accent-rose)' : 'var(--text-primary)'};">
                    ₹${c.heldValueCr.toFixed(3)} Cr
                  </td>
                  <td class="text-right mono font-weight-bold" style="color: ${c.multiple > 1 ? 'var(--accent-emerald)' : c.multiple === 0 ? 'var(--accent-rose)' : 'var(--text-secondary)'};">
                    ${c.multiple.toFixed(2)}x
                  </td>
                  <td class="text-right mono">${c.pctOfFund.toFixed(1)}%</td>
                  <td class="text-right mono" style="color: var(--accent-gold); font-weight: 700;">${formatINR(c.sfoLookThroughINR)}</td>
                  <td><span class="badge ${c.multiple > 1 ? 'badge-approved' : c.multiple === 0 ? 'badge-rejected' : 'badge-verified'}">${c.status}</span></td>
                </tr>
              `).join('')}
              <tr style="background: rgba(255, 255, 255, 0.03); font-weight: bold;">
                <td><strong>TOTAL PORTFOLIO LOOK-THROUGH</strong></td>
                <td class="text-right mono">₹31.20 Cr</td>
                <td class="text-right mono" style="color: var(--accent-emerald);">₹46.70 Cr</td>
                <td class="text-right mono">1.50x</td>
                <td class="text-right mono">100.0%</td>
                <td class="text-right mono" style="color: var(--accent-gold); font-size: 1rem;">₹9,73,942</td>
                <td>Plus ₹7.42L Undeployed Liquid Funds at Manager</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin-top: 16px; padding: 14px; background: var(--bg-primary); border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.82rem; color: var(--text-secondary);">
          <strong style="color: var(--accent-gold);">Key Valuation Discipline Note:</strong> The 1.50x manager slide is on deployed capital into companies. On capital drawn by SFO (bearing fees and undeployed cash), the effective multiple is <strong>1.16x</strong>. The official accounts carry Artha at <strong>₹17,15,956</strong> (at cost less fees/diminution) until formalized in audited statutory accounts.
        </div>
      </div>

      <!-- Consolidated Balance Sheet & P&L Tables -->
      <div class="grid-2">
        <!-- Balance Sheet -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Consolidated Balance Sheet</h3>
              <p class="card-subtitle">As of 13-August-2026</p>
            </div>
            <span class="badge badge-verified">Balanced</span>
          </div>

          <div style="margin-bottom: 12px; font-weight: 700; color: var(--accent-blue); font-size: 0.84rem; text-transform: uppercase;">Assets (Market Value)</div>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px;">
            ${REVISED_BALANCE_SHEET.assets.map(a => `
              <div style="display: flex; justify-content: space-between; font-size: 0.84rem; padding-bottom: 6px; border-bottom: 1px solid var(--border-subtle);">
                <span style="color: var(--text-secondary);">${a.name}</span>
                <strong class="mono">${formatINR(a.marketValue)}</strong>
              </div>
            `).join('')}
            <div style="display: flex; justify-content: space-between; font-size: 0.95rem; font-weight: 700; color: var(--accent-gold); padding-top: 4px;">
              <span>TOTAL ASSETS</span>
              <span class="mono">${formatINR(REVISED_BALANCE_SHEET.totalAssetsMarket)}</span>
            </div>
          </div>

          <div style="margin-bottom: 12px; font-weight: 700; color: var(--accent-emerald); font-size: 0.84rem; text-transform: uppercase;">Funds Employed</div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${REVISED_BALANCE_SHEET.fundsEmployed.map(f => `
              <div style="display: flex; justify-content: space-between; font-size: 0.84rem; padding-bottom: 6px; border-bottom: 1px solid var(--border-subtle);">
                <span style="color: var(--text-secondary);">${f.name}</span>
                <strong class="mono">${formatINR(f.amount)}</strong>
              </div>
            `).join('')}
            <div style="display: flex; justify-content: space-between; font-size: 0.95rem; font-weight: 700; color: var(--accent-emerald); padding-top: 4px;">
              <span>TOTAL FUNDS EMPLOYED</span>
              <span class="mono">${formatINR(REVISED_BALANCE_SHEET.totalFundsEmployed)}</span>
            </div>
          </div>
        </div>

        <!-- Profit & Loss -->
        <div class="card">
          <div class="card-header">
            <div>
              <h3 class="card-title">Profit & Loss Statement</h3>
              <p class="card-subtitle">Inception (14-May-2025) to 13-Aug-2026</p>
            </div>
            <span class="badge badge-approved">+₹11.78L Surplus</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.84rem; padding: 6px 10px; background: var(--bg-primary); border-radius: 4px;">
              <span>Total Income & Distributions</span>
              <strong class="mono" style="color: var(--accent-emerald);">${formatINR(PROFIT_AND_LOSS_STATEMENT.totalIncome.total)}</strong>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 0.84rem; padding: 6px 10px; background: var(--bg-primary); border-radius: 4px;">
              <span>Total Expenses, Fees & Diminution</span>
              <strong class="mono" style="color: var(--accent-rose);">${formatINR(PROFIT_AND_LOSS_STATEMENT.totalExpenses.total)}</strong>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 0.84rem; padding: 6px 10px; background: var(--bg-primary); border-radius: 4px;">
              <span>Net Realised Result</span>
              <strong class="mono" style="color: var(--accent-blue);">${formatINR(PROFIT_AND_LOSS_STATEMENT.netRealisedResult.total)}</strong>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 0.84rem; padding: 6px 10px; background: var(--bg-primary); border-radius: 4px;">
              <span>Unrealised MTM on Securities Held</span>
              <strong class="mono" style="color: var(--accent-emerald);">${formatINR(PROFIT_AND_LOSS_STATEMENT.unrealisedMovement.total)}</strong>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 0.84rem; padding: 6px 10px; background: var(--bg-primary); border-radius: 4px;">
              <span>Residual Reconciled Balance</span>
              <strong class="mono">${formatINR(PROFIT_AND_LOSS_STATEMENT.residualReconcile.total)}</strong>
            </div>

            <div style="margin-top: 10px; padding: 12px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: var(--accent-emerald); font-size: 1rem;">CUMULATIVE NET SURPLUS</strong>
                <div style="font-size: 0.76rem; color: var(--text-secondary);">Pro-rata credited across all 28 partners</div>
              </div>
              <strong class="mono" style="font-size: 1.3rem; color: var(--accent-emerald);">${formatINR(PROFIT_AND_LOSS_STATEMENT.cumulativeSurplus)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
