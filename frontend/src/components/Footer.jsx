import React from 'react';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useSettings } from '../context/SettingsContext';

const Footer = () => {
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const { settings } = useSettings();
  
  const languages = [
    { code: 'ka', label: t.languages.ka },
    { code: 'en', label: t.languages.en },
    { code: 'ru', label: t.languages.ru },
    { code: 'tr', label: t.languages.tr },
    { code: 'az', label: t.languages.az }
  ];
  
  return (
    <footer className="bg-black text-white mt-16 border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{t.footer.language}</span>
            <div className="flex gap-2">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-3 py-1 rounded transition-colors text-sm ${
                    currentLanguage === lang.code
                      ? 'bg-[#FF7A00] text-white hover:bg-[#ff8c1a]'
                      : 'bg-[#111111] text-white hover:bg-[#151515]'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">{t.footer.followUs}</span>
            <div className="flex gap-3">
              <a 
                href={settings.social_media.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-[#FF7A00] rounded-full flex items-center justify-center hover:bg-[#ff8c1a] transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href={settings.social_media.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-[#FF7A00] rounded-full flex items-center justify-center hover:bg-[#ff8c1a] transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href={settings.social_media.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-[#FF7A00] rounded-full flex items-center justify-center hover:bg-[#ff8c1a] transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-sm text-gray-400">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;