/**
 * Sahasraartha Family Office - App Live Update & Version Management Service
 * 
 * Capabilities:
 * - Checks remote version.json against installed app version
 * - Supports instant Cloud Live Update when hosting updates
 * - Displays in-app "New Version Available" dialog for native APK download
 * - Handles manual update checks from settings
 */

import { openUpdateModal } from '../components/updateModal.js';
import { triggerInAppNotification } from './notificationService.js';

export const CURRENT_APP_VERSION = '1.0.1';
export const CURRENT_BUILD_CODE = 2;

// Semver comparison: returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal
function compareVersions(v1, v2) {
  const parts1 = String(v1).replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
  const parts2 = String(v2).replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
  
  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    if (num1 > num2) return 1;
    if (num1 < num2) return -1;
  }
  return 0;
}

let lastCheckTime = 0;
let isChecking = false;

export async function fetchRemoteVersion() {
  const sources = [
    `${window.location.origin}/version.json?_t=${Date.now()}`,
    `https://saharaartha-f867c.web.app/version.json?_t=${Date.now()}`
  ];

  for (const url of sources) {
    try {
      const response = await fetch(url, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.warn(`[AppUpdate] Failed fetching version from ${url}:`, err);
    }
  }
  return null;
}

export async function checkForAppUpdates({ manual = false } = {}) {
  if (isChecking) return;
  isChecking = true;

  try {
    const remote = await fetchRemoteVersion();
    lastCheckTime = Date.now();

    if (!remote || !remote.version) {
      if (manual) {
        triggerInAppNotification({
          title: 'Update Check',
          message: 'Unable to connect to update server. Please check your internet connection.',
          category: 'GOVERNANCE',
          actor: 'Update Service'
        });
      }
      return;
    }

    const hasNewerVersion = compareVersions(remote.version, CURRENT_APP_VERSION) > 0 ||
      (remote.versionCode && remote.versionCode > CURRENT_BUILD_CODE);

    if (hasNewerVersion) {
      console.log(`[AppUpdate] New version available: v${remote.version} (Current: v${CURRENT_APP_VERSION})`);
      
      const dismissedVersion = localStorage.getItem('sfo_dismissed_update_version');
      const isDismissed = dismissedVersion === remote.version;

      if (manual || !isDismissed || remote.forceUpdate) {
        openUpdateModal(remote, () => {
          if (!remote.forceUpdate) {
            localStorage.setItem('sfo_dismissed_update_version', remote.version);
          }
        });
      }
    } else {
      console.log(`[AppUpdate] App is up to date (v${CURRENT_APP_VERSION})`);
      if (manual) {
        triggerInAppNotification({
          title: 'Latest Version Installed',
          message: `Sahasraartha SFO v${CURRENT_APP_VERSION} is completely up to date with live cloud sync!`,
          category: 'GOVERNANCE',
          actor: 'Update Service'
        });
      }
    }
  } catch (error) {
    console.error('[AppUpdate] Update check error:', error);
  } finally {
    isChecking = false;
  }
}

/**
 * Initializes update checking on app boot and background resume
 */
export function initAppUpdateService() {
  // Check after 2.5 seconds on initial startup
  setTimeout(() => {
    checkForAppUpdates({ manual: false });
  }, 2500);

  // Check periodically (every 20 minutes)
  setInterval(() => {
    checkForAppUpdates({ manual: false });
  }, 20 * 60 * 1000);

  // Check when user resumes app from background / switches back to window
  window.addEventListener('focus', () => {
    const elapsed = Date.now() - lastCheckTime;
    if (elapsed > 5 * 60 * 1000) { // If more than 5 minutes since last check
      checkForAppUpdates({ manual: false });
    }
  });
}
