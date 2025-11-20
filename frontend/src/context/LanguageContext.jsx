import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, addonTranslations, locationTranslations } from '../translations';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('ka');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang) => {
    if (translations[lang]) {
      setCurrentLanguage(lang);
      localStorage.setItem('preferredLanguage', lang);
    }
  };

  const t = translations[currentLanguage];
  const getAddonTranslation = (addonId) => addonTranslations[currentLanguage][addonId] || {};
  const getLocationTranslation = (locationId) => locationTranslations[currentLanguage][locationId] || {};

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    getAddonTranslation,
    getLocationTranslation
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};