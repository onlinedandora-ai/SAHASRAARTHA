/**
 * Master Ledger Explorer & 5-Way Reconciliation Proofs
 * 366 transactions, full audit trail, search & category filtering
 */

import { MASTER_ACCOUNTS_RECONCILIATION } from '../data/sfo_data.js';
import { MASTER_TRANSACTIONS } from '../data/ledger_data.js';
import { formatINR, formatDate } from '../utils/formatters.js';

let currentFilter = 'ALL';
let currentSearch = '';

export function renderMasterLedger() {
  const filtered = MASTER_TRANSACTIONS.filter(tx => {
    const matchesFilter = currentFilter === 'ALL' || 
      (currentFilter === 'BANK' && tx.account.includes('ICICI')) ||
      (currentFilter === 'BROKER' && tx.account.includes('Nuvama')) ||
      (currentFilter === 'AIF' && (tx.category === 'AIF' || tx.category === 'RevX Distribution')) ||
      (currentFilter === 'CAPITAL' && tx.category === 'Capital');

    const matchesSearch = !currentSearch || 
      tx.counterparty.toLowerCase().includes(currentSearch.toLowerCase()) ||
      tx.type.toLowerCase().includes(currentSearch.toLowerCase()) ||
      tx.notes.toLowerCase().includes(currentSearch.toLowerCase()) ||
      tx.id.toLowerCase().includes(currentSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return `
    <div class="view-section">
      <div class="section-header">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <span class="role-tag role-committee">Master Ledger Proof</span>
            <span class="mono" style="font-size: 0.8rem; color: var(--accent-emerald);">Sum of Closings = ₹1,64,27,861.17</span>
          </div>
          <h2>Master Transaction Ledger & Reconciliation</h2>
          <p>Every rupee traced across ICICI Bank, Nuvama Broker, Artha Fund IV, and RevX Fund II</p>
        </div>

        <div style="display: flex; gap: 10px;">
          <button class="btn btn-secondary btn-sm" id="btn-export-ledger-csv">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Export Ledger CSV
          </button>
        </div>
      </div>

      <!-- 5 Reconciliation Accounts Proof Cards -->
      <div class="grid-3">
        ${MASTER_ACCOUNTS_RECONCILIATION.map(acc => `
          <div class="card" style="padding: 18px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div>
                <span class="badge badge-category" style="font-size: 0.7rem;">${acc.category}</span>
                <h4 style="font-size: 0.95rem; margin-top: 6px; color: var(--text-primary);">${acc.name}</h4>
              </div>
              <span class="badge badge-verified">${acc.status}</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.82rem; margin-top: 8px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary);">Computed Closing:</span>
                <strong class="mono">${formatINR(acc.computedClosing)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: var(--text-secondary);">Confirmed Closing:</span>
                <strong class="mono" style="color: var(--accent-emerald);">${formatINR(acc.confirmedClosing)}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; padding-top: 4px; border-top: 1px dashed var(--border-subtle);">
                <span style="color: var(--text-muted);">Variance:</span>
                <span class="mono" style="color: ${acc.variance === 0 ? 'var(--accent-emerald)' : 'var(--accent-gold)'};">₹${acc.variance.toFixed(2)}</span>
              </div>
            </div>

            <div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 8px; font-style: italic;">
              ${acc.sourceDoc}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="card" style="padding: 16px 20px;">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="ledger-filter-buttons">
            <button class="btn btn-sm ${currentFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'} btn-filter-ledger" data-filter="ALL">All Entries</button>
            <button class="btn btn-sm ${currentFilter === 'BANK' ? 'btn-primary' : 'btn-secondary'} btn-filter-ledger" data-filter="BANK">ICICI Bank</button>
            <button class="btn btn-sm ${currentFilter === 'BROKER' ? 'btn-primary' : 'btn-secondary'} btn-filter-ledger" data-filter="BROKER">Nuvama Broker</button>
            <button class="btn btn-sm ${currentFilter === 'AIF' ? 'btn-primary' : 'btn-secondary'} btn-filter-ledger" data-filter="AIF">AIFs & Yield</button>
            <button class="btn btn-sm ${currentFilter === 'CAPITAL' ? 'btn-primary' : 'btn-secondary'} btn-filter-ledger" data-filter="CAPITAL">Partner Capital</button>
          </div>

          <div style="display: flex; align-items: center; gap: 10px; min-width: 260px;">
            <input type="text" id="input-search-ledger" class="form-input" placeholder="Search party, scrip, narration..." value="${currentSearch}" style="padding: 6px 12px; font-size: 0.84rem; width: 100%;">
          </div>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="card">
        <div class="card-header">
          <div>
            <h3 class="card-title">Chronological Transaction Log</h3>
            <p class="card-subtitle">Showing ${filtered.length} audited ledger entries</p>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Tx ID</th>
                <th>Date</th>
                <th>Account / Source</th>
                <th>Counterparty / Instrument</th>
                <th>Category</th>
                <th class="text-right">Debit (Out)</th>
                <th class="text-right">Credit (In)</th>
                <th class="text-right">Running Balance</th>
                <th>Narration / Audit Note</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(tx => `
                <tr>
                  <td class="mono font-weight-bold" style="color: var(--accent-gold); font-size: 0.78rem;">${tx.id}</td>
                  <td style="white-space: nowrap;">${formatDate(tx.date)}</td>
                  <td style="font-size: 0.8rem; color: var(--text-secondary);">${tx.account}</td>
                  <td><strong>${tx.counterparty}</strong></td>
                  <td><span class="badge badge-category" style="font-size: 0.68rem;">${tx.category}</span></td>
                  <td class="text-right mono" style="color: ${tx.debit > 0 ? 'var(--accent-rose)' : 'var(--text-muted)'};">
                    ${tx.debit > 0 ? formatINR(tx.debit) : '-'}
                  </td>
                  <td class="text-right mono" style="color: ${tx.credit > 0 ? 'var(--accent-emerald)' : 'var(--text-muted)'}; font-weight: ${tx.credit > 0 ? '700' : '400'};">
                    ${tx.credit > 0 ? formatINR(tx.credit) : '-'}
                  </td>
                  <td class="text-right mono" style="font-weight: 600;">${formatINR(tx.balance)}</td>
                  <td style="font-size: 0.78rem; color: var(--text-muted);">${tx.notes}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

export function attachLedgerEvents(reRenderCallback) {
  document.querySelectorAll('.btn-filter-ledger').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.getAttribute('data-filter');
      reRenderCallback();
    });
  });

  const searchInput = document.getElementById('input-search-ledger');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      reRenderCallback();
    });
  }

  const exportBtn = document.getElementById('btn-export-ledger-csv');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const headers = ["id", "date", "account", "type", "counterparty", "debit", "credit", "balance", "category", "notes"];
      const rows = MASTER_TRANSACTIONS.map(t => [
        t.id, t.date, `"${t.account}"`, `"${t.type}"`, `"${t.counterparty}"`, t.debit, t.credit, t.balance, `"${t.category}"`, `"${t.notes}"`
      ]);
      const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SFO_Master_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    });
  }
}
