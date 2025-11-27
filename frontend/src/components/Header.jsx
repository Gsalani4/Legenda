import React from 'react';
import { Phone, Clock, MapPin, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useSettings } from '../context/SettingsContext';

const Header = () => {
  const { settings } = useSettings();
  
  return (
    <header className="bg-black shadow-lg sticky top-0 z-50">
      {/* Top info bar */}
      <div className="bg-black text-white border-b border-gray-800 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
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
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#FF7A00]" />
            <a href={`tel:${settings.contact.phone}`} className="hover:text-[#FF7A00] transition-colors text-white">
              {settings.contact.phone}
            </a>
          </div>
        </div>
      </div>
      
      {/* Main header with centered logo */}
      <div className="bg-black py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-4">
            <a href="/" className="flex flex-col items-center">
              <img 
                src="https://customer-assets.emergentagent.com/job_mgz-checkout/artifacts/1pjprjf8_image.png" 
                alt="MGZAVROBANI Logo" 
                className="h-16 w-auto mb-2"
              />
              <h1 className="text-2xl font-bold text-white">MGZAVROBANI</h1>
              <p className="text-sm text-gray-400">Car Rental in Georgia</p>
            </a>
          </div>
          
          <nav className="flex items-center justify-center gap-8">
            <a href="/" className="text-white hover:text-[#FF7A00] transition-colors font-medium text-lg">Ana Sayfa</a>
            <a href="/admin" className="text-white hover:text-[#FF7A00] transition-colors font-medium text-lg">Admin</a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;