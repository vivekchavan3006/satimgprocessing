import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: [
      'en', 'hi', 'mr', 'bn', 'ta', 'te', 'kn', 'ml', 'gu', 'pa', 'ur',
      'es', 'fr', 'de', 'pt', 'it', 'nl', 'ru', 'uk', 'zh-CN', 'zh-TW',
      'ja', 'ko', 'ar', 'tr', 'id', 'vi', 'th'
    ],
    backend: {
      loadPath: '/locales/{{lng}}.json',
      // Add a short request timeout so a network failure doesn't hang forever
      requestOptions: { cache: 'default' },
    },
    interpolation: {
      escapeValue: false,
    },
    // CRITICAL: disable Suspense mode so components render immediately
    // even before the locale JSON file finishes loading from the network.
    react: {
      useSuspense: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
  if (lng === 'ar' || lng === 'ur') {
    document.documentElement.dir = 'rtl';
  } else {
    document.documentElement.dir = 'ltr';
  }
});

export default i18n;
