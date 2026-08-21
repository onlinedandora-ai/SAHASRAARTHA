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

// Detect platform or default
const isAndroid = /Android/i.test(navigator.userAgent);
let isAuthenticated = false; // Start directly on clean reference login screen

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
                <div class="mobile-brand-icon">S</div>
                <div>
                  <div class="mobile-brand-title">SAHASRAARTHA SFO</div>
                  <div class="mobile-brand-sub">${user.fullName} &bull; ${user.dpin ? 'DPIN: ' + user.dpin : user.partnerId}</div>
                </div>
              </div>

              <div style="display: flex; align-items: center; gap: 6px;">
                <button class="btn btn-secondary btn-sm" id="btn-open-statement" style="padding: 5px 8px; font-size: 0.7rem;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Statement
                </button>
                <button class="btn btn-secondary btn-sm" id="btn-open-profile-tab" style="padding: 5px 8px; font-size: 0.7rem;" title="Partner Profile">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </button>
                <button class="btn btn-secondary btn-sm" id="btn-lock-app" style="padding: 5px 8px; font-size: 0.7rem;" title="Logout / Lock App">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
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
    // Logout / Lock App button
    document.getElementById('btn-lock-app')?.addEventListener('click', () => {
      isAuthenticated = false;
      renderApp();
    });

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
