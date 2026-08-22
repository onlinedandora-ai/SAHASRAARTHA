/**
 * Screen 7: Partner Settings & Profile
 * Conforms to Blueprint Screen 7:
 * - DPIN, PAN, registered contact & address
 * - Linked Bank Account details with verification status
 * - Biometric login toggles (FaceID/Fingerprint unlock)
 * - Request payout bank details update workflow
 */

import { store } from '../state/store.js';

export function renderPartnerSettings() {
  const user = store.currentUser;
  const bank = user.bankAccounts?.[0] || {
    bankName: user.bankName || "HDFC Bank",
    accountNumber: user.accountNumber || "50100892341029",
    ifscCode: user.ifscCode || "HDFC0001824",
    accountHolderName: user.legalName || user.fullName,
    isPrimary: true,
    isVerified: true
  };

  const psrPct = user.sharePct || (user.psr ? user.psr * 100 : 0);

  return `
    <div class="view-section" style="padding-bottom: 24px;">
      
      <!-- Section Header -->
      <div class="section-header" style="margin-bottom: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
            <span class="role-tag role-lp" style="font-size: 0.68rem;">Partner Profile</span>
            <span class="mono" style="font-size: 0.72rem; color: var(--accent-gold);">${user.partnerId}</span>
          </div>
          <h2 style="font-size: 1.3rem;">Settings & KYC Profile</h2>
          <p style="font-size: 0.78rem;">Statutory MCA DPIN, Banking & Security Preferences</p>
        </div>
      </div>

      <!-- IDENTITY & MCA DPIN CARD -->
      <div class="card highlight-gold" style="margin-bottom: 14px; padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <span class="metric-label" style="color: var(--accent-gold); font-size: 0.68rem;">STATUTORY IDENTITY</span>
            <h3 style="font-size: 1.15rem; color: #ffffff; margin-top: 2px;">${user.fullName}</h3>
            <div style="font-size: 0.74rem; color: var(--text-muted); margin-top: 2px;">
              Father's Name: <strong style="color: var(--text-secondary);">${user.fatherName || 'Ayinavolu'}</strong>
            </div>
          </div>
          <span class="badge badge-verified">KYC Verified</span>
        </div>

        <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--border-subtle); font-size: 0.76rem; width: 100%;">
          <div style="flex: 1 1 120px; min-width: 0;">
            <span style="color: var(--text-muted);">MCA DPIN / ID:</span>
            <div class="mono" style="font-weight: 700; color: var(--accent-gold); word-break: break-word;">${user.dpin || '08923412'}</div>
          </div>
          <div style="flex: 1 1 120px; min-width: 0;">
            <span style="color: var(--text-muted);">PAN Number:</span>
            <div class="mono" style="font-weight: 700; color: var(--text-primary); word-break: break-word;">${user.pan || 'CZHPA9322F'}</div>
          </div>
          <div style="flex: 1 1 120px; min-width: 0;">
            <span style="color: var(--text-muted);">Partner Role:</span>
            <div style="font-weight: 700; color: var(--accent-emerald); word-break: break-word;">${user.role}</div>
          </div>
          <div style="flex: 1 1 120px; min-width: 0;">
            <span style="color: var(--text-muted);">Ownership PSR %:</span>
            <div style="font-weight: 700; color: var(--accent-blue); word-break: break-word;">${psrPct.toFixed(3)}%</div>
          </div>
        </div>

        <div style="margin-top: 10px; font-size: 0.74rem; color: var(--text-secondary); word-break: break-word;">
          <span style="color: var(--text-muted);">Family Cluster:</span> <strong>${user.familyGroup || 'Ayinavolu Family'}</strong>
        </div>
      </div>

      <!-- CONTACT & REGISTERED ADDRESS -->
      <div class="card" style="margin-bottom: 14px; padding: 16px;">
        <h4 style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 10px;">Registered Communication Details</h4>
        
        <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.76rem; width: 100%;">
          <div style="display: flex; justify-content: space-between; gap: 6px; flex-wrap: wrap;">
            <span style="color: var(--text-muted);">Registered Email:</span>
            <strong style="color: var(--text-primary); word-break: break-word;">${user.email}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; gap: 6px; flex-wrap: wrap;">
            <span style="color: var(--text-muted);">Registered Mobile:</span>
            <strong style="color: var(--text-primary); word-break: break-word;">${user.mobile}</strong>
          </div>
          <div style="margin-top: 4px;">
            <span style="color: var(--text-muted); display: block; margin-bottom: 2px;">Registered Address (MCA Deed):</span>
            <p style="color: var(--text-secondary); line-height: 1.4; background: rgba(255,255,255,0.02); padding: 8px; border-radius: 4px; word-break: break-word;">${user.address}</p>
          </div>
        </div>
      </div>

      <!-- LINKED PAYOUT BANK ACCOUNTS -->
      <div class="card" style="margin-bottom: 14px; padding: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h4 style="font-size: 0.9rem; color: var(--text-primary);">Linked Payout Bank Account</h4>
          <span class="badge badge-verified" style="font-size: 0.65rem;">Primary Verified</span>
        </div>

        <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 12px; font-size: 0.76rem;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700; font-size: 0.88rem; color: var(--text-primary);">${bank.bankName}</span>
            <span class="mono" style="font-size: 0.7rem; color: var(--accent-emerald);">Direct Credit Ready</span>
          </div>
          <div style="margin-top: 6px; display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
            <div>
              <span style="color: var(--text-muted);">Account Holder:</span>
              <div style="font-weight: 600; color: var(--text-secondary);">${bank.accountHolderName}</div>
            </div>
            <div>
              <span style="color: var(--text-muted);">Account Number:</span>
              <div class="mono" style="font-weight: 700; color: var(--accent-gold);">***${bank.accountNumber ? bank.accountNumber.slice(-4) : '1029'}</div>
            </div>
            <div>
              <span style="color: var(--text-muted);">IFSC Code:</span>
              <div class="mono" style="font-weight: 600; color: var(--text-secondary);">${bank.ifscCode}</div>
            </div>
            <div>
              <span style="color: var(--text-muted);">Status:</span>
              <div style="font-weight: 600; color: var(--accent-emerald);">Auto-Distribution Active</div>
            </div>
          </div>
        </div>

        <button class="btn btn-secondary btn-sm" id="btn-open-request-bank-modal" style="width: 100%; margin-top: 10px; font-size: 0.75rem;">
          Request Payout Bank Account Update
        </button>
      </div>

      <!-- SECURITY & BIOMETRIC AUTH TOGGLE -->
      <div class="card" style="margin-bottom: 14px; padding: 16px;">
        <h4 style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 10px;">Security & Biometrics</h4>

        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
          <div>
            <div style="font-weight: 600; font-size: 0.82rem; color: var(--text-primary);">Biometric Unlock (FaceID / Fingerprint)</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Require native biometric authentication upon app open</div>
          </div>
          <label class="toggle-switch">
            <input type="checkbox" id="toggle-biometrics" ${store.biometricsEnabled ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-top: 1px solid var(--border-subtle);">
          <div>
            <div style="font-weight: 600; font-size: 0.82rem; color: var(--text-primary);">Session Timeout</div>
            <div style="font-size: 0.7rem; color: var(--text-muted);">Auto lock after 5 minutes of inactivity</div>
          </div>
          <span class="badge badge-verified" style="font-size: 0.65rem;">Active (5m)</span>
        </div>
      </div>

      <!-- DEDICATED SIGN OUT / LOGOUT ACTION -->
      <div class="card" style="margin-bottom: 14px; padding: 14px 16px; border: 1.5px solid rgba(239, 68, 68, 0.25); background: rgba(239, 68, 68, 0.04);">
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
          <div>
            <div style="font-weight: 700; font-size: 0.85rem; color: #ef4444; display: flex; align-items: center; gap: 6px;">
              <span>🚪</span> Account Session
            </div>
            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">
              Logged in as <strong style="color: var(--text-secondary);">${user.fullName}</strong>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" id="btn-settings-signout" style="padding: 7px 14px; font-size: 0.76rem; font-weight: 700; color: #ef4444; border-color: rgba(239, 68, 68, 0.35); background: rgba(239, 68, 68, 0.1); cursor: pointer; display: flex; align-items: center; gap: 5px;">
            <span>🚪</span> Sign Out
          </button>
        </div>
      </div>

      <!-- APP VERSION & GOVERNANCE INFO -->
      <div style="text-align: center; font-size: 0.7rem; color: var(--text-muted); padding: 10px;">
        <div>Sahasraartha Family Office LLP &bull; v1.0.0 Production</div>
        <div>Statutory Auditor: Murahari & Associates &bull; MCA India</div>
      </div>

      <!-- BANK UPDATE REQUEST MODAL -->
      ${store.activeModal === 'BANK_UPDATE' ? renderBankUpdateModal(user) : ''}

    </div>
  `;
}

function renderBankUpdateModal(user) {
  return `
    <div class="modal-backdrop active" id="bank-update-modal-backdrop">
      <div class="modal-sheet" style="max-height: 85vh; overflow-y: auto;">
        
        <div class="modal-header">
          <div>
            <span class="role-tag role-lp" style="font-size: 0.65rem;">Statutory Request</span>
            <h3 style="font-size: 1.1rem; color: var(--text-primary); margin-top: 2px;">Update Payout Bank Details</h3>
          </div>
          <button class="modal-close" id="btn-close-bank-update-modal">&times;</button>
        </div>

        <form id="form-request-bank-update" style="display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
          <p style="font-size: 0.75rem; color: var(--text-secondary);">
            Bank account changes require statutory verification with a cancelled cheque before designated distributions can be routed.
          </p>

          <div>
            <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Bank Name</label>
            <input type="text" id="input-new-bank-name" class="input" placeholder="e.g. HDFC Bank, ICICI Bank" required />
          </div>

          <div>
            <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Account Number</label>
            <input type="password" id="input-new-ac-number" class="input mono" placeholder="Enter Full Bank Account Number" required />
          </div>

          <div>
            <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Confirm Account Number</label>
            <input type="text" id="input-new-ac-number-confirm" class="input mono" placeholder="Re-enter Bank Account Number" required />
          </div>

          <div>
            <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">IFSC Code</label>
            <input type="text" id="input-new-ifsc" class="input mono" placeholder="e.g. HDFC0001824" required />
          </div>

          <div>
            <label style="font-size: 0.74rem; color: var(--text-muted); display: block; margin-bottom: 4px;">Upload Cancelled Cheque (Proof)</label>
            <div style="border: 1px dashed var(--border-color); border-radius: 6px; padding: 10px; text-align: center; background: rgba(255,255,255,0.01);">
              <span style="font-size: 0.72rem; color: var(--accent-gold);">Attach Cancelled Cheque Leaf (JPEG/PDF)</span>
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="margin-top: 4px;">
            Submit Bank Change Request
          </button>
        </form>

      </div>
    </div>
  `;
}

export function attachPartnerSettingsEvents() {
  // Biometrics toggle
  const bioToggle = document.getElementById('toggle-biometrics');
  if (bioToggle) {
    bioToggle.addEventListener('change', () => {
      store.toggleBiometrics();
      alert(`Biometric Authentication ${store.biometricsEnabled ? 'Enabled' : 'Disabled'}`);
    });
  }

  // Open bank update modal
  document.getElementById('btn-open-request-bank-modal')?.addEventListener('click', () => {
    store.openModal('BANK_UPDATE');
  });

  document.getElementById('btn-close-bank-update-modal')?.addEventListener('click', () => {
    store.closeModal();
  });

  // Submit bank update form
  const bankForm = document.getElementById('form-request-bank-update');
  if (bankForm) {
    bankForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const bankName = document.getElementById('input-new-bank-name')?.value;
      const acNum = document.getElementById('input-new-ac-number')?.value;
      const ifsc = document.getElementById('input-new-ifsc')?.value;

      store.requestBankUpdate({
        partnerId: store.currentUser.partnerId,
        bankName,
        accountNumber: acNum,
        ifscCode: ifsc,
        accountHolderName: store.currentUser.legalName
      });

      alert(`Bank update request for ${bankName} submitted! Designated Managing Partner will verify before next distribution run.`);
      store.closeModal();
    });
  }
}
