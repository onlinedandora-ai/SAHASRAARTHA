/**
 * Sahasraartha Family Office - Comprehensive Notification Service
 * 
 * Capabilities:
 * - Native Android & iOS Push Notifications via @capacitor/push-notifications
 * - Local System Notifications via @capacitor/local-notifications
 * - Web Notification API fallback
 * - Real-Time In-App Floating Dynamic Alert Toasts
 * - FCM Token registration to Cloud Firestore
 */

import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { doc, setDoc } from 'firebase/firestore';
import { getDb } from './firebaseAuth.js';

let isPushRegistered = false;

/**
 * Initialize Push & Local Notifications
 */
export async function initNotificationService(userProfile = null) {
  try {
    if (Capacitor.isNativePlatform()) {
      await setupNativePushNotifications(userProfile);
      await setupLocalNotifications();
    } else {
      await setupWebNotifications();
    }
  } catch (err) {
    console.warn('[NotificationService] Init error:', err.message);
  }
}

/**
 * Setup Native Push Notifications on Android / iOS
 */
async function setupNativePushNotifications(userProfile) {
  try {
    let permStatus = await PushNotifications.checkPermissions();
    
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }

    if (permStatus.receive !== 'granted') {
      console.log('[NotificationService] Push notification permission not granted.');
      return;
    }

    // Register with Apple / Google APNs/FCM
    await PushNotifications.register();
    isPushRegistered = true;

    // Listeners
    PushNotifications.addListener('registration', async (token) => {
      console.log('[NotificationService] FCM Registration Token:', token.value);
      await saveFCMTokenToFirestore(token.value, userProfile);
    });

    PushNotifications.addListener('registrationError', (err) => {
      console.error('[NotificationService] Push Registration Error:', err);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('[NotificationService] Push Notification Received in Foreground:', notification);
      triggerInAppNotification({
        title: notification.title || 'Sahasraartha Update',
        message: notification.body || 'New update recorded.',
        category: 'PUSH'
      });
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('[NotificationService] Push Notification Action Performed:', action);
    });
  } catch (e) {
    console.error('[NotificationService] Native push setup failed:', e);
  }
}

/**
 * Setup Local Notifications for system tray banners
 */
async function setupLocalNotifications() {
  try {
    const perm = await LocalNotifications.checkPermissions();
    if (perm.display !== 'granted') {
      await LocalNotifications.requestPermissions();
    }
  } catch (e) {
    console.warn('[NotificationService] Local notification setup error:', e);
  }
}

/**
 * Setup Web Browser Notifications Fallback
 */
async function setupWebNotifications() {
  try {
    if ('Notification' in window && Notification.permission === 'default') {
      // Prompt gracefully on user action
      console.log('[NotificationService] Web notifications supported.');
    }
  } catch (e) {
    console.warn('[NotificationService] Web notification check failed:', e);
  }
}

/**
 * Store Device FCM Token into Cloud Firestore
 */
async function saveFCMTokenToFirestore(tokenValue, userProfile) {
  try {
    const db = getDb();
    if (!db || !tokenValue) return;

    const tokenDocId = tokenValue.substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
    await setDoc(doc(db, 'sfo_fcm_tokens', tokenDocId), {
      token: tokenValue,
      platform: Capacitor.getPlatform(),
      userId: userProfile?.uid || 'anonymous',
      userEmail: userProfile?.email || '',
      userName: userProfile?.displayName || '',
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    console.log('[NotificationService] FCM Token registered in cloud.');
  } catch (err) {
    console.error('[NotificationService] Failed to save FCM token:', err);
  }
}

/**
 * Trigger in-app toast notification and system tray notification
 * @param {object} param0 { title, message, category, actor }
 */
export async function triggerInAppNotification({ title, message, category = 'INFO', actor = '' }) {
  // 1. Show In-App Dynamic Floating Banner
  showFloatingToast(title, message, category, actor);

  // 2. Schedule Local Notification if on device / web permission granted
  try {
    if (Capacitor.isNativePlatform()) {
      await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: message,
            id: Math.floor(Date.now() % 100000),
            schedule: { at: new Date(Date.now() + 100) },
            sound: undefined,
            attachments: undefined,
            actionTypeId: '',
            extra: null
          }
        ]
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico'
      });
    }
  } catch (e) {
    // Ignore local notification scheduling errors
  }
}

/**
 * Render dynamic floating toast banner in DOM
 */
function showFloatingToast(title, message, category, actor) {
  let container = document.getElementById('sfo-notification-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'sfo-notification-container';
    container.style.cssText = `
      position: fixed;
      top: 18px;
      right: 18px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 380px;
      width: calc(100vw - 36px);
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'sfo-live-toast';
  toast.style.cssText = `
    background: rgba(13, 20, 38, 0.94);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(212, 175, 55, 0.4);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.2);
    border-radius: 14px;
    padding: 14px 16px;
    color: #ffffff;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    transform: translateY(-20px) scale(0.95);
    opacity: 0;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: auto;
    cursor: pointer;
  `;

  const categoryBadge = {
    PORTFOLIO: 'PORTFOLIO',
    LEDGER: 'LEDGER',
    CAPITAL_CALL: 'CAPITAL CALL',
    DISTRIBUTION: 'DISTRIBUTION',
    PROPOSAL: 'PROPOSAL',
    SYSTEM: 'SYSTEM',
    INFO: 'UPDATE'
  }[category] || 'UPDATE';

  toast.innerHTML = `
    <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 6px;">
      <span style="font-size: 10px; font-weight: 800; letter-spacing: 0.08em; background: rgba(212, 175, 55, 0.15); color: #d4af37; padding: 2px 8px; border-radius: 6px; border: 1px solid rgba(212, 175, 55, 0.3);">
        ${categoryBadge}
      </span>
      <span style="font-size: 11px; color: #8a99ad;">Just now</span>
    </div>
    <div style="font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 4px; line-height: 1.3;">
      ${escapeHtml(title)}
    </div>
    <div style="font-size: 12px; color: #cbd5e1; line-height: 1.4;">
      ${escapeHtml(message)}
    </div>
    ${actor ? `<div style="font-size: 10px; color: #94a3b8; margin-top: 6px;">By: ${escapeHtml(actor)}</div>` : ''}
  `;

  container.appendChild(toast);

  // Trigger smooth enter
  requestAnimationFrame(() => {
    toast.style.transform = 'translateY(0) scale(1)';
    toast.style.opacity = '1';
  });

  // Auto dismiss after 6 seconds
  const timer = setTimeout(() => {
    dismissToast(toast);
  }, 6000);

  toast.addEventListener('click', () => {
    clearTimeout(timer);
    dismissToast(toast);
  });
}

function dismissToast(toast) {
  toast.style.transform = 'translateY(-15px) scale(0.95)';
  toast.style.opacity = '0';
  setTimeout(() => {
    if (toast.parentElement) {
      toast.parentElement.removeChild(toast);
    }
  }, 350);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
