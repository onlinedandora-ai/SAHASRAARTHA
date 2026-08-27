/**
 * Screen 6: Document Vault & Secure Watermarked PDF Previewer
 * Conforms to Blueprint Screen 6:
 * - Categorized Folders: Tax (Form 16A, Form 64C), Legal (LLP Deed), Reports (Quarterly Reports, Pitch Decks)
 * - File Metadata (Size, Upload Date, Doc Type, Confidential badge)
 * - In-app Secure PDF Previewer with dynamic watermark
 * - Direct offline PDF download and immediate Back navigation
 */

import { store } from '../state/store.js';
import { formatDate } from '../utils/formatters.js';
import { downloadDocumentVaultPDF } from '../utils/pdfGenerator.js';

let activeFolderFilter = 'ALL'; // 'ALL' | 'Tax' | 'Legal' | 'Reports'

// Global fail-safe close handler attached to window
window.__closeDocPreview = function(e) {
  if (e && e.stopPropagation) {
    e.stopPropagation();
    e.preventDefault();
  }
  store.selectedDocId = null;
  store.closeModal();
  const el = document.getElementById('doc-preview-modal-backdrop');
  if (el) el.remove();
};

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
                  <button class="btn btn-primary btn-sm btn-preview-doc" data-doc-id="${doc.documentId}" style="padding: 5px 10px; font-size: 0.72rem; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Preview
                  </button>
                  <button class="btn btn-secondary btn-sm btn-download-doc" data-doc-id="${doc.documentId}" style="padding: 5px 10px; font-size: 0.72rem; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
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
    <div class="modal-backdrop active" id="doc-preview-modal-backdrop" style="position: fixed; inset: 0; background: rgba(5, 8, 16, 0.85); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 14px;">
      <div class="modal-sheet" style="max-height: 92vh; width: 100%; max-width: 680px; background: var(--bg-card); border: 1.5px solid var(--border-color); border-radius: 16px; overflow-y: auto; display: flex; flex-direction: column; box-shadow: 0 20px 50px rgba(0,0,0,0.7);">
        
        <!-- Header with Back Button -->
        <div class="modal-header" style="padding: 14px 18px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.15);">
          <div style="display: flex; align-items: center; gap: 10px;">
            <button class="btn btn-secondary btn-sm" id="btn-back-doc-preview" onclick="window.__closeDocPreview(event)" style="padding: 6px 12px; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; gap: 5px; border-radius: 8px; cursor: pointer;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
              <span>Back</span>
            </button>
            <div>
              <div style="display: flex; align-items: center; gap: 6px;">
                <span class="badge badge-verified" style="font-size: 0.65rem;">${doc.folder} Vault</span>
                <span class="mono" style="font-size: 0.7rem; color: var(--accent-gold);">${doc.documentId}</span>
              </div>
              <h3 style="font-size: 1rem; color: var(--text-primary); margin: 2px 0 0 0; font-weight: 800;">${doc.title}</h3>
            </div>
          </div>
          
          <button class="modal-close" id="btn-close-doc-preview" onclick="window.__closeDocPreview(event)" style="background: rgba(255,255,255,0.08); border: none; color: var(--text-secondary); width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center; justify-content: center;">&times;</button>
        </div>

        <!-- Simulated In-App Secure PDF Reader with Diagonal Watermark -->
        <div style="padding: 18px; flex: 1;">
          <div class="pdf-viewer-container" style="position: relative; background: #0f172a; border: 1.5px solid rgba(212, 175, 55, 0.3); border-radius: 12px; padding: 22px; min-height: 360px; overflow: hidden;">
            
            <!-- Diagonal Security Watermark Overlay -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; align-items: center; justify-content: center; transform: rotate(-30deg); pointer-events: none; opacity: 0.12; font-size: 0.95rem; font-weight: 900; color: #d4af37; text-align: center; line-height: 2.2; letter-spacing: 0.1em; user-select: none;">
              ${watermarkText}<br/>
              ${watermarkText}<br/>
              ${watermarkText}<br/>
              ${watermarkText}
            </div>

            <!-- Document Header -->
            <div style="border-bottom: 2px solid var(--accent-gold); padding-bottom: 12px; margin-bottom: 14px; display: flex; justify-content: space-between; align-items: center;">
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
              <p style="margin: 0;"><strong>SUBJECT:</strong> ${doc.title}</p>
              <p style="margin: 0;">This statutory electronic record is certified by Sahasraartha Family Office LLP for partner compliance under Indian LLP Act, 2008 and Income Tax Act, 1961.</p>
              
              <div style="background: rgba(0,0,0,0.3); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 12px; margin: 4px 0;">
                <div style="font-weight: 700; color: var(--accent-gold); margin-bottom: 6px; font-size: 0.75rem;">Certificate Metadata & Verification Hash:</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 0.72rem;">
                  <div>Document Type: <strong style="color: #ffffff;">${doc.docType}</strong></div>
                  <div>Upload Date: <strong style="color: #ffffff;">${formatDate(doc.uploadedAt)}</strong></div>
                  <div>Authorized Auditor: <strong style="color: #ffffff;">Murahari & Associates</strong></div>
                  <div>SHA-256 Checksum: <strong class="mono" style="color: var(--accent-gold);">8f9a2b...c419</strong></div>
                </div>
              </div>

              <p style="font-size: 0.7rem; color: var(--text-muted); margin: 0;">
                Notice: This document contains proprietary family office information and is watermarked with your individual partner identifier. Unauthorized redistribution is prohibited.
              </p>
            </div>
          </div>
        </div>

        <!-- Footer Actions with Back Button and Download PDF Button -->
        <div style="padding: 12px 18px; border-top: 1px solid var(--border-color); background: rgba(0,0,0,0.15); display: flex; gap: 10px; justify-content: space-between; align-items: center;">
          <button class="btn btn-secondary btn-sm" id="btn-close-preview-bottom" onclick="window.__closeDocPreview(event)" style="padding: 8px 16px; font-weight: 700; font-size: 0.8rem; display: flex; align-items: center; gap: 6px; cursor: pointer;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
            <span>Back to Vault</span>
          </button>
          
          <button class="btn btn-primary btn-sm" id="btn-download-watermarked-pdf" data-doc-id="${doc.documentId}" style="padding: 8px 18px; font-weight: 700; font-size: 0.82rem; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 10px rgba(234, 88, 12, 0.3); cursor: pointer;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Download Watermarked PDF</span>
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
    card.addEventListener('click', (e) => {
      // If clicked on download button, skip preview
      if (e.target.closest('.btn-download-doc')) return;
      const docId = card.getAttribute('data-doc-id');
      store.openModal('DOC_PREVIEW', { docId });
    });
  });

  // Close / Back preview events
  document.getElementById('btn-back-doc-preview')?.addEventListener('click', window.__closeDocPreview);
  document.getElementById('btn-close-doc-preview')?.addEventListener('click', window.__closeDocPreview);
  document.getElementById('btn-close-preview-bottom')?.addEventListener('click', window.__closeDocPreview);

  document.getElementById('doc-preview-modal-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'doc-preview-modal-backdrop') {
      window.__closeDocPreview(e);
    }
  });

  // Keyboard Escape key to close modal
  const handleEscape = (e) => {
    if (e.key === 'Escape' && store.selectedDocId) {
      window.__closeDocPreview(e);
    }
  };
  window.removeEventListener('keydown', handleEscape);
  window.addEventListener('keydown', handleEscape);

  // Direct PDF Download from document list
  document.querySelectorAll('.btn-download-doc').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const docId = btn.getAttribute('data-doc-id');
      const doc = store.documents.find(d => d.documentId === docId);
      if (doc) {
        downloadDocumentVaultPDF(doc, store.currentUser);
      }
    });
  });

  // Download from inside the preview modal
  document.getElementById('btn-download-watermarked-pdf')?.addEventListener('click', () => {
    const docId = document.getElementById('btn-download-watermarked-pdf')?.getAttribute('data-doc-id');
    const doc = store.documents.find(d => d.documentId === docId);
    if (doc) {
      downloadDocumentVaultPDF(doc, store.currentUser);
      setTimeout(() => {
        window.__closeDocPreview();
      }, 1000);
    }
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
