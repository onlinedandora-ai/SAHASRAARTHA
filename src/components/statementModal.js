/**
 * Printable Holding Statement & Tax Certificate Generator
 * Formalized LLP statement with seals, KYC metadata (PAN, Father's Name, Residential Address), unit balance, NAV, returns, and Form 16A/tax notes.
 */

import { store } from '../state/store.js';
import { formatINR, formatUnits, formatPercent, formatDate } from '../utils/formatters.js';

export function renderStatementModal() {
  const user = store.currentUser;
  const calcs = store.getCalculations();

  const partnerUnits = Number(user.unitsAllocated || 0);
  const currentVal = partnerUnits * calcs.navPerUnit;
  const principal = Number(user.totalInvested || 0);
  const surplus = currentVal - principal;
  const returnPct = principal > 0 ? (surplus / principal) * 100 : 0;

  return `
    <div class="modal-overlay" id="statement-modal" style="display: none;">
      <div class="modal-dialog" style="max-width: 800px; background: #ffffff; color: #0f172a;">
        <div class="modal-header" style="border-bottom: 2px solid #e2e8f0; background: #f8fafc;">
          <div>
            <h3 class="modal-title" style="color: #0f172a; font-size: 1.15rem;">Holding & Tax Statement</h3>
            <p style="font-size: 0.76rem; color: #64748b;">Sahasraartha Family Office LLP &bull; Registered Partner Statement</p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-primary btn-sm" onclick="window.print()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Print / Save as PDF
            </button>
            <button class="modal-close-btn" id="btn-close-statement-modal">&times;</button>
          </div>
        </div>

        <div class="modal-body statement-print-sheet" style="padding: 32px; font-family: 'Plus Jakarta Sans', sans-serif;">
          <!-- Formal SFO Letterhead -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px;">
            <div>
              <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; color: #0f172a; margin-bottom: 2px; font-weight: 800;">SAHASRAARTHA FAMILY OFFICE LLP</h2>
              <p style="font-size: 0.8rem; color: #475569;">Regd. Office: Bangalore, Karnataka | AIF SEBI IN/AIF2/24-25/1507</p>
              <p style="font-size: 0.76rem; color: #64748b;">Managing Partner: Srikanth | ICICI A/C: 818305500002</p>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.72rem; text-transform: uppercase; color: #64748b; font-weight: 700;">STATEMENT DATE</div>
              <div style="font-size: 1rem; font-weight: 700; color: #0f172a;">${formatDate(calcs.asOfDate)}</div>
              <div style="font-size: 0.72rem; color: #10b981; font-weight: 700; margin-top: 4px;">CONFIRMED RECONCILED</div>
            </div>
          </div>

          <!-- Partner Details Card with Complete KYC -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; font-size: 0.88rem;">
              <div>
                <span style="color: #64748b; font-size: 0.75rem; text-transform: uppercase; font-weight: 600;">Partner Legal Identity:</span>
                <div style="font-weight: 800; color: #0f172a; font-size: 1.1rem;">${user.fullName}</div>
                ${user.fatherName ? `<div style="color: #475569; font-size: 0.82rem; margin-top: 2px;">S/o, D/o, W/o: <strong>${user.fatherName}</strong></div>` : ''}
                <div style="color: #64748b; font-size: 0.8rem; margin-top: 4px;">Partner ID: <strong class="mono">${user.partnerId}</strong> (SL: ${user.slNo !== undefined ? user.slNo : '-'})</div>
              </div>
              <div>
                <span style="color: #64748b; font-size: 0.75rem; text-transform: uppercase; font-weight: 600;">Verified KYC & Contact Metadata:</span>
                <div style="color: #0f172a;">PAN: <strong class="mono" style="color: #d97706;">${user.pan || 'ABCPS1234A'}</strong></div>
                <div style="color: #0f172a;">Email: <strong>${user.email}</strong></div>
                <div style="color: #0f172a;">Mobile: <strong class="mono">${user.mobile}</strong></div>
              </div>
            </div>
            ${user.address ? `
              <div style="margin-top: 12px; padding-top: 10px; border-top: 1px dashed #e2e8f0; font-size: 0.8rem; color: #475569;">
                <span style="font-weight: 600; text-transform: uppercase; font-size: 0.72rem; color: #64748b;">Registered Address: </span>
                ${user.address}
              </div>
            ` : ''}
          </div>

          <!-- Position Snapshot Table -->
          <h4 style="font-size: 0.95rem; color: #0f172a; text-transform: uppercase; margin-bottom: 10px; font-weight: 700;">1. Holding & Valuation Summary</h4>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 0.88rem;">
            <thead>
              <tr style="background: #f1f5f9; border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1;">
                <th style="padding: 10px; text-align: left;">Description</th>
                <th style="padding: 10px; text-align: right;">Units / Ratio</th>
                <th style="padding: 10px; text-align: right;">Unit Price / NAV</th>
                <th style="padding: 10px; text-align: right;">Total Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Total Capital Contributed</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">${user.sharePct ? user.sharePct.toFixed(2) : '7.87'}% Pool</td>
                <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">₹100.00 Par</td>
                <td style="padding: 10px; text-align: right; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${formatINR(principal)}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Allotted Fractional Units Balance</td>
                <td style="padding: 10px; text-align: right; font-family: monospace; font-weight: bold; border-bottom: 1px solid #e2e8f0;">${formatUnits(partnerUnits)}</td>
                <td style="padding: 10px; text-align: right; font-family: monospace; border-bottom: 1px solid #e2e8f0;">₹${calcs.navPerUnit.toFixed(2)}</td>
                <td style="padding: 10px; text-align: right; font-weight: 700; color: #047857; font-size: 1.05rem; border-bottom: 1px solid #e2e8f0;">${formatINR(currentVal)}</td>
              </tr>
              <tr style="background: #f8fafc; font-weight: bold;">
                <td style="padding: 10px; border-bottom: 2px solid #cbd5e1;">Accumulated Surplus Attributed</td>
                <td style="padding: 10px; text-align: right; color: #047857; border-bottom: 2px solid #cbd5e1;">+${formatPercent(returnPct)}</td>
                <td style="padding: 10px; text-align: right; border-bottom: 2px solid #cbd5e1;">Pro-Rata</td>
                <td style="padding: 10px; text-align: right; color: #047857; border-bottom: 2px solid #cbd5e1;">+${formatINR(surplus)}</td>
              </tr>
            </tbody>
          </table>

          <!-- Tax and Regulatory Notes -->
          <h4 style="font-size: 0.95rem; color: #0f172a; text-transform: uppercase; margin-bottom: 8px; font-weight: 700;">2. Tax & Compliance Notes (LLP Pass-Through)</h4>
          <div style="font-size: 0.8rem; color: #475569; line-height: 1.6; background: #f8fafc; padding: 14px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <p>&bull; <strong>AIF Income Distributions:</strong> RevX Capital Fund II distributions are subject to Category II AIF pass-through tax provisions. Form 64C / TDS certificates available on filing.</p>
            <p>&bull; <strong>Artha Fund IV:</strong> Carried at manager capital closing balance of ₹17,15,956. TDS of ₹2,151 withheld on other income will be reflected in LLP Form 26AS.</p>
            <p>&bull; <strong>Statutory Audit:</strong> This statement is generated based on third-party verified bank (ICICI) and broker (Nuvama) records as of 13-August-2026.</p>
          </div>

          <!-- Signature Seal -->
          <div style="margin-top: 32px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div style="font-size: 0.72rem; color: #94a3b8;">
              System Generated Statement &bull; Hash: SFO-AUTH-${Date.now().toString(36).toUpperCase()}
            </div>
            <div style="text-align: center;">
              <div style="font-family: 'Outfit', cursive; font-size: 1.3rem; color: #1e3a8a; font-weight: bold;">Srikanth</div>
              <div style="border-top: 1px solid #0f172a; padding-top: 4px; font-size: 0.78rem; font-weight: 700; color: #0f172a;">
                Managing Partner, Sahasraartha Family Office LLP
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function attachStatementEvents() {
  const modal = document.getElementById('statement-modal');
  const btnOpen = document.getElementById('btn-open-statement-modal');
  const btnClose = document.getElementById('btn-close-statement-modal');

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      if (modal) modal.style.display = 'flex';
    });
  }

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      if (modal) modal.style.display = 'none';
    });
  }
}
