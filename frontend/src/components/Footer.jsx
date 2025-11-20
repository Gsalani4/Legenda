import React from 'react';
import { Facebook, Instagram, Youtube, MessageCircle, Phone } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t, currentLanguage, changeLanguage } = useLanguage();
  
  const languages = [
    { code: 'ka', label: t.languages.ka },
    { code: 'en', label: t.languages.en },
    { code: 'ru', label: t.languages.ru },
    { code: 'tr', label: t.languages.tr },
    { code: 'az', label: t.languages.az }
  ];
  
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-sm">{t.footer.language}</span>
            <div className="flex gap-2">
              {languages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-3 py-1 rounded transition-colors text-sm ${
                    currentLanguage === lang.code
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm">{t.footer.followUs}</span>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/profile.php?id=61573020256578" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/mgzavrobani/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://www.youtube.com/@MGZAVROBANI" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
              <a href="https://wa.me/995598123456" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="viber://chat?number=+995598123456" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors">
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-sm text-gray-400">
          <p>{t.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;