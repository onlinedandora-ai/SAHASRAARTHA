/**
 * Sahasraartha Family Office - Mobile App Download & Installation Modal
 * 
 * Provides:
 * - Direct Android APK download link
 * - QR code for seamless camera scanning to download on mobile
 * - Quick 3-step installation guide
 * - Progressive Web App (PWA) installation trigger
 */

export function renderDownloadModal() {
  const currentUrl = window.location.origin;
  const apkDownloadUrl = `${currentUrl}/downloads/Sahasraartha-SFO.apk`;
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(apkDownloadUrl)}&bgcolor=0a0f1d&color=d4af37`;

  return `
    <div id="sfo-download-modal" class="sfo-modal-overlay" style="
      position: fixed; inset: 0; z-index: 100000;
      background: rgba(5, 8, 16, 0.85); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
      display: flex; align-items: center; justify-content: center; padding: 20px;
    ">
      <div class="sfo-modal-card" style="
        background: linear-gradient(145deg, #0d1527, #070b14);
        border: 1px solid rgba(212, 175, 55, 0.4);
        box-shadow: 0 24px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(212, 175, 55, 0.15);
        border-radius: 20px; max-width: 520px; width: 100%; padding: 28px;
        color: #ffffff; position: relative; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <!-- Close Button -->
        <button id="btn-close-download-modal" style="
          position: absolute; top: 18px; right: 18px; background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 50%; width: 34px; height: 34px;
          color: #cbd5e1; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
        ">✕</button>

        <!-- Header -->
        <div style="text-align: center; margin-bottom: 22px;">
          <div style="
            display: inline-flex; align-items: center; justify-content: center;
            width: 56px; height: 56px; border-radius: 16px;
            background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(212, 175, 55, 0.05));
            border: 1px solid rgba(212, 175, 55, 0.4); margin-bottom: 12px;
          ">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
          </div>
          <h2 style="font-size: 20px; font-weight: 700; color: #ffffff; margin: 0 0 6px 0; letter-spacing: -0.01em;">
            Download Sahasraartha Mobile App
          </h2>
          <p style="font-size: 13px; color: #94a3b8; margin: 0; line-height: 1.4;">
            Install the dedicated Android native application on your smartphone
          </p>
        </div>

        <!-- Download & QR Grid -->
        <div style="
          display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;
          align-items: center; background: rgba(255, 255, 255, 0.03); padding: 16px; border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.06);
        ">
          <!-- QR Code -->
          <div style="text-align: center;">
            <div style="
              background: #0a0f1d; padding: 8px; border-radius: 12px;
              border: 1px solid rgba(212, 175, 55, 0.3); display: inline-block;
            ">
              <img src="${qrCodeApiUrl}" alt="Scan to Download APK" style="width: 120px; height: 120px; display: block; border-radius: 6px;" />
            </div>
            <div style="font-size: 11px; color: #d4af37; font-weight: 600; margin-top: 6px;">
              📱 Scan with Phone Camera
            </div>
          </div>

          <!-- Direct Download Action -->
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <a href="${apkDownloadUrl}" download="Sahasraartha-SFO.apk" id="btn-direct-apk-download" style="
              display: flex; align-items: center; justify-content: center; gap: 8px;
              background: linear-gradient(135deg, #d4af37, #aa8010); color: #070b14;
              font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 14px;
              border-radius: 10px; box-shadow: 0 4px 14px rgba(212, 175, 55, 0.3);
              transition: transform 0.2s, box-shadow 0.2s; text-align: center;
            ">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <span>Download APK</span>
            </a>
            
            <div style="font-size: 11px; color: #64748b; line-height: 1.3; text-align: center;">
              Version 1.0.0 (Release APK)<br/>
              Size: ~7.4 MB • Android 8.0+
            </div>
          </div>
        </div>

        <!-- 3 Simple Installation Steps -->
        <div style="
          background: rgba(10, 15, 29, 0.8); border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px; padding: 14px 16px; margin-bottom: 20px;
        ">
          <div style="font-size: 11px; font-weight: 700; color: #d4af37; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px;">
            Quick 3-Step Setup
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; font-size: 12px; color: #cbd5e1;">
            <div style="display: flex; gap: 8px; align-items: flex-start;">
              <span style="background: rgba(212, 175, 55, 0.2); color: #d4af37; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0;">1</span>
              <span>Download and tap <strong>Sahasraartha-SFO.apk</strong> in your notifications or downloads folder.</span>
            </div>
            <div style="display: flex; gap: 8px; align-items: flex-start;">
              <span style="background: rgba(212, 175, 55, 0.2); color: #d4af37; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0;">2</span>
              <span>If prompted by Android, tap <em>Settings &gt; Allow from this source</em> to enable install.</span>
            </div>
            <div style="display: flex; gap: 8px; align-items: flex-start;">
              <span style="background: rgba(212, 175, 55, 0.2); color: #d4af37; font-weight: 700; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; flex-shrink: 0;">3</span>
              <span>Open the app and sign in with your Google or Phone OTP to receive live valuation push notifications.</span>
            </div>
          </div>
        </div>

        <!-- Footer Dismiss -->
        <button id="btn-dismiss-download" style="
          width: 100%; background: rgba(255, 255, 255, 0.06); border: 1px solid rgba(255, 255, 255, 0.12);
          color: #94a3b8; font-size: 13px; font-weight: 600; padding: 10px; border-radius: 10px; cursor: pointer;
        ">
          Close Window
        </button>
      </div>
    </div>
  `;
}

export function attachDownloadModalEvents() {
  const closeBtn = document.getElementById('btn-close-download-modal');
  const dismissBtn = document.getElementById('btn-dismiss-download');
  const modalOverlay = document.getElementById('sfo-download-modal');

  const closeModal = () => {
    if (modalOverlay) {
      modalOverlay.style.opacity = '0';
      setTimeout(() => {
        if (modalOverlay.parentElement) {
          modalOverlay.parentElement.removeChild(modalOverlay);
        }
      }, 200);
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
}

export function openDownloadModal() {
  const existing = document.getElementById('sfo-download-modal');
  if (existing) return;
  const container = document.createElement('div');
  container.innerHTML = renderDownloadModal();
  document.body.appendChild(container.firstElementChild);
  attachDownloadModalEvents();
}
