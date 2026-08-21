/**
 * Proposal & Deal Voting Engine
 * Conforms to Corporate Overview Section 3 Digital Transformation:
 * - Structured Deal Evaluation & Voting Module
 * - Quorum Tracking (66.7% / 75% approval thresholds)
 * - Partner Voting (For / Against / Abstain) with live tallying
 * - Partner comments & deliberations
 * - Partner Capital Top-Up Proposal Submission
 */

import { store } from '../state/store.js';
import { formatINR, formatDate } from '../utils/formatters.js';

export function renderProposalVoting() {
  const user = store.currentUser;
  const calcs = store.getCalculations();

  return `
    <div class="view-section" style="padding-bottom: 24px;">
      
      <!-- Section Header -->
      <div class="section-header" style="margin-bottom: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
            <span class="role-tag role-committee" style="font-size: 0.68rem;">Governance & Voting</span>
            <span class="mono" style="font-size: 0.72rem; color: var(--accent-gold);">${store.deals.length} Opportunities</span>
          </div>
          <h2 style="font-size: 1.3rem;">Deals & Voting Engine</h2>
          <p style="font-size: 0.78rem;">Consensus Evaluation for Deployments & Capital Calls</p>
        </div>

        <button class="btn btn-primary btn-sm" id="btn-open-topup-modal" style="padding: 6px 12px; font-size: 0.78rem;">
          + Propose Capital Top-Up
        </button>
      </div>

      <!-- ACTIVE DEALS FOR PARTNER VOTING -->
      <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px;">
        ${store.deals.map(deal => {
          const totalVotes = deal.votes.for + deal.votes.against + deal.votes.abstain;
          const forPct = totalVotes > 0 ? (deal.votes.for / totalVotes) * 100 : 0;
          const quorumReached = forPct >= deal.quorumNeededPct;

          return `
            <div class="card" style="padding: 16px; border-top: 3px solid ${quorumReached ? 'var(--accent-emerald)' : 'var(--accent-gold)'};">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                    <span class="badge badge-pending" style="font-size: 0.62rem;">${deal.status}</span>
                    <span class="badge" style="background: rgba(255,255,255,0.06); font-size: 0.62rem; color: var(--accent-gold);">${deal.category}</span>
                    <span class="mono" style="font-size: 0.68rem; color: var(--text-muted);">${deal.dealId}</span>
                  </div>
                  <h3 style="font-size: 1.05rem; color: var(--text-primary); margin-top: 4px;">${deal.title}</h3>
                  <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
                    Proposed by: <strong style="color: var(--text-secondary);">${deal.proposer}</strong> &bull; Deadline: <strong>${formatDate(deal.votingDeadline)}</strong>
                  </div>
                </div>

                <div style="text-align: right; flex-shrink: 0;">
                  <div style="font-size: 1.15rem; font-weight: 800; color: var(--accent-gold); font-family: 'Outfit', sans-serif;">
                    ${formatINR(deal.targetAmount, { compact: true })}
                  </div>
                  <span class="badge ${quorumReached ? 'badge-verified' : 'badge-pending'}" style="font-size: 0.62rem;">
                    ${quorumReached ? 'Quorum Met' : 'Voting Open'}
                  </span>
                </div>
              </div>

              <!-- Deal Summary -->
              <p style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.4; margin-top: 10px; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px;">
                ${deal.summary}
              </p>

              <!-- Quorum & Voting Progress Bar -->
              <div style="margin-top: 12px;">
                <div style="display: flex; justify-content: space-between; font-size: 0.72rem; margin-bottom: 4px;">
                  <span style="color: var(--text-muted);">Partner Approval (${deal.votes.for}/${totalVotes} votes)</span>
                  <span style="font-weight: 700; color: ${quorumReached ? 'var(--accent-emerald)' : 'var(--accent-gold)'};">
                    ${forPct.toFixed(1)}% (Threshold ${deal.quorumNeededPct}%)
                  </span>
                </div>
                <div style="height: 6px; border-radius: 3px; background: rgba(255,255,255,0.06); overflow: hidden; position: relative;">
                  <div style="height: 100%; width: ${forPct}%; background: ${quorumReached ? 'var(--accent-emerald)' : 'var(--accent-gold)'}; border-radius: 3px;"></div>
                </div>
              </div>

              <!-- Live Partner Voting Buttons -->
              <div style="display: flex; gap: 8px; margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--border-subtle);">
                <button class="btn btn-sm btn-vote" data-deal-id="${deal.dealId}" data-vote="for" style="flex: 1; background: rgba(16, 185, 129, 0.15); color: var(--accent-emerald); border: 1px solid rgba(16, 185, 129, 0.3);">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Vote FOR (${deal.votes.for})
                </button>
                <button class="btn btn-sm btn-vote" data-deal-id="${deal.dealId}" data-vote="against" style="flex: 1; background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3);">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  AGAINST (${deal.votes.against})
                </button>
                <button class="btn btn-sm btn-vote" data-deal-id="${deal.dealId}" data-vote="abstain" style="flex: 1; background: rgba(255, 255, 255, 0.05); color: var(--text-muted); border: 1px solid var(--border-color);">
                  ABSTAIN (${deal.votes.abstain})
                </button>
              </div>

              <!-- Deliberation Comments Thread -->
              <div style="margin-top: 12px;">
                <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">Partner Deliberation:</div>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                  ${deal.comments.map(c => `
                    <div style="background: rgba(255,255,255,0.02); border-radius: 4px; padding: 6px 8px; font-size: 0.72rem;">
                      <div style="display: flex; justify-content: space-between; color: var(--accent-gold); font-weight: 600;">
                        <span>${c.author}</span>
                        <span style="font-size: 0.65rem; color: var(--text-muted);">${formatDate(c.date)}</span>
                      </div>
                      <div style="color: var(--text-secondary); margin-top: 2px;">${c.text}</div>
                    </div>
                  `).join('')}
                </div>

                <div style="display: flex; gap: 6px; margin-top: 8px;">
                  <input type="text" class="input input-comment" data-deal-id="${deal.dealId}" placeholder="Add your discussion note..." style="font-size: 0.74rem; padding: 6px 10px;" />
                  <button class="btn btn-secondary btn-sm btn-post-comment" data-deal-id="${deal.dealId}" style="padding: 6px 10px; font-size: 0.72rem;">Post</button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- CAPITAL TOP-UP PROPOSAL MODAL -->
      ${store.activeModal === 'PROPOSAL' ? renderTopupModal(user, calcs) : ''}

    </div>
  `;
}

function renderTopupModal(user, calcs) {
  return `
    <div class="modal-backdrop active" id="proposal-modal-backdrop">
      <div class="modal-sheet" style="max-height: 85vh; overflow-y: auto;">
        
        <div class="modal-header">
          <div>
            <span class="role-tag role-lp" style="font-size: 0.65rem;">Capital Allotment</span>
            <h3 style="font-size: 1.1rem; color: var(--text-primary); margin-top: 2px;">Propose Additional Capital</h3>
          </div>
          <button class="modal-close" id="btn-close-proposal-modal">&times;</button>
        </div>

        <form id="form-submit-proposal" style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
          <div class="card highlight-gold" style="padding: 12px;">
            <div style="font-size: 0.7rem; color: var(--text-muted);">CURRENT VALUATION BENCHMARK</div>
            <div style="font-size: 1.2rem; font-weight: 700; color: var(--accent-gold); margin-top: 2px;">
              ₹${calcs.navPerUnit.toFixed(2)} per SFO Unit
            </div>
            <div style="font-size: 0.68rem; color: var(--text-secondary); margin-top: 2px;">
              Units will be mathematically allotted at live net NAV upon Managing Partner approval.
            </div>
          </div>

          <div>
            <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Proposed Capital Amount (₹)</label>
            <input type="number" id="input-topup-amount" class="input" placeholder="e.g. 500000" min="50000" step="10000" required style="font-size: 1.1rem; font-weight: 700;" />
          </div>

          <div>
            <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Strategic Rationale / Deployment Note</label>
            <textarea id="input-topup-notes" class="input" rows="3" placeholder="e.g. Capital top-up for Artha follow-on or Real estate deal..." style="font-size: 0.76rem;"></textarea>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: 4px;">
            Submit Proposal to Managing Partner Desk
          </button>
        </form>

      </div>
    </div>
  `;
}

export function attachProposalVotingEvents() {
  // Cast vote buttons
  document.querySelectorAll('.btn-vote').forEach(btn => {
    btn.addEventListener('click', () => {
      const dealId = btn.getAttribute('data-deal-id');
      const vote = btn.getAttribute('data-vote');
      store.castVote({ dealId, vote });
      alert(`Vote "${vote.toUpperCase()}" recorded successfully!`);
    });
  });

  // Post comment buttons
  document.querySelectorAll('.btn-post-comment').forEach(btn => {
    btn.addEventListener('click', () => {
      const dealId = btn.getAttribute('data-deal-id');
      const input = document.querySelector(`.input-comment[data-deal-id="${dealId}"]`);
      if (input && input.value.trim()) {
        store.castVote({ dealId, vote: 'abstain', comment: input.value.trim() });
        input.value = '';
      }
    });
  });

  // Open / Close top-up modal
  document.getElementById('btn-open-topup-modal')?.addEventListener('click', () => {
    store.openModal('PROPOSAL');
  });

  document.getElementById('btn-close-proposal-modal')?.addEventListener('click', () => {
    store.closeModal();
  });

  // Submit top-up form
  const form = document.getElementById('form-submit-proposal');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = document.getElementById('input-topup-amount')?.value;
      const notes = document.getElementById('input-topup-notes')?.value;

      store.submitProposal({
        partnerId: store.currentUser.partnerId,
        proposedAmount: amount,
        notes
      });

      alert(`Proposal for ₹${Number(amount).toLocaleString('en-IN')} submitted to Srikanth's Admin Review Desk.`);
      store.closeModal();
    });
  }
}
