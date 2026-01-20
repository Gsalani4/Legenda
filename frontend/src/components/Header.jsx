import React from 'react';
import { Phone, Clock, MapPin } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const { settings } = useSettings();
  const { t } = useLanguage();

  return (
    <header className="bg-black sticky top-0 z-50 shadow-2xl">
      {/* Top Contact Bar */}
      <div className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-2">
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
      <div className="bg-black py-4">
        <div className="container mx-auto px-4">
          <a href="/" className="flex flex-col items-center justify-center leading-none">
            <div className="text-[28px] md:text-[34px] font-bold tracking-wide text-white">
              {t.header.companyName}
            </div>
            <div className="mt-1 text-xs md:text-sm text-gray-400">
              {t.header.tagline}
            </div>
          </a>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <div className="bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center gap-8 py-3">
            <a href="/" className="text-white hover:text-[#FF7A00] transition-colors font-medium text-base uppercase tracking-wide">
              {t.header.home}
            </a>
            <span className="text-gray-700">|</span>
            <a href="/admin" className="text-white hover:text-[#FF7A00] transition-colors font-medium text-base uppercase tracking-wide">
              {t.header.admin}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;