import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';

// Translation resources
const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
};

// Function to get translation for a specific language (independent of current i18n language)
export const getTranslation = (language: 'en' | 'hi' | 'mr', key: string, fallback?: string): string => {
  const keys = key.split('.');
  let value: any = resources[language]?.translation;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return fallback || key;
    }
  }
  
  return typeof value === 'string' ? value : fallback || key;
};

// Function to get translated karyakarta name for a specific language
export const getTranslatedKaryakartaName = (language: 'en' | 'hi' | 'mr', originalName: string): string => {
  return getTranslation(language, `names.karyakartas.${originalName}`, originalName);
};

// Function to get translated politician name for a specific language
export const getTranslatedPoliticianName = (language: 'en' | 'hi' | 'mr'): string => {
  return getTranslation(language, 'politician.name', 'Shri Rajesh Kumar');
};
