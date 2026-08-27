/**
 * Screen 4: Capital Ledger (Dual Inflow/Outflow) & Screen 5: Action / Capital Calls
 * Conforms to Blueprint Screens 4 & 5:
 * - Dual Ledger: Inflows (Capital Calls) vs Outflows (Distributions)
 * - Status badges (Verified, Under Review, Credited)
 * - Filter by date and transaction type
 * - Download verified transaction vouchers / receipts
 * - Screen 5 Action: Active Capital Call breakdown (Quota), Receiving Bank & UPI QR, UTR & Payment Proof submission
 */

import { store } from '../state/store.js';
import { formatINR, formatDate } from '../utils/formatters.js';
import { SFO_METADATA } from '../data/sfo_data.js';
import { downloadDocumentVaultPDF } from '../utils/pdfGenerator.js';

let ledgerTypeFilter = 'ALL'; // 'ALL' | 'INFLOW' | 'OUTFLOW'
let selectedTxType = 'ALL';

export function renderCapitalLedger() {
  const user = store.currentUser;
  const psr = user.sharePct ? user.sharePct / 100 : (user.psr || 0.05);

  // Active Capital Call
  const activeCall = store.capitalCalls.find(c => c.status === 'ACTIVE');
  const partnerCallQuota = activeCall ? (activeCall.totalCallAmount * psr) : 0;

  // Filter transactions
  let txs = store.capitalTransactions;

  // Filter by user if LP
  if (user.role !== 'SUPER_ADMIN' && user.role !== 'ADMIN') {
    txs = txs.filter(t => t.partnerId === user.partnerId || t.partnerId === 'FUND_WIDE');
  }

  if (ledgerTypeFilter === 'INFLOW') {
    txs = txs.filter(t => t.transactionType === 'CAPITAL_CONTRIBUTION');
  } else if (ledgerTypeFilter === 'OUTFLOW') {
    txs = txs.filter(t => t.transactionType === 'PROFIT_DISTRIBUTION' || t.transactionType === 'RETURN_OF_CAPITAL' || t.transactionType === 'EXPENSE');
  }

  if (selectedTxType !== 'ALL') {
    txs = txs.filter(t => t.transactionType === selectedTxType);
  }

  // Calculate totals
  const totalInflows = store.capitalTransactions
    .filter(t => t.transactionType === 'CAPITAL_CONTRIBUTION')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const totalOutflows = store.capitalTransactions
    .filter(t => t.transactionType === 'PROFIT_DISTRIBUTION' || t.transactionType === 'RETURN_OF_CAPITAL')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  return `
    <div class="view-section" style="padding-bottom: 24px;">
      
      <!-- Section Header -->
      <div class="section-header" style="margin-bottom: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
            <span class="role-tag role-lp" style="font-size: 0.68rem;">Capital Ledger</span>
            <span class="mono" style="font-size: 0.72rem; color: var(--accent-gold);">${user.partnerId}</span>
          </div>
          <h2 style="font-size: 1.3rem;">Double-Entry Capital Ledger</h2>
          <p style="font-size: 0.78rem;">Immutable Inflow & Distribution Tracking</p>
        </div>

        <button class="btn btn-primary btn-sm" id="btn-open-pay-call-modal" style="padding: 6px 12px; font-size: 0.78rem;">
          + Pay Capital Call
        </button>
      </div>

      <!-- DUAL LEDGER SUMMARY CARDS (Responsive Flexbox) -->
      <div style="display: flex; gap: 10px; flex-wrap: wrap; width: 100%; margin-bottom: 14px; box-sizing: border-box;">
        <div class="card" style="flex: 1 1 140px; min-width: 0; padding: 14px; border-top: 3px solid var(--accent-gold); box-sizing: border-box;">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; flex-wrap: wrap;">
            <span class="metric-label" style="font-size: 0.7rem; color: var(--accent-gold);">TOTAL INFLOWS</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" color="var(--accent-gold)"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
          </div>
          <div style="font-size: 1.35rem; font-weight: 800; color: var(--text-primary); margin-top: 4px; font-family: 'Outfit', sans-serif; word-break: break-word;">
            ${formatINR(totalInflows, { compact: true })}
          </div>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">Capital Calls & Subscriptions</div>
        </div>

        <div class="card" style="flex: 1 1 140px; min-width: 0; padding: 14px; border-top: 3px solid var(--accent-emerald); box-sizing: border-box;">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; flex-wrap: wrap;">
            <span class="metric-label" style="font-size: 0.7rem; color: var(--accent-emerald);">TOTAL OUTFLOWS</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" color="var(--accent-emerald)"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          </div>
          <div style="font-size: 1.35rem; font-weight: 800; color: var(--accent-emerald); margin-top: 4px; font-family: 'Outfit', sans-serif; word-break: break-word;">
            ${formatINR(totalOutflows, { compact: true })}
          </div>
          <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">Distributions & Yield Payouts</div>
        </div>
      </div>

      <!-- SCREEN 5: ACTIVE CAPITAL CALL ACTION HERO (Responsive Flexbox) -->
      ${activeCall ? `
        <div class="card highlight-gold" style="margin-bottom: 16px; padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; flex-wrap: wrap;">
            <div style="min-width: 0; flex: 1;">
              <span class="metric-label" style="color: var(--accent-gold); font-size: 0.68rem;">ACTIVE CAPITAL CALL #01/2026-27</span>
              <h3 style="font-size: 1.05rem; color: #ffffff; margin-top: 2px; word-break: break-word;">${activeCall.purpose}</h3>
            </div>
            <span class="badge badge-pending" style="font-size: 0.65rem; flex-shrink: 0;">Due: ${formatDate(activeCall.dueDate)}</span>
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px; padding: 10px; background: rgba(0,0,0,0.25); border-radius: 6px; width: 100%; box-sizing: border-box;">
            <div style="flex: 1 1 120px; min-width: 0;">
              <div style="font-size: 0.68rem; color: var(--text-muted);">Fund Target Call</div>
              <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-primary); word-break: break-word;">${formatINR(activeCall.totalCallAmount, { compact: true })}</div>
            </div>
            <div style="flex: 1 1 120px; min-width: 0;">
              <div style="font-size: 0.68rem; color: var(--text-muted);">Your Quota (${(psr * 100).toFixed(3)}%)</div>
              <div style="font-weight: 800; font-size: 1.05rem; color: var(--accent-gold); word-break: break-word;">${formatINR(partnerCallQuota)}</div>
            </div>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; width: 100%;">
            <button class="btn btn-primary btn-sm" id="btn-show-upi-qr" style="flex: 1 1 130px; padding: 7px; font-size: 0.78rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              View Bank & UPI QR
            </button>
            <button class="btn btn-secondary btn-sm" id="btn-submit-utr-quick" style="flex: 1 1 130px; padding: 7px; font-size: 0.78rem;">
              Submit UTR Proof
            </button>
          </div>
        </div>
      ` : ''}

      <!-- LEDGER FILTER TABS -->
      <div style="display: flex; gap: 6px; margin-bottom: 12px; overflow-x: auto; padding-bottom: 4px; width: 100%; box-sizing: border-box;">
        <button class="filter-pill ${ledgerTypeFilter === 'ALL' ? 'active' : ''}" data-ledger-filter="ALL">All Entries</button>
        <button class="filter-pill ${ledgerTypeFilter === 'INFLOW' ? 'active' : ''}" data-ledger-filter="INFLOW">Inflows (Calls)</button>
        <button class="filter-pill ${ledgerTypeFilter === 'OUTFLOW' ? 'active' : ''}" data-ledger-filter="OUTFLOW">Outflows (Distributions)</button>
      </div>

      <!-- TRANSACTION LEDGER TABLE / LIST (Responsive Flexbox) -->
      <div style="display: flex; flex-direction: column; gap: 10px; width: 100%; box-sizing: border-box;">
        ${txs.length === 0 ? `
          <div class="card" style="text-align: center; padding: 30px; color: var(--text-muted);">
            No transactions found for the selected filter.
          </div>
        ` : txs.map(tx => {
          const isInflow = tx.transactionType === 'CAPITAL_CONTRIBUTION';
          return `
            <div class="card" style="padding: 14px; border-left: 3px solid ${isInflow ? 'var(--accent-gold)' : 'var(--accent-emerald)'};">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap;">
                <div style="flex: 1 1 180px; min-width: 0;">
                  <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                    <span class="mono" style="font-size: 0.68rem; color: var(--text-muted);">${tx.transactionId}</span>
                    <span class="badge badge-${tx.status.toLowerCase()}" style="font-size: 0.62rem;">${tx.status}</span>
                    <span class="mono" style="font-size: 0.68rem; color: var(--accent-blue);">${tx.paymentMode}</span>
                  </div>
                  <div style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary); margin-top: 4px; word-break: break-word;">
                    ${tx.notes || tx.transactionType}
                  </div>
                  <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px; word-break: break-word;">
                    ${formatDate(tx.paymentDate)} &bull; ${tx.partnerName} &bull; Ref: <span class="mono" style="word-break: break-all;">${tx.utrReference}</span>
                  </div>
                </div>

                <div style="text-align: right; flex-shrink: 0; min-width: 90px;">
                  <div style="font-size: 1.15rem; font-weight: 800; color: ${isInflow ? 'var(--accent-gold)' : 'var(--accent-emerald)'}; font-family: 'Outfit', sans-serif;">
                    ${isInflow ? '+' : '-'}${formatINR(tx.amount)}
                  </div>
                  <button class="btn btn-secondary btn-sm btn-download-voucher" data-tx-id="${tx.transactionId}" style="margin-top: 4px; padding: 3px 8px; font-size: 0.65rem;">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Voucher
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- SCREEN 5: CAPITAL CALL PAYMENT & UPI QR MODAL -->
      ${store.activeModal === 'CAPITAL_CALL' ? renderCapitalCallModal(activeCall, user, partnerCallQuota) : ''}

    </div>
  `;
}

function renderCapitalCallModal(call, user, quota) {
  const bank = SFO_METADATA.bankReceiving;

  return `
    <div class="modal-backdrop active" id="capital-call-modal-backdrop" style="position: fixed; inset: 0; background: rgba(5, 8, 16, 0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 14px;">
      <div class="modal-sheet" style="max-height: 90vh; width: 100%; max-width: 600px; background: var(--bg-card); border: 1.5px solid var(--border-color); border-radius: 16px; overflow-y: auto;">
        
        <div class="modal-header" style="padding: 14px 18px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <button class="btn btn-secondary btn-sm" id="btn-back-call-modal" style="padding: 6px 12px; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; gap: 5px; border-radius: 8px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
              <span>Back</span>
            </button>
            <div>
              <span class="role-tag role-lp" style="font-size: 0.65rem;">Action / Capital Call</span>
              <h3 style="font-size: 1.05rem; color: var(--text-primary); margin: 2px 0 0 0; font-weight: 800;">Capital Call Payment & UTR Proof</h3>
            </div>
          </div>
          <button class="modal-close" id="btn-close-call-modal" style="background: rgba(255,255,255,0.08); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">&times;</button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px; padding: 18px;">
          
          <!-- Quota Overview -->
          <div class="card highlight-gold" style="padding: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span class="metric-label" style="color: var(--accent-gold); font-size: 0.68rem;">YOUR CALCULATED QUOTA</span>
                <div style="font-size: 1.4rem; font-weight: 800; color: #ffffff; margin-top: 2px;">${formatINR(quota)}</div>
              </div>
              <div style="text-align: right;">
                <span class="badge badge-verified" style="font-size: 0.65rem;">PSR: ${(user.sharePct || 5).toFixed(3)}%</span>
                <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">Due: ${formatDate(call?.dueDate || '2026-09-15')}</div>
              </div>
            </div>
          </div>

          <!-- Official Designated Bank Receiving Details & UPI QR -->
          <div class="card" style="padding: 14px;">
            <h4 style="font-size: 0.88rem; color: var(--text-primary); margin-bottom: 8px;">Designated LLP Bank Account (ICICI)</h4>
            
            <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
              <!-- Simulated SVG UPI QR Code -->
              <div style="width: 110px; height: 110px; background: #ffffff; border-radius: 8px; padding: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: var(--shadow-sm);">
                <svg viewBox="0 0 100 100" width="90" height="90">
                  <rect width="100" height="100" fill="white"/>
                  <rect x="10" y="10" width="25" height="25" fill="#0f172a"/>
                  <rect x="15" y="15" width="15" height="15" fill="white"/>
                  <rect x="18" y="18" width="9" height="9" fill="#0f172a"/>
                  <rect x="65" y="10" width="25" height="25" fill="#0f172a"/>
                  <rect x="70" y="15" width="15" height="15" fill="white"/>
                  <rect x="73" y="18" width="9" height="9" fill="#0f172a"/>
                  <rect x="10" y="65" width="25" height="25" fill="#0f172a"/>
                  <rect x="15" y="70" width="15" height="15" fill="white"/>
                  <rect x="18" y="73" width="9" height="9" fill="#0f172a"/>
                  <rect x="42" y="42" width="16" height="16" fill="#f59e0b"/>
                  <path d="M42 15h16v10h-16zM65 42h25v12h-25zM42 65h16v25h-16z" fill="#0f172a"/>
                </svg>
                <span style="font-size: 0.55rem; color: #0f172a; font-weight: 700; margin-top: 2px;">SCAN TO PAY UPI</span>
              </div>

              <!-- Bank Account Spec -->
              <div style="flex: 1; min-width: 180px; font-size: 0.74rem;">
                <div style="margin-bottom: 4px;">
                  <span style="color: var(--text-muted);">Account Holder:</span>
                  <div style="font-weight: 700; color: var(--text-primary);">${bank.accountHolder}</div>
                </div>
                <div style="margin-bottom: 4px;">
                  <span style="color: var(--text-muted);">Current Account Number:</span>
                  <div class="mono" style="font-weight: 700; color: var(--accent-gold); font-size: 0.82rem;">${bank.accountNumber}</div>
                </div>
                <div style="margin-bottom: 4px;">
                  <span style="color: var(--text-muted);">IFSC Code:</span>
                  <div class="mono" style="font-weight: 700; color: var(--text-primary);">${bank.ifscCode} (${bank.bankName})</div>
                </div>
                <div>
                  <span style="color: var(--text-muted);">UPI VPA:</span>
                  <div class="mono" style="font-weight: 700; color: var(--accent-blue);">${bank.upiId}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- UTR Submission Form -->
          <form id="form-submit-utr" class="card" style="padding: 14px;">
            <h4 style="font-size: 0.88rem; color: var(--text-primary); margin-bottom: 10px;">Submit Transaction UTR Reference</h4>

            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div>
                <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Payment Amount (₹)</label>
                <input type="number" id="input-payment-amount" class="input" value="${quota}" required style="font-weight: 700;" />
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <div>
                  <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Payment Mode</label>
                  <select id="select-payment-mode" class="input">
                    <option value="UPI">UPI Instant</option>
                    <option value="NEFT">NEFT Transfer</option>
                    <option value="RTGS">RTGS High-Value</option>
                    <option value="IMPS">IMPS Instant</option>
                  </select>
                </div>
                <div>
                  <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Bank UTR / Ref Number</label>
                  <input type="text" id="input-utr-reference" class="input mono" placeholder="e.g. ICIC2026..." required />
                </div>
              </div>

              <div>
                <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Upload Payment Proof (Receipt / Screenshot)</label>
                <div style="border: 1px dashed var(--border-color); border-radius: 6px; padding: 12px; text-align: center; background: rgba(255,255,255,0.01); cursor: pointer;" id="fake-upload-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" color="var(--accent-gold)" style="margin: 0 auto 4px auto;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <div style="font-size: 0.75rem; color: var(--text-primary); font-weight: 600;">Attach Bank Receipt Screenshot (PNG/PDF)</div>
                  <div style="font-size: 0.65rem; color: var(--text-muted); margin-top: 2px;">Will be queued for Admin verification</div>
                </div>
              </div>

              <div style="display: flex; gap: 8px; margin-top: 6px;">
                <button type="button" class="btn btn-secondary" id="btn-cancel-call-bottom" style="flex: 1;">
                  Cancel & Back
                </button>
                <button type="submit" class="btn btn-primary" style="flex: 2;">
                  Submit for Verification
                </button>
              </div>
            </div>
          </form>

        </div>

      </div>
    </div>
  `;
}

export function attachCapitalLedgerEvents() {
  // Ledger tab filters
  document.querySelectorAll('[data-ledger-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      ledgerTypeFilter = btn.getAttribute('data-ledger-filter');
      store.notify();
    });
  });

  // Open pay call modal
  document.getElementById('btn-open-pay-call-modal')?.addEventListener('click', () => {
    store.openModal('CAPITAL_CALL');
  });

  document.getElementById('btn-show-upi-qr')?.addEventListener('click', () => {
    store.openModal('CAPITAL_CALL');
  });

  document.getElementById('btn-submit-utr-quick')?.addEventListener('click', () => {
    store.openModal('CAPITAL_CALL');
  });

  const closeCallModal = () => {
    store.closeModal();
  };

  document.getElementById('btn-close-call-modal')?.addEventListener('click', closeCallModal);
  document.getElementById('btn-back-call-modal')?.addEventListener('click', closeCallModal);
  document.getElementById('btn-cancel-call-bottom')?.addEventListener('click', closeCallModal);

  document.getElementById('capital-call-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'capital-call-modal-backdrop') {
      closeCallModal();
    }
  });

  // UTR submission form
  const form = document.getElementById('form-submit-utr');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = document.getElementById('input-payment-amount')?.value;
      const mode = document.getElementById('select-payment-mode')?.value;
      const utr = document.getElementById('input-utr-reference')?.value;

      store.submitCapitalPayment({
        partnerId: store.currentUser.partnerId,
        callId: "CC-2026-01",
        amount,
        paymentMode: mode,
        utrReference: utr,
        notes: `Payment for Capital Call #01 quota`
      });

      alert(`Payment of ₹${Number(amount).toLocaleString('en-IN')} (Ref: ${utr}) submitted! It is now visible in the Admin UTR Verification Queue.`);
      store.closeModal();
    });
  }

  // Voucher download
  document.querySelectorAll('.btn-download-voucher').forEach(btn => {
    btn.addEventListener('click', () => {
      const txId = btn.getAttribute('data-tx-id');
      const tx = store.capitalTransactions.find(t => t.transactionId === txId);
      if (tx) {
        const dummyDoc = {
          title: `Capital Transaction Voucher ${tx.transactionId}`,
          documentId: tx.transactionId,
          docType: tx.transactionType,
          folder: 'Ledger',
          uploadedAt: tx.paymentDate,
          description: `Certified ledger receipt for ${tx.notes || tx.transactionType} amounting to INR ${Number(tx.amount || 0).toLocaleString('en-IN')}`
        };
        downloadDocumentVaultPDF(dummyDoc, store.currentUser);
      }
    });
  });
}
