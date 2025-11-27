import React from 'react';
import { Phone, Clock, MapPin, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useSettings } from '../context/SettingsContext';

const Header = () => {
  const { settings } = useSettings();
  
  return (
    <header className="bg-black sticky top-0 z-50 shadow-2xl">
      {/* Top Contact Bar */}
      <div className="bg-black border-b border-gray-800">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center text-sm">
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
      <div className="bg-black py-6">
        <div className="container mx-auto px-4">
          <a href="/" className="flex flex-col items-center justify-center">
            <img 
              src="https://customer-assets.emergentagent.com/job_mgz-checkout/artifacts/gmb2tiz9_image.png" 
              alt="MGZAVROBANI Logo" 
              className="h-24 w-auto mb-3"
            />
            <h1 className="text-3xl font-bold text-white tracking-wide">MGZAVROBANI</h1>
            <p className="text-sm text-gray-400 mt-1">Car Rental in Georgia</p>
          </a>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <div className="bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-center gap-8 py-3">
            <a href="/" className="text-white hover:text-[#FF7A00] transition-colors font-medium text-base uppercase tracking-wide">
              Ana Sayfa
            </a>
            <span className="text-gray-700">|</span>
            <a href="/admin" className="text-white hover:text-[#FF7A00] transition-colors font-medium text-base uppercase tracking-wide">
              Admin
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;