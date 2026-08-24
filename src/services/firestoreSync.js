/**
 * Sahasraartha Family Office - Cloud Firestore Real-Time Sync Engine
 * 
 * Provides:
 * 1. Automatic Firestore initial database seeding from base SFO dataset
 * 2. Real-time live onSnapshot subscriptions across all collections
 * 3. Bidirectional mutations (writes persist to Cloud Firestore & stream to all connected devices)
 * 4. Real-time update feed broadcasting for instant notifications
 */

import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { getDb } from './firebaseAuth.js';
import {
  PORTFOLIO_ASSETS,
  INITIAL_CAPITAL_CALLS,
  INITIAL_CAPITAL_TRANSACTIONS,
  INITIAL_DISTRIBUTION_EVENTS,
  INITIAL_DOCUMENTS,
  INITIAL_DEALS,
  LIQUIDITY_BREAKDOWN
} from '../data/sfo_data.js';
import { PARTNERS_DATA, INITIAL_CAPITAL_PROPOSALS } from '../data/partners_data.js';
import { triggerInAppNotification } from './notificationService.js';

let isInitialized = false;
let storeRef = null;
let unsubscribers = [];

// Collection Names
export const COLLECTIONS = {
  PORTFOLIO: 'sfo_portfolio',
  PARTNERS: 'sfo_partners',
  CAPITAL_CALLS: 'sfo_capital_calls',
  TRANSACTIONS: 'sfo_capital_transactions',
  DISTRIBUTIONS: 'sfo_distribution_events',
  DEALS: 'sfo_deals',
  PROPOSALS: 'sfo_proposals',
  DOCUMENTS: 'sfo_documents',
  LIQUIDITY: 'sfo_liquidity',
  AUDIT_LOG: 'sfo_audit_log',
  UPDATES_FEED: 'sfo_updates_feed'
};

/**
 * Initialize Firestore real-time synchronization
 * @param {object} store - SFOStore singleton instance
 */
export async function initFirestoreSync(store) {
  if (isInitialized) return;
  storeRef = store;

  try {
    const db = getDb();
    if (!db) {
      console.warn('[FirestoreSync] Database not available yet, waiting for auth initialization.');
      return;
    }

    console.log('[FirestoreSync] Initializing real-time Firestore sync...');
    
    // 1. Seed initial data if empty in cloud
    await seedFirestoreIfEmpty(db);

    // 2. Setup Real-time Listeners
    setupRealtimeListeners(db, store);

    isInitialized = true;
    console.log('[FirestoreSync] Real-time Firestore sync active.');
  } catch (err) {
    console.error('[FirestoreSync] Init error:', err);
  }
}

/**
 * Seed collections if they have no records in Firestore
 */
async function seedFirestoreIfEmpty(db) {
  try {
    const portfolioSnap = await getDocs(collection(db, COLLECTIONS.PORTFOLIO));
    if (portfolioSnap.empty) {
      console.log('[FirestoreSync] Seeding initial SFO data to Cloud Firestore...');

      // Seed Portfolio
      for (const asset of PORTFOLIO_ASSETS) {
        await setDoc(doc(db, COLLECTIONS.PORTFOLIO, asset.id), asset);
      }

      // Seed Partners
      for (const p of PARTNERS_DATA) {
        await setDoc(doc(db, COLLECTIONS.PARTNERS, p.partnerId), p);
      }

      // Seed Capital Calls
      for (const cc of INITIAL_CAPITAL_CALLS) {
        await setDoc(doc(db, COLLECTIONS.CAPITAL_CALLS, cc.id), cc);
      }

      // Seed Transactions
      for (const tx of INITIAL_CAPITAL_TRANSACTIONS) {
        await setDoc(doc(db, COLLECTIONS.TRANSACTIONS, tx.id), tx);
      }

      // Seed Distributions
      for (const dist of INITIAL_DISTRIBUTION_EVENTS) {
        await setDoc(doc(db, COLLECTIONS.DISTRIBUTIONS, dist.id), dist);
      }

      // Seed Deals
      for (const deal of INITIAL_DEALS) {
        await setDoc(doc(db, COLLECTIONS.DEALS, deal.id), deal);
      }

      // Seed Proposals
      for (const prop of INITIAL_CAPITAL_PROPOSALS) {
        await setDoc(doc(db, COLLECTIONS.PROPOSALS, prop.id), prop);
      }

      // Seed Documents
      for (const d of INITIAL_DOCUMENTS) {
        await setDoc(doc(db, COLLECTIONS.DOCUMENTS, d.id), d);
      }

      // Seed Liquidity
      await setDoc(doc(db, COLLECTIONS.LIQUIDITY, 'main'), {
        brokerCash: LIQUIDITY_BREAKDOWN.brokerCashNuvama,
        bankBalance: LIQUIDITY_BREAKDOWN.bankBalanceICICI,
        accruedLiabilities: 0.00,
        updatedAt: new Date().toISOString()
      });

      // Seed initial update entry
      await setDoc(doc(db, COLLECTIONS.UPDATES_FEED, 'welcome-init'), {
        id: 'welcome-init',
        title: 'Sahasraartha System Online',
        message: 'Live database and real-time synchronization successfully established.',
        category: 'SYSTEM',
        actor: 'System Administrator',
        timestamp: new Date().toISOString()
      });

      console.log('[FirestoreSync] Cloud database seeded successfully.');
    }
  } catch (err) {
    console.warn('[FirestoreSync] Seeding check error (might be offline or rule restricted):', err.message);
  }
}

/**
 * Setup Realtime onSnapshot Listeners
 */
function setupRealtimeListeners(db, store) {
  // Clear any existing subscriptions
  unsubscribers.forEach(unsub => unsub && unsub());
  unsubscribers = [];

  // 1. Portfolio Assets Stream
  const unsubPortfolio = onSnapshot(collection(db, COLLECTIONS.PORTFOLIO), (snapshot) => {
    if (!snapshot.empty) {
      const assets = [];
      snapshot.forEach(docSnap => assets.push({ ...docSnap.data(), id: docSnap.id }));
      store.portfolioAssets = assets;
      store.saveState();
      store.notify();
    }
  }, (err) => console.error('[FirestoreSync] Portfolio listener error:', err));
  unsubscribers.push(unsubPortfolio);

  // 2. Partners Stream
  const unsubPartners = onSnapshot(collection(db, COLLECTIONS.PARTNERS), (snapshot) => {
    if (!snapshot.empty) {
      const partners = [];
      snapshot.forEach(docSnap => partners.push({ ...docSnap.data(), partnerId: docSnap.id }));
      store.partners = partners;
      store.saveState();
      store.notify();
    }
  }, (err) => console.error('[FirestoreSync] Partners listener error:', err));
  unsubscribers.push(unsubPartners);

  // 3. Capital Calls Stream
  const unsubCalls = onSnapshot(collection(db, COLLECTIONS.CAPITAL_CALLS), (snapshot) => {
    if (!snapshot.empty) {
      const calls = [];
      snapshot.forEach(docSnap => calls.push({ ...docSnap.data(), id: docSnap.id }));
      store.capitalCalls = calls;
      store.saveState();
      store.notify();
    }
  }, (err) => console.error('[FirestoreSync] Capital Calls listener error:', err));
  unsubscribers.push(unsubCalls);

  // 4. Transactions Stream
  const unsubTx = onSnapshot(collection(db, COLLECTIONS.TRANSACTIONS), (snapshot) => {
    if (!snapshot.empty) {
      const txs = [];
      snapshot.forEach(docSnap => txs.push({ ...docSnap.data(), id: docSnap.id }));
      store.capitalTransactions = txs;
      store.saveState();
      store.notify();
    }
  }, (err) => console.error('[FirestoreSync] Transactions listener error:', err));
  unsubscribers.push(unsubTx);

  // 5. Distribution Events Stream
  const unsubDist = onSnapshot(collection(db, COLLECTIONS.DISTRIBUTIONS), (snapshot) => {
    if (!snapshot.empty) {
      const dists = [];
      snapshot.forEach(docSnap => dists.push({ ...docSnap.data(), id: docSnap.id }));
      store.distributionEvents = dists;
      store.saveState();
      store.notify();
    }
  }, (err) => console.error('[FirestoreSync] Distributions listener error:', err));
  unsubscribers.push(unsubDist);

  // 6. Deals Stream
  const unsubDeals = onSnapshot(collection(db, COLLECTIONS.DEALS), (snapshot) => {
    if (!snapshot.empty) {
      const deals = [];
      snapshot.forEach(docSnap => deals.push({ ...docSnap.data(), id: docSnap.id }));
      store.deals = deals;
      store.saveState();
      store.notify();
    }
  }, (err) => console.error('[FirestoreSync] Deals listener error:', err));
  unsubscribers.push(unsubDeals);

  // 7. Proposals Stream
  const unsubProposals = onSnapshot(collection(db, COLLECTIONS.PROPOSALS), (snapshot) => {
    if (!snapshot.empty) {
      const proposals = [];
      snapshot.forEach(docSnap => proposals.push({ ...docSnap.data(), id: docSnap.id }));
      store.proposals = proposals;
      store.saveState();
      store.notify();
    }
  }, (err) => console.error('[FirestoreSync] Proposals listener error:', err));
  unsubscribers.push(unsubProposals);

  // 8. Documents Stream
  const unsubDocs = onSnapshot(collection(db, COLLECTIONS.DOCUMENTS), (snapshot) => {
    if (!snapshot.empty) {
      const docs = [];
      snapshot.forEach(docSnap => docs.push({ ...docSnap.data(), id: docSnap.id }));
      store.documents = docs;
      store.saveState();
      store.notify();
    }
  }, (err) => console.error('[FirestoreSync] Documents listener error:', err));
  unsubscribers.push(unsubDocs);

  // 9. Liquidity Stream
  const unsubLiq = onSnapshot(doc(db, COLLECTIONS.LIQUIDITY, 'main'), (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.brokerCash !== undefined) store.brokerCash = data.brokerCash;
      if (data.bankBalance !== undefined) store.bankBalance = data.bankBalance;
      if (data.accruedLiabilities !== undefined) store.accruedLiabilities = data.accruedLiabilities;
      store.saveState();
      store.notify();
    }
  }, (err) => console.error('[FirestoreSync] Liquidity listener error:', err));
  unsubscribers.push(unsubLiq);

  // 10. Real-time Live Update Feed & Notification Trigger
  let initialFeedLoad = true;
  const feedQuery = query(collection(db, COLLECTIONS.UPDATES_FEED), orderBy('timestamp', 'desc'), limit(15));
  const unsubFeed = onSnapshot(feedQuery, (snapshot) => {
    if (initialFeedLoad) {
      initialFeedLoad = false;
      return; // Skip alerts on initial snapshot load
    }
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const updateData = change.doc.data();
        console.log('[FirestoreSync] New live update received:', updateData);
        triggerInAppNotification({
          title: updateData.title || 'Sahasraartha Update',
          message: updateData.message || 'New portfolio/ledger change recorded.',
          category: updateData.category || 'INFO',
          actor: updateData.actor || 'System'
        });
      }
    });
  }, (err) => console.error('[FirestoreSync] Updates feed listener error:', err));
  unsubscribers.push(unsubFeed);
}

// ─── Mutation Writers ────────────────────────────────────────────────────────

export async function syncSaveAsset(asset) {
  try {
    const db = getDb();
    if (!db) return;
    await setDoc(doc(db, COLLECTIONS.PORTFOLIO, asset.id), asset, { merge: true });
    await broadcastUpdateEvent({
      title: 'Portfolio Valuation Updated',
      message: `${asset.name} (${asset.symbol || asset.code || ''}) valuation updated to ₹${(asset.currentValue || asset.nav || 0).toLocaleString('en-IN')}`,
      category: 'PORTFOLIO',
      actor: storeRef?.currentUser?.fullName || 'Admin'
    });
  } catch (err) {
    console.error('[FirestoreSync] syncSaveAsset error:', err);
  }
}

export async function syncSaveTransaction(tx) {
  try {
    const db = getDb();
    if (!db) return;
    await setDoc(doc(db, COLLECTIONS.TRANSACTIONS, tx.id), tx, { merge: true });
    await broadcastUpdateEvent({
      title: 'New Capital Transaction Logged',
      message: `Transaction ${tx.id} of ₹${(tx.amount || 0).toLocaleString('en-IN')} recorded for ${tx.partnerName || 'Partner'}.`,
      category: 'LEDGER',
      actor: storeRef?.currentUser?.fullName || 'Admin'
    });
  } catch (err) {
    console.error('[FirestoreSync] syncSaveTransaction error:', err);
  }
}

export async function syncSaveCapitalCall(call) {
  try {
    const db = getDb();
    if (!db) return;
    await setDoc(doc(db, COLLECTIONS.CAPITAL_CALLS, call.id), call, { merge: true });
    await broadcastUpdateEvent({
      title: 'Capital Call Notice Issued',
      message: `Notice ${call.callNumber || call.id}: ₹${(call.totalAmount || 0).toLocaleString('en-IN')} for ${call.purpose || 'Deployment'}.`,
      category: 'CAPITAL_CALL',
      actor: storeRef?.currentUser?.fullName || 'Admin'
    });
  } catch (err) {
    console.error('[FirestoreSync] syncSaveCapitalCall error:', err);
  }
}

export async function syncSaveDistributionEvent(dist) {
  try {
    const db = getDb();
    if (!db) return;
    await setDoc(doc(db, COLLECTIONS.DISTRIBUTIONS, dist.id), dist, { merge: true });
    await broadcastUpdateEvent({
      title: 'Capital Distribution Executed',
      message: `Distribution of ₹${(dist.totalGrossAmount || 0).toLocaleString('en-IN')} processed with Auto-TDS split.`,
      category: 'DISTRIBUTION',
      actor: storeRef?.currentUser?.fullName || 'Admin'
    });
  } catch (err) {
    console.error('[FirestoreSync] syncSaveDistributionEvent error:', err);
  }
}

export async function syncSaveProposal(prop) {
  try {
    const db = getDb();
    if (!db) return;
    await setDoc(doc(db, COLLECTIONS.PROPOSALS, prop.id), prop, { merge: true });
    await broadcastUpdateEvent({
      title: 'New Investment Proposal',
      message: `Proposal "${prop.title}" open for committee voting.`,
      category: 'PROPOSAL',
      actor: storeRef?.currentUser?.fullName || 'Partner'
    });
  } catch (err) {
    console.error('[FirestoreSync] syncSaveProposal error:', err);
  }
}

export async function syncSaveLiquidity(liquidityObj) {
  try {
    const db = getDb();
    if (!db) return;
    await setDoc(doc(db, COLLECTIONS.LIQUIDITY, 'main'), {
      ...liquidityObj,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.error('[FirestoreSync] syncSaveLiquidity error:', err);
  }
}

export async function syncSavePartner(partner) {
  try {
    const db = getDb();
    if (!db) return;
    await setDoc(doc(db, COLLECTIONS.PARTNERS, partner.partnerId), partner, { merge: true });
  } catch (err) {
    console.error('[FirestoreSync] syncSavePartner error:', err);
  }
}

/**
 * Broadcast an update event across the cloud for all mobile/web users
 */
export async function broadcastUpdateEvent({ title, message, category = 'GENERAL', actor = 'System' }) {
  try {
    const db = getDb();
    if (!db) return;
    const eventId = 'upd-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    await setDoc(doc(db, COLLECTIONS.UPDATES_FEED, eventId), {
      id: eventId,
      title,
      message,
      category,
      actor,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('[FirestoreSync] Broadcast error:', err);
  }
}
