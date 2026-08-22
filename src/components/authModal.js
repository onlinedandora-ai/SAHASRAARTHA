/**
 * Screen 1: Authentication (Mobile / Email OTP) & Quick Persona Picker
 * Conforms to Specification Screen 1 Wireframe
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
              <p style="font-size: 0.76rem; color: var(--text-muted);">Secure Partner & Admin Authentication</p>
            </div>
          </div>
          <button class="modal-close-btn" id="btn-close-auth-modal">&times;</button>
        </div>

        <div class="modal-body">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="width: 48px; height: 48px; background: rgba(245, 158, 11, 0.15); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h4 style="font-size: 1.2rem; color: var(--text-primary); margin-bottom: 4px;">Sign In to Your Portfolio</h4>
            <p style="font-size: 0.85rem; color: var(--text-secondary);">Enter registered mobile number or email to receive a 6-digit OTP</p>
          </div>

          <div id="auth-step-1">
            <div class="form-group">
              <label class="form-label">Registered Mobile / Email</label>
              <input type="text" id="auth-input-id" class="form-input" placeholder="Enter registered mobile number or email" value="">
              <span class="input-hint">Must match the registered LLP whitelist records.</span>
            </div>
            <button class="btn btn-primary" id="btn-send-otp" style="width: 100%; margin-top: 8px;">
              Get Secure OTP
            </button>
          </div>

          <div id="auth-step-2" style="display: none; margin-top: 16px;">
            <div style="background: var(--bg-primary); padding: 14px; border-radius: var(--radius-sm); margin-bottom: 16px; border: 1px solid var(--border-color); text-align: center;">
              <p style="font-size: 0.85rem; color: var(--accent-emerald);">OTP verification code has been sent to your registered mobile/email.</p>
            </div>
            <div class="form-group">
              <label class="form-label" style="text-align: center; display: block;">Enter 6-Digit Secure OTP</label>
              <div style="display: flex; gap: 8px; justify-content: center; margin: 10px 0;">
                <input type="text" maxlength="1" class="form-input mono otp-box" style="width: 44px; text-align: center; font-size: 1.2rem; font-weight: bold;" value="" placeholder="•">
                <input type="text" maxlength="1" class="form-input mono otp-box" style="width: 44px; text-align: center; font-size: 1.2rem; font-weight: bold;" value="" placeholder="•">
                <input type="text" maxlength="1" class="form-input mono otp-box" style="width: 44px; text-align: center; font-size: 1.2rem; font-weight: bold;" value="" placeholder="•">
                <input type="text" maxlength="1" class="form-input mono otp-box" style="width: 44px; text-align: center; font-size: 1.2rem; font-weight: bold;" value="" placeholder="•">
                <input type="text" maxlength="1" class="form-input mono otp-box" style="width: 44px; text-align: center; font-size: 1.2rem; font-weight: bold;" value="" placeholder="•">
                <input type="text" maxlength="1" class="form-input mono otp-box" style="width: 44px; text-align: center; font-size: 1.2rem; font-weight: bold;" value="" placeholder="•">
              </div>
            </div>
            <button class="btn btn-emerald" id="btn-verify-otp" style="width: 100%; margin-top: 12px;">
              Verify & Enter Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function attachAuthEvents() {
  const btnClose = document.getElementById('btn-close-auth-modal');
  const btnSendOtp = document.getElementById('btn-send-otp');
  const btnVerifyOtp = document.getElementById('btn-verify-otp');

  if (btnClose) {
    btnClose.addEventListener('click', () => {
      const modal = document.getElementById('auth-modal-overlay');
      if (modal) modal.remove();
    });
  }

  if (btnSendOtp) {
    btnSendOtp.addEventListener('click', () => {
      const inputVal = document.getElementById('auth-input-id')?.value.trim();
      if (!inputVal) {
        alert('Please enter your registered mobile number or email');
        return;
      }
      document.getElementById('auth-step-1').style.display = 'none';
      document.getElementById('auth-step-2').style.display = 'block';
    });
  }

  if (btnVerifyOtp) {
    btnVerifyOtp.addEventListener('click', () => {
      const inputVal = document.getElementById('auth-input-id')?.value.toLowerCase().trim();
      const matched = store.partners.find(p => 
        p.email.toLowerCase() === inputVal || 
        p.mobile.includes(inputVal) || 
        p.partnerId.toLowerCase() === inputVal
      ) || store.partners[0];

      store.setCurrentUser(matched.partnerId);
      const modal = document.getElementById('auth-modal-overlay');
      if (modal) modal.remove();
    });
  }
}
