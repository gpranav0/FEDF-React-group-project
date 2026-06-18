import { ENV } from '../config/env';

export const logger = {
  info: (message, data) => {
    if (ENV.IS_DEV) {
      console.log(`[INFO] ${message}`, data || '');
    }
  },
  warn: (message, data) => {
    if (ENV.IS_DEV) {
      console.warn(`[WARN] ${message}`, data || '');
    }
  },
  error: (message, error) => {
    console.error(`[ERROR] ${message}`, error);
    // Future: Send to Sentry, DataDog, etc.
  },
  trackAction: (action, metadata) => {
    if (ENV.IS_DEV) {
      console.log(`[TRACK] User Action: ${action}`, metadata || '');
    }
    // Future: Send to Mixpanel, Google Analytics
  }
};
