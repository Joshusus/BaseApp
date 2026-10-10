import { createInstance } from 'i18next';
import translations from '../public/locales/en/translation.json';

/** Resolve actual English resources in behavior tests instead of returning raw keys. */
export const englishI18n = createInstance();
await englishI18n.init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation: translations } },
  interpolation: { escapeValue: false },
});
