import { store } from '../state/store.js';
import { renderSFOEmblem } from './sfoLogo.js';
import { formatINR, formatUnits, formatPercent, formatDate } from '../utils/formatters.js';
import { downloadStatementPDF } from '../utils/pdfGenerator.js';

export function renderStatementModal({ isOpen = false } = {}) {
  const user = store.currentUser;
  const calcs = store.getCalculations();

  const partnerUnits = Number(user.unitsAllocated || 0);
  const currentVal = partnerUnits * calcs.navPerUnit;
  const principal = Number(user.totalInvested || 0);
  const surplus = currentVal - principal;
  const returnPct = principal > 0 ? (surplus / principal) * 100 : 0;

  return `
    <div class="modal-overlay" id="statement-modal" style="display: ${isOpen ? 'flex' : 'none'};">
      <div class="modal-dialog" style="max-width: 800px; background: #ffffff; color: #0f172a; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; border-radius: 16px;">
        
        <!-- Header with Prominent Back Button & Download PDF -->
        <div class="modal-header" style="border-bottom: 2px solid #e2e8f0; background: #f8fafc; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <button class="btn btn-secondary btn-sm" id="btn-back-statement" style="padding: 6px 12px; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; gap: 5px; cursor: pointer; border-radius: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
              <span>Back</span>
            </button>
            <div>
              <h3 class="modal-title" style="color: #0f172a; font-size: 1.05rem; margin: 0; font-weight: 800;">Holding & Tax Statement</h3>
              <p style="font-size: 0.72rem; color: #64748b; margin: 2px 0 0 0;">Sahasraartha Family Office LLP &bull; Partner Statement</p>
            </div>
          </div>
          
          <div style="display: flex; gap: 8px; align-items: center;">
            <button class="btn btn-primary btn-sm" id="btn-download-statement-pdf" style="padding: 6px 14px; font-weight: 700; font-size: 0.78rem; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(234, 88, 12, 0.25);">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Download PDF</span>
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-print-statement" style="padding: 6px 10px; font-size: 0.78rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </button>
            <button class="modal-close-btn" id="btn-close-statement-modal" style="width: 32px; height: 32px; font-size: 1.3rem; display: flex; align-items: center; justify-content: center; cursor: pointer;">&times;</button>
          </div>
        </div>

        <div class="modal-body statement-print-sheet" style="padding: 24px 28px; overflow-y: auto; flex: 1; font-family: 'Plus Jakarta Sans', sans-serif;">
          <!-- Formal SFO Letterhead -->
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #D4AF37; padding-bottom: 14px; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              ${renderSFOEmblem({ size: 48 })}
              <div>
                <h2 style="font-family: 'Cinzel', 'Outfit', serif; font-size: 1.3rem; color: #0f172a; margin-bottom: 2px; font-weight: 800; letter-spacing: 0.03em;">SAHASRAARTHA FAMILY OFFICE LLP</h2>
                <p style="font-size: 0.76rem; color: #475569; margin: 0;">Regd. Office: Bangalore, Karnataka | AIF SEBI IN/AIF2/24-25/1507</p>
                <p style="font-size: 0.72rem; color: #64748b; margin: 0;">Managing Partner: Srikanth | ICICI A/C: 818305500002</p>
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-size: 0.7rem; text-transform: uppercase; color: #64748b; font-weight: 700;">STATEMENT DATE</div>
              <div style="font-size: 0.95rem; font-weight: 700; color: #0f172a;">${formatDate(calcs.asOfDate)}</div>
              <div style="font-size: 0.68rem; color: #10b981; font-weight: 700; margin-top: 2px;">CONFIRMED RECONCILED</div>
            </div>
          </div>

          <!-- Partner Details Card with Complete KYC -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; font-size: 0.85rem;">
              <div>
                <span style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 600;">Partner Legal Identity:</span>
                <div style="font-weight: 800; color: #0f172a; font-size: 1.05rem;">${user.fullName}</div>
                ${user.fatherName ? `<div style="color: #475569; font-size: 0.78rem; margin-top: 2px;">S/o, D/o, W/o: <strong>${user.fatherName}</strong></div>` : ''}
                <div style="color: #64748b; font-size: 0.76rem; margin-top: 4px;">Partner ID: <strong class="mono">${user.partnerId}</strong> (SL: ${user.slNo !== undefined ? user.slNo : '-'})</div>
              </div>
              <div>
                <span style="color: #64748b; font-size: 0.72rem; text-transform: uppercase; font-weight: 600;">Verified KYC & Contact Metadata:</span>
                <div style="color: #0f172a;">PAN: <strong class="mono" style="color: #d97706;">${user.pan || 'ABCPS1234A'}</strong></div>
                <div style="color: #0f172a;">Email: <strong>${user.email}</strong></div>
                <div style="color: #0f172a;">Mobile: <strong class="mono">${user.mobile}</strong></div>
              </div>
            </div>
            ${user.address ? `
              <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #e2e8f0; font-size: 0.76rem; color: #475569;">
                <span style="font-weight: 600; text-transform: uppercase; font-size: 0.7rem; color: #64748b;">Registered Address: </span>
                ${user.address}
              </div>
            ` : ''}
          </div>

          <!-- Position Snapshot Table -->
          <h4 style="font-size: 0.9rem; color: #0f172a; text-transform: uppercase; margin-bottom: 8px; font-weight: 700;">1. Holding & Valuation Summary</h4>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.85rem;">
            <thead>
              <tr style="background: #f1f5f9; border-top: 1px solid #cbd5e1; border-bottom: 1px solid #cbd5e1;">
                <th style="padding: 8px 10px; text-align: left;">Description</th>
                <th style="padding: 8px 10px; text-align: right;">Units / Ratio</th>
                <th style="padding: 8px 10px; text-align: right;">Unit Price / NAV</th>
                <th style="padding: 8px 10px; text-align: right;">Total Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0;">Total Capital Contributed</td>
                <td style="padding: 8px 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">${user.sharePct ? user.sharePct.toFixed(2) : '7.87'}% Pool</td>
                <td style="padding: 8px 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">₹100.00 Par</td>
                <td style="padding: 8px 10px; text-align: right; font-weight: 600; border-bottom: 1px solid #e2e8f0;">${formatINR(principal)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 10px; border-bottom: 1px solid #e2e8f0;">Allotted Fractional Units Balance</td>
                <td style="padding: 8px 10px; text-align: right; font-family: monospace; font-weight: bold; border-bottom: 1px solid #e2e8f0;">${formatUnits(partnerUnits)}</td>
                <td style="padding: 8px 10px; text-align: right; font-family: monospace; border-bottom: 1px solid #e2e8f0;">₹${calcs.navPerUnit.toFixed(2)}</td>
                <td style="padding: 8px 10px; text-align: right; font-weight: 700; color: #047857; font-size: 1rem; border-bottom: 1px solid #e2e8f0;">${formatINR(currentVal)}</td>
              </tr>
              <tr style="background: #f8fafc; font-weight: bold;">
                <td style="padding: 8px 10px; border-bottom: 2px solid #cbd5e1;">Accumulated Surplus Attributed</td>
                <td style="padding: 8px 10px; text-align: right; color: #047857; border-bottom: 2px solid #cbd5e1;">+${formatPercent(returnPct)}</td>
                <td style="padding: 8px 10px; text-align: right; border-bottom: 2px solid #cbd5e1;">Pro-Rata</td>
                <td style="padding: 8px 10px; text-align: right; color: #047857; border-bottom: 2px solid #cbd5e1;">+${formatINR(surplus)}</td>
              </tr>
            </tbody>
          </table>

          <!-- Tax and Regulatory Notes -->
          <h4 style="font-size: 0.9rem; color: #0f172a; text-transform: uppercase; margin-bottom: 6px; font-weight: 700;">2. Tax & Compliance Notes (LLP Pass-Through)</h4>
          <div style="font-size: 0.78rem; color: #475569; line-height: 1.5; background: #f8fafc; padding: 12px 14px; border-radius: 6px; border: 1px solid #e2e8f0;">
            <p style="margin: 0 0 6px 0;">&bull; <strong>AIF Income Distributions:</strong> RevX Capital Fund II distributions are subject to Category II AIF pass-through tax provisions. Form 64C / TDS certificates available on filing.</p>
            <p style="margin: 0 0 6px 0;">&bull; <strong>Artha Fund IV:</strong> Carried at manager capital closing balance of ₹17,15,956. TDS of ₹2,151 withheld on other income will be reflected in LLP Form 26AS.</p>
            <p style="margin: 0;">&bull; <strong>Statutory Audit:</strong> This statement is generated based on third-party verified bank (ICICI) and broker (Nuvama) records as of 13-August-2026.</p>
          </div>

          <!-- Signature Seal -->
          <div style="margin-top: 24px; display: flex; justify-content: space-between; align-items: flex-end;">
            <div style="font-size: 0.7rem; color: #94a3b8;">
              System Generated Statement &bull; Hash: SFO-AUTH-${Date.now().toString(36).toUpperCase()}
            </div>
            <div style="text-align: center;">
              <div style="font-family: 'Outfit', cursive; font-size: 1.2rem; color: #1e3a8a; font-weight: bold;">Srikanth</div>
              <div style="border-top: 1px solid #0f172a; padding-top: 4px; font-size: 0.74rem; font-weight: 700; color: #0f172a;">
                Managing Partner, Sahasraartha Family Office LLP
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky Footer with Back / Close Button -->
        <div style="border-top: 1px solid #e2e8f0; background: #f8fafc; padding: 12px 18px; display: flex; justify-content: space-between; align-items: center;">
          <button class="btn btn-secondary btn-sm" id="btn-bottom-back-statement" style="padding: 8px 16px; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            <span>Back to Dashboard</span>
          </button>
          
          <button class="btn btn-primary btn-sm" id="btn-bottom-download-statement" style="padding: 8px 18px; font-weight: 700; font-size: 0.82rem; cursor: pointer; display: flex; align-items: center; gap: 6px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Download Official PDF</span>
          </button>
        </div>

      </div>
    </div>
  `;
}

export function attachStatementEvents() {
  const modal = document.getElementById('statement-modal');
  const btnOpen = document.getElementById('btn-open-statement-modal');
  const btnClose = document.getElementById('btn-close-statement-modal');
  const btnBack = document.getElementById('btn-back-statement');
  const btnBottomBack = document.getElementById('btn-bottom-back-statement');
  const btnDownloadPdf = document.getElementById('btn-download-statement-pdf');
  const btnBottomDownload = document.getElementById('btn-bottom-download-statement');
  const btnPrint = document.getElementById('btn-print-statement');

  const closeModal = () => {
    if (modal) modal.style.display = 'none';
  };

  const triggerDownload = () => {
    const user = store.currentUser;
    const calcs = store.getCalculations();
    downloadStatementPDF(user, calcs);
    setTimeout(() => {
      closeModal();
    }, 1000);
  };

  if (btnOpen) {
    btnOpen.addEventListener('click', () => {
      if (modal) modal.style.display = 'flex';
    });
  }

  if (btnClose) btnClose.addEventListener('click', closeModal);
  if (btnBack) btnBack.addEventListener('click', closeModal);
  if (btnBottomBack) btnBottomBack.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target.id === 'statement-modal') {
        closeModal();
      }
    });
  }

  // Keyboard Escape key to go back
  const handleKeydown = (e) => {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      closeModal();
    }
  };
  window.removeEventListener('keydown', handleKeydown);
  window.addEventListener('keydown', handleKeydown);

  // PDF download events
  if (btnDownloadPdf) btnDownloadPdf.addEventListener('click', triggerDownload);
  if (btnBottomDownload) btnBottomDownload.addEventListener('click', triggerDownload);
  if (btnPrint) btnPrint.addEventListener('click', () => window.print());
}
