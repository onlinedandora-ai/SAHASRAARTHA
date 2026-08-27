/**
 * Sahasraartha Family Office - In-App Update Notification Modal
 * 
 * Provides:
 * - Direct visual alert when a newer app version is released
 * - Release highlights / new features list
 * - One-tap Direct APK download & install trigger
 * - Non-intrusive dismiss or mandatory update lock
 */

export function renderUpdateModal(updateInfo) {
  const {
    version = '1.0.2',
    releaseDate = '',
    title = 'New Version Available',
    releaseNotes = 'New features and security updates are available.',
    features = [],
    apkUrl = '/downloads/Sahasraartha-SFO.apk',
    forceUpdate = false
  } = updateInfo;

  return `
    <div id="sfo-update-modal" class="sfo-modal-overlay" style="
      position: fixed; inset: 0; z-index: 100001;
      background: rgba(5, 8, 16, 0.88); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
      display: flex; align-items: center; justify-content: center; padding: 16px;
      animation: fadeIn 0.25s ease-out;
    ">
      <div class="sfo-modal-card" style="
        background: linear-gradient(145deg, #0f172a, #070b14);
        border: 1.5px solid rgba(212, 175, 55, 0.5);
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(212, 175, 55, 0.25);
        border-radius: 24px; max-width: 460px; width: 100%; padding: 26px;
        color: #ffffff; position: relative; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        box-sizing: border-box;
      ">
        
        <!-- Top Icon & Version Badge -->
        <div style="text-align: center; margin-bottom: 18px;">
          <div style="
            display: inline-flex; align-items: center; justify-content: center;
            width: 60px; height: 60px; border-radius: 18px;
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(212, 175, 55, 0.08));
            border: 1.5px solid rgba(212, 175, 55, 0.5); margin-bottom: 12px;
            box-shadow: 0 8px 20px rgba(212, 175, 55, 0.2);
          ">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          
          <div style="
            display: inline-block; background: rgba(212, 175, 55, 0.15);
            border: 1px solid rgba(212, 175, 55, 0.35); border-radius: 20px;
            padding: 3px 12px; font-size: 11px; font-weight: 800; color: #d4af37;
            text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px;
          ">
            App Update Available
          </div>

          <h2 style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 4px 0; letter-spacing: -0.01em;">
            ${title}
          </h2>
          <p style="font-size: 13px; color: #94a3b8; margin: 0;">
            Version <strong style="color: #d4af37;">v${version}</strong> is now ready to install ${releaseDate ? `(${releaseDate})` : ''}
          </p>
        </div>

        <!-- Release Highlights -->
        <div style="
          background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px; padding: 14px; margin-bottom: 20px;
        ">
          <div style="font-size: 11px; font-weight: 700; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">
            What's New in this Version:
          </div>
          
          ${features && features.length > 0 ? `
            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: #cbd5e1;">
              ${features.map(feat => `
                <div style="display: flex; gap: 8px; align-items: flex-start;">
                  <span style="color: #d4af37; font-weight: 800; font-size: 13px; line-height: 1;">✓</span>
                  <span>${feat}</span>
                </div>
              `).join('')}
            </div>
          ` : `
            <p style="font-size: 12px; color: #cbd5e1; margin: 0; line-height: 1.4;">${releaseNotes}</p>
          `}
        </div>

        <!-- Action Buttons -->
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <a href="${apkUrl}" download="Sahasraartha-SFO.apk" id="btn-update-download-now" style="
            display: flex; align-items: center; justify-content: center; gap: 8px;
            background: linear-gradient(135deg, #d4af37, #b8860b); color: #070b14;
            font-size: 14px; font-weight: 800; text-decoration: none; padding: 13px 16px;
            border-radius: 12px; box-shadow: 0 4px 18px rgba(212, 175, 55, 0.4);
            text-align: center; cursor: pointer; transition: transform 0.15s ease;
          ">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Update Now (Download APK)</span>
          </a>

          ${!forceUpdate ? `
            <button id="btn-update-remind-later" style="
              width: 100%; background: transparent; border: 1px solid rgba(255, 255, 255, 0.15);
              color: #94a3b8; font-size: 12px; font-weight: 600; padding: 9px;
              border-radius: 10px; cursor: pointer; text-align: center;
            ">
              Remind Me Later
            </button>
          ` : `
            <div style="text-align: center; font-size: 11px; color: #ef4444; font-weight: 600;">
              * Mandatory Security Update Required
            </div>
          `}
        </div>

      </div>
    </div>
  `;
}

export function attachUpdateModalEvents(updateInfo, onDismiss) {
  const modalOverlay = document.getElementById('sfo-update-modal');
  const downloadBtn = document.getElementById('btn-update-download-now');
  const laterBtn = document.getElementById('btn-update-remind-later');

  const closeUpdateModal = () => {
    if (modalOverlay) {
      modalOverlay.style.opacity = '0';
      modalOverlay.style.transition = 'opacity 0.2s ease';
      setTimeout(() => {
        if (modalOverlay.parentElement) {
          modalOverlay.parentElement.removeChild(modalOverlay);
        }
        if (onDismiss) onDismiss();
      }, 200);
    }
  };

  if (laterBtn) {
    laterBtn.addEventListener('click', closeUpdateModal);
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      downloadBtn.innerHTML = '<span>Starting APK Download...</span>';
      setTimeout(() => {
        closeUpdateModal();
      }, 2000);
    });
  }

  // Prevent background click dismissal if forced
  if (modalOverlay && !updateInfo?.forceUpdate) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeUpdateModal();
    });
  }
}

export function openUpdateModal(updateInfo, onDismiss) {
  const existing = document.getElementById('sfo-update-modal');
  if (existing) existing.remove();

  const container = document.createElement('div');
  container.innerHTML = renderUpdateModal(updateInfo);
  document.body.appendChild(container.firstElementChild);
  attachUpdateModalEvents(updateInfo, onDismiss);
}
