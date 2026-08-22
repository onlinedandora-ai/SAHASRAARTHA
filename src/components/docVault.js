/**
 * Screen 6: Document Vault & Secure Watermarked PDF Previewer
 * Conforms to Blueprint Screen 6:
 * - Categorized Folders: Tax (Form 16A, Form 64C), Legal (LLP Deed), Reports (Quarterly Reports, Pitch Decks)
 * - File Metadata (Size, Upload Date, Doc Type, Confidential badge)
 * - In-app Secure PDF Previewer with dynamic watermark
 * - Direct offline download
 */

import { store } from '../state/store.js';
import { formatDate } from '../utils/formatters.js';

let activeFolderFilter = 'ALL'; // 'ALL' | 'Tax' | 'Legal' | 'Reports'

export function renderDocVault() {
  const user = store.currentUser;
  let docs = store.documents;

  if (activeFolderFilter !== 'ALL') {
    docs = docs.filter(d => d.folder === activeFolderFilter);
  }

  const selectedDoc = store.selectedDocId ? store.documents.find(d => d.documentId === store.selectedDocId) : null;

  return `
    <div class="view-section" style="padding-bottom: 24px;">
      
      <!-- Section Header -->
      <div class="section-header" style="margin-bottom: 14px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 2px;">
            <span class="role-tag role-lp" style="font-size: 0.68rem;">Compliance & Legal</span>
            <span class="mono" style="font-size: 0.72rem; color: var(--accent-gold);">${store.documents.length} Files</span>
          </div>
          <h2 style="font-size: 1.3rem;">Document Vault</h2>
          <p style="font-size: 0.78rem;">Statutory Filings, Tax Certificates & LLP Deeds</p>
        </div>

        <button class="btn btn-secondary btn-sm" id="btn-upload-doc-modal" style="padding: 6px 12px; font-size: 0.78rem;">
          + Upload Document
        </button>
      </div>

      <!-- FOLDER CATEGORY TABS -->
      <div class="filter-pills" style="display: flex; gap: 6px; margin-bottom: 14px; overflow-x: auto; padding-bottom: 4px;">
        <button class="filter-pill ${activeFolderFilter === 'ALL' ? 'active' : ''}" data-doc-folder="ALL">All Documents</button>
        <button class="filter-pill ${activeFolderFilter === 'Tax' ? 'active' : ''}" data-doc-folder="Tax">Tax (Form 16A & 64C)</button>
        <button class="filter-pill ${activeFolderFilter === 'Legal' ? 'active' : ''}" data-doc-folder="Legal">Legal & LLP Deeds</button>
        <button class="filter-pill ${activeFolderFilter === 'Reports' ? 'active' : ''}" data-doc-folder="Reports">Quarterly Reports</button>
      </div>

      <!-- DOCUMENT LIST -->
      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${docs.map(doc => {
          return `
            <div class="card doc-item-card" data-doc-id="${doc.documentId}" style="cursor: pointer; padding: 14px; border-left: 3px solid ${getDocTypeColor(doc.docType)}; transition: transform 0.2s, border-color 0.2s; box-sizing: border-box; width: 100%;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; flex-wrap: wrap;">
                <div style="display: flex; align-items: flex-start; gap: 10px; flex: 1 1 180px; min-width: 0;">
                  <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(245, 158, 11, 0.12); display: flex; align-items: center; justify-content: center; color: var(--accent-gold); flex-shrink: 0;">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                  </div>
                  <div style="min-width: 0; flex: 1;">
                    <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                      <span class="badge" style="background: rgba(255,255,255,0.06); font-size: 0.62rem; color: var(--accent-gold);">${doc.folder}</span>
                      <span class="badge badge-verified" style="font-size: 0.6rem;">${doc.docType}</span>
                      ${doc.isConfidential ? `<span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #f87171; font-size: 0.6rem;">Confidential</span>` : ''}
                    </div>
                    <h3 style="font-size: 0.92rem; color: var(--text-primary); margin-top: 4px; font-weight: 700; word-break: break-word;">${doc.title}</h3>
                    <p style="font-size: 0.72rem; color: var(--text-secondary); margin-top: 2px; word-break: break-word;">${doc.description}</p>
                    <div style="font-size: 0.68rem; color: var(--text-muted); margin-top: 4px; word-break: break-word;">
                      Uploaded: ${formatDate(doc.uploadedAt)} &bull; ${doc.fileSizeKb} KB &bull; PDF
                    </div>
                  </div>
                </div>

                <div style="display: flex; flex-direction: row; gap: 6px; flex-shrink: 0; align-items: center;">
                  <button class="btn btn-primary btn-sm btn-preview-doc" data-doc-id="${doc.documentId}" style="padding: 4px 8px; font-size: 0.68rem;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Preview
                  </button>
                  <button class="btn btn-secondary btn-sm btn-download-doc" data-doc-title="${doc.title}" style="padding: 4px 8px; font-size: 0.68rem;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    PDF
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- IN-APP WATERMARKED PDF PREVIEWER MODAL -->
      ${selectedDoc ? renderDocPreviewModal(selectedDoc, user) : ''}

    </div>
  `;
}

function renderDocPreviewModal(doc, user) {
  const watermarkText = `CONFIDENTIAL • SAHASRAARTHA FAMILY OFFICE LLP • PARTNER ${user.partnerId} (${user.fullName})`;

  return `
    <div class="modal-backdrop active" id="doc-preview-modal-backdrop">
      <div class="modal-sheet" style="max-height: 92vh; overflow-y: auto;">
        
        <div class="modal-header">
          <div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="badge badge-verified" style="font-size: 0.65rem;">${doc.folder} Vault</span>
              <span class="mono" style="font-size: 0.7rem; color: var(--accent-gold);">${doc.documentId}</span>
            </div>
            <h3 style="font-size: 1.05rem; color: var(--text-primary); margin-top: 2px;">${doc.title}</h3>
          </div>
          <button class="modal-close" id="btn-close-doc-preview">&times;</button>
        </div>

        <!-- Simulated In-App Secure PDF Reader with Diagonal Watermark -->
        <div class="pdf-viewer-container" style="position: relative; background: #1e293b; border: 1px solid var(--border-color); border-radius: 8px; padding: 24px; min-height: 380px; overflow: hidden; margin-top: 10px;">
          
          <!-- Diagonal Security Watermark Overlay -->
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; transform: rotate(-30deg); pointer-events: none; opacity: 0.09; font-size: 1rem; font-weight: 900; color: #ffffff; text-align: center; line-height: 2.2; letter-spacing: 0.1em; user-select: none;">
            ${watermarkText}<br/>
            ${watermarkText}<br/>
            ${watermarkText}<br/>
            ${watermarkText}
          </div>

          <!-- Document Header -->
          <div style="border-bottom: 2px solid var(--accent-gold); padding-bottom: 12px; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-weight: 800; font-size: 0.95rem; color: #ffffff; letter-spacing: 0.05em;">SAHASRAARTHA FAMILY OFFICE LLP</div>
              <div style="font-size: 0.68rem; color: var(--text-muted);">Ministry of Corporate Affairs (MCA) Registration &bull; Murahari & Associates</div>
            </div>
            <div style="text-align: right; font-size: 0.68rem; color: var(--accent-gold);">
              <div>Issued to: ${user.fullName}</div>
              <div class="mono">${user.dpin ? 'DPIN: ' + user.dpin : user.partnerId}</div>
            </div>
          </div>

          <!-- Document Body Simulation -->
          <div style="font-size: 0.78rem; color: var(--text-secondary); line-height: 1.6; display: flex; flex-direction: column; gap: 10px;">
            <p><strong>SUBJECT:</strong> ${doc.title}</p>
            <p>This statutory electronic record is certified by Sahasraartha Family Office LLP for partner compliance under Indian LLP Act, 2008 and Income Tax Act, 1961.</p>
            
            <div style="background: rgba(0,0,0,0.25); border: 1px solid var(--border-subtle); border-radius: 6px; padding: 10px;">
              <div style="font-weight: 700; color: var(--text-primary); margin-bottom: 6px;">Certificate Metadata & Verification Hash:</div>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 0.72rem;">
                <div>Document Type: <strong>${doc.docType}</strong></div>
                <div>Upload Date: <strong>${formatDate(doc.uploadedAt)}</strong></div>
                <div>Authorized Auditor: <strong>Murahari & Associates</strong></div>
                <div>SHA-256 Checksum: <strong class="mono" style="color: var(--accent-gold);">8f9a2b...c419</strong></div>
              </div>
            </div>

            <p style="font-size: 0.72rem; color: var(--text-muted);">
              Notice: This document contains proprietary family office information and is watermarked with your individual partner identifier. Unauthorized redistribution is prohibited.
            </p>
          </div>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 14px;">
          <button class="btn btn-primary" id="btn-download-watermarked-pdf" style="flex: 1;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Watermarked PDF
          </button>
          <button class="btn btn-secondary" id="btn-close-preview-bottom" style="flex: 1;">
            Close Preview
          </button>
        </div>

      </div>
    </div>
  `;
}

function getDocTypeColor(type) {
  switch (type) {
    case 'FORM_16A': return '#f59e0b';
    case 'LLP_AGREEMENT': return '#3b82f6';
    case 'QUARTERLY_REPORT': return '#10b981';
    case 'TITLE_DEED': return '#ec4899';
    case 'PITCH_DECK': return '#8b5cf6';
    default: return '#f59e0b';
  }
}

export function attachDocVaultEvents() {
  // Folder filters
  document.querySelectorAll('[data-doc-folder]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFolderFilter = btn.getAttribute('data-doc-folder');
      store.notify();
    });
  });

  // Open preview
  document.querySelectorAll('.btn-preview-doc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const docId = btn.getAttribute('data-doc-id');
      store.openModal('DOC_PREVIEW', { docId });
    });
  });

  document.querySelectorAll('.doc-item-card').forEach(card => {
    card.addEventListener('click', () => {
      const docId = card.getAttribute('data-doc-id');
      store.openModal('DOC_PREVIEW', { docId });
    });
  });

  // Close preview
  document.getElementById('btn-close-doc-preview')?.addEventListener('click', () => {
    store.closeModal();
  });

  document.getElementById('btn-close-preview-bottom')?.addEventListener('click', () => {
    store.closeModal();
  });

  // Download actions
  document.querySelectorAll('.btn-download-doc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = btn.getAttribute('data-doc-title');
      alert(`[SFO Secure Downloader]: Exporting "${title}" with official LLP digital seal and Partner ${store.currentUser.partnerId} watermark...`);
    });
  });

  document.getElementById('btn-download-watermarked-pdf')?.addEventListener('click', () => {
    alert(`[SFO PDF Engine]: Download started for watermarked certificate. Saved to mobile device storage.`);
  });

  // Upload modal trigger
  document.getElementById('btn-upload-doc-modal')?.addEventListener('click', () => {
    const title = prompt("Enter Document Title (e.g. Form 16A Q1, MCA Certificate, Deed):");
    if (title) {
      store.uploadDocument({
        title,
        docType: "QUARTERLY_REPORT",
        folder: "Reports",
        fileSizeKb: 680,
        isConfidential: true,
        description: `Uploaded by ${store.currentUser.fullName}`
      });
      alert(`Document "${title}" uploaded to SFO Document Vault!`);
    }
  });
}
