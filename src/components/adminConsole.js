/**
 * Screen 8: Admin Console (Role-Gated - Srikanth's Control Center)
 * Conforms to Blueprint Screen 8:
 * - Directory of 28 Partners with status and total equity
 * - Pending UTR verification queue (Approve & Credit Units / Reject)
 * - Asset revaluation & distribution engine
 * - Issue fund-wide Capital Calls (Auto-allocates quota by PSR %)
 * - Execute profit distribution runs (Auto 10% TDS & Net splits)
 * - Upload global/tax documents
 */

import { store } from '../state/store.js';
import { formatINR, formatUnits, formatPercent, formatDate } from '../utils/formatters.js';

export function renderAdminConsole() {
  const calcs = store.getCalculations();
  const pendingTxs = store.capitalTransactions.filter(t => t.status === 'PENDING');
  const pendingProposals = store.proposals.filter(p => p.status === 'PENDING');
  const activePartnersCount = store.partners.length;

  return `
    <div class="view-section" style="padding-bottom: 24px;">
      
      <!-- Section Header -->
      <div class="section-header" style="margin-bottom: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
            <span class="role-tag role-super-admin" style="font-size: 0.68rem;">Super Admin Role</span>
            <span class="mono" style="font-size: 0.72rem; color: var(--accent-gold);">Srikanth's Control Center</span>
          </div>
          <h2 style="font-size: 1.3rem;">Super Admin Console</h2>
          <p style="font-size: 0.78rem;">28-Partner Registry, UTR Queue & Automated Distribution Engine</p>
        </div>

        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button class="btn btn-primary btn-sm" id="btn-admin-issue-call" style="padding: 5px 10px; font-size: 0.75rem;">
            + Issue Capital Call
          </button>
          <button class="btn btn-secondary btn-sm" id="btn-admin-run-distribution" style="padding: 5px 10px; font-size: 0.75rem;">
            + Run Distribution (10% TDS)
          </button>
        </div>
      </div>

      <!-- MASTER METRICS SUMMARY (Responsive Flexbox) -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; width: 100%; box-sizing: border-box;">
        <div class="card" style="flex: 1 1 calc(50% - 4px); min-width: 130px; padding: 12px; box-sizing: border-box;">
          <span class="metric-label" style="font-size: 0.68rem;">LLP TOTAL AUM</span>
          <div class="metric-value gold" style="font-size: 1.25rem; word-break: break-word;">${formatINR(calcs.totalGrossAssets, { compact: true })}</div>
          <div style="font-size: 0.68rem; color: var(--text-muted); word-break: break-word;">Sum of 5 Reconciled Accounts</div>
        </div>

        <div class="card" style="flex: 1 1 calc(50% - 4px); min-width: 130px; padding: 12px; box-sizing: border-box;">
          <span class="metric-label" style="font-size: 0.68rem;">LIVE UNIT NAV</span>
          <div class="metric-value emerald mono" style="font-size: 1.25rem; word-break: break-word;">₹${calcs.navPerUnit.toFixed(2)}</div>
          <div style="font-size: 0.68rem; color: var(--text-muted); word-break: break-word;">${formatUnits(calcs.totalOutstandingUnits)} Partner Units</div>
        </div>

        <div class="card" style="flex: 1 1 calc(50% - 4px); min-width: 130px; padding: 12px; box-sizing: border-box;">
          <span class="metric-label" style="font-size: 0.68rem;">PENDING UTR QUEUE</span>
          <div class="metric-value ${pendingTxs.length > 0 ? 'gold' : ''} mono" style="font-size: 1.25rem; word-break: break-word;">${pendingTxs.length} Pending</div>
          <div style="font-size: 0.68rem; color: var(--text-muted); word-break: break-word;">${pendingTxs.length > 0 ? 'Requires Verification' : 'All Clear'}</div>
        </div>

        <div class="card" style="flex: 1 1 calc(50% - 4px); min-width: 130px; padding: 12px; box-sizing: border-box;">
          <span class="metric-label" style="font-size: 0.68rem;">PROPOSALS DESK</span>
          <div class="metric-value mono" style="font-size: 1.25rem; word-break: break-word;">${pendingProposals.length} New</div>
          <div style="font-size: 0.68rem; color: var(--text-muted); word-break: break-word;">Partner Capital Invocations</div>
        </div>
      </div>

      <!-- PENDING UTR VERIFICATION QUEUE (Screen 8 Core Spec) -->
      <div class="card highlight-gold" style="margin-bottom: 16px; padding: 16px;">
        <div class="card-header" style="margin-bottom: 10px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h3 style="font-size: 1.05rem; color: var(--accent-gold);">Pending UTR Verification Desk</h3>
              <span class="badge ${pendingTxs.length > 0 ? 'badge-pending' : 'badge-verified'}">${pendingTxs.length} In Queue</span>
            </div>
            <p style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">Inspect Bank UTR Proofs & Credit Partner Units at Live NAV</p>
          </div>
        </div>

        ${pendingTxs.length === 0 ? `
          <div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 0.78rem;">
            All partner payment proofs verified. No pending UTR submissions.
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${pendingTxs.map(tx => `
              <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 12px; font-size: 0.76rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span class="mono" style="font-weight: 700; color: var(--text-primary);">${tx.partnerId}</span>
                      <strong style="color: var(--text-primary);">${tx.partnerName}</strong>
                      <span class="badge badge-pending" style="font-size: 0.6rem;">${tx.paymentMode}</span>
                    </div>
                    <div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 4px;">
                      UTR Ref: <strong class="mono" style="color: var(--accent-gold);">${tx.utrReference}</strong> &bull; Date: ${formatDate(tx.paymentDate)}
                    </div>
                    <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 2px;">
                      Receipt attached: <em>${tx.receiptUrl}</em> &bull; Call: ${tx.callId || 'Capital Call'}
                    </div>
                  </div>

                  <div style="text-align: right; flex-shrink: 0;">
                    <div style="font-size: 1.15rem; font-weight: 800; color: var(--accent-gold);">${formatINR(tx.amount)}</div>
                    <div style="font-size: 0.68rem; color: var(--accent-emerald);">~${(Number(tx.amount) / calcs.navPerUnit).toFixed(2)} Units</div>
                  </div>
                </div>

                <div style="display: flex; gap: 8px; margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--border-subtle);">
                  <button class="btn btn-primary btn-sm btn-verify-utr" data-tx-id="${tx.transactionId}" style="flex: 1; padding: 5px; font-size: 0.74rem;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Verify & Credit Units
                  </button>
                  <button class="btn btn-secondary btn-sm btn-reject-utr" data-tx-id="${tx.transactionId}" style="flex: 1; padding: 5px; font-size: 0.74rem; color: #f87171;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    Reject Payment
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- PENDING CAPITAL PROPOSALS DESK (Screen 8 Extension) -->
      <div class="card" style="margin-bottom: 16px; padding: 16px;">
        <div class="card-header" style="margin-bottom: 10px;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h3 style="font-size: 1.05rem; color: var(--text-primary);">Partner Capital Proposals Queue</h3>
              <span class="badge ${pendingProposals.length > 0 ? 'badge-pending' : 'badge-verified'}">${pendingProposals.length} Pending</span>
            </div>
            <p style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">Review Partner Capital Top-Up Invocations</p>
          </div>
        </div>

        ${pendingProposals.length === 0 ? `
          <div style="text-align: center; padding: 16px; color: var(--text-muted); font-size: 0.78rem;">
            No pending capital proposals.
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 10px;">
            ${pendingProposals.map(prop => `
              <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 12px; font-size: 0.76rem;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                  <div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                      <span class="mono" style="font-weight: 700; color: var(--accent-gold);">${prop.proposalId}</span>
                      <strong style="color: var(--text-primary);">${prop.partnerName}</strong>
                    </div>
                    <div style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 4px;">
                      Notes: ${prop.notes || 'Capital infusion proposal'} &bull; Submitted: ${formatDate(prop.submittedAt)}
                    </div>
                    <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">
                      Estimated Units @ ₹${(prop.currentNAVAtProposal || calcs.navPerUnit).toFixed(2)} NAV: <strong>${formatUnits(prop.estimatedUnits || (prop.proposedAmount / calcs.navPerUnit))} Units</strong>
                    </div>
                  </div>

                  <div style="text-align: right; flex-shrink: 0;">
                    <div style="font-size: 1.15rem; font-weight: 800; color: var(--accent-emerald);">${formatINR(prop.proposedAmount)}</div>
                    <span class="badge badge-pending" style="font-size: 0.6rem;">Requires Super Admin</span>
                  </div>
                </div>

                <div style="display: flex; gap: 8px; margin-top: 10px; padding-top: 8px; border-top: 1px solid var(--border-subtle);">
                  <button class="btn btn-primary btn-sm btn-approve-proposal" data-prop-id="${prop.proposalId}" style="flex: 1; padding: 5px; font-size: 0.74rem;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Approve & Issue Tranche
                  </button>
                  <button class="btn btn-secondary btn-sm btn-reject-proposal" data-prop-id="${prop.proposalId}" style="flex: 1; padding: 5px; font-size: 0.74rem; color: #f87171;">
                    Reject
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- ASSET REVALUATION ENGINE (Quick Action) -->
      <div class="card" style="margin-bottom: 16px; padding: 16px;">
        <div class="card-header" style="margin-bottom: 10px;">
          <div>
            <h4 style="font-size: 0.95rem; color: var(--text-primary);">Asset Revaluation & Valuation Engine</h4>
            <p style="font-size: 0.72rem; color: var(--text-muted);">Update asset carrying marks to trigger atomic NAV recalculation</p>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${store.portfolioAssets.map(asset => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px; background: rgba(255,255,255,0.02); border-radius: 6px; font-size: 0.76rem;">
              <div>
                <strong style="color: var(--text-primary);">${asset.assetName}</strong>
                <div style="font-size: 0.68rem; color: var(--text-muted);">${asset.assetClass} &bull; Current Mark: ${formatINR(asset.currentValuation)}</div>
              </div>
              <button class="btn btn-secondary btn-sm btn-revalue-asset" data-asset-id="${asset.assetId}" data-asset-name="${asset.assetName}" data-current-val="${asset.currentValuation}" style="padding: 4px 8px; font-size: 0.7rem;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Revalue
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 28 PARTNERS MASTER DIRECTORY (Screen 8 Spec) -->
      <div class="card" style="margin-bottom: 16px; padding: 16px;">
        <div class="card-header" style="margin-bottom: 10px;">
          <div>
            <h4 style="font-size: 0.95rem; color: var(--text-primary);">Partner Master Directory (28 Members across 12 Families)</h4>
            <p style="font-size: 0.72rem; color: var(--text-muted);">Reconciled with Statutory MCA LLP Agreement</p>
          </div>
          <span class="badge badge-verified">${activePartnersCount} Partners</span>
        </div>

        <div style="max-height: 380px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px;">
          ${store.partners.map(p => {
            const partnerVal = p.unitsAllocated * calcs.navPerUnit;
            return `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: rgba(255,255,255,0.02); border-radius: 6px; font-size: 0.74rem;">
                <div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span class="mono" style="color: var(--accent-gold); font-weight: 700;">${p.partnerId}</span>
                    <strong style="color: var(--text-primary);">${p.fullName}</strong>
                  </div>
                  <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px;">
                    DPIN: ${p.dpin || '08923412'} &bull; PSR: <strong>${(p.sharePct || 0).toFixed(3)}%</strong> &bull; ${p.familyGroup || 'Family Group'}
                  </div>
                </div>

                <div style="text-align: right; flex-shrink: 0;">
                  <div style="font-weight: 700; color: var(--accent-emerald); font-size: 0.84rem;">
                    ${formatINR(partnerVal)}
                  </div>
                  <div style="font-size: 0.65rem; color: var(--text-muted);">
                    ${formatUnits(p.unitsAllocated)} Units
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- MODALS: ISSUE CAPITAL CALL & AUTOMATED DISTRIBUTION RUN -->
      ${store.activeModal === 'ISSUE_CALL' ? renderIssueCapitalCallModal() : ''}
      ${store.activeModal === 'DISTRIBUTION_RUN' ? renderDistributionRunModal(calcs) : ''}

    </div>
  `;
}

function renderIssueCapitalCallModal() {
  return `
    <div class="modal-backdrop active" id="issue-call-modal-backdrop">
      <div class="modal-sheet" style="max-height: 85vh; overflow-y: auto;">
        
        <div class="modal-header">
          <div>
            <span class="role-tag role-super-admin" style="font-size: 0.65rem;">Super Admin Action</span>
            <h3 style="font-size: 1.1rem; color: var(--text-primary); margin-top: 2px;">Issue Fund-Wide Capital Call</h3>
          </div>
          <button class="modal-close" id="btn-close-issue-call">&times;</button>
        </div>

        <form id="form-issue-capital-call" style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
          <div>
            <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Call Number / Title</label>
            <input type="text" id="input-call-number" class="input" value="Capital Call #02/2026-27" required />
          </div>

          <div>
            <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Total Call Amount (₹)</label>
            <input type="number" id="input-total-call-amount" class="input" placeholder="e.g. 5000000" min="100000" step="50000" required style="font-size: 1.1rem; font-weight: 700;" />
            <span style="font-size: 0.68rem; color: var(--text-muted); margin-top: 2px; display: block;">Individual quotas will be auto-calculated across all 28 partners using strict PSR %.</span>
          </div>

          <div>
            <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Purpose / Deployment Description</label>
            <textarea id="input-call-purpose" class="input" rows="2" placeholder="e.g. Drawdown for Artha follow-on / Commercial Real Estate..." required style="font-size: 0.76rem;"></textarea>
          </div>

          <div>
            <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Payment Due Date</label>
            <input type="date" id="input-call-due-date" class="input" value="2026-09-30" required />
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: 4px;">
            Publish Capital Call to 28 Partners
          </button>
        </form>

      </div>
    </div>
  `;
}

function renderDistributionRunModal(calcs) {
  return `
    <div class="modal-backdrop active" id="distribution-run-modal-backdrop">
      <div class="modal-sheet" style="max-height: 88vh; overflow-y: auto;">
        
        <div class="modal-header">
          <div>
            <span class="role-tag role-super-admin" style="font-size: 0.65rem;">Automated Engine</span>
            <h3 style="font-size: 1.1rem; color: var(--text-primary); margin-top: 2px;">Execute Profit Distribution Run</h3>
          </div>
          <button class="modal-close" id="btn-close-dist-run">&times;</button>
        </div>

        <form id="form-execute-distribution" style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
          <div class="card highlight-gold" style="padding: 12px;">
            <div style="font-size: 0.7rem; color: var(--accent-gold); font-weight: 700;">STATUTORY TDS WITHHOLDING RULE</div>
            <div style="font-size: 0.74rem; color: var(--text-secondary); margin-top: 2px;">
              Auto 10% TDS will be deducted from Gross Share per Section 194A / 194LBA before generating Net Payables for all 28 partners.
            </div>
          </div>

          <div>
            <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Distribution Run Title</label>
            <input type="text" id="input-dist-title" class="input" value="Q2 FY27 Debt Yield & Rental Distribution" required />
          </div>

          <div>
            <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Total Distribution Pool Amount (₹)</label>
            <input type="number" id="input-dist-amount" class="input" value="500000" min="10000" step="10000" required style="font-size: 1.1rem; font-weight: 700;" />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div>
              <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Income Classification</label>
              <select id="select-income-type" class="input">
                <option value="RENTAL_YIELD">Rental Yield</option>
                <option value="DIVIDEND">Dividend</option>
                <option value="CAPITAL_GAIN">Capital Gain</option>
                <option value="INTEREST">Interest</option>
              </select>
            </div>
            <div>
              <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Source Asset</label>
              <input type="text" id="input-source-asset" class="input" value="RevX Yield & TechPark Rental" required />
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: 4px;">
            Execute Distribution Run & Credit Ledger
          </button>
        </form>

      </div>
    </div>
  `;
}

export function attachAdminEvents() {
  // Issue call modal open/close
  document.getElementById('btn-admin-issue-call')?.addEventListener('click', () => {
    store.openModal('ISSUE_CALL');
  });

  document.getElementById('btn-close-issue-call')?.addEventListener('click', () => {
    store.closeModal();
  });

  // Run distribution modal open/close
  document.getElementById('btn-admin-run-distribution')?.addEventListener('click', () => {
    store.openModal('DISTRIBUTION_RUN');
  });

  document.getElementById('btn-close-dist-run')?.addEventListener('click', () => {
    store.closeModal();
  });

  // Verify UTR buttons
  document.querySelectorAll('.btn-verify-utr').forEach(btn => {
    btn.addEventListener('click', () => {
      const txId = btn.getAttribute('data-tx-id');
      store.verifyTransaction(txId);
      alert(`Transaction ${txId} verified! Units allotted and bank cash updated.`);
    });
  });

  // Reject UTR buttons
  document.querySelectorAll('.btn-reject-utr').forEach(btn => {
    btn.addEventListener('click', () => {
      const txId = btn.getAttribute('data-tx-id');
      const reason = prompt("Enter rejection reason:");
      if (reason) {
        store.rejectTransaction(txId, reason);
        alert(`Transaction ${txId} rejected.`);
      }
    });
  });

  // Revalue asset prompt
  document.querySelectorAll('.btn-revalue-asset').forEach(btn => {
    btn.addEventListener('click', () => {
      const assetId = btn.getAttribute('data-asset-id');
      const assetName = btn.getAttribute('data-asset-name');
      const currentVal = btn.getAttribute('data-current-val');

      const newVal = prompt(`Enter new valuation for "${assetName}" (Current: ₹${Number(currentVal).toLocaleString('en-IN')}):`, currentVal);
      if (newVal && !isNaN(newVal)) {
        store.revalueAsset(assetId, Number(newVal), "Admin periodic revaluation");
        alert(`Asset "${assetName}" revalued to ₹${Number(newVal).toLocaleString('en-IN')}! Live NAV per unit updated.`);
      }
    });
  });

  // Issue Call Form submit
  const issueForm = document.getElementById('form-issue-capital-call');
  if (issueForm) {
    issueForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const callNumber = document.getElementById('input-call-number')?.value;
      const totalAmount = document.getElementById('input-total-call-amount')?.value;
      const purpose = document.getElementById('input-call-purpose')?.value;
      const dueDate = document.getElementById('input-call-due-date')?.value;

      store.issueCapitalCall({
        callNumber,
        totalCallAmount: totalAmount,
        purpose,
        dueDate
      });

      alert(`Published ${callNumber} for ₹${Number(totalAmount).toLocaleString('en-IN')} to all 28 partners.`);
      store.closeModal();
    });
  }

  // Execute Distribution Form submit
  const distForm = document.getElementById('form-execute-distribution');
  if (distForm) {
    distForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('input-dist-title')?.value;
      const totalAmount = document.getElementById('input-dist-amount')?.value;
      const incomeType = document.getElementById('select-income-type')?.value;
      const sourceAsset = document.getElementById('input-source-asset')?.value;

      const res = store.executeDistributionRun({
        title,
        totalAmount,
        incomeType,
        sourceAsset
      });

      alert(`Distribution Run "${title}" of ₹${Number(totalAmount).toLocaleString('en-IN')} completed! Auto 10% TDS deducted and credited to all 28 partner accounts.`);
      store.closeModal();
    });
  }

  // Approve Proposal buttons
  document.querySelectorAll('.btn-approve-proposal').forEach(btn => {
    btn.addEventListener('click', () => {
      const propId = btn.getAttribute('data-prop-id');
      const res = store.approveProposal(propId);
      if (res && res.success) {
        alert(`Capital proposal ${propId} approved! Units allotted and bank cash updated.`);
      }
    });
  });

  // Reject Proposal buttons
  document.querySelectorAll('.btn-reject-proposal').forEach(btn => {
    btn.addEventListener('click', () => {
      const propId = btn.getAttribute('data-prop-id');
      const reason = prompt("Enter rejection reason:");
      if (reason) {
        store.rejectProposal(propId, reason);
        alert(`Capital proposal ${propId} declined.`);
      }
    });
  });
}
