import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const whitelist = ['en', 'es', 'fr', 'ja', 'ko', 'th', 'vi', 'zh', 'id', 'ru'];
const defaultLanguage = 'en';
const options = {
  initImmediate: false,
  whitelist,
  fallbackLng: defaultLanguage,
  load: 'languageOnly',
  ns: ['translations'],
  defaultNS: 'translations',
  detection: {
    lookupQuerystring: 'lang'
  },
  interpolation: {
    escapeValue: false,
    formatSeparator: ',',
    format: (value, format) => {
      if (format === 'uppercase') return value.toUpperCase();
      return value;
    }
  },

  react: {
    wait: true,
    useSuspense: false
  }
};

i18n.use(Backend).use(LanguageDetector).use(initReactI18next).init(options);

export default i18n;
