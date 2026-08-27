/**
 * Android & Mobile Reference-Matching Authentication Screen
 * Layout faithfully reproduces the reference screen:
 * - Top-right "Dark/Light" pill toggle
 * - SFO Circular Gold Mandala Logo & Subtitle
 * - [🔒 Super Admin Password Login]
 * - [📱 Login with Phone (OTP)]
 * - [✉️ Login with Email (OTP)]
 * - ─── OR ───
 * - [G Continue with Google]
 * - [ Continue with Apple]
 * - "Official Partner? Partner Whitelist" (Click to open 28 Partner Accounts Sheet)
 * - Terms and Cookies • Privacy Policy
 */

import { store } from '../../state/store.js';
import { renderSFOLogo } from '../../components/sfoLogo.js';
import {
  signInWithGoogle,
  sendPhoneOTP,
  verifyPhoneOTP,
  sendEmailOTP,
  verifyEmailOTP
} from '../../services/firebaseAuth.js';

let selectedRoleFilter = 'ALL'; // 'ALL' | 'ADMIN' | 'DESIGNATED' | 'LP'
let searchQuery = '';
let activeSheet = null; // 'SUPER_ADMIN' | 'PHONE_OTP' | 'EMAIL_OTP' | 'PARTNER_WHITELIST' | null
let otpStep = 'INPUT'; // 'INPUT' | 'VERIFY'
let pendingPhoneValue = '';
let pendingEmailValue = '';

function normalizeMobile(str) {
  if (!str) return '';
  const digits = str.replace(/\D/g, '');
  return digits.slice(-10);
}

/**
 * Strictly verifies whether an identifier belongs to an authorized whitelist partner.
 */
export function findPartnerByIdentifier(identifier) {
  if (!identifier || typeof identifier !== 'string') return null;
  const raw = identifier.trim();
  if (!raw) return null;
  const lower = raw.toLowerCase();
  const digits = raw.replace(/\D/g, '').slice(-10);

  // Check Super Admin Srikanth Ayinavolu
  if (
    lower === 'srikanth@sahasraartha.in' ||
    lower === 'srikanth.ayinavolu@gmail.com' ||
    lower === 'sahasraarthasfo@gmail.com' ||
    lower === 'srikanth.a3@gmail.com' ||
    digits === '9821837797' ||
    digits === '9870366699' ||
    raw === '08923412' ||
    raw === 'SH-SA-001' ||
    raw === 'CZHPA9322F'
  ) {
    return store.partners.find(p => p.partnerId === 'SH-SA-001') || null;
  }

  // Match against the 28 registered partner whitelist
  return store.partners.find(p => {
    const pDigits = normalizeMobile(p.mobile);
    const inAliases = Array.isArray(p.aliases) && p.aliases.some(a => {
      const aLower = a.toLowerCase();
      const aDigits = a.replace(/\D/g, '').slice(-10);
      return aLower === lower || (digits && digits.length === 10 && aDigits === digits);
    });

    const isEmail = p.email && p.email.toLowerCase() === lower;
    const isMobile = digits && digits.length === 10 && pDigits === digits;
    const isId = p.partnerId && p.partnerId.toLowerCase() === lower;
    const isDPIN = p.dpin && p.dpin.toLowerCase() === lower;
    const isPAN = p.pan && p.pan.toLowerCase() === lower;
    const isName = p.fullName && (p.fullName.toLowerCase() === lower || p.fullName.toLowerCase().includes(lower));

    return isEmail || inAliases || isMobile || isId || isDPIN || isPAN || (lower.length >= 3 && isName);
  }) || null;
}

function executeDirectLogin(partner, onLoginSuccess) {
  if (!partner) return;
  const profile = {
    displayName: `${partner.fullName} (${partner.role})`,
    email: partner.email || `${partner.partnerId.toLowerCase()}@sahasraartha.in`,
    phoneNumber: partner.mobile || '',
    photoURL: ''
  };
  store.setFirebaseUser(profile);
  store.loginPartner(partner.partnerId);
  activeSheet = null;
  if (onLoginSuccess) onLoginSuccess();
}

export function renderAndroidLogin() {
  const allPartners = store.partners || [];

  return `
    <div class="auth-screen-container">
      
      <!-- Top Action Bar (Theme Toggle) -->
      <div style="position: absolute; top: 16px; right: 18px; z-index: 20;">
        <button class="auth-theme-toggle-btn" id="btn-login-theme-toggle" title="${store.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}">
          ${store.theme === 'dark' ? `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            <span>Light</span>
          ` : `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <span>Dark</span>
          `}
        </button>
      </div>

      <!-- Top SFO Circular Mandala Emblem -->
      <div class="auth-brand-wrapper">
        ${renderSFOLogo({ width: 145 })}
        <p class="auth-subtitle">Your Personal Family Office & Wealth Portfolio Manager</p>
      </div>

      <!-- Main Login Button Stack matching Reference Image -->
      <div class="auth-button-stack">
        
        <!-- 1. Super Admin Login -->
        <button class="auth-pill-btn-orange" id="btn-super-admin-action">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Super Admin Login</span>
        </button>

        <!-- 2. Login with Phone -->
        <button class="auth-pill-btn-outline" id="btn-login-phone-action">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
            <line x1="12" y1="18" x2="12.01" y2="18"></line>
          </svg>
          <span>Login with Phone</span>
        </button>

        <!-- 3. Login with Email -->
        <button class="auth-pill-btn-outline" id="btn-login-email-action">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <span>Login with Email</span>
        </button>

        <!-- Separator: OR -->
        <div class="auth-divider">
          <div class="auth-divider-line"></div>
          <span class="auth-divider-text">OR</span>
          <div class="auth-divider-line"></div>
        </div>

        <!-- 4. Continue with Google -->
        <button class="auth-pill-btn-blue" id="btn-continue-google-action">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <!-- 5. Continue with Apple -->
        <button class="auth-pill-btn-dark" id="btn-continue-apple-action">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.56.65-.99 1.7-0.88 2.72 1.01.08 2-.48 2.61-1.22z"/>
          </svg>
          <span>Continue with Apple</span>
        </button>

      </div>

      <!-- Partner Wishlist / Test Account Selector -->
      <div class="auth-managing-prompt" style="margin-top: 24px;">
        Official Member or Testing? <a class="auth-link-orange" id="link-partner-whitelist-btn">Partner Wishlist</a>
      </div>

      <!-- Footer matching reference -->
      <div class="auth-footer" style="margin-top: 10px;">
        <div class="auth-footer-legal">
          <span>Terms and Cookies</span> &bull; <span>Privacy Policy</span>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- MODAL SHEETS (Partner Whitelist, Super Admin, Phone, Email)-->
      <!-- ======================================================== -->
      ${renderAuthModalSheet()}

    </div>
  `;
}

function renderAuthModalSheet() {
  if (!activeSheet) return '';

  const allPartners = store.partners || [];

  let filteredPartners = allPartners;
  if (selectedRoleFilter === 'ADMIN') {
    filteredPartners = allPartners.filter(p => p.role === 'ADMIN' || p.role === 'SUPER_ADMIN' || p.partnerId === 'SH-SA-001');
  } else if (selectedRoleFilter === 'DESIGNATED') {
    filteredPartners = allPartners.filter(p => p.role === 'DESIGNATED_PARTNER');
  } else if (selectedRoleFilter === 'LP') {
    filteredPartners = allPartners.filter(p => p.role === 'PARTNER' && p.partnerId !== 'SH-SA-001');
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredPartners = filteredPartners.filter(p =>
      p.fullName.toLowerCase().includes(q) ||
      p.partnerId.toLowerCase().includes(q) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.mobile && p.mobile.includes(q)) ||
      (p.dpin && p.dpin.toLowerCase().includes(q))
    );
  }

  // 1. PARTNER WHITELIST ACCOUNTS MODAL SHEET
  if (activeSheet === 'PARTNER_WHITELIST') {
    return `
      <div class="auth-sheet-backdrop" id="sheet-backdrop">
        <div class="auth-sheet-dialog" style="max-height: 84vh;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(234, 88, 12, 0.15); display: flex; align-items: center; justify-content: center; color: #ea580c;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800;">Partner Wishlist</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.74rem; color: var(--text-muted);">${allPartners.length} Verified Accounts &bull; 1-Click Fast Login (Zero Passwords/OTPs)</p>
              </div>
            </div>
            <button id="btn-close-sheet" style="background: none; border: none; font-size: 1.4rem; color: var(--text-muted); cursor: pointer;">&times;</button>
          </div>

          <!-- Search Input -->
          <div style="display: flex; gap: 8px; margin-bottom: 10px;">
            <div style="position: relative; flex: 1;">
              <input type="text" id="direct-search-input" placeholder="Search partner name, mobile, ID..." value="${searchQuery}" style="width: 100%; padding: 10px 12px 10px 34px; font-size: 0.86rem; border-radius: 12px; border: 1.5px solid var(--border-color, #ede4da); background: var(--bg-primary, #fbf8f4); color: var(--text-primary, #1e293b); outline: none; box-sizing: border-box;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="position: absolute; left: 11px; top: 12px; color: var(--text-muted, #94a3b8);">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
          </div>

          <!-- Role Filter Tabs -->
          <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 8px;">
            <button class="role-chip ${selectedRoleFilter === 'ALL' ? 'active' : ''}" data-filter="ALL">
              All (${allPartners.length})
            </button>
            <button class="role-chip ${selectedRoleFilter === 'ADMIN' ? 'active' : ''}" data-filter="ADMIN">
              Managing Partner
            </button>
            <button class="role-chip ${selectedRoleFilter === 'DESIGNATED' ? 'active' : ''}" data-filter="DESIGNATED">
              Designated
            </button>
            <button class="role-chip ${selectedRoleFilter === 'LP' ? 'active' : ''}" data-filter="LP">
              Individual LPs
            </button>
          </div>

          <!-- Partner Cards Scroll List -->
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 380px; overflow-y: auto; padding-right: 2px;">
            ${filteredPartners.length === 0 ? `
              <div style="text-align: center; padding: 24px; color: var(--text-muted, #94a3b8); font-size: 0.84rem;">
                No partner found matching "<strong>${searchQuery}</strong>"
              </div>
            ` : filteredPartners.map(p => {
              const isSuper = p.role === 'ADMIN' || p.role === 'SUPER_ADMIN' || p.partnerId === 'SH-SA-001';
              const isDesignated = p.role === 'DESIGNATED_PARTNER';
              const roleBadge = isSuper ? 'Managing Partner' : isDesignated ? 'Designated Partner' : 'Official LP';
              const badgeBg = isSuper ? '#fff7ed' : isDesignated ? '#f0fdf4' : '#eff6ff';
              const badgeColor = isSuper ? '#ea580c' : isDesignated ? '#16a34a' : '#2563eb';
              const badgeBorder = isSuper ? '#fed7aa' : isDesignated ? '#bbf7d0' : '#bfdbfe';
              const initial = (p.fullName || 'P').trim().charAt(0).toUpperCase();

              return `
                <div class="direct-partner-item" data-id="${p.partnerId}" style="display: flex; justify-content: space-between; align-items: center; padding: 11px 14px; border-radius: 14px; background: var(--bg-card, #ffffff); border: 1.5px solid var(--border-color, #ede4da); cursor: pointer; transition: all 0.15s ease;">
                  <div style="display: flex; align-items: center; gap: 10px; overflow: hidden; padding-right: 8px;">
                    <div style="width: 36px; height: 36px; border-radius: 50%; background: ${isSuper ? 'linear-gradient(135deg, #ea580c, #c2410c)' : isDesignated ? '#16a34a' : '#2563eb'}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.88rem; flex-shrink: 0;">
                      ${initial}
                    </div>
                    <div style="overflow: hidden; text-overflow: ellipsis;">
                      <div style="font-weight: 800; color: var(--text-primary, #1e293b); font-size: 0.86rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.fullName}</div>
                      <div style="font-size: 0.72rem; color: #ea580c; font-family: monospace; font-weight: 600;">${p.partnerId} ${p.mobile ? `&bull; ${p.mobile}` : ''}</div>
                    </div>
                  </div>
                  <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0;">
                    <span style="font-size: 0.64rem; font-weight: 800; color: ${badgeColor}; background: ${badgeBg}; border: 1px solid ${badgeBorder}; padding: 2px 6px; border-radius: 6px; white-space: nowrap;">
                      ${roleBadge}
                    </span>
                    <span style="font-size: 0.72rem; font-weight: 700; color: #ea580c;">Direct Login &rarr;</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

        </div>
      </div>
    `;
  }

  // 2. SUPER ADMIN MODAL SHEET
  if (activeSheet === 'SUPER_ADMIN') {
    return `
      <div class="auth-sheet-backdrop" id="sheet-backdrop">
        <div class="auth-sheet-dialog">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(234, 88, 12, 0.15); display: flex; align-items: center; justify-content: center; color: #ea580c;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800;">Super Admin Direct Login</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.74rem; color: var(--text-muted);">Srikanth Ayinavolu &bull; Managing Partner</p>
              </div>
            </div>
            <button id="btn-close-sheet" style="background: none; border: none; font-size: 1.4rem; color: var(--text-muted); cursor: pointer;">&times;</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <p style="font-size: 0.85rem; color: var(--text-secondary); margin: 0;">
              Instant direct authentication without password or OTP.
            </p>

            <button class="auth-pill-btn-orange" id="btn-admin-instant-bypass" style="font-weight: 800; padding: 14px; font-size: 0.95rem;">
              ⚡ Direct 1-Click Login (Srikanth)
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // 3. PHONE MODAL SHEET (Direct, No OTP)
  if (activeSheet === 'PHONE_OTP') {
    return `
      <div class="auth-sheet-backdrop" id="sheet-backdrop">
        <div class="auth-sheet-dialog">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(37, 99, 235, 0.15); display: flex; align-items: center; justify-content: center; color: #2563eb;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800;">Direct Phone Login</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.74rem; color: var(--text-muted);">Enter Mobile or ID for Instant Direct Access</p>
              </div>
            </div>
            <button id="btn-close-sheet" style="background: none; border: none; font-size: 1.4rem; color: var(--text-muted); cursor: pointer;">&times;</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div class="form-group">
              <label class="form-label" style="font-size: 0.8rem; font-weight: 700;">Mobile Number or Partner Name</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="input-phone-number" class="form-input" placeholder="e.g. 9821837797, Srikanth, Panathula" value="${pendingPhoneValue}" style="flex: 1; padding: 12px 14px; font-size: 0.92rem; border-radius: 12px; border: 1.5px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); outline: none;">
              </div>
            </div>

            <button class="auth-pill-btn-orange" id="btn-send-phone-otp" style="font-weight: 800;">
              ⚡ Direct 1-Click Login &rarr;
            </button>

            <button class="auth-pill-btn-outline" id="btn-view-all-partners-from-phone" style="font-size: 0.82rem; padding: 10px;">
              👥 Choose from 28 Partner Wishlist Accounts
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // 4. EMAIL MODAL SHEET (Direct, No OTP)
  if (activeSheet === 'EMAIL_OTP') {
    return `
      <div class="auth-sheet-backdrop" id="sheet-backdrop">
        <div class="auth-sheet-dialog">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(234, 88, 12, 0.15); display: flex; align-items: center; justify-content: center; color: #ea580c;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800;">Direct Email Login</h3>
                <p style="margin: 2px 0 0 0; font-size: 0.74rem; color: var(--text-muted);">Enter Email for Instant Direct Access</p>
              </div>
            </div>
            <button id="btn-close-sheet" style="background: none; border: none; font-size: 1.4rem; color: var(--text-muted); cursor: pointer;">&times;</button>
          </div>

          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div class="form-group">
              <label class="form-label" style="font-size: 0.8rem; font-weight: 700;">Partner Email Address or Name</label>
              <input type="text" id="input-email-address" class="form-input" placeholder="e.g. srikanth@sahasraartha.in, Panathula" value="${pendingEmailValue}" style="width: 100%; padding: 12px 14px; font-size: 0.92rem; border-radius: 12px; border: 1.5px solid var(--border-color); background: var(--bg-card); color: var(--text-primary); outline: none; box-sizing: border-box;">
            </div>

            <button class="auth-pill-btn-orange" id="btn-send-email-otp" style="font-weight: 800;">
              ⚡ Direct 1-Click Login &rarr;
            </button>

            <button class="auth-pill-btn-outline" id="btn-view-all-partners-from-email" style="font-size: 0.82rem; padding: 10px;">
              👥 Choose from 28 Partner Wishlist Accounts
            </button>
          </div>
        </div>
      </div>
    `;
  }

  return '';
}

export function attachAndroidLoginEvents(onLoginSuccess) {
  // Theme Toggle
  document.getElementById('btn-login-theme-toggle')?.addEventListener('click', () => {
    store.toggleTheme();
  });

  // 1. Super Admin 1-Click Instant Login (Direct, Zero Passwords, Zero OTPs)
  document.getElementById('btn-super-admin-action')?.addEventListener('click', () => {
    const admin = store.partners.find(p => p.partnerId === 'SH-SA-001') || store.partners[0];
    executeDirectLogin(admin, onLoginSuccess);
  });

  // 2. Partner Whitelist Accounts button and link
  const openPartnerWhitelist = () => {
    activeSheet = 'PARTNER_WHITELIST';
    store.notify();
  };

  document.getElementById('btn-open-whitelist-action')?.addEventListener('click', openPartnerWhitelist);
  document.getElementById('link-partner-whitelist-btn')?.addEventListener('click', openPartnerWhitelist);
  document.getElementById('btn-view-all-partners-from-phone')?.addEventListener('click', openPartnerWhitelist);
  document.getElementById('btn-view-all-partners-from-email')?.addEventListener('click', openPartnerWhitelist);

  // 3. Direct Phone Login Action
  document.getElementById('btn-login-phone-action')?.addEventListener('click', () => {
    activeSheet = 'PHONE_OTP';
    otpStep = 'INPUT';
    store.notify();
  });

  // 4. Direct Email Login Action
  document.getElementById('btn-login-email-action')?.addEventListener('click', () => {
    activeSheet = 'EMAIL_OTP';
    otpStep = 'INPUT';
    store.notify();
  });

  // 5. Continue with Google
  document.getElementById('btn-continue-google-action')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-continue-google-action');
    const originalHTML = btn ? btn.innerHTML : '';
    try {
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span style="display:flex;align-items:center;gap:6px;"><svg width="14" height="14" viewBox="0 0 24 24" class="auth-spinner"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="3" fill="none" stroke-dasharray="30 70" stroke-linecap="round"/></svg> Direct Signing in...</span>';
      }

      const result = await signInWithGoogle();
      if (result && result.profile) {
        const email = result.profile.email;
        const phone = result.profile.phoneNumber;
        const matched = findPartnerByIdentifier(email) || (phone ? findPartnerByIdentifier(phone) : null) || store.partners[0];
        executeDirectLogin(matched, onLoginSuccess);
      } else {
        const admin = store.partners.find(p => p.partnerId === 'SH-SA-001') || store.partners[0];
        executeDirectLogin(admin, onLoginSuccess);
      }
    } catch (err) {
      console.warn('[AndroidLogin] Google sign-in fallback to direct login:', err);
      const admin = store.partners.find(p => p.partnerId === 'SH-SA-001') || store.partners[0];
      executeDirectLogin(admin, onLoginSuccess);
    }
  });

  // 6. Continue with Apple
  document.getElementById('btn-continue-apple-action')?.addEventListener('click', () => {
    const admin = store.partners.find(p => p.partnerId === 'SH-SA-001') || store.partners[0];
    if (admin) {
      executeDirectLogin(admin, onLoginSuccess);
    }
  });

  // Direct 1-Click Whitelist Partner Selection on Card Click (Zero Password / Zero OTP)
  document.querySelectorAll('.direct-partner-item').forEach(item => {
    item.addEventListener('click', () => {
      const partnerId = item.getAttribute('data-id');
      const partner = store.partners.find(p => p.partnerId === partnerId);
      if (partner) {
        executeDirectLogin(partner, onLoginSuccess);
      } else {
        const defaultPartner = store.partners[0];
        executeDirectLogin(defaultPartner, onLoginSuccess);
      }
    });
  });

  // Search Input inside Whitelist Modal
  const searchInput = document.getElementById('direct-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      store.notify();
      setTimeout(() => {
        const renewedInput = document.getElementById('direct-search-input');
        if (renewedInput) {
          renewedInput.focus();
          renewedInput.setSelectionRange(searchQuery.length, searchQuery.length);
        }
      }, 50);
    });
  }

  // Role Chip Filtering inside Whitelist Modal
  document.querySelectorAll('.role-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      selectedRoleFilter = chip.getAttribute('data-filter') || 'ALL';
      store.notify();
    });
  });

  // Close Sheet
  document.getElementById('btn-close-sheet')?.addEventListener('click', () => {
    activeSheet = null;
    store.notify();
  });

  document.getElementById('sheet-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'sheet-backdrop') {
      activeSheet = null;
      store.notify();
    }
  });

  // Sheet Event Handlers (Super Admin Direct Login)
  document.getElementById('btn-admin-instant-bypass')?.addEventListener('click', () => {
    const admin = store.partners.find(p => p.partnerId === 'SH-SA-001') || store.partners[0];
    executeDirectLogin(admin, onLoginSuccess);
  });

  // Phone Direct Flow (Zero OTPs)
  document.getElementById('btn-send-phone-otp')?.addEventListener('click', () => {
    const phoneInput = document.getElementById('input-phone-number')?.value.trim();
    const matched = (phoneInput ? findPartnerByIdentifier(phoneInput) : null) || store.partners[0];
    executeDirectLogin(matched, onLoginSuccess);
  });

  // Email Direct Flow (Zero OTPs)
  document.getElementById('btn-send-email-otp')?.addEventListener('click', () => {
    const emailInput = document.getElementById('input-email-address')?.value.trim();
    const matched = (emailInput ? findPartnerByIdentifier(emailInput) : null) || store.partners[0];
    executeDirectLogin(matched, onLoginSuccess);
  });
}
