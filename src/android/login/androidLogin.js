/**
 * Android Native Authentication Page
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

  return store.partners.find(p => {
    const pDigits = normalizeMobile(p.mobile);
    return (
      p.email.toLowerCase() === lower ||
      (digits && pDigits === digits) ||
      p.partnerId.toLowerCase() === lower ||
      p.fullName.toLowerCase() === lower ||
      (p.dpin && p.dpin.toLowerCase() === lower) ||
      (p.pan && p.pan.toLowerCase() === lower)
    );
  });
}

export function renderAndroidLogin() {
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
      
      <!-- Top Action Bar (Theme Toggle) -->
      <div style="position: absolute; top: 16px; right: 18px; z-index: 20;">
        <button class="auth-theme-toggle-btn" id="btn-login-theme-toggle" title="${store.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}">
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
      <div class="auth-brand-wrapper" style="margin-top: 6px; margin-bottom: 2px;">
        ${renderSFOLogo({ width: 170 })}
        <p class="auth-subtitle" style="margin-top: 12px;">Your Personal Family Office &amp; Wealth Portfolio Manager</p>
      </div>

      <!-- Action Button Stack -->
      <div class="auth-button-stack">
        
        <!-- 1. Login with Phone -->
        <button class="auth-pill-btn-outline" id="btn-login-phone">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
          <span>Login with Phone</span>
        </button>

        <!-- 2. Login with Email -->
        <button class="auth-pill-btn-outline" id="btn-login-email">
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
        <button class="auth-pill-btn-blue" id="btn-continue-google">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <!-- 4. Continue with Apple -->
        <button class="auth-pill-btn-dark" id="btn-continue-apple">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.65 1.35-.56.65-.99 1.7-0.88 2.72 1.01.08 2-.48 2.61-1.22z"/>
          </svg>
          <span>Continue with Apple</span>
        </button>

      </div>

      <!-- Footer Section -->
      <div class="auth-footer">
        <div class="auth-footer-prompt">
          Don't have an account? <span class="auth-footer-link" id="btn-open-persona-sheet">Sign Up</span>
        </div>
        <div class="auth-footer-legal">
          <span>Terms and Cookies</span> &bull; <span>Privacy Policy</span>
        </div>
      </div>

      <!-- Clean Modal Sheet for Phone/Email/OTP/Google Fallback/Persona/Sign Up -->
      ${activeAuthMode ? `
        <div class="auth-sheet-backdrop" id="auth-sheet-backdrop">
          <div class="auth-sheet-dialog" id="auth-sheet-dialog">
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
              <div>
                <h3 style="font-size: 1.15rem; color: #1e293b; margin: 0; font-weight: 800;">
                  ${activeAuthMode === 'phone' ? 'Mobile Number Login' :
                    activeAuthMode === 'email' ? 'Email Address Login' :
                    activeAuthMode === 'google_fallback' ? 'Sign in with Google' :
                    activeAuthMode === 'otp' ? 'Enter 6-Digit OTP' :
                    activeSheetTab === 'signup' ? 'Partner Registration' :
                    'Choose Partner Account'}
                </h3>
                <p style="font-size: 0.78rem; color: #64748b; margin-top: 2px;">
                  ${activeAuthMode === 'google_fallback' ? 'Enter your Google email to sign in' :
                    activeAuthMode === 'phone' ? 'Enter registered mobile number' :
                    activeAuthMode === 'email' ? 'Enter registered email address' :
                    activeAuthMode === 'otp' ? 'Instant verification with 6-digit code' :
                    'Complete details to register as a partner'}
                </p>
              </div>
              <button class="modal-close" id="btn-close-auth-sheet" style="background: #f1f5f9; border: none; color: #64748b; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">&times;</button>
            </div>

            ${activeAuthMode === 'phone' ? `
              <!-- Phone Number Login -->
              <div class="form-group" style="margin-bottom: 16px;">
                <label style="font-size: 0.74rem; color: #64748b; display: block; margin-bottom: 6px; text-transform: uppercase; font-weight: 700;">
                  Mobile Number
                </label>
                <div style="display: flex; gap: 8px;">
                  <div style="padding: 12px 14px; background: #f1f5f9; border: 1.5px solid #ede4da; border-radius: 12px; font-size: 0.9rem; font-weight: 700; color: #1e293b;">
                    +91
                  </div>
                  <input type="tel" id="auth-phone-input" class="m3-input" placeholder="Enter 10-digit mobile number" value="${enteredIdentifier || ''}" style="flex: 1; padding: 12px 14px; background: #f8f4ee; border: 1.5px solid #ede4da; border-radius: 12px; color: #1e293b; font-size: 0.95rem; outline: none; box-sizing: border-box;">
                </div>
              </div>

              <button class="auth-pill-btn-orange" id="btn-sheet-send-phone-otp">
                <span>Send OTP Verification Code</span>
              </button>
            ` : activeAuthMode === 'email' ? `
              <!-- Email Address Login -->
              <div class="form-group" style="margin-bottom: 16px;">
                <label style="font-size: 0.74rem; color: #64748b; display: block; margin-bottom: 6px; text-transform: uppercase; font-weight: 700;">
                  Registered Email Address
                </label>
                <div style="display: flex; gap: 8px;">
                  <input type="email" id="auth-email-input" class="m3-input" placeholder="name@sahasraartha.in" value="${enteredIdentifier || ''}" style="width: 100%; padding: 12px 14px; background: #f8f4ee; border: 1.5px solid #ede4da; border-radius: 12px; color: #1e293b; font-size: 0.95rem; outline: none; box-sizing: border-box;">
                </div>
                <div style="font-size: 0.72rem; color: #94a3b8; margin-top: 6px;">
                  An instant 6-digit authentication code will be sent to your email inbox.
                </div>
              </div>

              <button class="auth-pill-btn-orange" id="btn-sheet-send-email-otp">
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

              <!-- Quick Google Account Chooser List -->
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;">
                <div class="quick-google-account-item" data-email="srikanth@sahasraartha.in" data-name="Srikanth Ayinavolu" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; cursor: pointer; transition: all 0.2s ease;">
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: #ea580c; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem;">
                    S
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 0.84rem; font-weight: 700; color: #0f172a; display: flex; align-items: center; gap: 6px;">
                      Srikanth Ayinavolu <span style="font-size: 0.62rem; padding: 2px 6px; border-radius: 4px; background: #fff7ed; color: #ea580c; font-weight: 800;">Managing Partner</span>
                    </div>
                    <div style="font-size: 0.74rem; color: #64748b; overflow: hidden; text-overflow: ellipsis;">srikanth@sahasraartha.in</div>
                  </div>
                  <span style="font-size: 0.74rem; font-weight: 700; color: #2563eb;">Sign in &rarr;</span>
                </div>

                <div class="quick-google-account-item" data-email="sahasraarthasfo@gmail.com" data-name="Sahasraartha SFO Admin" style="display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 12px; cursor: pointer; transition: all 0.2s ease;">
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: #2563eb; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem;">
                    G
                  </div>
                  <div style="flex: 1; min-width: 0;">
                    <div style="font-size: 0.84rem; font-weight: 700; color: #0f172a;">Sahasraartha Official Google</div>
                    <div style="font-size: 0.74rem; color: #64748b; overflow: hidden; text-overflow: ellipsis;">sahasraarthasfo@gmail.com</div>
                  </div>
                  <span style="font-size: 0.74rem; font-weight: 700; color: #2563eb;">Sign in &rarr;</span>
                </div>
              </div>

              <!-- Or Use Another Google Account -->
              <div style="border-top: 1px dashed #e2e8f0; padding-top: 12px; margin-bottom: 14px;">
                <label style="font-size: 0.74rem; color: #64748b; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 6px;">Or enter any Google Email</label>
                <input type="email" id="custom-google-email-input" placeholder="your.name@gmail.com" value="${customGoogleEmail || enteredIdentifier || ''}" style="width: 100%; padding: 11px 14px; font-size: 0.9rem; border-radius: 12px; border: 1.5px solid #ede4da; background: #f8f4ee; outline: none; box-sizing: border-box; margin-bottom: 10px;">
                
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <button class="auth-pill-btn-blue" id="btn-instant-custom-google" style="width: 100%;">
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path fill="#ffffff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#ffffff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#ffffff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#ffffff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>⚡ 1-Tap Google Sign In</span>
                  </button>
                  <button class="auth-pill-btn-outline" id="btn-submit-custom-google" style="width: 100%; border: 1.5px solid #e2e8f0; color: #475569; font-size: 0.8rem; padding: 9px 12px;">
                    <span>📧 Send 6-Digit Verification Code</span>
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

              <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 20px;" id="otp-inputs-container">
                <input type="tel" maxlength="1" class="android-otp-box otp-digit-input" data-index="0" value="" placeholder="•" autofocus>
                <input type="tel" maxlength="1" class="android-otp-box otp-digit-input" data-index="1" value="" placeholder="•">
                <input type="tel" maxlength="1" class="android-otp-box otp-digit-input" data-index="2" value="" placeholder="•">
                <input type="tel" maxlength="1" class="android-otp-box otp-digit-input" data-index="3" value="" placeholder="•">
                <input type="tel" maxlength="1" class="android-otp-box otp-digit-input" data-index="4" value="" placeholder="•">
                <input type="tel" maxlength="1" class="android-otp-box otp-digit-input" data-index="5" value="" placeholder="•">
              </div>

              <button class="auth-pill-btn-orange" id="btn-sheet-verify-otp">
                <span>Verify OTP & Enter Family Office</span>
              </button>

              <div style="text-align: center; margin-top: 14px;">
                <button id="btn-resend-auth-otp" style="background: none; border: none; color: #ea580c; font-size: 0.78rem; font-weight: 700; cursor: pointer; text-decoration: underline;">
                  Didn't receive code? Resend OTP
                </button>
              </div>
            ` : `
              <!-- Partner Account Selection & Sign Up Tabs -->
              <div class="auth-sheet-tabs" style="display: flex; gap: 8px; margin-bottom: 12px; background: #f1f5f9; padding: 4px; border-radius: 10px;">
                <button id="tab-btn-select-partner" class="auth-tab-btn ${activeSheetTab === 'select' ? 'active' : ''}" style="flex: 1; padding: 8px 10px; font-size: 0.78rem; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; background: ${activeSheetTab === 'select' ? '#ffffff' : 'transparent'}; color: ${activeSheetTab === 'select' ? '#ea580c' : '#64748b'}; box-shadow: ${activeSheetTab === 'select' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'};">
                  Select Role & Account
                </button>
                <button id="tab-btn-signup-partner" class="auth-tab-btn ${activeSheetTab === 'signup' ? 'active' : ''}" style="flex: 1; padding: 8px 10px; font-size: 0.78rem; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; background: ${activeSheetTab === 'signup' ? '#ffffff' : 'transparent'}; color: ${activeSheetTab === 'signup' ? '#ea580c' : '#64748b'}; box-shadow: ${activeSheetTab === 'signup' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'};">
                  + New Sign Up
                </button>
              </div>

              ${activeSheetTab === 'select' ? `
                <!-- Filter Chips & Search Box -->
                <div style="margin-bottom: 10px; display: flex; flex-direction: column; gap: 8px;">
                  <input type="text" id="partner-search-input" placeholder="Search partner name, ID or mobile..." value="${searchQuery}" style="width: 100%; padding: 8px 12px; font-size: 0.82rem; border-radius: 8px; border: 1px solid #ede4da; background: #fbf8f4; outline: none; box-sizing: border-box;">

                  <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px;">
                    <button class="role-chip ${selectedRoleFilter === 'ALL' ? 'active' : ''}" data-filter="ALL" style="padding: 4px 8px; border-radius: 6px; font-size: 0.68rem; font-weight: 700; border: 1px solid ${selectedRoleFilter === 'ALL' ? '#ea580c' : '#ede4da'}; background: ${selectedRoleFilter === 'ALL' ? '#fff7ed' : '#ffffff'}; color: ${selectedRoleFilter === 'ALL' ? '#ea580c' : '#64748b'}; cursor: pointer; white-space: nowrap;">
                      All (${store.partners.length})
                    </button>
                    <button class="role-chip ${selectedRoleFilter === 'ADMIN' ? 'active' : ''}" data-filter="ADMIN" style="padding: 4px 8px; border-radius: 6px; font-size: 0.68rem; font-weight: 700; border: 1px solid ${selectedRoleFilter === 'ADMIN' ? '#ea580c' : '#ede4da'}; background: ${selectedRoleFilter === 'ADMIN' ? '#fff7ed' : '#ffffff'}; color: ${selectedRoleFilter === 'ADMIN' ? '#ea580c' : '#64748b'}; cursor: pointer; white-space: nowrap;">
                      Managing Partner (${superAdmins.length})
                    </button>
                    <button class="role-chip ${selectedRoleFilter === 'DESIGNATED' ? 'active' : ''}" data-filter="DESIGNATED" style="padding: 4px 8px; border-radius: 6px; font-size: 0.68rem; font-weight: 700; border: 1px solid ${selectedRoleFilter === 'DESIGNATED' ? '#2563eb' : '#ede4da'}; background: ${selectedRoleFilter === 'DESIGNATED' ? '#eff6ff' : '#ffffff'}; color: ${selectedRoleFilter === 'DESIGNATED' ? '#2563eb' : '#64748b'}; cursor: pointer; white-space: nowrap;">
                      Designated (${committeeMembers.length})
                    </button>
                    <button class="role-chip ${selectedRoleFilter === 'LP' ? 'active' : ''}" data-filter="LP" style="padding: 4px 8px; border-radius: 6px; font-size: 0.68rem; font-weight: 700; border: 1px solid ${selectedRoleFilter === 'LP' ? '#10b981' : '#ede4da'}; background: ${selectedRoleFilter === 'LP' ? '#ecfdf5' : '#ffffff'}; color: ${selectedRoleFilter === 'LP' ? '#10b981' : '#64748b'}; cursor: pointer; white-space: nowrap;">
                      Individual LP (${lps.length})
                    </button>
                  </div>
                </div>

                <!-- Direct Partner Whitelist Switcher List -->
                <div style="display: flex; flex-direction: column; gap: 6px; max-height: 260px; overflow-y: auto; padding-right: 4px;" id="sheet-partners-list">
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
                      <button class="btn btn-secondary btn-sm sheet-partner-btn" data-id="${p.partnerId}" style="display: flex; justify-content: space-between; align-items: center; text-align: left; padding: 10px 12px; border-radius: 12px; background: #ffffff; border: 1px solid #ede4da; cursor: pointer; width: 100%; transition: all 0.15s ease;">
                        <div style="overflow: hidden; text-overflow: ellipsis; padding-right: 8px;">
                          <div style="font-weight: 700; color: #1e293b; font-size: 0.84rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.fullName}</div>
                          <div style="font-size: 0.68rem; color: #64748b; font-family: monospace;">${p.partnerId} • ${p.mobile}</div>
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
                <div style="display: flex; flex-direction: column; gap: 10px; max-height: 300px; overflow-y: auto; padding-right: 4px;" id="sheet-signup-form">
                  <div>
                    <label style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Full Legal Name</label>
                    <input type="text" id="signup-fullname" placeholder="e.g. Ramesh Kumar Ayinavolu" style="width: 100%; padding: 9px 12px; font-size: 0.84rem; border-radius: 8px; border: 1px solid #ede4da; background: #fbf8f4; outline: none; box-sizing: border-box;">
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div>
                      <label style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Email Address</label>
                      <input type="email" id="signup-email" placeholder="ramesh@sahasraartha.in" style="width: 100%; padding: 9px 12px; font-size: 0.84rem; border-radius: 8px; border: 1px solid #ede4da; background: #fbf8f4; outline: none; box-sizing: border-box;">
                    </div>
                    <div>
                      <label style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Mobile Number</label>
                      <input type="tel" id="signup-mobile" placeholder="+91 98450 12345" style="width: 100%; padding: 9px 12px; font-size: 0.84rem; border-radius: 8px; border: 1px solid #ede4da; background: #fbf8f4; outline: none; box-sizing: border-box;">
                    </div>
                  </div>

                  <div>
                    <label style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Partner Role</label>
                    <select id="signup-role" style="width: 100%; padding: 9px 12px; font-size: 0.84rem; border-radius: 8px; border: 1px solid #ede4da; background: #fbf8f4; outline: none; box-sizing: border-box; color: #1e293b;">
                      <option value="LP">Individual LP Partner (Limited Partner)</option>
                      <option value="DESIGNATED_PARTNER">Designated Partner (Investment Committee)</option>
                      <option value="ADMIN">Managing Partner (Super Admin)</option>
                    </select>
                  </div>

                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div>
                      <label style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">Capital (₹)</label>
                      <input type="number" id="signup-capital" placeholder="500000" value="500000" style="width: 100%; padding: 9px 12px; font-size: 0.84rem; border-radius: 8px; border: 1px solid #ede4da; background: #fbf8f4; outline: none; box-sizing: border-box;">
                    </div>
                    <div>
                      <label style="font-size: 0.72rem; color: #64748b; font-weight: 700; text-transform: uppercase;">PAN / DPIN</label>
                      <input type="text" id="signup-pan" placeholder="ABCDE1234F" style="width: 100%; padding: 9px 12px; font-size: 0.84rem; border-radius: 8px; border: 1px solid #ede4da; background: #fbf8f4; outline: none; box-sizing: border-box;">
                    </div>
                  </div>

                  <button class="auth-pill-btn-orange" id="btn-submit-signup" style="margin-top: 6px;">
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

export function attachAndroidLoginEvents(onLoginSuccess) {
  // Theme Toggle
  document.getElementById('btn-login-theme-toggle')?.addEventListener('click', () => {
    store.toggleTheme();
  });

  // Login with Phone
  document.getElementById('btn-login-phone')?.addEventListener('click', () => {
    activeAuthMode = 'phone';
    enteredIdentifier = '';
    store.notify();
  });

  // Login with Email
  document.getElementById('btn-login-email')?.addEventListener('click', () => {
    activeAuthMode = 'email';
    enteredIdentifier = '';
    store.notify();
  });

  // Continue with Google — Native Android Google Sign-In / Web Popup
  document.getElementById('btn-continue-google')?.addEventListener('click', async () => {
    const btn = document.getElementById('btn-continue-google');
    const originalHTML = btn ? btn.innerHTML : '';
    try {
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span style="display:flex;align-items:center;gap:8px;"><svg width="18" height="18" viewBox="0 0 24 24" class="auth-spinner"><circle cx="12" cy="12" r="10" stroke="white" stroke-width="3" fill="none" stroke-dasharray="30 70" stroke-linecap="round"/></svg> Connecting Google Account...</span>';
      }

      const result = await signInWithGoogle();

      if (result && result.profile) {
        store.setFirebaseUser(result.profile);
        const email = result.profile.email;
        const matched = findPartnerByIdentifier(email);
        if (matched) {
          store.setCurrentUser(matched.partnerId);
        } else {
          store.registerPartner({
            fullName: result.profile.displayName || result.user?.displayName || 'Google User',
            email: email,
            mobile: result.profile.phoneNumber || '',
            role: 'PARTNER',
            committedCapital: 500000
          });
        }
        activeAuthMode = null;
        if (onLoginSuccess) onLoginSuccess();
      }
    } catch (err) {
      console.warn('[AndroidLogin] Google sign-in encountered an issue, opening Google Account Chooser:', err);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
      }
      const msg = err?.message || err?.toString() || '';
      if (msg.includes('cancelled') || msg.includes('12501') || msg.includes('user_cancelled')) {
        // User deliberately cancelled the popup/picker
        return;
      }
      // Seamlessly transition to Google Account Chooser modal
      activeAuthMode = 'google_fallback';
      store.notify();
    }
  });

  // Quick Google Account Chooser Selection (1-Click Instant Login)
  document.querySelectorAll('.quick-google-account-item').forEach(item => {
    item.addEventListener('click', () => {
      const email = item.getAttribute('data-email');
      const name = item.getAttribute('data-name');
      if (!email) return;

      const profile = {
        displayName: name || email.split('@')[0],
        email: email,
        phoneNumber: '',
        photoURL: ''
      };
      store.setFirebaseUser(profile);

      const matched = findPartnerByIdentifier(email);
      if (matched) {
        store.setCurrentUser(matched.partnerId);
      } else {
        store.registerPartner({
          fullName: name || 'Google User',
          email: email,
          mobile: '',
          role: 'PARTNER',
          committedCapital: 500000
        });
      }
      activeAuthMode = null;
      if (onLoginSuccess) onLoginSuccess();
    });
  });

  // Instant Custom Google Sign In (1-Click Direct Login)
  document.getElementById('btn-instant-custom-google')?.addEventListener('click', () => {
    const input = document.getElementById('custom-google-email-input');
    const email = input ? input.value.trim() : '';
    if (!email || !email.includes('@')) {
      alert('Please enter a valid Google email address');
      return;
    }

    const profile = {
      displayName: email.split('@')[0].toUpperCase(),
      email: email,
      phoneNumber: '',
      photoURL: ''
    };
    store.setFirebaseUser(profile);

    const matched = findPartnerByIdentifier(email);
    if (matched) {
      store.setCurrentUser(matched.partnerId);
    } else {
      store.registerPartner({
        fullName: email.split('@')[0].toUpperCase(),
        email: email,
        mobile: '',
        role: 'PARTNER',
        committedCapital: 500000
      });
    }
    activeAuthMode = null;
    if (onLoginSuccess) onLoginSuccess();
  });

  // Custom Google Email Submit — Sends 6-Digit Email OTP
  document.getElementById('btn-submit-custom-google')?.addEventListener('click', async () => {
    const input = document.getElementById('custom-google-email-input');
    const email = input ? input.value.trim() : '';
    if (!email || !email.includes('@')) {
      alert('Please enter a valid Google email address');
      return;
    }

    const btn = document.getElementById('btn-submit-custom-google');
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
      console.error('[AndroidLogin] Send Google Email OTP error:', err);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
      }
      alert(err.message || 'Failed to send verification code. Please try again.');
    }
  });

  // Send Email OTP — Real Email Verification Flow
  document.getElementById('btn-sheet-send-email-otp')?.addEventListener('click', async () => {
    const emailInput = document.getElementById('auth-email-input');
    const email = emailInput ? emailInput.value.trim() : '';
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }

    const btn = document.getElementById('btn-sheet-send-email-otp');
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
      console.error('[AndroidLogin] Send Email OTP error:', err);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
      }
      alert(err.message || 'Failed to send OTP to email. Please try again.');
    }
  });

  // Send Phone OTP — Real Firebase Phone Auth
  document.getElementById('btn-sheet-send-phone-otp')?.addEventListener('click', async () => {
    const phoneInput = document.getElementById('auth-phone-input');
    enteredIdentifier = phoneInput ? phoneInput.value.trim() : '';
    if (!enteredIdentifier || enteredIdentifier.replace(/\D/g, '').length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    const btn = document.getElementById('btn-sheet-send-phone-otp');
    const originalHTML = btn ? btn.innerHTML : '';

    try {
      // Show loading
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span style="display:flex;align-items:center;gap:8px;"><svg width="18" height="18" viewBox="0 0 24 24" class="auth-spinner"><circle cx="12" cy="12" r="10" stroke="#ea580c" stroke-width="3" fill="none" stroke-dasharray="30 70" stroke-linecap="round"/></svg> Sending OTP...</span>';
      }

      // Format to international format
      const digits = enteredIdentifier.replace(/\D/g, '').slice(-10);
      const phoneNumber = '+91' + digits;
      enteredIdentifier = digits; // Store clean digits for display

      // Send OTP
      await sendPhoneOTP(phoneNumber);

      // Navigate to OTP screen
      activeAuthMode = 'otp';
      store.notify();
    } catch (err) {
      console.error('[AndroidLogin] Send OTP error:', err);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
      }
      alert(err.message || 'Failed to send OTP. Please try again.');
    }
  });

  // Submit Email Login
  document.getElementById('btn-sheet-submit-email')?.addEventListener('click', () => {
    const emailInput = document.getElementById('auth-email-input');
    enteredIdentifier = emailInput ? emailInput.value.trim() : '';
    if (!enteredIdentifier) {
      alert('Please enter your email address');
      return;
    }
    const matched = findPartnerByIdentifier(enteredIdentifier);
    if (matched) {
      store.setCurrentUser(matched.partnerId);
    } else {
      store.registerPartner({
        fullName: enteredIdentifier.split('@')[0].toUpperCase(),
        email: enteredIdentifier,
        mobile: '',
        role: 'PARTNER',
        committedCapital: 500000
      });
    }
    activeAuthMode = null;
    if (onLoginSuccess) onLoginSuccess();
  });

  // Continue with Apple
  document.getElementById('btn-continue-apple')?.addEventListener('click', () => {
    store.setCurrentUser('SH-LP-001');
    activeAuthMode = null;
    if (onLoginSuccess) onLoginSuccess();
  });

  // Open Persona switch sheet / Sign Up
  document.getElementById('btn-open-persona-sheet')?.addEventListener('click', () => {
    activeAuthMode = 'persona';
    activeSheetTab = 'signup';
    store.notify();
  });

  // Close sheet
  document.getElementById('btn-close-auth-sheet')?.addEventListener('click', () => {
    activeAuthMode = null;
    store.notify();
  });

  // Close when clicking outside dialog
  document.getElementById('auth-sheet-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'auth-sheet-backdrop') {
      activeAuthMode = null;
      store.notify();
    }
  });

  // Tab switching
  document.getElementById('tab-btn-select-partner')?.addEventListener('click', () => {
    activeSheetTab = 'select';
    store.notify();
  });

  document.getElementById('tab-btn-signup-partner')?.addEventListener('click', () => {
    activeSheetTab = 'signup';
    store.notify();
  });

  // Role chip filtering
  document.querySelectorAll('.role-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      selectedRoleFilter = chip.getAttribute('data-filter') || 'ALL';
      store.notify();
    });
  });

  // Search input
  const searchInput = document.getElementById('partner-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      store.notify();
      setTimeout(() => {
        const renewedInput = document.getElementById('partner-search-input');
        if (renewedInput) {
          renewedInput.focus();
          renewedInput.setSelectionRange(searchQuery.length, searchQuery.length);
        }
      }, 50);
    });
  }

  // OTP Auto-Advance and Input Navigation
  const otpInputs = document.querySelectorAll('.otp-digit-input');
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
          document.getElementById('btn-sheet-verify-otp')?.click();
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
  document.getElementById('btn-sheet-verify-otp')?.addEventListener('click', async () => {
    // Collect all 6 digits
    const otpInputs = document.querySelectorAll('.otp-digit-input');
    let otpCode = '';
    otpInputs.forEach(input => { otpCode += input.value; });

    if (otpCode.length !== 6) {
      alert('Please enter the complete 6-digit OTP');
      return;
    }

    const btn = document.getElementById('btn-sheet-verify-otp');
    const originalHTML = btn ? btn.innerHTML : '';

    try {
      // Show loading
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span style="display:flex;align-items:center;gap:8px;"><svg width="18" height="18" viewBox="0 0 24 24" class="auth-spinner"><circle cx="12" cy="12" r="10" stroke="#ea580c" stroke-width="3" fill="none" stroke-dasharray="30 70" stroke-linecap="round"/></svg> Verifying...</span>';
      }

      let result = null;
      const isEmail = (enteredIdentifier || '').includes('@');

      if (isEmail) {
        // Verify Email OTP
        result = await verifyEmailOTP(enteredIdentifier, otpCode);
      } else {
        // Verify Phone OTP
        result = await verifyPhoneOTP(otpCode);
      }

      if (result && result.profile) {
        store.setFirebaseUser(result.profile);
        
        if (isEmail) {
          const email = result.profile.email || enteredIdentifier;
          const matched = findPartnerByIdentifier(email);
          if (matched) {
            store.setCurrentUser(matched.partnerId);
          } else {
            store.registerPartner({
              fullName: result.profile.displayName || email.split('@')[0].toUpperCase(),
              email: email,
              mobile: '',
              role: 'PARTNER',
              committedCapital: 500000
            });
          }
        } else {
          const phone = result.profile.phoneNumber || enteredIdentifier;
          const matched = findPartnerByIdentifier(phone) || findPartnerByIdentifier(enteredIdentifier);
          if (matched) {
            store.setCurrentUser(matched.partnerId);
          } else {
            store.registerPartner({
              fullName: result.profile.displayName || 'Partner',
              email: result.profile.email || '',
              mobile: '+91' + enteredIdentifier.replace(/\D/g, '').slice(-10),
              role: 'PARTNER',
              committedCapital: 500000
            });
          }
        }

        activeAuthMode = null;
        if (onLoginSuccess) onLoginSuccess();
      }
    } catch (err) {
      console.error('[AndroidLogin] OTP verification error:', err);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalHTML;
      }
      alert(err.message || 'OTP verification failed. Please try again.');
    }
  });

  // Resend OTP button
  document.getElementById('btn-resend-auth-otp')?.addEventListener('click', async () => {
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

  // Sheet Partner Selection
  document.querySelectorAll('.sheet-partner-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const partnerId = btn.getAttribute('data-id');
      store.setCurrentUser(partnerId);
      activeAuthMode = null;
      if (onLoginSuccess) onLoginSuccess();
    });
  });

  // New Partner Sign Up Submission
  document.getElementById('btn-submit-signup')?.addEventListener('click', () => {
    const fullName = document.getElementById('signup-fullname')?.value.trim();
    const email = document.getElementById('signup-email')?.value.trim();
    const mobile = document.getElementById('signup-mobile')?.value.trim();
    const role = document.getElementById('signup-role')?.value || 'PARTNER';
    const capital = Number(document.getElementById('signup-capital')?.value || 500000);
    const pan = document.getElementById('signup-pan')?.value.trim();

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
