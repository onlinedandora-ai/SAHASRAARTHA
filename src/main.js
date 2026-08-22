/**
 * Sahasraartha Family Office LLP - Dedicated Mobile Application Bootstrap
 * Targets iOS & Android native platforms
 * Clean Mobile Experience:
 * - Dedicated Reference-Matching Login Page (No Status Bar / No Clutter on Login)
 * - Official Google & Apple Vector Logos
 * - Seamless Authentication & Transition
 */

import { store } from './state/store.js';
import { formatINR } from './utils/formatters.js';
import { renderSFOEmblem } from './components/sfoLogo.js';
import { renderPartnerPortal, attachPartnerEvents } from './components/partnerPortal.js';
import { renderPortfolioAssets, attachPortfolioAssetsEvents } from './components/portfolioAssets.js';
import { renderCapitalLedger, attachCapitalLedgerEvents } from './components/capitalLedger.js';
import { renderDocVault, attachDocVaultEvents } from './components/docVault.js';
import { renderPartnerSettings, attachPartnerSettingsEvents } from './components/partnerSettings.js';
import { renderProposalVoting, attachProposalVotingEvents } from './components/proposalVoting.js';
import { renderAdminConsole, attachAdminEvents } from './components/adminConsole.js';
import { renderStatementModal, attachStatementEvents } from './components/statementModal.js';

// Dedicated Platform Login Modules in Separate Folders
import { renderAndroidLogin, attachAndroidLoginEvents } from './android/login/androidLogin.js';
import { renderIOSLogin, attachIOSLoginEvents } from './ios/login/iosLogin.js';

// Firebase Authentication
import { initFirebase, checkRedirectResult, onAuthChanged, signOut as firebaseSignOut } from './services/firebaseAuth.js';

// Detect platform or default
const isAndroid = /Android/i.test(navigator.userAgent);
let isAuthenticated = false; // Start directly on clean reference login screen

// ─── Initialize Firebase Auth on Boot ──────────────────────────────────────
try {
  initFirebase();
  console.log('[App] Firebase initialized');
} catch (err) {
  console.error('[App] Firebase init failed:', err);
}

// Check for Google redirect result (in case signInWithRedirect was used)
checkRedirectResult().then(result => {
  if (result && result.profile) {
    console.log('[App] Redirect sign-in result:', result.profile.email);
    store.setFirebaseUser(result.profile);
    // Auto-match to partner
    const email = result.profile.email;
    const phone = result.profile.phoneNumber;
    const matched = store.partners.find(p =>
      (email && p.email.toLowerCase() === email.toLowerCase()) ||
      (phone && p.mobile && p.mobile.replace(/\D/g, '').slice(-10) === phone.replace(/\D/g, '').slice(-10))
    );
    if (matched) {
      store.setCurrentUser(matched.partnerId);
    } else if (email) {
      store.registerPartner({
        fullName: result.profile.displayName || email.split('@')[0].toUpperCase(),
        email: email,
        mobile: phone || '',
        role: 'PARTNER',
        committedCapital: 500000
      });
    }
    isAuthenticated = true;
    renderApp();
  }
}).catch(() => { /* ignore */ });

function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  const user = store.currentUser;
  const calcs = store.getCalculations();
  const activeTab = store.activeTab;
  const pendingTxsCount = store.capitalTransactions.filter(t => t.status === 'PENDING').length;
  const pendingProposalsCount = store.proposals.filter(p => p.status === 'PENDING').length;
  const totalAdminBadge = pendingTxsCount + pendingProposalsCount;

  document.documentElement.setAttribute('data-theme', store.theme);

  // Mobile status bar live time (only used inside authenticated dashboard)
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  app.innerHTML = `
    <div class="app-wrapper">
      <div class="device-container">
        <div class="device-phone">

          ${!isAuthenticated ? `
            <!-- Dedicated Reference-Matching Login Page -->
            <div class="mobile-scroll-body" style="padding: 0; height: 100%;">
              ${isAndroid ? renderAndroidLogin() : renderIOSLogin()}
            </div>
          ` : `
            <!-- Authenticated Mobile App Header Bar -->
            <div class="mobile-app-header">
              <div class="mobile-brand">
                <div class="mobile-brand-icon">
                  ${renderSFOEmblem({ size: 34 })}
                </div>
                <div>
                  <div class="mobile-brand-title">SAHASRAARTHA SFO</div>
                  <div class="mobile-brand-sub">${user.fullName} &bull; ${user.dpin ? 'DPIN: ' + user.dpin : user.partnerId}</div>
                </div>
              </div>

              <div class="mobile-header-actions">
                <button class="mobile-header-btn" id="btn-toggle-theme" title="${store.theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}">
                  ${store.theme === 'dark' ? `
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-gold)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  ` : `
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  `}
                </button>
                <button class="mobile-header-btn" id="btn-open-statement" title="Account Statement">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </button>
                <button class="mobile-header-btn" id="btn-open-profile-tab" title="Partner Profile">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </button>
                <button class="mobile-header-btn mobile-header-btn-danger" id="btn-lock-app" title="Sign Out">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            </div>

            <!-- Scrollable App Content Body -->
            <div class="mobile-scroll-body">
              ${activeTab === 'overview' || activeTab === 'partner' ? renderPartnerPortal() :
                activeTab === 'assets' ? renderPortfolioAssets() :
                activeTab === 'ledger' ? renderCapitalLedger() :
                activeTab === 'vault' ? renderDocVault() :
                activeTab === 'voting' ? renderProposalVoting() :
                activeTab === 'admin' ? renderAdminConsole() :
                activeTab === 'profile' ? renderPartnerSettings() :
                renderPartnerPortal()}
            </div>

            <!-- Native Mobile Bottom Tab Bar -->
            <nav class="mobile-bottom-nav">
              <button class="mobile-nav-item ${activeTab === 'overview' || activeTab === 'partner' ? 'active' : ''}" data-tab="overview">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span>Home</span>
              </button>

              <button class="mobile-nav-item ${activeTab === 'assets' ? 'active' : ''}" data-tab="assets">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>
                <span>Assets</span>
              </button>

              <button class="mobile-nav-item ${activeTab === 'ledger' ? 'active' : ''}" data-tab="ledger">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                <span>Ledger</span>
              </button>

              <button class="mobile-nav-item ${activeTab === 'vault' ? 'active' : ''}" data-tab="vault">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span>Vault</span>
              </button>

              <button class="mobile-nav-item ${activeTab === 'admin' ? 'active' : ''}" data-tab="admin">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                <span>Admin</span>
                ${totalAdminBadge > 0 ? `<span class="mobile-nav-badge">${totalAdminBadge}</span>` : ''}
              </button>
            </nav>
          `}

          <!-- iOS Home Indicator -->
          <div class="mobile-home-indicator">
            <div class="indicator-pill"></div>
          </div>

        </div>
      </div>
    </div>

    <!-- Modals Container -->
    <div id="statement-modal-wrapper">
      ${renderStatementModal()}
    </div>
  `;

  attachGlobalEvents();
}

function attachGlobalEvents() {
  if (!isAuthenticated) {
    if (isAndroid) {
      attachAndroidLoginEvents(() => {
        isAuthenticated = true;
        renderApp();
      });
    } else {
      attachIOSLoginEvents(() => {
        isAuthenticated = true;
        renderApp();
      });
    }
  } else {
    // Toggle Light / Dark Theme button
    document.getElementById('btn-toggle-theme')?.addEventListener('click', () => {
      store.toggleTheme();
    });

    // Logout / Lock App button (also signs out from Firebase)
    const handleSignOut = async () => {
      try {
        await firebaseSignOut();
        store.clearFirebaseUser();
      } catch (err) {
        console.warn('[App] Firebase sign-out error:', err);
      }
      isAuthenticated = false;
      renderApp();
    };

    document.getElementById('btn-lock-app')?.addEventListener('click', handleSignOut);
    document.getElementById('btn-settings-signout')?.addEventListener('click', handleSignOut);

    // Mobile Bottom Navigation Tab Switching
    document.querySelectorAll('.mobile-nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        store.setActiveTab(tab);
      });
    });

    // Statement modal button
    document.getElementById('btn-open-statement')?.addEventListener('click', () => {
      const modal = document.getElementById('statement-modal-wrapper');
      if (modal) {
        modal.innerHTML = renderStatementModal({ isOpen: true });
        attachStatementEvents();
      }
    });

    // Profile icon button
    document.getElementById('btn-open-profile-tab')?.addEventListener('click', () => {
      store.setActiveTab('profile');
    });

    // Attach Tab specific handlers
    const tab = store.activeTab;
    if (tab === 'overview' || tab === 'partner') {
      attachPartnerEvents();
    } else if (tab === 'assets') {
      attachPortfolioAssetsEvents();
    } else if (tab === 'ledger') {
      attachCapitalLedgerEvents();
    } else if (tab === 'vault') {
      attachDocVaultEvents();
    } else if (tab === 'voting') {
      attachProposalVotingEvents();
    } else if (tab === 'admin') {
      attachAdminEvents();
    } else if (tab === 'profile') {
      attachPartnerSettingsEvents();
    }

    attachStatementEvents();
  }
}

// Reactive store subscription
store.subscribe(() => {
  renderApp();
});

// Boot app
renderApp();
