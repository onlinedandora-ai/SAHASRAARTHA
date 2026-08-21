/**
 * iOS Native Authentication Page (Apple Cupertino)
 * Modern Light Orange & Crisp White Theme:
 * - Glowing Emblem Logo (Double Ring in Sunset Orange)
 * - "Welcome to Sahasraartha"
 * - "Your Personal Family Office & Wealth Portfolio Manager"
 * - Outline "Login with Phone" & "Login with Email" Buttons (White with light orange border)
 * - "OR" Divider
 * - "Continue with Google" (with Official Google G Logo)
 * - "Continue with Apple" (with Official Apple Logo)
 * - Full Partner Select & Sign Up Sheet (Managing Partner, Designated Partner, Individual LP)
 */

import { store } from '../../state/store.js';

let activeAuthMode = null; // null | 'phone' | 'email' | 'persona' | 'signup' | 'otp'
let activeSheetTab = 'select'; // 'select' | 'signup'
let selectedRoleFilter = 'ALL'; // 'ALL' | 'ADMIN' | 'DESIGNATED' | 'LP'
let searchQuery = '';
let enteredIdentifier = '';

export function renderIOSLogin() {
  const superAdmins = store.partners.filter(p => p.role === 'ADMIN' || p.role === 'SUPER_ADMIN' || p.partnerId === 'SH-SA-001');
  const committeeMembers = store.partners.filter(p => p.role === 'DESIGNATED_PARTNER' || p.role === 'COMMITTEE');
  const lps = store.partners.filter(p => !superAdmins.some(a => a.partnerId === p.partnerId) && !committeeMembers.some(c => c.partnerId === p.partnerId));

  let filteredPartners = store.partners;
  if (selectedRoleFilter === 'ADMIN') filteredPartners = superAdmins;
  else if (selectedRoleFilter === 'DESIGNATED') filteredPartners = committeeMembers;
  else if (selectedRoleFilter === 'LP') filteredPartners = lps;

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredPartners = filteredPartners.filter(p => 
      p.fullName.toLowerCase().includes(q) || 
      p.partnerId.toLowerCase().includes(q) || 
      p.email.toLowerCase().includes(q) || 
      (p.dpin && p.dpin.toLowerCase().includes(q))
    );
  }

  return `
    <div class="auth-screen-container">
      
      <!-- Top Brand Emblem & Title -->
      <div class="auth-brand-wrapper">
        <div class="auth-glowing-circle">
          <div class="auth-logo-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
        </div>

        <h1 class="auth-title">Welcome to Sahasraartha</h1>
        <p class="auth-subtitle">Your Personal Family Office & Wealth Portfolio Manager</p>
      </div>

      <!-- Action Button Stack -->
      <div class="auth-button-stack">
        
        <!-- 1. Login with Phone -->
        <button class="auth-pill-btn-outline" id="btn-login-phone-ios">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
          <span>Login with Phone</span>
        </button>

        <!-- 2. Login with Email -->
        <button class="auth-pill-btn-outline" id="btn-login-email-ios">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <span>Login with Email</span>
        </button>

        <!-- Divider -->
        <div class="auth-divider">
          <div class="auth-divider-line"></div>
          <span class="auth-divider-text">OR</span>
          <div class="auth-divider-line"></div>
        </div>

        <!-- 3. Continue with Google -->
        <button class="auth-pill-btn-blue" id="btn-continue-google-ios">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <!-- 4. Continue with Apple -->
        <button class="auth-pill-btn-dark" id="btn-continue-apple-ios">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.56.65-.99 1.7-0.88 2.72 1.01.08 2-.48 2.61-1.22z"/>
          </svg>
          <span>Continue with Apple</span>
        </button>

      </div>

      <!-- Footer Section -->
      <div class="auth-footer">
        <div class="auth-footer-prompt">
          Don't have an account? <span class="auth-footer-link" id="btn-open-persona-sheet-ios">Sign Up</span>
        </div>
        <div class="auth-footer-legal">
          <span>Terms and Cookies</span> &bull; <span>Privacy Policy</span>
        </div>
      </div>

      <!-- Clean Modal Sheet for Phone/Email/OTP/Persona/Sign Up -->
      ${activeAuthMode ? `
        <div class="auth-sheet-backdrop" id="auth-sheet-backdrop-ios">
          <div class="auth-sheet-dialog" id="auth-sheet-dialog-ios">
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <h3 style="font-size: 1.15rem; color: #1e293b; margin: 0; font-weight: 800;">
                  ${activeAuthMode === 'phone' ? 'Phone Number Login' :
                    activeAuthMode === 'email' ? 'Email Login' :
                    activeAuthMode === 'otp' ? 'Enter 6-Digit OTP' :
                    activeSheetTab === 'signup' ? 'Partner Registration' :
                    'Choose Partner Account'}
                </h3>
                <p style="font-size: 0.78rem; color: #64748b; margin-top: 2px;">Managing Partner &bull; Designated Partner &bull; Individual LP</p>
              </div>
              <button class="modal-close" id="btn-close-auth-sheet-ios" style="background: #f1f5f9; border: none; color: #64748b; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">&times;</button>
            </div>

            ${activeAuthMode === 'phone' || activeAuthMode === 'email' ? `
              <div class="form-group" style="margin-bottom: 16px;">
                <label style="font-size: 0.76rem; color: #64748b; display: block; margin-bottom: 6px; text-transform: uppercase; font-weight: 700;">
                  ${activeAuthMode === 'phone' ? 'Mobile Number' : 'Email Address'}
                </label>
                <input type="text" id="auth-sheet-input-ios" class="m3-input" placeholder="${activeAuthMode === 'phone' ? 'Enter mobile (e.g. +91 9821837797)' : 'Enter email (e.g. srikanth@sahasraartha.in)'}" value="" style="width: 100%; padding: 14px; background: #f8f4ee; border: 1.5px solid #ede4da; border-radius: 12px; color: #1e293b; font-size: 0.95rem; outline: none; box-sizing: border-box;">
              </div>

              <button class="auth-pill-btn-orange" id="btn-sheet-send-otp-ios">
                <span>Send OTP</span>
              </button>
            ` : activeAuthMode === 'otp' ? `
              <div style="text-align: center; margin-bottom: 16px;">
                <p style="font-size: 0.82rem; color: #64748b;">Please enter the 6-digit verification code sent to your device</p>
              </div>

              <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 20px;" id="otp-inputs-container-ios">
                <input type="tel" maxlength="1" class="android-otp-box otp-digit-input-ios" data-index="0" value="" placeholder="•" autofocus>
                <input type="tel" maxlength="1" class="android-otp-box otp-digit-input-ios" data-index="1" value="" placeholder="•">
                <input type="tel" maxlength="1" class="android-otp-box otp-digit-input-ios" data-index="2" value="" placeholder="•">
                <input type="tel" maxlength="1" class="android-otp-box otp-digit-input-ios" data-index="3" value="" placeholder="•">
                <input type="tel" maxlength="1" class="android-otp-box otp-digit-input-ios" data-index="4" value="" placeholder="•">
                <input type="tel" maxlength="1" class="android-otp-box otp-digit-input-ios" data-index="5" value="" placeholder="•">
              </div>

              <button class="auth-pill-btn-orange" id="btn-sheet-verify-otp-ios">
                <span>Verify & Login</span>
              </button>
            ` : `
              <!-- Partner Account Selection & Sign Up Tabs -->
              <div class="auth-sheet-tabs" style="display: flex; gap: 8px; margin-bottom: 12px; background: #f1f5f9; padding: 4px; border-radius: 10px;">
                <button id="tab-btn-select-partner-ios" class="auth-tab-btn ${activeSheetTab === 'select' ? 'active' : ''}" style="flex: 1; padding: 8px 10px; font-size: 0.78rem; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; background: ${activeSheetTab === 'select' ? '#ffffff' : 'transparent'}; color: ${activeSheetTab === 'select' ? '#ea580c' : '#64748b'}; box-shadow: ${activeSheetTab === 'select' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'};">
                  Select Role & Account
                </button>
                <button id="tab-btn-signup-partner-ios" class="auth-tab-btn ${activeSheetTab === 'signup' ? 'active' : ''}" style="flex: 1; padding: 8px 10px; font-size: 0.78rem; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; background: ${activeSheetTab === 'signup' ? '#ffffff' : 'transparent'}; color: ${activeSheetTab === 'signup' ? '#ea580c' : '#64748b'}; box-shadow: ${activeSheetTab === 'signup' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'};">
                  + New Sign Up
                </button>
              </div>

              ${activeSheetTab === 'select' ? `
                <!-- Filter Chips & Search Box -->
                <div style="margin-bottom: 10px; display: flex; flex-direction: column; gap: 8px;">
                  <input type="text" id="partner-search-input-ios" placeholder="Search partner name or ID..." value="${searchQuery}" style="width: 100%; padding: 8px 12px; font-size: 0.82rem; border-radius: 8px; border: 1px solid #ede4da; background: #fbf8f4; outline: none; box-sizing: border-box;">

                  <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px;">
                    <button class="role-chip-ios ${selectedRoleFilter === 'ALL' ? 'active' : ''}" data-filter="ALL" style="padding: 4px 8px; border-radius: 6px; font-size: 0.68rem; font-weight: 700; border: 1px solid ${selectedRoleFilter === 'ALL' ? '#ea580c' : '#ede4da'}; background: ${selectedRoleFilter === 'ALL' ? '#fff7ed' : '#ffffff'}; color: ${selectedRoleFilter === 'ALL' ? '#ea580c' : '#64748b'}; cursor: pointer; white-space: nowrap;">
                      All (${store.partners.length})
                    </button>
                    <button class="role-chip-ios ${selectedRoleFilter === 'ADMIN' ? 'active' : ''}" data-filter="ADMIN" style="padding: 4px 8px; border-radius: 6px; font-size: 0.68rem; font-weight: 700; border: 1px solid ${selectedRoleFilter === 'ADMIN' ? '#ea580c' : '#ede4da'}; background: ${selectedRoleFilter === 'ADMIN' ? '#fff7ed' : '#ffffff'}; color: ${selectedRoleFilter === 'ADMIN' ? '#ea580c' : '#64748b'}; cursor: pointer; white-space: nowrap;">
                      Managing Partner (${superAdmins.length})
                    </button>
                    <button class="role-chip-ios ${selectedRoleFilter === 'DESIGNATED' ? 'active' : ''}" data-filter="DESIGNATED" style="padding: 4px 8px; border-radius: 6px; font-size: 0.68rem; font-weight: 700; border: 1px solid ${selectedRoleFilter === 'DESIGNATED' ? '#2563eb' : '#ede4da'}; background: ${selectedRoleFilter === 'DESIGNATED' ? '#eff6ff' : '#ffffff'}; color: ${selectedRoleFilter === 'DESIGNATED' ? '#2563eb' : '#64748b'}; cursor: pointer; white-space: nowrap;">
                      Designated (${committeeMembers.length})
                    </button>
                    <button class="role-chip-ios ${selectedRoleFilter === 'LP' ? 'active' : ''}" data-filter="LP" style="padding: 4px 8px; border-radius: 6px; font-size: 0.68rem; font-weight: 700; border: 1px solid ${selectedRoleFilter === 'LP' ? '#10b981' : '#ede4da'}; background: ${selectedRoleFilter === 'LP' ? '#ecfdf5' : '#ffffff'}; color: ${selectedRoleFilter === 'LP' ? '#10b981' : '#64748b'}; cursor: pointer; white-space: nowrap;">
                      Individual LP (${lps.length})
                    </button>
                  </div>
                </div>

                <!-- Direct Partner Whitelist Switcher List -->
                <div style="display: flex; flex-direction: column; gap: 6px; max-height: 260px; overflow-y: auto; padding-right: 4px;" id="sheet-partners-list-ios">
                  ${filteredPartners.length === 0 ? `
                    <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 0.82rem;">
                      No partners found matching "${searchQuery}"
                    </div>
                  ` : filteredPartners.map(p => {
                    const isSA = superAdmins.some(a => a.partnerId === p.partnerId);
                    const isDP = committeeMembers.some(c => c.partnerId === p.partnerId);
                    const roleLabel = isSA ? 'Managing Partner' : isDP ? 'Designated Partner' : 'Individual LP';
                    const roleColor = isSA ? '#ea580c' : isDP ? '#2563eb' : '#10b981';
                    const roleBg = isSA ? '#fff7ed' : isDP ? '#eff6ff' : '#ecfdf5';

                    return `
                      <button class="btn btn-secondary btn-sm sheet-partner-btn-ios" data-id="${p.partnerId}" style="display: flex; justify-content: space-between; align-items: center; text-align: left; padding: 10px 12px; border-radius: 12px; background: #ffffff; border: 1px solid #ede4da; cursor: pointer; width: 100%; transition: all 0.15s ease;">
                        <div style="overflow: hidden; text-overflow: ellipsis; padding-right: 8px;">
                          <div style="font-weight: 700; color: #1e293b; font-size: 0.84rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.fullName}</div>
                          <div style="font-size: 0.68rem; color: #64748b; font-family: monospace;">${p.partnerId} &bull; ${p.mobile}</div>
                        </div>
                        <span style="font-size: 0.65rem; font-weight: 700; color: ${roleColor}; background: ${roleBg}; padding: 3px 8px; border-radius: 6px; white-space: nowrap;">
                          ${roleLabel}
                        </span>
                      </button>
                    `;
                  }).join('')}
                </div>
              ` : `
                <!-- New Partner Registration Form -->
                <div style="display: flex; flex-direction: column; gap: 10px; max-height: 300px; overflow-y: auto; padding-right: 4px;" id="sheet-signup-form-ios">
                  <div>
                    <label style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Full Legal Name</label>
                    <input type="text" id="signup-fullname-ios" placeholder="e.g. Ramesh Kumar Ayinavolu" style="width: 100%; padding: 9px 12px; font-size: 0.84rem; border-radius: 8px; border: 1px solid #ede4da; background: #fbf8f4; outline: none; box-sizing: border-box;">
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div>
                      <label style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Email Address</label>
                      <input type="email" id="signup-email-ios" placeholder="ramesh@sahasraartha.in" style="width: 100%; padding: 9px 12px; font-size: 0.84rem; border-radius: 8px; border: 1px solid #ede4da; background: #fbf8f4; outline: none; box-sizing: border-box;">
                    </div>
                    <div>
                      <label style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Mobile Number</label>
                      <input type="tel" id="signup-mobile-ios" placeholder="+91 98450 12345" style="width: 100%; padding: 9px 12px; font-size: 0.84rem; border-radius: 8px; border: 1px solid #ede4da; background: #fbf8f4; outline: none; box-sizing: border-box;">
                    </div>
                  </div>

                  <div>
                    <label style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Partner Role</label>
                    <select id="signup-role-ios" style="width: 100%; padding: 9px 12px; font-size: 0.84rem; border-radius: 8px; border: 1px solid #ede4da; background: #fbf8f4; outline: none; box-sizing: border-box; color: #1e293b;">
                      <option value="LP">Individual LP Partner (Limited Partner)</option>
                      <option value="DESIGNATED_PARTNER">Designated Partner (Investment Committee)</option>
                      <option value="ADMIN">Managing Partner (Super Admin)</option>
                    </select>
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div>
                      <label style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Capital (₹)</label>
                      <input type="number" id="signup-capital-ios" placeholder="500000" value="500000" style="width: 100%; padding: 9px 12px; font-size: 0.84rem; border-radius: 8px; border: 1px solid #ede4da; background: #fbf8f4; outline: none; box-sizing: border-box;">
                    </div>
                    <div>
                      <label style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">PAN / DPIN</label>
                      <input type="text" id="signup-pan-ios" placeholder="ABCDE1234F" style="width: 100%; padding: 9px 12px; font-size: 0.84rem; border-radius: 8px; border: 1px solid #ede4da; background: #fbf8f4; outline: none; box-sizing: border-box;">
                    </div>
                  </div>

                  <button class="auth-pill-btn-orange" id="btn-submit-signup-ios" style="margin-top: 6px;">
                    <span>Complete Sign Up & Enter Portal</span>
                  </button>
                </div>
              `}
            `}

          </div>
        </div>
      ` : ''}

    </div>
  `;
}

export function attachIOSLoginEvents(onLoginSuccess) {
  // Login with Phone
  document.getElementById('btn-login-phone-ios')?.addEventListener('click', () => {
    activeAuthMode = 'phone';
    store.notify();
  });

  // Login with Email
  document.getElementById('btn-login-email-ios')?.addEventListener('click', () => {
    activeAuthMode = 'email';
    store.notify();
  });

  // Continue with Google
  document.getElementById('btn-continue-google-ios')?.addEventListener('click', () => {
    store.setCurrentUser('SH-SA-001');
    activeAuthMode = null;
    if (onLoginSuccess) onLoginSuccess();
  });

  // Continue with Apple
  document.getElementById('btn-continue-apple-ios')?.addEventListener('click', () => {
    store.setCurrentUser('SH-LP-001');
    activeAuthMode = null;
    if (onLoginSuccess) onLoginSuccess();
  });

  // Open Persona switch sheet / Sign Up
  document.getElementById('btn-open-persona-sheet-ios')?.addEventListener('click', () => {
    activeAuthMode = 'persona';
    activeSheetTab = 'select';
    store.notify();
  });

  // Close sheet
  document.getElementById('btn-close-auth-sheet-ios')?.addEventListener('click', () => {
    activeAuthMode = null;
    store.notify();
  });

  // Close when clicking outside dialog
  document.getElementById('auth-sheet-backdrop-ios')?.addEventListener('click', (e) => {
    if (e.target.id === 'auth-sheet-backdrop-ios') {
      activeAuthMode = null;
      store.notify();
    }
  });

  // Tab switching
  document.getElementById('tab-btn-select-partner-ios')?.addEventListener('click', () => {
    activeSheetTab = 'select';
    store.notify();
  });

  document.getElementById('tab-btn-signup-partner-ios')?.addEventListener('click', () => {
    activeSheetTab = 'signup';
    store.notify();
  });

  // Role chip filtering
  document.querySelectorAll('.role-chip-ios').forEach(chip => {
    chip.addEventListener('click', () => {
      selectedRoleFilter = chip.getAttribute('data-filter') || 'ALL';
      store.notify();
    });
  });

  // Search input
  const searchInput = document.getElementById('partner-search-input-ios');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      store.notify();
      setTimeout(() => {
        const renewedInput = document.getElementById('partner-search-input-ios');
        if (renewedInput) {
          renewedInput.focus();
          renewedInput.setSelectionRange(searchQuery.length, searchQuery.length);
        }
      }, 50);
    });
  }

  // Send OTP
  document.getElementById('btn-sheet-send-otp-ios')?.addEventListener('click', () => {
    const input = document.getElementById('auth-sheet-input-ios');
    enteredIdentifier = input ? input.value.trim() : '';
    activeAuthMode = 'otp';
    store.notify();
  });

  // OTP Auto-Advance and Input Navigation
  const otpInputs = document.querySelectorAll('.otp-digit-input-ios');
  if (otpInputs.length > 0) {
    otpInputs.forEach((input, idx) => {
      input.addEventListener('input', (e) => {
        const val = e.target.value;
        if (val.length > 0) {
          e.target.value = val.slice(-1);
          if (idx < otpInputs.length - 1) {
            otpInputs[idx + 1].focus();
            otpInputs[idx + 1].select();
          }
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace') {
          if (!e.target.value && idx > 0) {
            otpInputs[idx - 1].focus();
            otpInputs[idx - 1].value = '';
          }
        } else if (e.key === 'ArrowLeft' && idx > 0) {
          otpInputs[idx - 1].focus();
        } else if (e.key === 'ArrowRight' && idx < otpInputs.length - 1) {
          otpInputs[idx + 1].focus();
        } else if (e.key === 'Enter') {
          document.getElementById('btn-sheet-verify-otp-ios')?.click();
        }
      });

      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const pasteData = (e.clipboardData || window.clipboardData).getData('text').trim();
        if (pasteData) {
          const digits = pasteData.replace(/\D/g, '').slice(0, 6);
          digits.split('').forEach((d, i) => {
            if (otpInputs[i]) otpInputs[i].value = d;
          });
          const nextFocus = Math.min(digits.length, otpInputs.length - 1);
          otpInputs[nextFocus].focus();
        }
      });
    });

    setTimeout(() => {
      otpInputs[0]?.focus();
    }, 100);
  }

  // Verify OTP
  document.getElementById('btn-sheet-verify-otp-ios')?.addEventListener('click', () => {
    const matched = store.partners.find(p => 
      (enteredIdentifier && p.email.toLowerCase().includes(enteredIdentifier.toLowerCase())) || 
      (enteredIdentifier && p.mobile.includes(enteredIdentifier)) || 
      (enteredIdentifier && p.partnerId.toLowerCase() === enteredIdentifier.toLowerCase())
    ) || store.partners[0];

    store.setCurrentUser(matched.partnerId);
    activeAuthMode = null;
    if (onLoginSuccess) onLoginSuccess();
  });

  // Sheet Partner Selection
  document.querySelectorAll('.sheet-partner-btn-ios').forEach(btn => {
    btn.addEventListener('click', () => {
      const partnerId = btn.getAttribute('data-id');
      store.setCurrentUser(partnerId);
      activeAuthMode = null;
      if (onLoginSuccess) onLoginSuccess();
    });
  });

  // New Partner Sign Up Submission
  document.getElementById('btn-submit-signup-ios')?.addEventListener('click', () => {
    const fullName = document.getElementById('signup-fullname-ios')?.value.trim();
    const email = document.getElementById('signup-email-ios')?.value.trim();
    const mobile = document.getElementById('signup-mobile-ios')?.value.trim();
    const role = document.getElementById('signup-role-ios')?.value || 'PARTNER';
    const capital = Number(document.getElementById('signup-capital-ios')?.value || 500000);
    const pan = document.getElementById('signup-pan-ios')?.value.trim();

    if (!fullName) {
      alert('Please enter your Full Legal Name');
      return;
    }

    store.registerPartner({
      fullName,
      email,
      mobile,
      role,
      committedCapital: capital,
      pan
    });

    activeAuthMode = null;
    if (onLoginSuccess) onLoginSuccess();
  });
}
