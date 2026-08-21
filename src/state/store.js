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

class SFOStore {
  constructor() {
    this.subscribers = [];
    this.loadState();
  }

  loadState() {
    const saved = localStorage.getItem('sfo_state_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.currentUser = parsed.currentUser || PARTNERS_DATA[0];
        this.partners = parsed.partners || [...PARTNERS_DATA];
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
        this.theme = 'light';
        this.activeTab = parsed.activeTab || 'overview';
        this.selectedFiscalYear = parsed.selectedFiscalYear || 'FY2026-27';
        this.biometricsEnabled = parsed.biometricsEnabled !== undefined ? parsed.biometricsEnabled : true;
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
      localStorage.setItem('sfo_state_v2', JSON.stringify({
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
  setCurrentUser(partnerId) {
    const partner = this.partners.find(p => p.partnerId === partnerId);
    if (partner) {
      this.currentUser = partner;
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

    this.notify();
    return newPartner;
  }

  setTheme(theme) {
    this.theme = theme;
    this.notify();
  }

  setActiveTab(tab) {
    this.activeTab = tab;
    this.notify();
  }

  setFiscalYear(fy) {
    this.selectedFiscalYear = fy;
    this.notify();
  }

  toggleBiometrics() {
    this.biometricsEnabled = !this.biometricsEnabled;
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
    this.notify();
  }

  // --- Partner Capital Call Payment / UTR Submission ---
  submitCapitalPayment({ partnerId, callId, amount, paymentMode, utrReference, notes }) {
    const partner = this.partners.find(p => p.partnerId === partnerId);
    if (!partner) return { error: "Partner not found" };

    const newTx = {
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

    this.notify();
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

    this.notify();
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

    this.notify();
    return { success: true };
  }

  // --- Admin Capital Call Generator ---
  issueCapitalCall({ callNumber, totalCallAmount, purpose, dueDate }) {
    const newCall = {
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

    this.notify();
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
    this.capitalTransactions.unshift({
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
    });

    this.auditLog.unshift({
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action: "Distribution Run Executed",
      actor: this.currentUser.fullName,
      details: `Executed ${title} for ₹${total} (Auto 10% TDS ₹${totalTds} deducted). Credited all 28 partners.`
    });

    this.notify();
    return { success: true, event: newEvent, entries: partnerEntries };
  }

  // --- Admin Asset Revaluation Engine ---
  revalueAsset(assetId, newValuation, note = "Periodic NAV Revaluation") {
    const asset = this.portfolioAssets.find(a => a.assetId === assetId);
    if (!asset) return { error: "Asset not found" };

    const oldVal = Number(asset.currentValuation);
    const newVal = Number(newValuation);
    asset.currentValuation = newVal;

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
      details: `Revalued ${asset.assetName} from ₹${oldVal.toLocaleString('en-IN')} to ₹${newVal.toLocaleString('en-IN')}`
    });

    this.notify();
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

    this.notify();
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

    this.notify();
    return { success: true };
  }

  // --- Proposal Workflow ---
  submitProposal({ partnerId, proposedAmount, notes }) {
    const partner = this.partners.find(p => p.partnerId === partnerId);
    if (!partner) return { error: "Partner not found in whitelist." };

    const { navPerUnit } = this.getCalculations();
    const estUnits = Number(proposedAmount) / navPerUnit;

    const newProposal = {
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

    this.notify();
    return { success: true, proposal: newProposal };
  }

  approveProposal(proposalId, adjustedAmount = null) {
    const proposal = this.proposals.find(p => p.proposalId === proposalId);
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

    this.notify();
    return { success: true };
  }

  rejectProposal(proposalId, reason) {
    const proposal = this.proposals.find(p => p.proposalId === proposalId);
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

    this.notify();
    return { success: true };
  }
}

export const store = new SFOStore();
