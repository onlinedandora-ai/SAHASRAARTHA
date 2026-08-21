/**
 * Screen 1: Partner Home / Overview (Partner View)
 * 100% Light Theme (Warm Orange & Crisp White) & Mobile-Responsive Flexbox Layout
 * No dark backgrounds, no text overflow / spillage on any mobile screen.
 */

import { store } from '../state/store.js';
import { formatINR, formatUnits, formatPercent, formatDate } from '../utils/formatters.js';

export function renderPartnerPortal() {
  const user = store.currentUser;
  const calcs = store.getCalculations();
  const fy = store.selectedFiscalYear;

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
    <div class="view-section" style="padding-bottom: 24px; display: flex; flex-direction: column; gap: 14px; width: 100%; box-sizing: border-box;">
      
      <!-- Fiscal Year Selector Bar (Responsive Flexbox) -->
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; width: 100%;">
        <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
          <span style="font-size: 0.72rem; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.03em;">Period:</span>
          <div class="fy-selector-chips">
            <button class="fy-chip ${fy === 'FY2026-27' ? 'active' : ''}" data-fy="FY2026-27">FY 2026-27</button>
            <button class="fy-chip ${fy === 'FY2025-26' ? 'active' : ''}" data-fy="FY2025-26">FY 2025-26</button>
            <button class="fy-chip ${fy === 'ALL' ? 'active' : ''}" data-fy="ALL">Inception</button>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 6px;">
          <span class="badge badge-verified" style="font-size: 0.68rem;">MCA Verified</span>
          <span class="mono" style="font-size: 0.74rem; color: #ea580c; font-weight: 800;">PSR ${psrPct.toFixed(3)}%</span>
        </div>
      </div>

      <!-- ACTIVE CAPITAL CALL NOTICE BANNER (Responsive Flexbox) -->
      ${activeCall ? `
        <div class="card" style="border: 1.5px solid #fed7aa; background: #fffaf5; box-shadow: 0 4px 16px rgba(234, 88, 12, 0.06); padding: 14px;">
          <div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">
            
            <div style="display: flex; align-items: flex-start; gap: 10px; width: 100%;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: #ffedd5; display: flex; align-items: center; justify-content: center; color: #ea580c; flex-shrink: 0;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                  <span style="font-weight: 800; font-size: 0.88rem; color: #0f172a;">${activeCall.callNumber}</span>
                  <span class="badge badge-pending" style="font-size: 0.62rem;">Due: ${formatDate(activeCall.dueDate)}</span>
                </div>
                <p style="font-size: 0.76rem; color: #64748b; margin-top: 2px; line-height: 1.35; word-break: break-word;">${activeCall.purpose}</p>
              </div>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; flex-wrap: wrap; border-top: 1px dashed #fed7aa; padding-top: 8px;">
              <div style="font-size: 0.8rem; color: #475569;">
                Your Quota: <strong style="color: #ea580c; font-weight: 800;">${formatINR(partnerCallQuota)}</strong>
                ${partnerPendingTx ? ` &bull; <span class="badge badge-${partnerPendingTx.status.toLowerCase()}" style="font-size: 0.6rem;">${partnerPendingTx.status}</span>` : ''}
              </div>
              <button class="btn btn-primary btn-sm" id="btn-home-pay-call" style="padding: 6px 12px; font-size: 0.74rem;">
                ${partnerPendingTx ? 'View Receipt' : 'Upload UTR'}
              </button>
            </div>

          </div>
        </div>
      ` : ''}

      <!-- PARTNER HOLDING SUMMARY CARD (Responsive Flexbox & Light Theme) -->
      <div class="card highlight-gold" style="padding: 16px;">
        
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; gap: 8px; flex-wrap: wrap;">
          <div style="min-width: 0;">
            <span style="font-size: 0.7rem; color: #ea580c; text-transform: uppercase; font-weight: 800; letter-spacing: 0.04em;">PARTNER CAPITAL ACCOUNT</span>
            <h3 style="font-size: 1.2rem; color: #0f172a; margin-top: 2px; font-weight: 800; word-break: break-word;">${user.fullName}</h3>
          </div>
          <div style="text-align: right;">
            <span class="mono" style="font-size: 0.72rem; color: #64748b; font-weight: 600;">${user.dpin ? 'DPIN: ' + user.dpin : user.partnerId}</span>
            <div style="font-size: 0.7rem; color: #059669; font-weight: 700;">Active Partner</div>
          </div>
        </div>

        <!-- 2 Metric Boxes in Responsive Flexbox Layout -->
        <div style="display: flex; gap: 10px; flex-wrap: wrap; width: 100%;">
          
          <div style="flex: 1 1 140px; min-width: 0; background: #ffffff; padding: 12px; border-radius: 12px; border: 1px solid #ede4da; box-shadow: 0 2px 8px rgba(0,0,0,0.02); box-sizing: border-box;">
            <span class="metric-label" style="color: #64748b; font-size: 0.7rem;">Current NAV Holding</span>
            <div class="metric-value emerald" style="font-size: 1.3rem; margin-top: 2px;">${formatINR(currentPortfolioValue)}</div>
            <div class="metric-trend trend-up" style="font-size: 0.7rem;">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              +${formatPercent(absoluteReturnPct)} (${formatINR(absoluteGain, { compact: true })})
            </div>
          </div>

          <div style="flex: 1 1 140px; min-width: 0; background: #ffffff; padding: 12px; border-radius: 12px; border: 1px solid #ede4da; box-shadow: 0 2px 8px rgba(0,0,0,0.02); box-sizing: border-box;">
            <span class="metric-label" style="color: #64748b; font-size: 0.7rem;">Contributed Capital</span>
            <div class="metric-value" style="font-size: 1.3rem; margin-top: 2px; color: #0f172a;">${formatINR(totalPrincipalInvested)}</div>
            <span style="font-size: 0.68rem; color: #8c9ba5; display: block; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${formatUnits(partnerUnits)} Units @ ₹${currentNAV.toFixed(2)}</span>
          </div>

        </div>

        <div style="display: flex; justify-content: space-between; gap: 8px; margin-top: 12px; padding-top: 10px; border-top: 1px solid #ede4da; font-size: 0.76rem; flex-wrap: wrap;">
          <div>
            <span style="color: #64748b;">Ownership PSR %:</span>
            <strong style="color: #0f172a; margin-left: 4px; font-weight: 800;">${psrPct.toFixed(3)}%</strong>
          </div>
          <div>
            <span style="color: #64748b;">Total Net Payouts:</span>
            <strong style="color: #059669; margin-left: 4px; font-weight: 800;">${formatINR(partnerTotalPayouts)}</strong>
          </div>
        </div>

      </div>

      <!-- SFO LLP FUND AGGREGATES (Responsive Flexbox & Light Theme) -->
      <div class="card" style="padding: 16px;">
        <div class="card-header" style="margin-bottom: 12px;">
          <div>
            <span class="metric-label" style="color: #ea580c; font-size: 0.7rem;">LLP FUND AGGREGATES</span>
            <h4 style="color: #0f172a; margin-top: 2px; font-size: 0.98rem; font-weight: 800;">Fund Liquidity & Assets</h4>
          </div>
          <span class="mono" style="font-size: 0.76rem; color: #ea580c; font-weight: 800; background: #fff7ed; padding: 3px 8px; border-radius: 6px; border: 1px solid #fed7aa;">
            Total AUM: ${formatINR(calcs.totalGrossAssets, { compact: true })}
          </span>
        </div>

        <!-- Responsive Flexbox for 3 Aggregate Blocks -->
        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
          
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #fcf9f5; border-radius: 10px; border: 1px solid #ede4da; gap: 8px;">
            <div>
              <div style="font-size: 0.72rem; color: #475569; font-weight: 700;">Invested Portfolio</div>
              <div style="font-size: 0.68rem; color: #8c9ba5;">AIFs, Real Estate, Equities</div>
            </div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #2563eb; font-family: 'Outfit', sans-serif;">
              ${formatINR(calcs.totalAssetsMarketValue - calcs.totalLiquidAssets, { compact: true })}
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #fcf9f5; border-radius: 10px; border: 1px solid #ede4da; gap: 8px;">
            <div>
              <div style="font-size: 0.72rem; color: #475569; font-weight: 700;">Liquid Dry Powder</div>
              <div style="font-size: 0.68rem; color: #8c9ba5;">Bank & Broker Cash</div>
            </div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #059669; font-family: 'Outfit', sans-serif;">
              ${formatINR(calcs.totalLiquidAssets, { compact: true })}
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #fcf9f5; border-radius: 10px; border: 1px solid #ede4da; gap: 8px;">
            <div>
              <div style="font-size: 0.72rem; color: #475569; font-weight: 700;">Cumulative Surplus</div>
              <div style="font-size: 0.68rem; color: #8c9ba5;">+${calcs.returnOnCapitalPct.toFixed(2)}% Overall Return</div>
            </div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #ea580c; font-family: 'Outfit', sans-serif;">
              +${formatINR(calcs.accumulatedSurplus, { compact: true })}
            </div>
          </div>

        </div>
      </div>

      <!-- RECENT TRANSACTION ACTIVITY (Responsive Flexbox & Light Theme) -->
      <div class="card" style="padding: 16px;">
        <div class="card-header" style="margin-bottom: 10px;">
          <h4 style="font-size: 0.95rem; color: #0f172a; font-weight: 800;">Recent Fund Activity</h4>
          <span style="font-size: 0.68rem; color: #8c9ba5; font-weight: 600;">Live Reconciled Feed</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; width: 100%;">
          ${store.capitalTransactions.slice(0, 4).map(tx => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; background: #fcf9f5; border-radius: 10px; border: 1px solid #ede4da; font-size: 0.78rem; gap: 10px;">
              <div style="min-width: 0; flex: 1;">
                <div style="font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${tx.notes || tx.transactionType}</div>
                <div style="font-size: 0.68rem; color: #64748b; margin-top: 2px;">${formatDate(tx.paymentDate)} &bull; ${tx.paymentMode} &bull; ${tx.partnerName}</div>
              </div>
              <div style="text-align: right; flex-shrink: 0;">
                <div style="font-weight: 800; color: ${tx.transactionType === 'PROFIT_DISTRIBUTION' ? '#059669' : '#ea580c'}; font-size: 0.92rem;">
                  ${formatINR(tx.amount)}
                </div>
                <span class="badge badge-${tx.status.toLowerCase()}" style="font-size: 0.6rem; margin-top: 2px;">${tx.status}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

export function attachPartnerEvents() {
  // Fiscal year switch
  document.querySelectorAll('.fy-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const fy = btn.getAttribute('data-fy');
      store.setFiscalYear(fy);
    });
  });

  // Pay active call
  const payBtn = document.getElementById('btn-home-pay-call');
  if (payBtn) {
    payBtn.addEventListener('click', () => {
      store.openModal('CAPITAL_CALL');
    });
  }
}
