/**
 * Screen 1: Partner Home / Executive Overview (Opening Screen)
 * Displays official reconciled position matching statutory LLP records:
 * - Headline Position 3-Period Historical Comparison (13-Aug-2026 vs 31-Mar-2026 vs 07-Jan-2026)
 * - What Drove the Surplus Breakdown (Itemized 11 Reconciliation Lines totaling ₹11,77,860)
 * - Super Admin (Srikanth) Executive Controls & Partner Registry Switcher
 * - Individual Partner Capital Account Holding & Yield Summary
 * - 5 Statutory Audit Notes (Artha Fund IV SEBI Reg, Dry Powder ₹15.07L, Contributor Equity ₹1.525 Cr)
 */

import { store } from '../state/store.js';
import { SFO_METADATA, HEADLINE_POSITION, SURPLUS_DRIVERS, OPEN_ITEMS_AND_SOURCES } from '../data/sfo_data.js';
import { formatINR, formatUnits, formatPercent, formatDate } from '../utils/formatters.js';

export function renderPartnerPortal() {
  const user = store.currentUser;
  const calcs = store.getCalculations();
  const fy = store.selectedFiscalYear;
  const isSuperAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.partnerId === 'SH-SA-001';

  // Individual Partner Calculations
  const partnerUnits = Number(user.unitsAllocated || 0);
  const currentNAV = calcs.navPerUnit;
  const currentPortfolioValue = partnerUnits * currentNAV;
  const totalPrincipalInvested = Number(user.totalInvested || 0);
  const absoluteGain = currentPortfolioValue - totalPrincipalInvested;
  const absoluteReturnPct = totalPrincipalInvested > 0 ? (absoluteGain / totalPrincipalInvested) * 100 : 0;
  const psrPct = user.sharePct || (user.psr ? user.psr * 100 : 0);

  // Partner's share of cumulative distributions
  const partnerTotalPayouts = store.distributionEvents.reduce((sum, e) => {
    return sum + (Number(e.totalNetPayable || 0) * (psrPct / 100));
  }, 0);

  // Active Capital Call
  const activeCall = store.capitalCalls.find(c => c.status === 'ACTIVE');
  const partnerCallQuota = activeCall ? (activeCall.totalCallAmount * (psrPct / 100)) : 0;
  const partnerPendingTx = store.capitalTransactions.find(t => t.partnerId === user.partnerId && t.callId === activeCall?.callId);

  return `
    <div class="view-section" style="padding-bottom: 28px; display: flex; flex-direction: column; gap: 14px; width: 100%; box-sizing: border-box;">
      
      <!-- 1. EXECUTIVE RECONCILED POSITION HEADER -->
      <div class="card highlight-gold" style="padding: 14px 16px; background: linear-gradient(135deg, rgba(234, 88, 12, 0.08) 0%, rgba(212, 175, 55, 0.12) 100%); border: 1.5px solid rgba(212, 175, 55, 0.45);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap;">
          <div>
            <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
              <span class="badge ${isSuperAdmin ? 'badge-admin' : 'badge-verified'}" style="font-size: 0.68rem; font-weight: 800; text-transform: uppercase;">
                ${isSuperAdmin ? '👑 Super Admin / Managing Partner' : '✓ Verified LLP Account Holder'}
              </span>
              <span style="font-size: 0.7rem; color: var(--accent-gold); font-weight: 800; font-family: monospace;">MCA &bull; ${SFO_METADATA.llpPin}</span>
            </div>
            <h2 style="font-size: 1.15rem; color: var(--text-primary); font-weight: 900; margin: 4px 0 2px 0; letter-spacing: -0.01em;">
              SAHASRARTHA FAMILY OFFICE LLP
            </h2>
            <p style="font-size: 0.74rem; color: var(--text-secondary); margin: 0; line-height: 1.35;">
              Reconciled position as at <strong>13-August-2026</strong> &bull; Prepared from bank, broker and fund-manager records
            </p>
          </div>

          <!-- Quick Partner Switcher for Super Admin (Srikanth) -->
          ${isSuperAdmin ? `
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
              <label style="font-size: 0.65rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">View Partner Account:</label>
              <select id="quick-super-admin-partner-select" style="padding: 4px 8px; font-size: 0.72rem; font-weight: 700; border-radius: 8px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); outline: none; cursor: pointer; max-width: 170px;">
                ${store.partners.map(p => `
                  <option value="${p.partnerId}" ${p.partnerId === user.partnerId ? 'selected' : ''}>
                    ${p.partnerId === 'SH-SA-001' ? '★ ' : ''}${p.fullName.slice(0, 18)} (${p.sharePct}%)
                  </option>
                `).join('')}
              </select>
            </div>
          ` : `
            <div style="text-align: right;">
              <span class="mono" style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">${user.dpin ? 'DPIN: ' + user.dpin : user.partnerId}</span>
              <div style="font-size: 0.7rem; color: var(--accent-emerald); font-weight: 800;">PSR ${psrPct.toFixed(3)}%</div>
            </div>
          `}
        </div>
      </div>

      <!-- 2. HEADLINE POSITION SUMMARY TABLE (Direct from Excel Sheet) -->
      <div class="card" style="padding: 16px; border: 1.5px solid var(--border-color);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 6px;">
          <div>
            <span style="font-size: 0.7rem; color: var(--accent-gold); text-transform: uppercase; font-weight: 800; letter-spacing: 0.04em;">EXECUTIVE SUMMARY</span>
            <h3 style="font-size: 1.05rem; color: var(--text-primary); font-weight: 800; margin-top: 2px;">HEADLINE POSITION</h3>
          </div>
          <span class="badge badge-verified" style="font-size: 0.65rem;">100% Reconciled</span>
        </div>

        <div style="overflow-x: auto; -webkit-overflow-scrolling: touch; margin: 0 -4px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.76rem; min-width: 320px;">
            <thead>
              <tr style="border-bottom: 1.5px solid var(--border-color); color: var(--text-secondary); text-align: right;">
                <th style="text-align: left; padding: 6px 4px; font-weight: 800; font-size: 0.72rem;">Metric</th>
                <th style="padding: 6px 4px; font-weight: 800; color: #ea580c; font-size: 0.72rem;">13-Aug-2026</th>
                <th style="padding: 6px 4px; font-weight: 700; font-size: 0.72rem;">31-Mar-2026</th>
                <th style="padding: 6px 4px; font-weight: 700; font-size: 0.72rem;">07-Jan-2026</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 8px 4px; font-weight: 700; color: var(--text-primary);">Total Assets</td>
                <td style="padding: 8px 4px; text-align: right; font-weight: 800; color: var(--text-primary); font-family: monospace;">₹1,64,27,861</td>
                <td style="padding: 8px 4px; text-align: right; color: var(--text-secondary); font-family: monospace;">₹1,56,02,603</td>
                <td style="padding: 8px 4px; text-align: right; color: var(--text-secondary); font-family: monospace;">₹1,60,16,851</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-subtle);">
                <td style="padding: 8px 4px; font-weight: 700; color: var(--text-primary);">Contributor Funds</td>
                <td style="padding: 8px 4px; text-align: right; font-weight: 800; color: var(--text-primary); font-family: monospace;">₹1,52,50,001</td>
                <td style="padding: 8px 4px; text-align: right; color: var(--text-secondary); font-family: monospace;">₹1,52,50,001</td>
                <td style="padding: 8px 4px; text-align: right; color: var(--text-secondary); font-family: monospace;">₹1,52,50,001</td>
              </tr>
              <tr style="border-bottom: 1px solid var(--border-subtle); background: rgba(234, 88, 12, 0.04);">
                <td style="padding: 8px 4px; font-weight: 800; color: #ea580c;">Accumulated Surplus</td>
                <td style="padding: 8px 4px; text-align: right; font-weight: 800; color: #ea580c; font-family: monospace; font-size: 0.82rem;">₹11,77,860</td>
                <td style="padding: 8px 4px; text-align: right; color: var(--text-secondary); font-family: monospace;">₹3,52,602</td>
                <td style="padding: 8px 4px; text-align: right; color: var(--text-secondary); font-family: monospace;">₹7,66,850</td>
              </tr>
              <tr>
                <td style="padding: 8px 4px; font-weight: 700; color: var(--text-primary);">Return on Capital</td>
                <td style="padding: 8px 4px; text-align: right; font-weight: 800; color: var(--accent-emerald); font-family: monospace; font-size: 0.82rem;">+7.72%</td>
                <td style="padding: 8px 4px; text-align: right; color: var(--accent-emerald); font-family: monospace;">+2.31%</td>
                <td style="padding: 8px 4px; text-align: right; color: var(--accent-emerald); font-family: monospace;">+5.03%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 8px; border-top: 1px dashed var(--border-subtle); padding-top: 6px;">
          Note: Contributor funds derived from 36 bank credits (14-May to 26-May-2025). Return is cumulative not annualised.
        </div>
      </div>

      <!-- 3. WHAT DROVE THE SURPLUS (Inception to 13-Aug-2026) -->
      <div class="card" style="padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 6px; flex-wrap: wrap;">
          <div>
            <span style="font-size: 0.7rem; color: var(--accent-gold); text-transform: uppercase; font-weight: 800; letter-spacing: 0.04em;">P&amp;L RECONCILIATION</span>
            <h3 style="font-size: 1.02rem; color: var(--text-primary); font-weight: 800; margin-top: 2px;">WHAT DROVE THE SURPLUS</h3>
          </div>
          <span style="font-size: 0.82rem; font-weight: 900; color: #ea580c; background: #fff7ed; padding: 4px 10px; border-radius: 8px; border: 1px solid #fed7aa;">
            Total: +₹11,77,860
          </span>
        </div>

        <!-- 11 Surplus Drivers Itemized List -->
        <div style="display: flex; flex-direction: column; gap: 6px; width: 100%;">
          ${SURPLUS_DRIVERS.map((item, idx) => {
            const isPos = item.amount > 0;
            const isLoss = item.amount < 0;
            const amtFormatted = isLoss 
              ? `(₹${Math.abs(item.amount).toLocaleString('en-IN')})` 
              : `+₹${item.amount.toLocaleString('en-IN')}`;
            const color = isLoss ? '#ef4444' : '#10b981';
            const bg = isLoss ? 'rgba(239, 68, 68, 0.04)' : 'rgba(16, 185, 129, 0.04)';

            return `
              <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 10px; background: ${bg}; border-radius: 8px; border: 1px solid var(--border-subtle); gap: 8px;">
                <div style="flex: 1; min-width: 0;">
                  <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-primary); line-height: 1.3;">
                    ${item.component}
                  </div>
                  <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px; line-height: 1.2;">
                    ${item.basis}
                  </div>
                </div>
                <div style="font-family: monospace; font-size: 0.84rem; font-weight: 800; color: ${color}; white-space: nowrap; text-align: right;">
                  ${amtFormatted}
                </div>
              </div>
            `;
          }).join('')}

          <!-- Sub-total and Total Footer -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #fff7ed; border-radius: 10px; border: 1.5px solid #fed7aa; margin-top: 4px;">
            <div>
              <div style="font-size: 0.8rem; font-weight: 800; color: #1e293b;">Sub-Total Explained</div>
              <div style="font-size: 0.68rem; color: #64748b;">Plus Residual to Reconcile (₹19,937 &bull; 0.13%)</div>
            </div>
            <div style="font-family: monospace; font-size: 1.05rem; font-weight: 900; color: #ea580c;">
              ₹11,77,860
            </div>
          </div>
        </div>
      </div>

      <!-- 4. PARTNER CAPITAL ACCOUNT HOLDING CARD -->
      <div class="card highlight-gold" style="padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 8px; flex-wrap: wrap;">
          <div style="min-width: 0;">
            <span style="font-size: 0.7rem; color: var(--accent-gold); text-transform: uppercase; font-weight: 800; letter-spacing: 0.04em;">PARTNER CAPITAL ACCOUNT</span>
            <h3 style="font-size: 1.15rem; color: var(--text-primary); margin-top: 2px; font-weight: 800; word-break: break-word;">${user.fullName}</h3>
          </div>
          <div style="text-align: right;">
            <span class="mono" style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">${user.dpin ? 'DPIN: ' + user.dpin : user.partnerId}</span>
            <div style="font-size: 0.7rem; color: var(--accent-emerald); font-weight: 700;">Active Partner</div>
          </div>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap; width: 100%;">
          <div style="flex: 1 1 140px; min-width: 0; background: var(--bg-card); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); box-sizing: border-box;">
            <span class="metric-label" style="color: var(--text-secondary); font-size: 0.7rem;">Allocated NAV Holding</span>
            <div class="metric-value emerald" style="font-size: 1.3rem; margin-top: 2px;">${formatINR(currentPortfolioValue)}</div>
            <div class="metric-trend trend-up" style="font-size: 0.7rem;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              +${formatPercent(absoluteReturnPct)} (${formatINR(absoluteGain, { compact: true })})
            </div>
          </div>

          <div style="flex: 1 1 140px; min-width: 0; background: var(--bg-card); padding: 12px; border-radius: 12px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); box-sizing: border-box;">
            <span class="metric-label" style="color: var(--text-secondary); font-size: 0.7rem;">Contributed Capital</span>
            <div class="metric-value" style="font-size: 1.3rem; margin-top: 2px; color: var(--text-primary);">${formatINR(totalPrincipalInvested)}</div>
            <span style="font-size: 0.68rem; color: var(--text-muted); display: block; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${formatUnits(partnerUnits)} Units @ ₹${currentNAV.toFixed(2)}</span>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border-subtle); font-size: 0.76rem; flex-wrap: wrap;">
          <div>
            <span style="color: var(--text-secondary);">Ownership PSR %:</span>
            <strong style="color: var(--text-primary); margin-left: 4px; font-weight: 800;">${psrPct.toFixed(3)}%</strong>
          </div>
          <div>
            <span style="color: var(--text-secondary);">Cumulative Payouts:</span>
            <strong style="color: var(--accent-emerald); margin-left: 4px; font-weight: 800;">${formatINR(partnerTotalPayouts)}</strong>
          </div>
        </div>
      </div>

      <!-- 5. KEY AUDIT & RECONCILIATION NOTES (From Verified Sheet) -->
      <div class="card" style="padding: 16px;">
        <div class="card-header" style="margin-bottom: 10px;">
          <h4 style="font-size: 0.95rem; color: var(--text-primary); font-weight: 800;">Official Audit &amp; Reconciliation Notes</h4>
          <span style="font-size: 0.68rem; color: var(--text-muted); font-weight: 600;">Statutory Disclosures</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
          <div style="padding: 8px 10px; background: var(--bg-input); border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.72rem; color: var(--text-secondary); line-height: 1.35;">
            <strong>1. AIF Held:</strong> ARTHA FUND IV (SEBI IN/AIF2/24-25/1507), not Artha Venture Fund II.
          </div>
          <div style="padding: 8px 10px; background: var(--bg-input); border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.72rem; color: var(--text-secondary); line-height: 1.35;">
            <strong>2. Artha Valuation:</strong> Carried by Nuvama at par (₹20,00,000). Manager capital account says ₹17,15,956. Difference of ₹2,84,044 is fees and diminution.
          </div>
          <div style="padding: 8px 10px; background: var(--bg-input); border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.72rem; color: var(--text-secondary); line-height: 1.35;">
            <strong>3. Contributor Capital:</strong> All ₹1,52,50,001 is partner equity credited to partners capital on opening operational accounts.
          </div>
          <div style="padding: 8px 10px; background: var(--bg-input); border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.72rem; color: var(--text-secondary); line-height: 1.35;">
            <strong>4. Dry Powder Strategy:</strong> ₹15,07,071 held at broker cash ledger. Nifty ~2% pullback avoided ~₹30,000 MTM loss.
          </div>
          <div style="padding: 8px 10px; background: var(--bg-input); border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.72rem; color: var(--text-secondary); line-height: 1.35;">
            <strong>5. Artha NAV/Unit:</strong> Statement quotes NAV ₹102.88 yet closing is ₹17,15,955.80 (₹85.80/unit). Line-item build-up supports the lower value.
          </div>
        </div>
      </div>

      <!-- 6. ACTIVE CAPITAL CALL NOTICE (If Active) -->
      ${activeCall ? `
        <div class="card" style="border: 1.5px solid rgba(212, 175, 55, 0.4); background: var(--grad-gold-subtle); padding: 14px;">
          <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
            <div style="display: flex; align-items: flex-start; gap: 10px; width: 100%;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(212, 175, 55, 0.15); display: flex; align-items: center; justify-content: center; color: var(--accent-gold); flex-shrink: 0;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                  <span style="font-weight: 800; font-size: 0.88rem; color: var(--text-primary);">${activeCall.callNumber}</span>
                  <span class="badge badge-pending" style="font-size: 0.62rem;">Due: ${formatDate(activeCall.dueDate)}</span>
                </div>
                <p style="font-size: 0.76rem; color: var(--text-muted); margin-top: 2px; line-height: 1.35; word-break: break-word;">${activeCall.purpose}</p>
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; border-top: 1px dashed var(--border-color); padding-top: 8px;">
              <div style="font-size: 0.8rem; color: var(--text-secondary);">
                Your Quota: <strong style="color: var(--accent-gold); font-weight: 800;">${formatINR(partnerCallQuota)}</strong>
                ${partnerPendingTx ? ` &bull; <span class="badge badge-${partnerPendingTx.status.toLowerCase()}" style="font-size: 0.6rem;">${partnerPendingTx.status}</span>` : ''}
              </div>
              <button class="btn btn-primary btn-sm" id="btn-home-pay-call" style="padding: 6px 12px; font-size: 0.74rem;">
                ${partnerPendingTx ? 'View Receipt' : 'Upload UTR'}
              </button>
            </div>
          </div>
        </div>
      ` : ''}

    </div>
  `;
}

export function attachPartnerEvents() {
  // Super Admin Partner Account Quick Switcher
  document.getElementById('quick-super-admin-partner-select')?.addEventListener('change', (e) => {
    const partnerId = e.target.value;
    store.setCurrentUser(partnerId);
  });

  // Pay active call
  const payBtn = document.getElementById('btn-home-pay-call');
  if (payBtn) {
    payBtn.addEventListener('click', () => {
      store.openModal('CAPITAL_CALL');
    });
  }
}
