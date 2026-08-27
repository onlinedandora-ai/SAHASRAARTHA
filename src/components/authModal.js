/**
 * Screen 1: Direct Partner & Admin Account Chooser (Zero Passwords, Zero OTPs)
 */

import { store } from '../state/store.js';

export function renderAuthModal({ isOpen, onClose }) {
  if (!isOpen) return '';

  const partners = store.partners;
  const superAdmins = partners.filter(p => p.role === 'ADMIN' || p.role === 'SUPER_ADMIN' || p.partnerId === 'SH-SA-001');
  const committeeMembers = partners.filter(p => p.role === 'DESIGNATED_PARTNER' || p.role === 'COMMITTEE');
  const lps = partners.filter(p => !superAdmins.some(a => a.partnerId === p.partnerId) && !committeeMembers.some(c => c.partnerId === p.partnerId));

  return `
    <div class="modal-overlay" id="auth-modal-overlay">
      <div class="modal-dialog" style="max-width: 540px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="brand-logo-icon" style="width: 36px; height: 36px; font-size: 1.1rem;">S</div>
            <div>
              <h3 class="modal-title" style="font-size: 1.1rem;">Sahasraartha Family Office</h3>
              <p style="font-size: 0.76rem; color: var(--text-muted);">Direct 1-Click Partner Authentication</p>
            </div>
          </div>
          <button class="modal-close-btn" id="btn-close-auth-modal">&times;</button>
        </div>

        <div class="modal-body">
          <div style="margin-bottom: 16px;">
            <div class="form-group">
              <label class="form-label">Search or Enter Partner Name / ID / Mobile</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="auth-input-id" class="form-input" placeholder="e.g. Srikanth, 9821837797, SH-SA-001" value="" style="flex: 1;">
                <button class="btn btn-primary" id="btn-quick-login-modal">Direct Login</button>
              </div>
            </div>
          </div>

          <div style="font-size: 0.76rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">
            Select Member Account (1-Click Instant Login)
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 280px; overflow-y: auto; padding-right: 4px;">
            ${partners.map(p => {
              const isSuper = p.role === 'ADMIN' || p.role === 'SUPER_ADMIN' || p.partnerId === 'SH-SA-001';
              const isDesignated = p.role === 'DESIGNATED_PARTNER';
              return `
                <div class="modal-partner-select-btn" data-id="${p.partnerId}" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; cursor: pointer; transition: all 0.15s ease;">
                  <div>
                    <div style="font-weight: 700; font-size: 0.86rem; color: var(--text-primary);">${p.fullName}</div>
                    <div style="font-size: 0.72rem; color: #ea580c;">${p.partnerId} ${p.mobile ? `&bull; ${p.mobile}` : ''}</div>
                  </div>
                  <span class="badge ${isSuper ? 'badge-active' : isDesignated ? 'badge-verified' : ''}" style="font-size: 0.65rem;">
                    ${isSuper ? 'Managing Partner' : isDesignated ? 'Designated Partner' : 'Official LP'}
                  </span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

export function attachAuthEvents() {
  const btnClose = document.getElementById('btn-close-auth-modal');
  const btnQuickLogin = document.getElementById('btn-quick-login-modal');

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      const modal = document.getElementById('auth-modal-overlay');
      if (modal) modal.remove();
    });
  }

  const loginPartnerId = (partnerId) => {
    const matched = store.partners.find(p => p.partnerId === partnerId) || store.partners[0];
    const profile = {
      displayName: `${matched.fullName} (${matched.role})`,
      email: matched.email,
      phoneNumber: matched.mobile,
      photoURL: ''
    };
    store.setFirebaseUser(profile);
    store.loginPartner(matched.partnerId);
    const modal = document.getElementById('auth-modal-overlay');
    if (modal) modal.remove();
  };

  if (btnQuickLogin) {
    btnQuickLogin.addEventListener('click', () => {
      const inputVal = document.getElementById('auth-input-id')?.value.toLowerCase().trim();
      const matched = store.partners.find(p => 
        (p.email && p.email.toLowerCase().includes(inputVal)) || 
        (p.mobile && p.mobile.includes(inputVal)) || 
        (p.partnerId && p.partnerId.toLowerCase() === inputVal) ||
        (p.fullName && p.fullName.toLowerCase().includes(inputVal))
      ) || store.partners[0];

      loginPartnerId(matched.partnerId);
    });
  }

  document.querySelectorAll('.modal-partner-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      loginPartnerId(id);
    });
  });
}
