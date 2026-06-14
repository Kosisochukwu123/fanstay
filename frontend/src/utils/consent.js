// Manages cookie/consent state and gates service worker (image caching) registration on it.

const CONSENT_KEY = 'fanstay_cookie_consent'; // 'accepted' | 'rejected'

export const getConsent = () => localStorage.getItem(CONSENT_KEY);

export const hasAcceptedConsent = () => getConsent() === 'accepted';

export const setConsent = (value) => {
  localStorage.setItem(CONSENT_KEY, value);
  if (value === 'accepted') {
    registerServiceWorker();
  } else {
    unregisterServiceWorker();
  }
};

export const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return;
  if (!hasAcceptedConsent()) return;

  try {
    await navigator.serviceWorker.register('/sw.js');
  } catch (err) {
    console.error('Service worker registration failed:', err);
  }
};

export const unregisterServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) return;

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((r) => r.unregister()));

  // Also clear the image cache
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_IMAGE_CACHE' });
  }
  if ('caches' in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }
};

// Call this on app startup — registers immediately if consent was already given previously
export const initServiceWorkerFromStoredConsent = () => {
  if (hasAcceptedConsent()) {
    registerServiceWorker();
  }
};