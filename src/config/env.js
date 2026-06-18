export const ENV = {
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Personal Finance Tracker',
  API_URL: import.meta.env.VITE_API_URL || '',
  VERSION: import.meta.env.VITE_VERSION || '1.0.0',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
};
