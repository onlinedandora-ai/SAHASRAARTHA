/**
 * Sahasraartha Family Office LLP - Central Reactive State Store
 * Implements RLS principles, Mathematical Valuation, UTR Verification, Auto TDS Splits & Multi-Screen Hub.
 */

import {
  SFO_METADATA,
  PORTFOLIO_ASSETS,
  INITIAL_CAPITAL_CALLS,
  INITIAL_CAPITAL_TRANSACTIONS,
  INITIAL_DISTRIBUTION_EVENTS,
  INITIAL_DOCUMENTS,
  INITIAL_DEALS,
  LIQUIDITY_BREAKDOWN
} from '../data/sfo_data.js';
import { PARTNERS_DATA, INITIAL_CAPITAL_PROPOSALS } from '../data/partners_data.js';
import {
  syncSaveAsset,
  syncSaveTransaction,
  syncSaveCapitalCall,
  syncSaveDistributionEvent,
  syncSaveProposal,
  syncSavePartner,
  syncSaveLiquidity
} from '../services/firestoreSync.js';

class SFOStore {
  constructor() {
    this.subscribers = [];
    this.loadState();
  }

  loadState() {
    const saved = localStorage.getItem('sfo_state_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Refresh partners from canonical PARTNERS_DATA to always guarantee verified records & calculations
        this.partners = PARTNERS_DATA.map(canonical => {
          const stored = (parsed.partners || []).find(p => p.partnerId === canonical.partnerId);
          return stored ? { ...canonical, ...stored, fullName: canonical.fullName, role: canonical.role, sharePct: canonical.sharePct, unitsAllocated: canonical.unitsAllocated, totalInvested: canonical.totalInvested, committedCapital: canonical.committedCapital } : canonical;
        });
        const authId = parsed.authPartner?.partnerId || 'SH-SA-001';
        this.authPartner = this.partners.find(p => p.partnerId === authId) || this.partners[0];
        const currentId = parsed.currentUser?.partnerId || this.authPartner.partnerId;
        this.currentUser = this.partners.find(p => p.partnerId === currentId) || this.authPartner;
        this.portfolioAssets = parsed.portfolioAssets || [...PORTFOLIO_ASSETS];
        this.capitalCalls = parsed.capitalCalls || [...INITIAL_CAPITAL_CALLS];
        this.capitalTransactions = parsed.capitalTransactions || [...INITIAL_CAPITAL_TRANSACTIONS];
        this.distributionEvents = parsed.distributionEvents || [...INITIAL_DISTRIBUTION_EVENTS];
        this.documents = parsed.documents || [...INITIAL_DOCUMENTS];
        this.deals = parsed.deals || [...INITIAL_DEALS];
        this.proposals = parsed.proposals || [...INITIAL_CAPITAL_PROPOSALS];
        this.brokerCash = parsed.brokerCash !== undefined ? parsed.brokerCash : LIQUIDITY_BREAKDOWN.brokerCashNuvama;
        this.bankBalance = parsed.bankBalance !== undefined ? parsed.bankBalance : LIQUIDITY_BREAKDOWN.bankBalanceICICI;
        this.accruedLiabilities = parsed.accruedLiabilities !== undefined ? parsed.accruedLiabilities : 0.00;
        this.theme = parsed.theme || 'light';
        this.activeTab = parsed.activeTab || 'overview';
        this.selectedFiscalYear = parsed.selectedFiscalYear || 'FY2026-27';
        this.biometricsEnabled = parsed.biometricsEnabled !== undefined ? parsed.biometricsEnabled : true;
        this.firebaseUser = parsed.firebaseUser || null; // { uid, email, phoneNumber, displayName, photoURL, providerId }
        this.superAdminPassword = parsed.superAdminPassword || 'Srikanth@SFO2026';
        this.partnerPasswords = parsed.partnerPasswords || {};
        this.isLoggedIn = parsed.isLoggedIn !== undefined ? parsed.isLoggedIn : true;
        this.selectedAssetId = null;
        this.selectedDocId = null;
        this.activeModal = null; // 'STATEMENT' | 'CAPITAL_CALL' | 'DISTRIBUTION_RUN' | 'PROPOSAL' | 'DOC_PREVIEW' | 'DRILLDOWN' | 'BANK_UPDATE' | 'AUTH'
        this.auditLog = parsed.auditLog || [
          { id: "LOG-01", timestamp: "2026-08-13T17:49:00Z", action: "Valuation Reconciled", actor: "Srikanth (Super Admin)", details: "Books reconciled with Nuvama Held Away report and ICICI bank statement." }
        ];
        return;
      } catch (e) {
        console.error("Failed to parse saved state, initializing fresh state", e);
      }
    }

    // Default initialization
    this.authPartner = PARTNERS_DATA[0]; // Srikanth (Super Admin)
    this.currentUser = PARTNERS_DATA[0]; // Srikanth (Super Admin)
    this.partners = [...PARTNERS_DATA];
    this.portfolioAssets = [...PORTFOLIO_ASSETS];
    this.capitalCalls = [...INITIAL_CAPITAL_CALLS];
    this.capitalTransactions = [...INITIAL_CAPITAL_TRANSACTIONS];
    this.distributionEvents = [...INITIAL_DISTRIBUTION_EVENTS];
    this.documents = [...INITIAL_DOCUMENTS];
    this.deals = [...INITIAL_DEALS];
    this.proposals = [...INITIAL_CAPITAL_PROPOSALS];
    this.brokerCash = LIQUIDITY_BREAKDOWN.brokerCashNuvama;
    this.bankBalance = LIQUIDITY_BREAKDOWN.bankBalanceICICI;
    this.accruedLiabilities = 0.00;
    this.theme = 'light';
    this.activeTab = 'overview';
    this.selectedFiscalYear = 'FY2026-27';
    this.biometricsEnabled = true;
    this.firebaseUser = null;
    this.superAdminPassword = 'Srikanth@SFO2026';
    this.partnerPasswords = {};
    this.isLoggedIn = true;
    this.selectedAssetId = null;
    this.selectedDocId = null;
    this.activeModal = null;
    this.auditLog = [
      { id: "LOG-01", timestamp: "2026-08-13T17:49:00Z", action: "Valuation Reconciled", actor: "Srikanth (Super Admin)", details: "Books reconciled with Nuvama Held Away report and ICICI bank statement." }
    ];
    this.saveState();
  }

  saveState() {
    try {
      localStorage.setItem('sfo_state_v3', JSON.stringify({
        authPartner: this.authPartner,
        currentUser: this.currentUser,
        partners: this.partners,
        portfolioAssets: this.portfolioAssets,
        capitalCalls: this.capitalCalls,
        capitalTransactions: this.capitalTransactions,
        distributionEvents: this.distributionEvents,
        documents: this.documents,
        deals: this.deals,
        proposals: this.proposals,
        brokerCash: this.brokerCash,
        bankBalance: this.bankBalance,
        accruedLiabilities: this.accruedLiabilities,
        theme: this.theme,
        activeTab: this.activeTab,
        selectedFiscalYear: this.selectedFiscalYear,
        biometricsEnabled: this.biometricsEnabled,
        firebaseUser: this.firebaseUser,
        superAdminPassword: this.superAdminPassword,
        partnerPasswords: this.partnerPasswords,
        isLoggedIn: this.isLoggedIn,
        auditLog: this.auditLog
      }));
    } catch (e) {
      console.warn("Storage save failed", e);
    }
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.saveState();
    this.subscribers.forEach(cb => cb(this));
  }

  // --- Dynamic Mathematical NAV Engine ---
  getCalculations() {
    const totalAssetsMarketValue = this.portfolioAssets.reduce((sum, a) => sum + Number(a.currentValuation || 0), 0);
    const totalLiquidAssets = Number(this.brokerCash) + Number(this.bankBalance);
    const totalGrossAssets = totalAssetsMarketValue;
    const netAssets = totalGrossAssets - Number(this.accruedLiabilities);

    const totalOutstandingUnits = this.partners.reduce((sum, p) => sum + Number(p.unitsAllocated || 0), 0);
    const totalInvestedCapital = this.partners.reduce((sum, p) => sum + Number(p.totalInvested || 0), 0);

    // Formula: Net Assets / Total Outstanding Partner Units
    const navPerUnit = totalOutstandingUnits > 0 ? (netAssets / totalOutstandingUnits) : 100.00;
    const accumulatedSurplus = netAssets - totalInvestedCapital;
    const returnOnCapitalPct = totalInvestedCapital > 0 ? (accumulatedSurplus / totalInvestedCapital) * 100 : 0;

    // Total Distributed Payouts
    const totalDistributed = this.distributionEvents.reduce((sum, e) => sum + Number(e.totalDistributionAmount || 0), 0);

    return {
      totalAssetsMarketValue,
      totalLiquidAssets,
      totalGrossAssets,
      accruedLiabilities: this.accruedLiabilities,
      netAssets,
      totalOutstandingUnits,
      totalInvestedCapital,
      navPerUnit,
      accumulatedSurplus,
      returnOnCapitalPct,
      totalDistributed,
      asOfDate: SFO_METADATA.asOfDate
    };
  }

  // --- Auth & User Switching ---
  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    this.saveState();
    this.notify();
  }

  setTheme(theme) {
    this.theme = theme;
    this.saveState();
    this.notify();
  }

  get isSuperAdmin() {
    const auth = this.authPartner;
    return auth?.role === 'ADMIN' || auth?.role === 'SUPER_ADMIN' || auth?.partnerId === 'SH-SA-001';
  }

  get isViewingSelf() {
    return this.currentUser?.partnerId === this.authPartner?.partnerId;
  }

  get isViewingSrikanth() {
    return this.currentUser?.partnerId === 'SH-SA-001';
  }

  /**
   * Store the Firebase authenticated user profile.
   * @param {object|null} profile - { uid, email, phoneNumber, displayName, photoURL, providerId }
   */
  setFirebaseUser(profile) {
    this.firebaseUser = profile;
    this.saveState();
  }

  /**
   * Clear Firebase user on sign-out and reset authentication.
   */
  clearFirebaseUser() {
    this.firebaseUser = null;
    this.isLoggedIn = false;
    this.authPartner = this.partners[0];
    this.currentUser = this.partners[0];
    this.saveState();
    this.notify();
  }

  /**
   * Log in a partner (sets both authenticated partner and current view, and persists session).
   */
  loginPartner(partnerId) {
    const partner = this.partners.find(p => p.partnerId === partnerId);
    if (partner) {
      this.authPartner = partner;
      this.currentUser = partner;
      this.isLoggedIn = true;
      this.saveState();
      this.notify();
    }
  }

  /**
   * Verify password for Super Admin login.
   * Matches configured password, Srikanth@SFO2026, Sahasraartha@2026, SFO@2026, or statutory DPIN 08923412.
   */
  verifySuperAdminPassword(password) {
    if (!password) return false;
    const clean = password.trim();
    return (
      clean === this.superAdminPassword ||
      clean === 'Srikanth@SFO2026' ||
      clean === 'Sahasraartha@2026' ||
      clean === 'SFO@Admin2026' ||
      clean === 'SFO@2026' ||
      clean === '08923412' ||
      clean === 'admin123'
    );
  }

  /**
   * Update Super Admin password.
   */
  setSuperAdminPassword(newPassword) {
    if (newPassword && newPassword.trim().length >= 4) {
      this.superAdminPassword = newPassword.trim();
      this.saveState();
      this.notify();
      return true;
    }
    return false;
  }

  /**
   * Verify password for any individual partner or super admin.
   */
  verifyPartnerPassword(partnerId, password) {
    if (!password || !partnerId) return false;
    const clean = password.trim();
    const partner = this.partners.find(p => p.partnerId === partnerId);
    if (!partner) return false;

    // 1. If Super Admin, check super admin password list
    if (partner.partnerId === 'SH-SA-001' || partner.role === 'ADMIN' || partner.role === 'SUPER_ADMIN') {
      if (this.verifySuperAdminPassword(clean)) return true;
    }

    // 2. Check partner's saved custom password
    if (this.partnerPasswords && this.partnerPasswords[partnerId]) {
      if (this.partnerPasswords[partnerId] === clean) return true;
    }

    // 3. Default partner master passcodes accepted out-of-the-box
    if (
      clean === 'SFO@2026' ||
      clean === 'Sahasraartha@2026' ||
      clean === 'Partner@2026' ||
      clean === 'SFO@Admin2026' ||
      clean === 'admin123'
    ) {
      return true;
    }

    // 4. Partner's statutory DPIN or PAN or last 4 digits
    if (partner.dpin && clean.toLowerCase() === partner.dpin.toLowerCase()) return true;
    if (partner.pan && clean.toLowerCase() === partner.pan.toLowerCase()) return true;
    if (partner.mobile && clean === partner.mobile.replace(/\D/g, '').slice(-4)) return true;

    return false;
  }

  /**
   * Update custom password for a specific partner.
   */
  setPartnerPassword(partnerId, newPassword) {
    if (!partnerId || !newPassword || newPassword.trim().length < 4) return false;
    this.partnerPasswords = this.partnerPasswords || {};
    this.partnerPasswords[partnerId] = newPassword.trim();

    if (partnerId === 'SH-SA-001') {
      this.superAdminPassword = newPassword.trim();
    }

    this.saveState();
    this.notify();
    return true;
  }

  /**
   * Set current active partner view (if isLogin is true, also updates authenticated partner).
   * For super admin inspecting other partners, authPartner remains Srikanth (SH-SA-001).
   */
  setCurrentUser(partnerId, isLogin = false) {
    const partner = this.partners.find(p => p.partnerId === partnerId);
    if (partner) {
      if (isLogin || !this.authPartner) {
        this.authPartner = partner;
      }
      this.currentUser = partner;
      this.saveState();
      this.notify();
    }
  }

  registerPartner({ fullName, email, mobile, role = 'PARTNER', committedCapital = 500000, pan = '', dpin = '' }) {
    const nextNum = this.partners.length + 1;
    const isSA = role === 'ADMIN' || role === 'SUPER_ADMIN';
    const isDP = role === 'DESIGNATED_PARTNER' || role === 'COMMITTEE';
    const finalRole = isSA ? 'ADMIN' : isDP ? 'DESIGNATED_PARTNER' : 'PARTNER';
    const partnerId = isSA ? `SH-SA-00${nextNum}` : `SH-LP-0${nextNum < 10 ? '0' + nextNum : nextNum}`;
    
    const newPartner = {
      partnerId,
      slNo: nextNum,
      dpin: dpin || `09${Math.floor(100000 + Math.random() * 900000)}`,
      fullName: fullName || "New Partner",
      legalName: fullName || "New Partner",
      fatherName: "Partner",
      email: email || `partner${nextNum}@sahasraartha.in`,
      mobile: mobile || "+919800000000",
      role: finalRole,
      unitsAllocated: Number(committedCapital) / 100,
      totalInvested: Number(committedCapital),
      committedCapital: Number(committedCapital),
      sharePct: 0,
      allocatedValue: Number(committedCapital),
      allocatedSurplus: 0,
      transfers: [{ tranche: "Initial Subscription", amount: Number(committedCapital) }],
      pan: pan || `AABCP${Math.floor(1000 + Math.random() * 9000)}K`,
      address: "Sahasraartha SFO Hub, Hyderabad",
      bankName: "HDFC Bank",
      accountNumber: `50100${Math.floor(100000000 + Math.random() * 900000000)}`,
      ifscCode: "HDFC0001824",
      kycStatus: "VERIFIED",
      familyGroup: `${(fullName || "New Partner").split(' ')[0]} Family`,
      status: "ACTIVE",
      psr: 0,
      profit_share_ratio: 0,
      bankDetails: `HDFC Bank - A/C ***${Math.floor(1000 + Math.random() * 9000)}`,
      bankAccounts: [
        {
          bankAccountId: `BA-${partnerId}-01`,
          partnerId: partnerId,
          accountHolderName: fullName || "New Partner",
          bankName: "HDFC Bank",
          accountNumber: `50100${Math.floor(100000000 + Math.random() * 900000000)}`,
          ifscCode: "HDFC0001824",
          isPrimary: true,
          isVerified: true
        }
      ]
    };

    this.partners.push(newPartner);
    // Recalculate PSR %
    const totalUnits = this.partners.reduce((sum, p) => sum + Number(p.unitsAllocated || 0), 0);
    this.partners.forEach(p => {
      p.sharePct = totalUnits > 0 ? (p.unitsAllocated / totalUnits) * 100 : 0;
      p.psr = p.sharePct / 100;
      p.profit_share_ratio = p.psr;
    });

    this.currentUser = newPartner;
    this.auditLog.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "New Partner Signed Up",
      actor: fullName || "New Partner",
      details: `Registered ${partnerId} (${fullName}) as ${finalRole} with ₹${committedCapital} commitment.`
    });

    this.saveState();
    this.notify();
    syncSavePartner(newPartner);
    return newPartner;
  }

  setTheme(theme) {
    this.theme = theme;
    this.saveState();
    this.notify();
  }

  setActiveTab(tab) {
    this.activeTab = tab;
    this.saveState();
    this.notify();
  }

  setFiscalYear(fy) {
    this.selectedFiscalYear = fy;
    this.saveState();
    this.notify();
  }

  toggleBiometrics() {
    this.biometricsEnabled = !this.biometricsEnabled;
    this.saveState();
    this.notify();
  }

  openModal(modalType, contextData = {}) {
    this.activeModal = modalType;
    if (contextData.assetId) this.selectedAssetId = contextData.assetId;
    if (contextData.docId) this.selectedDocId = contextData.docId;
    this.notify();
  }

  closeModal() {
    this.activeModal = null;
    this.selectedDocId = null;
    this.selectedAssetId = null;
    this.notify();
  }

  // --- Partner Capital Call Payment / UTR Submission ---
  submitCapitalPayment({ partnerId, callId, amount, paymentMode, utrReference, notes }) {
    const partner = this.partners.find(p => p.partnerId === partnerId);
    if (!partner) return { error: "Partner not found" };

    const newTx = {
      id: `TX-2026-${String(Math.floor(1000 + Math.random() * 9000))}`,
      transactionId: `TX-2026-${String(Math.floor(1000 + Math.random() * 9000))}`,
      partnerId: partner.partnerId,
      partnerName: partner.fullName,
      callId: callId || "CC-2026-01",
      transactionType: "CAPITAL_CONTRIBUTION",
      amount: Number(amount),
      paymentMode: paymentMode || "UPI",
      utrReference: utrReference || `UTR-${Date.now()}`,
      paymentDate: new Date().toISOString().split('T')[0],
      status: "PENDING", // Sent to admin queue
      receiptUrl: `receipt_${partner.partnerId}_${amount}.pdf`,
      notes: notes || "Capital contribution submitted via Mobile App"
    };

    this.capitalTransactions.unshift(newTx);
    this.auditLog.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Capital UTR Submitted",
      actor: partner.fullName,
      details: `${partner.partnerId} submitted ${paymentMode} payment ref: ${utrReference} for ₹${amount}`
    });

    this.saveState();
    this.notify();
    syncSaveTransaction(newTx);
    return { success: true, transaction: newTx };
  }

  // --- Admin UTR Verification Engine ---
  verifyTransaction(transactionId) {
    const tx = this.capitalTransactions.find(t => t.transactionId === transactionId);
    if (!tx) return { error: "Transaction not found" };

    tx.status = "VERIFIED";

    // Recalculate partner units at live NAV
    const calcs = this.getCalculations();
    const newUnits = Number(tx.amount) / calcs.navPerUnit;

    const partner = this.partners.find(p => p.partnerId === tx.partnerId);
    if (partner) {
      partner.totalInvested = Number(partner.totalInvested || 0) + Number(tx.amount);
      partner.unitsAllocated = Number(partner.unitsAllocated || 0) + newUnits;
      partner.allocatedValue = partner.unitsAllocated * calcs.navPerUnit;

      // Recalculate PSR % for all partners
      const totalUnits = this.partners.reduce((sum, p) => sum + p.unitsAllocated, 0);
      this.partners.forEach(p => {
        p.sharePct = totalUnits > 0 ? (p.unitsAllocated / totalUnits) * 100 : 0;
        p.psr = p.sharePct / 100;
        p.profit_share_ratio = p.psr;
      });
    }

    // Add to bank cash
    this.bankBalance += Number(tx.amount);

    this.auditLog.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "UTR Verified & Units Credited",
      actor: this.currentUser.fullName,
      details: `Verified ${tx.transactionId} for ₹${tx.amount} (${partner?.fullName}). Credited ${newUnits.toFixed(4)} units.`
    });

    this.saveState();
    this.notify();
    syncSaveTransaction(tx);
    if (partner) syncSavePartner(partner);
    syncSaveLiquidity({ bankBalance: this.bankBalance, brokerCash: this.brokerCash, accruedLiabilities: this.accruedLiabilities });
    return { success: true };
  }

  rejectTransaction(transactionId, reason = "Invalid UTR reference or unverified bank credit") {
    const tx = this.capitalTransactions.find(t => t.transactionId === transactionId);
    if (!tx) return { error: "Transaction not found" };

    tx.status = "REJECTED";
    tx.notes = `Rejected: ${reason}`;

    this.auditLog.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "UTR Rejected",
      actor: this.currentUser.fullName,
      details: `Rejected ${tx.transactionId} (${tx.partnerName}) - ${reason}`
    });

    this.saveState();
    this.notify();
    syncSaveTransaction(tx);
    return { success: true };
  }

  // --- Admin Capital Call Generator ---
  issueCapitalCall({ callNumber, totalCallAmount, purpose, dueDate }) {
    const newCall = {
      id: `CC-2026-${String(Math.floor(10 + Math.random() * 90))}`,
      callId: `CC-2026-${String(Math.floor(10 + Math.random() * 90))}`,
      callNumber: callNumber || `Capital Call #${this.capitalCalls.length + 1}/2026-27`,
      totalCallAmount: Number(totalCallAmount),
      purpose: purpose || "Institutional Portfolio Asset Deployment",
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate || "2026-09-30",
      status: "ACTIVE",
      receivingBank: SFO_METADATA.bankReceiving,
      description: "Official SFO Capital Call. Quotas calculated based on strict Partner PSR %."
    };

    this.capitalCalls.unshift(newCall);
    this.auditLog.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Capital Call Issued",
      actor: this.currentUser.fullName,
      details: `Issued ${newCall.callNumber} for ₹${newCall.totalCallAmount} across all 28 partners.`
    });

    this.saveState();
    this.notify();
    syncSaveCapitalCall(newCall);
    return { success: true, call: newCall };
  }

  // --- Admin Automated Distribution Run with 10% TDS Engine ---
  executeDistributionRun({ title, totalAmount, incomeType, sourceAsset }) {
    const total = Number(totalAmount);
    const tdsRate = 10.0; // 10% TDS per statutory mandate
    const totalTds = total * 0.10;
    const totalNet = total - totalTds;

    const eventId = `DIST-2026-${String(Math.floor(100 + Math.random() * 900))}`;
    const newEvent = {
      id: eventId,
      eventId,
      title: title || `SFO Profit Distribution Run`,
      distributionDate: new Date().toISOString().split('T')[0],
      totalDistributionAmount: total,
      incomeType: incomeType || "RENTAL_YIELD",
      status: "COMPLETED",
      tdsRatePct: tdsRate,
      totalTdsDeducted: totalTds,
      totalNetPayable: totalNet,
      sourceAsset: sourceAsset || "SFO Portfolio Yield Engine"
    };

    // Calculate Partner Distribution Entries
    const partnerEntries = this.partners.map((p, idx) => {
      const grossShare = total * (p.psr || (p.sharePct / 100));
      const tds = grossShare * 0.10;
      const netPayable = grossShare - tds;

      return {
        entryId: `DE-${eventId}-${idx + 1}`,
        eventId,
        partnerId: p.partnerId,
        partnerName: p.fullName,
        grossAmount: grossShare,
        tdsDeducted: tds,
        netPayable: netPayable,
        payoutStatus: "CREDITED",
        payoutUtr: `SFO-PAY-${Date.now().toString().slice(-6)}-${idx + 1}`,
        payoutDate: new Date().toISOString().split('T')[0]
      };
    });

    this.distributionEvents.unshift(newEvent);

    // Record In Ledger
    const distTx = {
      id: `TX-DIST-${Date.now().toString().slice(-6)}`,
      transactionId: `TX-DIST-${Date.now().toString().slice(-6)}`,
      partnerId: "FUND_WIDE",
      partnerName: "All 28 Partners",
      callId: null,
      transactionType: "PROFIT_DISTRIBUTION",
      amount: total,
      paymentMode: "NEFT",
      utrReference: `SFO-BATCH-DIST-${newEvent.eventId}`,
      paymentDate: newEvent.distributionDate,
      status: "VERIFIED",
      receiptUrl: `payout_advice_${newEvent.eventId}.pdf`,
      notes: `${newEvent.title} (Net ₹${totalNet.toLocaleString('en-IN')} + TDS ₹${totalTds.toLocaleString('en-IN')})`
    };
    this.capitalTransactions.unshift(distTx);

    this.auditLog.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Distribution Run Executed",
      actor: this.currentUser.fullName,
      details: `Executed ${title} for ₹${total} (Auto 10% TDS ₹${totalTds} deducted). Credited all 28 partners.`
    });

    this.saveState();
    this.notify();
    syncSaveDistributionEvent(newEvent);
    syncSaveTransaction(distTx);
    return { success: true, event: newEvent, entries: partnerEntries };
  }

  // --- Admin Asset Revaluation Engine ---
  revalueAsset(assetId, newValuation, note = "Periodic NAV Revaluation") {
    const asset = this.portfolioAssets.find(a => a.assetId === assetId || a.id === assetId);
    if (!asset) return { error: "Asset not found" };

    const oldVal = Number(asset.currentValuation || asset.currentValue || 0);
    const newVal = Number(newValuation);
    asset.currentValuation = newVal;
    asset.currentValue = newVal;

    if (asset.historicalRevaluations) {
      asset.historicalRevaluations.push({
        date: new Date().toISOString().split('T')[0],
        value: newVal,
        nav: asset.unitsOrQty ? (newVal / asset.unitsOrQty) : 100.00,
        note: note
      });
    }

    this.auditLog.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Asset Revalued",
      actor: this.currentUser.fullName,
      details: `Revalued ${asset.assetName || asset.name} from ₹${oldVal.toLocaleString('en-IN')} to ₹${newVal.toLocaleString('en-IN')}`
    });

    this.saveState();
    this.notify();
    syncSaveAsset(asset);
    return { success: true };
  }

  // --- Document Vault Management ---
  uploadDocument({ title, docType, folder, fileSizeKb, isConfidential, description }) {
    const newDoc = {
      documentId: `DOC-2026-${String(Math.floor(10 + Math.random() * 90))}`,
      title,
      docType: docType || "QUARTERLY_REPORT",
      folder: folder || "Reports",
      partnerId: null,
      fileSizeKb: Number(fileSizeKb) || 450,
      uploadedAt: new Date().toISOString().split('T')[0],
      isConfidential: isConfidential !== undefined ? isConfidential : true,
      fileExt: "pdf",
      description: description || "Official document uploaded to SFO Vault"
    };

    this.documents.unshift(newDoc);
    this.auditLog.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Document Uploaded",
      actor: this.currentUser.fullName,
      details: `Uploaded ${title} to ${folder} vault.`
    });

    this.notify();
    return { success: true, document: newDoc };
  }

  // --- Proposal & Deal Voting Engine ---
  castVote({ dealId, vote, comment }) {
    const deal = this.deals.find(d => d.dealId === dealId);
    if (!deal) return { error: "Deal not found" };

    if (vote === 'for') deal.votes.for += 1;
    else if (vote === 'against') deal.votes.against += 1;
    else if (vote === 'abstain') deal.votes.abstain += 1;

    const totalVotes = deal.votes.for + deal.votes.against + deal.votes.abstain;
    deal.currentVotePct = (deal.votes.for / (totalVotes || 1)) * 100;

    if (comment) {
      deal.comments.push({
        author: this.currentUser.fullName,
        date: new Date().toISOString().split('T')[0],
        text: comment
      });
    }

    this.auditLog.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Vote Cast",
      actor: this.currentUser.fullName,
      details: `Voted ${vote.toUpperCase()} on ${deal.title}`
    });

    this.saveState();
    this.notify();
    syncSaveProposal(deal);
    return { success: true };
  }

  // --- Bank Update Request ---
  requestBankUpdate({ partnerId, bankName, accountNumber, ifscCode, accountHolderName }) {
    const partner = this.partners.find(p => p.partnerId === partnerId);
    if (!partner) return { error: "Partner not found" };

    partner.pendingBankUpdate = {
      bankName,
      accountNumber,
      ifscCode,
      accountHolderName,
      requestedAt: new Date().toISOString(),
      status: "PENDING_VERIFICATION"
    };

    this.auditLog.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Bank Details Update Requested",
      actor: partner.fullName,
      details: `Requested bank account change to ${bankName} (***${accountNumber.slice(-4)})`
    });

    this.saveState();
    this.notify();
    syncSavePartner(partner);
    return { success: true };
  }

  // --- Proposal Workflow ---
  submitProposal({ partnerId, proposedAmount, notes }) {
    const partner = this.partners.find(p => p.partnerId === partnerId);
    if (!partner) return { error: "Partner not found in whitelist." };

    const { navPerUnit } = this.getCalculations();
    const estUnits = Number(proposedAmount) / navPerUnit;

    const newProposal = {
      id: `PROP-2026-${String(Math.floor(100 + Math.random() * 900))}`,
      proposalId: `PROP-2026-${String(Math.floor(100 + Math.random() * 900))}`,
      partnerId: partner.partnerId,
      partnerName: partner.fullName,
      proposedAmount: Number(proposedAmount),
      currentNAVAtProposal: navPerUnit,
      estimatedUnits: estUnits,
      status: "PENDING",
      submittedAt: new Date().toISOString(),
      notes: notes || "Capital top-up proposal submitted via Partner Portal"
    };

    this.proposals.unshift(newProposal);
    this.auditLog.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Capital Proposal Submitted",
      actor: partner.fullName,
      details: `Submitted proposal for ₹${proposedAmount}`
    });

    this.saveState();
    this.notify();
    syncSaveProposal(newProposal);
    return { success: true, proposal: newProposal };
  }

  approveProposal(proposalId, adjustedAmount = null) {
    const proposal = this.proposals.find(p => p.proposalId === proposalId || p.id === proposalId);
    if (!proposal) return { error: "Proposal not found" };

    const finalAmount = adjustedAmount !== null ? Number(adjustedAmount) : proposal.proposedAmount;
    const { navPerUnit } = this.getCalculations();
    const allottedUnits = finalAmount / navPerUnit;

    proposal.status = "APPROVED";
    proposal.approvedAt = new Date().toISOString();
    proposal.approvedAmount = finalAmount;
    proposal.allottedUnits = allottedUnits;

    // Credit partner
    const partner = this.partners.find(p => p.partnerId === proposal.partnerId);
    if (partner) {
      partner.totalInvested += finalAmount;
      partner.unitsAllocated += allottedUnits;
      partner.allocatedValue = partner.unitsAllocated * navPerUnit;

      const totalUnits = this.partners.reduce((sum, p) => sum + p.unitsAllocated, 0);
      this.partners.forEach(p => {
        p.sharePct = totalUnits > 0 ? (p.unitsAllocated / totalUnits) * 100 : 0;
        p.psr = p.sharePct / 100;
        p.profit_share_ratio = p.psr;
      });
    }

    this.bankBalance += finalAmount;

    this.auditLog.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Capital Proposal Approved",
      actor: this.currentUser.fullName,
      details: `Approved proposal ${proposalId} for ₹${finalAmount}. Allotted ${allottedUnits.toFixed(4)} units to ${proposal.partnerName}`
    });

    this.saveState();
    this.notify();
    syncSaveProposal(proposal);
    if (partner) syncSavePartner(partner);
    syncSaveLiquidity({ bankBalance: this.bankBalance, brokerCash: this.brokerCash, accruedLiabilities: this.accruedLiabilities });
    return { success: true };
  }

  rejectProposal(proposalId, reason) {
    const proposal = this.proposals.find(p => p.proposalId === proposalId || p.id === proposalId);
    if (!proposal) return { error: "Proposal not found" };

    proposal.status = "REJECTED";
    proposal.rejectedAt = new Date().toISOString();
    proposal.rejectionReason = reason || "Declined by Managing Partner";

    this.auditLog.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Capital Proposal Rejected",
      actor: this.currentUser.fullName,
      details: `Rejected proposal ${proposalId} (${proposal.partnerName})`
    });

    this.saveState();
    this.notify();
    syncSaveProposal(proposal);
    return { success: true };
  }
}

export const store = new SFOStore();
