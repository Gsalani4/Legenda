import React from 'react';
import { Phone, Clock, MapPin, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const { t } = useLanguage();
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="bg-blue-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{t.header.schedule}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>{t.header.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <a href="tel:+995500883088" className="hover:underline">
              {t.header.phone}
            </a>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <a href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              MG
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900">{t.header.companyName}</h1>
              <p className="text-xs text-gray-500">{t.header.tagline}</p>
            </div>
          </a>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Ana Sayfa</a>
            <a href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Admin</a>
          </nav>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;