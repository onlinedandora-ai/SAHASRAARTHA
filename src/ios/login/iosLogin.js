/**
 * iOS Native Authentication Page (Apple Cupertino Style)
 * Modern Light Orange & Crisp White Theme with Complete Multi-Credential Support:
 * - Glowing Emblem Logo (Double Ring in Sunset Orange)
 * - "Welcome to Sahasraartha"
 * - "Your Personal Family Office & Wealth Portfolio Manager"
 * - Outline "Login with Phone" (with instant Mobile Credentials & OTP)
 * - Outline "Login with Email" (with instant Email Credentials & Password/OTP)
 * - "OR" Divider
 * - "Continue with Google" (Native Google Auth + Instant Google Account Chooser fallback)
 * - "Continue with Apple" (Apple ID Fast Login)
 * - Full Partner Select & Sign Up Sheet (Managing Partner, Designated Partner, Individual LP)
 */

import { store } from '../../state/store.js';
import { renderSFOLogo, renderSFOEmblem } from '../../components/sfoLogo.js';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import {
  signInWithGoogle,
  sendPhoneOTP,
  verifyPhoneOTP,
  sendEmailOTP,
  verifyEmailOTP,
  setupRecaptcha
} from '../../services/firebaseAuth.js';

let activeAuthMode = null; // null | 'phone' | 'email' | 'google_fallback' | 'persona' | 'signup' | 'otp'
let activeSheetTab = 'select'; // 'select' | 'signup'
let selectedRoleFilter = 'ALL'; // 'ALL' | 'ADMIN' | 'DESIGNATED' | 'LP'
let searchQuery = '';
let enteredIdentifier = '';
let customGoogleEmail = '';

function normalizeMobile(str) {
  if (!str) return '';
  const digits = str.replace(/\D/g, '');
  return digits.slice(-10);
}

function findPartnerByIdentifier(identifier) {
  if (!identifier) return null;
  const raw = identifier.trim();
  const lower = raw.toLowerCase();
  const digits = normalizeMobile(raw);

  // Check if identifier is Srikanth (Super Admin)
  if (
    lower === 'srikanth@sahasraartha.in' ||
    lower === 'srikanth.ayinavolu@gmail.com' ||
    lower === 'sahasraarthasfo@gmail.com' ||
    digits === '9821837797' ||
    raw === '08923412' ||
    raw === 'SH-SA-001'
  ) {
    return store.partners.find(p => p.partnerId === 'SH-SA-001') || store.partners[0];
  }

  return store.partners.find(p => {
    const pDigits = normalizeMobile(p.mobile);
    const inAliases = Array.isArray(p.aliases) && p.aliases.some(a => a.toLowerCase() === lower);
    return (
      p.email.toLowerCase() === lower ||
      inAliases ||
      (digits && pDigits === digits) ||
      p.partnerId.toLowerCase() === lower ||
      p.fullName.toLowerCase() === lower ||
      (p.dpin && p.dpin.toLowerCase() === lower) ||
      (p.pan && p.pan.toLowerCase() === lower)
    );
  });
}

export function renderIOSLogin() {
  const superAdmins = store.partners.filter(p => p.role === 'ADMIN' || p.role === 'SUPER_ADMIN' || p.partnerId === 'SH-SA-001');

  let filteredPartners = superAdmins;

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
    <div class="auth-screen-container ios-screen">
      
      <!-- Top Action Bar (Theme Toggle) -->
      <div style="position: absolute; top: 16px; right: 18px; z-index: 20;">
        <button class="auth-theme-toggle-btn" id="btn-login-theme-toggle-ios" title="${store.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}">
          ${store.theme === 'dark' ? `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-primary);">Light</span>
          ` : `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-primary);">Dark</span>
          `}
        </button>
      </div>

      <!-- Top Brand Logo (Exact Unmodified Image) -->
      <div class="auth-brand-wrapper" style="margin-top: 6px; margin-bottom: 8px;">
        ${renderSFOLogo({ width: 170 })}
        <p class="auth-subtitle" style="margin-top: 12px;">Your Personal Family Office &amp; Wealth Portfolio Manager</p>
      </div>

      <!-- Action Button Stack -->
      <div class="auth-button-stack">
        
        <!-- 1. Super Admin Password Login -->
        <button class="auth-pill-btn-orange" id="btn-login-password-ios" style="box-shadow: 0 4px 14px rgba(234, 88, 12, 0.25);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>Super Admin Password Login</span>
        </button>

        <!-- 2. Login with Phone -->
        <button class="auth-pill-btn-outline" id="btn-login-phone-ios">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
          <span>Login with Phone (OTP)</span>
        </button>

        <!-- 3. Login with Email -->
        <button class="auth-pill-btn-outline" id="btn-login-email-ios">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <span>Login with Email (OTP)</span>
        </button>

        <!-- Divider -->
        <div class="auth-divider">
          <div class="auth-divider-line"></div>
          <span class="auth-divider-text">OR</span>
          <div class="auth-divider-line"></div>
        </div>

        <!-- 4. Continue with Google -->
        <button class="auth-pill-btn-blue" id="btn-continue-google-ios">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <!-- 5. Continue with Apple -->
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
          Managing Partner? <span class="auth-footer-link" id="btn-open-persona-sheet-ios">Super Admin Account</span>
        </div>
        <div class="auth-footer-legal">
          <span>Terms and Cookies</span> &bull; <span>Privacy Policy</span>
        </div>
      </div>

      <!-- Clean Modal Sheet for Password/Phone/Email/OTP/Google Fallback/Partner Whitelist Directory -->
      ${activeAuthMode ? `
        <div class="auth-sheet-backdrop" id="auth-sheet-backdrop-ios">
          <div class="auth-sheet-dialog ios-dialog" id="auth-sheet-dialog-ios">
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <h3 style="font-size: 1.15rem; color: #1e293b; margin: 0; font-weight: 800;">
                  ${activeAuthMode === 'password' ? 'Super Admin Password Login' :
                    activeAuthMode === 'phone' ? 'Mobile Number Login' :
                    activeAuthMode === 'email' ? 'Email Address Login' :
                    activeAuthMode === 'google_fallback' ? 'Sign in with Google' :
                    activeAuthMode === 'otp' ? 'Enter 6-Digit OTP' :
                    'Super Admin Partner Account'}
                </h3>
                <p style="font-size: 0.78rem; color: #64748b; margin-top: 2px;">
                  ${activeAuthMode === 'password' ? 'Enter Master Passcode / PIN for Srikanth' :
                    activeAuthMode === 'google_fallback' ? 'Select or enter registered Google email' :
                    activeAuthMode === 'phone' ? 'Enter registered Super Admin mobile' :
                    activeAuthMode === 'email' ? 'Enter registered Super Admin email' :
                    activeAuthMode === 'otp' ? 'Instant verification with 6-digit code' :
                    'Official Sahasraartha LLP Managing Partner Portal'}
                </p>
              </div>
              <button class="modal-close" id="btn-close-auth-sheet-ios" style="background: #f1f5f9; border: none; color: #64748b; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">&times;</button>
            </div>

            ${activeAuthMode === 'password' ? `
              <!-- Super Admin Password Authentication -->
              <div style="margin-bottom: 14px;">
                <div class="form-group" style="margin-bottom: 12px;">
                  <label style="font-size: 0.74rem; color: #64748b; display: block; margin-bottom: 6px; text-transform: uppercase; font-weight: 700;">
                    Super Admin Email / Registered ID
                  </label>
                  <input type="text" id="auth-password-identifier-ios" class="m3-input" placeholder="e.g. srikanth@sahasraartha.in" value="${enteredIdentifier || 'srikanth@sahasraartha.in'}" style="width: 100%; padding: 12px 14px; background: #f8f4ee; border: 1.5px solid #ede4da; border-radius: 12px; color: #1e293b; font-size: 0.95rem; outline: none; box-sizing: border-box;">
                </div>

                <div class="form-group" style="margin-bottom: 16px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <label style="font-size: 0.74rem; color: #64748b; text-transform: uppercase; font-weight: 700; margin: 0;">
                      Super Admin Master Password / PIN
                    </label>
                  </div>
                  <div style="position: relative; display: flex; align-items: center;">
                    <input type="password" id="auth-password-input-ios" class="m3-input" placeholder="Enter Super Admin Password / PIN" value="" style="width: 100%; padding: 12px 42px 12px 14px; background: #f8f4ee; border: 1.5px solid #ede4da; border-radius: 12px; color: #1e293b; font-size: 0.95rem; outline: none; box-sizing: border-box;">
                    <button type="button" id="btn-toggle-show-password-ios" style="position: absolute; right: 10px; background: none; border: none; cursor: pointer; color: #64748b; font-size: 1rem; padding: 4px; display: flex; align-items: center;" title="Show/Hide Password">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                  <div style="font-size: 0.7rem; color: #94a3b8; margin-top: 5px;">
                    Master passcode verification for Srikanth Ayinavolu (Managing Partner).
                  </div>
                </div>

                <button class="auth-pill-btn-orange" id="btn-sheet-submit-password-ios" style="width: 100%;">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span>Authenticate & Enter Console</span>
                </button>

                <div style="display: flex; justify-content: space-between; margin-top: 14px; padding-top: 10px; border-top: 1px dashed #ede4da; font-size: 0.76rem;">
                  <button id="btn-switch-to-otp-mode-ios" style="background: none; border: none; color: #ea580c; font-weight: 700; cursor: pointer; text-decoration: underline;">
                    Use OTP Instead
                  </button>
                  <button id="btn-switch-to-google-mode-ios" style="background: none; border: none; color: #2563eb; font-weight: 700; cursor: pointer; text-decoration: underline;">
                    Use Google Account
                  </button>
                </div>
              </div>
            ` : activeAuthMode === 'phone' ? `
              <!-- Phone Number Login -->
              <div class="form-group" style="margin-bottom: 16px;">
                <label style="font-size: 0.74rem; color: #64748b; display: block; margin-bottom: 6px; text-transform: uppercase; font-weight: 700;">
                  Mobile Number
                </label>
                <div style="display: flex; gap: 8px;">
                  <div style="padding: 12px 14px; background: #f1f5f9; border: 1.5px solid #ede4da; border-radius: 12px; font-size: 0.9rem; font-weight: 700; color: #1e293b;">
                    +91
                  </div>
                  <input type="tel" id="auth-phone-input-ios" class="m3-input" placeholder="Enter registered mobile (e.g. 9821837797)" value="${enteredIdentifier || ''}" style="flex: 1; padding: 12px 14px; background: #f8f4ee; border: 1.5px solid #ede4da; border-radius: 12px; color: #1e293b; font-size: 0.95rem; outline: none; box-sizing: border-box;">
                </div>
              </div>

              <button class="auth-pill-btn-orange" id="btn-sheet-send-phone-otp-ios">
                <span>Send OTP Verification Code</span>
              </button>
            ` : activeAuthMode === 'email' ? `
              <!-- Email Address Login -->
              <div class="form-group" style="margin-bottom: 16px;">
                <label style="font-size: 0.74rem; color: #64748b; display: block; margin-bottom: 6px; text-transform: uppercase; font-weight: 700;">
                  Registered Partner Email Address
                </label>
                <div style="display: flex; gap: 8px;">
                  <input type="email" id="auth-email-input-ios" class="m3-input" placeholder="e.g. srikanth@sahasraartha.in" value="${enteredIdentifier || ''}" style="width: 100%; padding: 12px 14px; background: #f8f4ee; border: 1.5px solid #ede4da; border-radius: 12px; color: #1e293b; font-size: 0.95rem; outline: none; box-sizing: border-box;">
                </div>
                <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 6px;">
                  An instant 6-digit authentication code will be sent to your registered email inbox.
                </div>
              </div>

              <button class="auth-pill-btn-orange" id="btn-sheet-send-email-otp-ios">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>Send OTP to Email</span>
              </button>
            ` : activeAuthMode === 'google_fallback' ? `
              <!-- Google Account Selection Modal -->
              <div style="text-align: center; margin-bottom: 14px;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: #ffffff; border: 1.5px solid #ede4da; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px auto; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                  <svg width="22" height="22" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                </div>
                <h4 style="font-size: 0.95rem; color: #1e293b; margin: 0; font-weight: 800;">Choose a Google Account</h4>
                <p style="font-size: 0.76rem; color: #64748b; margin: 4px 0 0 0;">to continue to Sahasraartha Family Office</p>
              </div>

              <!-- Quick Google Account Chooser List (Super Admin Account Only) -->
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;">
                <div class="quick-google-account-item-ios" data-email="srikanth@sahasraartha.in" data-name="Srikanth Ayinavolu" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: #ffffff; border: 1.5px solid #fed7aa; border-radius: 12px; cursor: pointer; transition: all 0.2s ease;">
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: #ea580c; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem;">
                    S
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 0.84rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 6px;">
                      Srikanth Ayinavolu <span style="font-size: 0.62rem; padding: 2px 6px; border-radius: 4px; background: #fff7ed; color: #ea580c; font-weight: 800;">Super Admin</span>
                    </div>
                    <div style="font-size: 0.74rem; color: #ea580c; font-weight: 600; overflow: hidden; text-overflow: ellipsis;">srikanth@sahasraartha.in</div>
                  </div>
                  <span style="font-size: 0.74rem; font-weight: 700; color: #2563eb;">Send Code &rarr;</span>
                </div>

                <div class="quick-google-account-item-ios" data-email="srikanth.ayinavolu@gmail.com" data-name="Srikanth Ayinavolu" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; cursor: pointer; transition: all 0.2s ease;">
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem;">
                    S
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 0.84rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 6px;">
                      Srikanth Ayinavolu <span style="font-size: 0.62rem; padding: 2px 6px; border-radius: 4px; background: #f1f5f9; color: #475569; font-weight: 700;">Google Account</span>
                    </div>
                    <div style="font-size: 0.74rem; color: #64748b; overflow: hidden; text-overflow: ellipsis;">srikanth.ayinavolu@gmail.com</div>
                  </div>
                  <span style="font-size: 0.74rem; font-weight: 700; color: #2563eb;">Send Code &rarr;</span>
                </div>

                <div class="quick-google-account-item-ios" data-email="sahasraarthasfo@gmail.com" data-name="Sahasraartha SFO Admin" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; cursor: pointer; transition: all 0.2s ease;">
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: #2563eb; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem;">
                    G
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 0.84rem; font-weight: 700; color: #0f172a;">Sahasraartha Official Google</div>
                    <div style="font-size: 0.74rem; color: #64748b; overflow: hidden; text-overflow: ellipsis;">sahasraarthasfo@gmail.com</div>
                  </div>
                  <span style="font-size: 0.74rem; font-weight: 700; color: #2563eb;">Send Code &rarr;</span>
                </div>
              </div>

              <!-- Or Use Another Google Account -->
              <div style="border-top: 1px dashed #e2e8f0; padding-top: 12px; margin-bottom: 14px;">
                <label style="font-size: 0.74rem; color: #64748b; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 6px;">Or enter registered Super Admin email</label>
                <input type="email" id="custom-google-email-input-ios" placeholder="your.name@gmail.com" value="${customGoogleEmail || enteredIdentifier || ''}" style="width: 100%; padding: 11px 14px; font-size: 0.9rem; border-radius: 12px; border: 1.5px solid #ede4da; background: #f8f4ee; outline: none; box-sizing: border-box; margin-bottom: 10px;">
                
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <button class="auth-pill-btn-blue" id="btn-submit-custom-google-ios" style="width: 100%;">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Send Verification Code to Email</span>
                  </button>
                </div>
              </div>
            ` : activeAuthMode === 'otp' ? `
              <!-- OTP Verification Screen -->
              <div style="text-align: center; margin-bottom: 16px;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: #fff7ed; border: 1px solid #fed7aa; color: #ea580c; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px auto;">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <p style="font-size: 0.85rem; color: #475569; margin-bottom: 4px;">
                  Verification code sent to <strong style="color: #ea580c;">${enteredIdentifier || 'your email / mobile'}</strong>
                </p>
                <p style="font-size: 0.74rem; color: #94a3b8; margin: 0;">
                  Please check your inbox / SMS and enter the 6-digit code
                </p>
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
                <span>Verify OTP & Enter Family Office</span>
              </button>

              <div style="text-align: center; margin-top: 14px;">
                <button id="btn-resend-auth-otp-ios" style="background: none; border: none; color: #ea580c; font-size: 0.78rem; font-weight: 700; cursor: pointer; text-decoration: underline;">
                  Didn't receive code? Resend OTP
                </button>
              </div>
            ` : `
              <!-- Partner Account Selection Directory (Super Admin Only) -->
              <div style="margin-bottom: 10px; display: flex; flex-direction: column; gap: 8px;">
                <input type="text" id="partner-search-input-ios" placeholder="Search Super Admin name, ID, email or mobile..." value="${searchQuery}" style="width: 100%; padding: 9px 12px; font-size: 0.84rem; border-radius: 10px; border: 1.5px solid #ede4da; background: #fbf8f4; outline: none; box-sizing: border-box;">

                <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px;">
                  <button class="role-chip-ios active" data-filter="ADMIN" style="padding: 5px 10px; border-radius: 8px; font-size: 0.7rem; font-weight: 700; border: 1px solid #ea580c; background: #fff7ed; color: #ea580c; cursor: pointer; white-space: nowrap;">
                    Managing Partner / Super Admin (${superAdmins.length})
                  </button>
                </div>
              </div>

              <!-- Direct Super Admin Switcher List -->
              <div style="display: flex; flex-direction: column; gap: 6px; max-height: 280px; overflow-y: auto; padding-right: 4px;" id="sheet-partners-list-ios">
                ${filteredPartners.length === 0 ? `
                  <div style="text-align: center; padding: 20px; color: #94a3b8; font-size: 0.82rem;">
                    No authorized Super Admin found matching "${searchQuery}"
                  </div>
                ` : filteredPartners.map(p => {
                  return `
                    <button class="btn btn-secondary btn-sm sheet-partner-btn-ios" data-id="${p.partnerId}" style="display: flex; justify-content: space-between; align-items: center; text-align: left; padding: 12px 14px; border-radius: 12px; background: #ffffff; border: 1.5px solid #fed7aa; cursor: pointer; width: 100%; transition: all 0.15s ease;">
                      <div style="overflow: hidden; text-overflow: ellipsis; padding-right: 8px;">
                        <div style="font-weight: 800; color: #1e293b; font-size: 0.88rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.fullName}</div>
                        <div style="font-size: 0.72rem; color: #ea580c; font-family: monospace; font-weight: 600;">${p.partnerId} • ${p.email}</div>
                        <div style="font-size: 0.68rem; color: #64748b; margin-top: 2px;">Mobile: ${p.mobile}</div>
                      </div>
                      <span style="font-size: 0.68rem; font-weight: 800; color: #ea580c; background: #fff7ed; padding: 4px 9px; border-radius: 6px; white-space: nowrap;">
                        Super Admin
                      </span>
                    </button>
                  `;
                }).join('')}
              </div>
            `}

          </div>
        </div>
      ` : ''}

    </div>
  `;
}

export function attachIOSLoginEvents(onLoginSuccess) {
  // Theme Toggle
  document.getElementById('btn-login-theme-toggle-ios')?.addEventListener('click', () => {
    store.toggleTheme();
  });

  // Login with Super Admin Password
  document.getElementById('btn-login-password-ios')?.addEventListener('click', () => {
    activeAuthMode = 'password';
    enteredIdentifier = 'srikanth@sahasraartha.in';
    store.notify();
  });

  // Submit Password Form
  document.getElementById('btn-sheet-submit-password-ios')?.addEventListener('click', () => {
    const idInput = document.getElementById('auth-password-identifier-ios');
    const passInput = document.getElementById('auth-password-input-ios');
    const identifier = idInput ? idInput.value.trim() : '';
    const password = passInput ? passInput.value.trim() : '';

    if (!identifier) {
      alert('Please enter your Super Admin email or ID');
      return;
    }
    if (!password) {
      alert('Please enter your Super Admin password');
      return;
    }

    const matched = findPartnerByIdentifier(identifier);
    if (!matched || (matched.partnerId !== 'SH-SA-001' && matched.role !== 'ADMIN' && matched.role !== 'SUPER_ADMIN')) {
      alert(`Access Denied: "${identifier}" is not authorized for Super Admin console access.`);
      return;
    }

    const isValid = store.verifySuperAdminPassword(password);
    if (isValid) {
      const profile = {
        displayName: 'Srikanth Ayinavolu (Super Admin)',
        email: matched.email,
        phoneNumber: matched.mobile,
        photoURL: ''
      };
      store.setFirebaseUser(profile);
      store.loginPartner(matched.partnerId);
      activeAuthMode = null;
      if (onLoginSuccess) onLoginSuccess();
    } else {
      alert('Incorrect Super Admin Password. Please try again or use OTP verification.');
    }
  });

  // Toggle Show/Hide Password
  document.getElementById('btn-toggle-show-password-ios')?.addEventListener('click', () => {
    const input = document.getElementById('auth-password-input-ios');
    if (input) {
      input.type = input.type === 'password' ? 'text' : 'password';
    }
  });

  // Switch to OTP mode from Password mode
  document.getElementById('btn-switch-to-otp-mode-ios')?.addEventListener('click', () => {
    activeAuthMode = 'email';
    store.notify();
  });

  // Switch to Google mode from Password mode
  document.getElementById('btn-switch-to-google-mode-ios')?.addEventListener('click', () => {
    activeAuthMode = 'google_fallback';
    store.notify();
  });

  // Login with Phone
  document.getElementById('btn-login-phone-ios')?.addEventListener('click', () => {
    activeAuthMode = 'phone';
    enteredIdentifier = '';
    store.notify();
  });

  // Login with Email
  document.getElementById('btn-login-email-ios')?.addEventListener('click', () => {
    activeAuthMode = 'email';
    enteredIdentifier = '';
    store.notify();
  });

  // Continue with Google — Native Google Sign-In / Web Popup
  document.getElementById('btn-continue-google-ios')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-continue-google-ios');
    const originalHTML = btn ? btn.innerHTML : '';
    try {
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span style="display:flex;align-items:center;gap:8px;"><svg width="18" height="18" viewBox="0 0 24 24" class="auth-spinner"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="3" fill="none" stroke-dasharray="30 70" stroke-linecap="round"/></svg> Connecting Google Account...</span>';
      }

      const result = await signInWithGoogle();

      if (result && result.profile) {
        const email = result.profile.email;
        const matched = findPartnerByIdentifier(email);
        if (matched) {
          store.setFirebaseUser(result.profile);
          store.loginPartner(matched.partnerId);
          activeAuthMode = null;
          if (onLoginSuccess) onLoginSuccess();
        } else {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
          }
          alert(`Access Denied: The Google email "${email}" is not registered as an authorized account holder of Sahasraartha Family Office LLP. Only official partners are permitted.`);
        }
      }
    } catch (err) {
      console.warn('[IOSLogin] Google sign-in encountered an issue, opening Google Account Chooser:', err);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
      }
      const msg = err?.message || err?.toString() || '';
      if (msg.includes('cancelled') || msg.includes('12501') || msg.includes('user_cancelled')) {
        return;
      }
      activeAuthMode = 'google_fallback';
      store.notify();
    }
  });

  // Quick Google Account Chooser Selection (1-Click Instant Login)
  // Quick Google Account Chooser Selection (Sends OTP for Verification)
  document.querySelectorAll('.quick-google-account-item-ios').forEach(item => {
    item.addEventListener('click', async () => {
      const email = item.getAttribute('data-email');
      if (!email) return;

      const matched = findPartnerByIdentifier(email);
      if (!matched) {
        alert(`Access Denied: The email "${email}" is not registered as an authorized account holder.`);
        return;
      }

      try {
        await sendEmailOTP(email);
        enteredIdentifier = email;
        activeAuthMode = 'otp';
        store.notify();
      } catch (err) {
        alert(err.message || 'Failed to send verification code.');
      }
    });
  });

  // Custom Google Email Submit — Sends 6-Digit Email OTP
  document.getElementById('btn-submit-custom-google-ios')?.addEventListener('click', async () => {
    const input = document.getElementById('custom-google-email-input-ios');
    const email = input ? input.value.trim() : '';
    if (!email || !email.includes('@')) {
      alert('Please enter a valid Google email address');
      return;
    }

    const matched = findPartnerByIdentifier(email);
    if (!matched) {
      alert(`Access Denied: "${email}" is not an authorized account holder of Sahasraartha Family Office LLP.`);
      return;
    }

    const btn = document.getElementById('btn-submit-custom-google-ios');
    const originalHTML = btn ? btn.innerHTML : '';

    try {
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span style="display:flex;align-items:center;gap:8px;"><svg width="18" height="18" viewBox="0 0 24 24" class="auth-spinner"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="3" fill="none" stroke-dasharray="30 70" stroke-linecap="round"/></svg> Sending Code to Email...</span>';
      }

      await sendEmailOTP(email);
      enteredIdentifier = email;
      activeAuthMode = 'otp';
      store.notify();
    } catch (err) {
      console.error('[IOSLogin] Send Google Email OTP error:', err);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
      }
      alert(err.message || 'Failed to send verification code. Please try again.');
    }
  });

  // Send Email OTP — Real Email Verification Flow
  document.getElementById('btn-sheet-send-email-otp-ios')?.addEventListener('click', async () => {
    const emailInput = document.getElementById('auth-email-input-ios');
    const email = emailInput ? emailInput.value.trim() : '';
    if (!email || !email.includes('@')) {
      alert('Please enter a valid registered email address');
      return;
    }

    const matched = findPartnerByIdentifier(email);
    if (!matched) {
      alert(`Access Denied: The email "${email}" is not registered as an authorized account holder of Sahasraartha Family Office LLP.`);
      return;
    }

    const btn = document.getElementById('btn-sheet-send-email-otp-ios');
    const originalHTML = btn ? btn.innerHTML : '';

    try {
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span style="display:flex;align-items:center;gap:8px;"><svg width="18" height="18" viewBox="0 0 24 24" class="auth-spinner"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="3" fill="none" stroke-dasharray="30 70" stroke-linecap="round"/></svg> Sending OTP to Email...</span>';
      }

      await sendEmailOTP(email);
      enteredIdentifier = email;
      activeAuthMode = 'otp';
      store.notify();
    } catch (err) {
      console.error('[IOSLogin] Send Email OTP error:', err);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
      }
      alert(err.message || 'Failed to send OTP to email. Please try again.');
    }
  });

  // Send Phone OTP — Real Firebase Phone Auth
  document.getElementById('btn-sheet-send-phone-otp-ios')?.addEventListener('click', async () => {
    const phoneInput = document.getElementById('auth-phone-input-ios');
    enteredIdentifier = phoneInput ? phoneInput.value.trim() : '';
    if (!enteredIdentifier || enteredIdentifier.replace(/\D/g, '').length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    const matched = findPartnerByIdentifier(enteredIdentifier);
    if (!matched) {
      alert(`Access Denied: Mobile number "+91 ${enteredIdentifier.replace(/\D/g, '').slice(-10)}" is not registered for any authorized account holder of Sahasraartha Family Office LLP.`);
      return;
    }

    const btn = document.getElementById('btn-sheet-send-phone-otp-ios');
    const originalHTML = btn ? btn.innerHTML : '';

    try {
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span style="display:flex;align-items:center;gap:8px;"><svg width="18" height="18" viewBox="0 0 24 24" class="auth-spinner"><circle cx="12" cy="12" r="10" stroke="#ea580c" stroke-width="3" fill="none" stroke-dasharray="30 70" stroke-linecap="round"/></svg> Sending OTP...</span>';
      }

      const digits = enteredIdentifier.replace(/\D/g, '').slice(-10);
      const phoneNumber = '+91' + digits;
      enteredIdentifier = digits;

      await sendPhoneOTP(phoneNumber);

      activeAuthMode = 'otp';
      store.notify();
    } catch (err) {
      console.error('[IOSLogin] Send OTP error:', err);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
      }
      alert(err.message || 'Failed to send OTP. Please try again.');
    }
  });

  // Continue with Apple — Requires Super Admin Authentication
  document.getElementById('btn-continue-apple-ios')?.addEventListener('click', () => {
    activeAuthMode = 'password';
    enteredIdentifier = 'srikanth@sahasraartha.in';
    store.notify();
  });

  // Open Partner Directory sheet
  document.getElementById('btn-open-persona-sheet-ios')?.addEventListener('click', () => {
    activeAuthMode = 'persona';
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

  // Verify OTP — Handles both Email OTP and Phone OTP
  document.getElementById('btn-sheet-verify-otp-ios')?.addEventListener('click', async () => {
    const otpInputs = document.querySelectorAll('.otp-digit-input-ios');
    let otpCode = '';
    otpInputs.forEach(input => { otpCode += input.value; });

    if (otpCode.length !== 6) {
      alert('Please enter the complete 6-digit OTP');
      return;
    }

    const btn = document.getElementById('btn-sheet-verify-otp-ios');
    const originalHTML = btn ? btn.innerHTML : '';

    try {
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span style="display:flex;align-items:center;gap:8px;"><svg width="18" height="18" viewBox="0 0 24 24" class="auth-spinner"><circle cx="12" cy="12" r="10" stroke="#ea580c" stroke-width="3" fill="none" stroke-dasharray="30 70" stroke-linecap="round"/></svg> Verifying...</span>';
      }

      let result = null;
      const isEmail = (enteredIdentifier || '').includes('@');

      if (isEmail) {
        result = await verifyEmailOTP(enteredIdentifier, otpCode);
      } else {
        result = await verifyPhoneOTP(otpCode);
      }

      if (result && result.profile) {
        const idToCheck = isEmail ? (result.profile.email || enteredIdentifier) : (result.profile.phoneNumber || enteredIdentifier);
        const matched = findPartnerByIdentifier(idToCheck) || findPartnerByIdentifier(enteredIdentifier);
        if (matched) {
          store.setFirebaseUser(result.profile);
          store.loginPartner(matched.partnerId);
          activeAuthMode = null;
          if (onLoginSuccess) onLoginSuccess();
        } else {
          if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHTML;
          }
          alert(`Access Denied: "${idToCheck}" is not registered as an authorized account holder of Sahasraartha Family Office LLP.`);
        }
      }
    } catch (err) {
      console.error('[IOSLogin] OTP verification error:', err);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
      }
      alert(err.message || 'OTP verification failed. Please try again.');
    }
  });

  // Resend OTP button
  document.getElementById('btn-resend-auth-otp-ios')?.addEventListener('click', async () => {
    const isEmail = (enteredIdentifier || '').includes('@');
    try {
      if (isEmail) {
        await sendEmailOTP(enteredIdentifier);
        alert(`A new verification code has been sent to ${enteredIdentifier}`);
      } else {
        const digits = (enteredIdentifier || '').replace(/\D/g, '').slice(-10);
        await sendPhoneOTP('+91' + digits);
        alert(`A new verification code has been sent to +91 ${digits}`);
      }
    } catch (err) {
      alert(err.message || 'Failed to resend OTP. Please try again.');
    }
  });

  // Sheet Partner Selection — Requires Authentication
  document.querySelectorAll('.sheet-partner-btn-ios').forEach(btn => {
    btn.addEventListener('click', () => {
      const partnerId = btn.getAttribute('data-id');
      const partner = store.partners.find(p => p.partnerId === partnerId);
      enteredIdentifier = partner?.email || 'srikanth@sahasraartha.in';
      activeAuthMode = 'password';
      store.notify();
    });
  });
}
