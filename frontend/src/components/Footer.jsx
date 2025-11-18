import React from 'react';
import { Facebook, Instagram, Youtube, MessageCircle, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-sm">ენა:</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700 transition-colors text-sm">
                Georgian
              </button>
              <button className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-sm">
                English
              </button>
              <button className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-sm">
                Russian
              </button>
              <button className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors text-sm">
                Ukrainian
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm">გამოგვყევით:</span>
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
          <p>&copy; 2024 MGZAVROBANI - ავტომობილების გაქირავება საქართველოში. ყველა უფლება დაცულია.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;