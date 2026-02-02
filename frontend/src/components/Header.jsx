import React from 'react';
import { Phone, Clock, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

const Header = ({ transparent = false }) => {
  const { settings } = useSettings();
  const { t } = useLanguage();

  const headerClass = transparent
    ? 'bg-black/60 backdrop-blur-md'
    : 'bg-black';

  return (
    <header className={`sticky top-0 z-50 shadow-2xl ${headerClass}`}>
      {/* Top Contact Bar */}
      <div className={`border-b border-gray-800 ${transparent ? 'bg-transparent' : 'bg-black'}`}>
        <div className="container mx-auto px-4 py-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm">
            {/* Sol taraf - Çalışma saatleri ve Adres */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FF7A00]" />
                <span className="text-gray-300">{settings.contact.working_hours}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF7A00]" />
                <span className="text-gray-300">{settings.contact.address}</span>
              </div>
            </div>
            
            {/* Sağ taraf - Telefon */}
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#FF7A00]" />
              <a href={`tel:${settings.contact.phone}`} className="text-white hover:text-[#FF7A00] transition-colors font-medium">
                {settings.contact.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Logo Section - Center */}
      <div className={`${transparent ? 'bg-transparent' : 'bg-black'} py-1`}>
        <div className="container mx-auto px-4">
          <a href="/" className="flex flex-col items-center justify-center leading-none">
            <div className="text-[24px] md:text-[28px] font-bold tracking-wide text-white">
              {t.header.companyName}
            </div>
            <div className="mt-0.5 text-xs text-gray-400">
              {t.header.tagline}
            </div>
          </a>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <div className={`border-t border-gray-800 ${transparent ? 'bg-transparent' : 'bg-black'}`}>
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center gap-8 py-1">
            <a href="/" className="text-white hover:text-[#FF7A00] transition-colors font-medium text-sm md:text-base uppercase tracking-wide">
              {t.header.home}
            </a>
            <span className="text-gray-700">|</span>
            <a href="/admin" className="text-white hover:text-[#FF7A00] transition-colors font-medium text-sm md:text-base uppercase tracking-wide">
              {t.auth.signIn}
            </a>
            <span className="text-gray-700">|</span>
            <a href="/admin?tab=signup" className="text-white hover:text-[#FF7A00] transition-colors font-medium text-sm md:text-base uppercase tracking-wide">
              {t.auth.signUp}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;