import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  LanguageCode, 
  LanguageInfo, 
  SUPPORTED_LANGUAGES, 
  TRANSLATIONS 
} from '../data/translations';
import { 
  CROP_NAMES, 
  GROWTH_STAGES, 
  FARMING_METHODS, 
  FARMER_TYPES_I18N 
} from '../data/cropTranslations';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  tCrop: (cropName: string) => string;
  tStage: (stage: string) => string;
  tMethod: (method: string) => string;
  tFarmerType: (type: string) => string;
  languageInfo: LanguageInfo;
  supportedLanguages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('farmsync_lang');
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      return saved as LanguageCode;
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguageState(lang);
    localStorage.setItem('farmsync_lang', lang);
  };

  const languageInfo = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  const t = (key: string, fallback?: string): string => {
    const langDict = TRANSLATIONS[currentLanguage];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    if (TRANSLATIONS['en'] && TRANSLATIONS['en'][key]) {
      return TRANSLATIONS['en'][key];
    }
    return fallback || key;
  };

  const tCrop = (cropName: string): string => {
    if (!cropName) return '';
    const cropsDict = CROP_NAMES[currentLanguage];
    if (cropsDict) {
      if (cropsDict[cropName]) return cropsDict[cropName];
      // Check partial match (e.g. "Organic Capsicum" -> "సేంద్రీయ క్యాప్సికమ్" or "Tomato (Arka Rakshak)" -> "టమోటా")
      for (const [key, val] of Object.entries(cropsDict)) {
        if (cropName.toLowerCase() === key.toLowerCase()) return val;
        if (cropName.toLowerCase().includes(key.toLowerCase()) && key.length > 3) {
          return cropName.replace(new RegExp(key, 'i'), val);
        }
      }
    }
    return cropName;
  };

  const tStage = (stage: string): string => {
    if (!stage) return '';
    const stagesDict = GROWTH_STAGES[currentLanguage];
    if (stagesDict && stagesDict[stage]) {
      return stagesDict[stage];
    }
    return stage;
  };

  const tMethod = (method: string): string => {
    if (!method) return '';
    const methodsDict = FARMING_METHODS[currentLanguage];
    if (methodsDict && methodsDict[method]) {
      return methodsDict[method];
    }
    return method;
  };

  const tFarmerType = (type: string): string => {
    if (!type) return '';
    const typesDict = FARMER_TYPES_I18N[currentLanguage];
    if (typesDict && typesDict[type]) {
      return typesDict[type];
    }
    return type;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        tCrop,
        tStage,
        tMethod,
        tFarmerType,
        languageInfo,
        supportedLanguages: SUPPORTED_LANGUAGES
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
